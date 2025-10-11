import pandas as pd
import sys
sys.path.append('.')
from supabase import create_client
from dotenv import load_dotenv
import os
import json

load_dotenv('.env.local')

# إنشاء اتصال Supabase
supabase = create_client(
    os.getenv('NEXT_PUBLIC_SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
)

print("🚀 بدء استيراد أسئلة Big5 إلى assessment_questions...\n")

# جلب IDs الأدوات
tools = {}
for code in ['BIG5_60_COLLEGE', 'BIG5_60_MIDDLE', 'BIG5_60_HIGH']:
    result = supabase.table('assessment_tools').select('id').eq('code', code).single().execute()
    if result.data:
        tools[code] = result.data['id']
        print(f"✅ تم جلب ID لـ {code}: {result.data['id']}")
    else:
        print(f"❌ لم يتم العثور على {code}")
        exit(1)

print()

# ==========================================
# 1. استيراد أسئلة College/FreshGrad
# ==========================================
print("=" * 60)
print("📚 استيراد أسئلة College/FreshGrad (60 سؤال)")
print("=" * 60)

df_college = pd.read_excel('big5/Big5_College_FreshGrad_Bilingual.xlsx', sheet_name='Big5_Long_60')
print(f"✅ تم قراءة {len(df_college)} سؤال من Excel\n")

college_questions = []
for idx, row in df_college.iterrows():
    college_questions.append({
        'tool_id': tools['BIG5_60_COLLEGE'],
        'question_ar': row['Arabic Question'],
        'question_en': row['English Question'],
        'question_fr': row['English Question'],  # يمكن ترجمته لاحقاً
        'question_type': 'likert_5',
        'options': json.dumps({
            'scale': 5,
            'labels_ar': ['لا أوافق بشدة', 'لا أوافق', 'محايد', 'أوافق', 'أوافق بشدة'],
            'labels_en': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        }),
        'dimension': row['Trait'],
        'subdimension': None,
        'weight': 1.0,
        'order_index': idx + 1,
        'is_reverse_scored': row['Reverse'] == 'Yes'
    })

print("💾 جاري إدراج الأسئلة في قاعدة البيانات...")
try:
    result = supabase.table('assessment_questions').insert(college_questions).execute()
    print(f"✅ تم إدراج {len(college_questions)} سؤال بنجاح!\n")
except Exception as e:
    print(f"❌ خطأ: {e}\n")

# ==========================================
# 2. استيراد أسئلة Middle School
# ==========================================
print("=" * 60)
print("🎒 استيراد أسئلة Middle School (60 سؤال)")
print("=" * 60)

df_youth = pd.read_excel('big5/Big5_Master_Bilingual_Youth.xlsx', sheet_name='Big5_Long_60')
df_middle = df_youth[df_youth['Age Group'] == 'Gen Alpha (Middle)'].copy()
print(f"✅ تم قراءة {len(df_middle)} سؤال من Excel\n")

middle_questions = []
for idx, row in df_middle.iterrows():
    middle_questions.append({
        'tool_id': tools['BIG5_60_MIDDLE'],
        'question_ar': row['Arabic Question'],
        'question_en': row['English Question'],
        'question_fr': row['English Question'],
        'question_type': 'likert_5',
        'options': json.dumps({
            'scale': 5,
            'labels_ar': ['لا أوافق بشدة', 'لا أوافق', 'محايد', 'أوافق', 'أوافق بشدة'],
            'labels_en': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        }),
        'dimension': row['Trait'],
        'subdimension': None,
        'weight': 1.0,
        'order_index': idx + 1,
        'is_reverse_scored': row['Reverse'] == 'Yes'
    })

print("💾 جاري إدراج الأسئلة في قاعدة البيانات...")
try:
    result = supabase.table('assessment_questions').insert(middle_questions).execute()
    print(f"✅ تم إدراج {len(middle_questions)} سؤال بنجاح!\n")
except Exception as e:
    print(f"❌ خطأ: {e}\n")

# ==========================================
# 3. استيراد أسئلة High School
# ==========================================
print("=" * 60)
print("🎓 استيراد أسئلة High School (60 سؤال)")
print("=" * 60)

df_high = df_youth[df_youth['Age Group'] == 'Gen Z (High)'].copy()
print(f"✅ تم قراءة {len(df_high)} سؤال من Excel\n")

high_questions = []
for idx, row in df_high.iterrows():
    high_questions.append({
        'tool_id': tools['BIG5_60_HIGH'],
        'question_ar': row['Arabic Question'],
        'question_en': row['English Question'],
        'question_fr': row['English Question'],
        'question_type': 'likert_5',
        'options': json.dumps({
            'scale': 5,
            'labels_ar': ['لا أوافق بشدة', 'لا أوافق', 'محايد', 'أوافق', 'أوافق بشدة'],
            'labels_en': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        }),
        'dimension': row['Trait'],
        'subdimension': None,
        'weight': 1.0,
        'order_index': idx + 1,
        'is_reverse_scored': row['Reverse'] == 'Yes'
    })

print("💾 جاري إدراج الأسئلة في قاعدة البيانات...")
try:
    result = supabase.table('assessment_questions').insert(high_questions).execute()
    print(f"✅ تم إدراج {len(high_questions)} سؤال بنجاح!\n")
except Exception as e:
    print(f"❌ خطأ: {e}\n")

# ==========================================
# ملخص نهائي
# ==========================================
print("\n" + "=" * 60)
print("🎉 تم الانتهاء من الاستيراد!")
print("=" * 60)
print(f"✅ College/FreshGrad: {len(college_questions)} سؤال")
print(f"✅ Middle School: {len(middle_questions)} سؤال")
print(f"✅ High School: {len(high_questions)} سؤال")
print("=" * 60)

# التحقق
print("\n🔍 التحقق من البيانات...")
for code, tool_id in tools.items():
    result = supabase.table('assessment_questions').select('*', count='exact').eq('tool_id', tool_id).execute()
    print(f"✅ {code}: {result.count} سؤال")
