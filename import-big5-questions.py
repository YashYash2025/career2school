import pandas as pd
import sys
sys.path.append('.')
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv('.env.local')

# إنشاء اتصال Supabase
supabase = create_client(
    os.getenv('NEXT_PUBLIC_SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
)

print("🚀 بدء استيراد أسئلة Big5...\n")

# ==========================================
# 1. استيراد أسئلة College/FreshGrad
# ==========================================
print("=" * 60)
print("📚 استيراد أسئلة College/FreshGrad (60 سؤال)")
print("=" * 60)

df_college = pd.read_excel('big5/Big5_College_FreshGrad_Bilingual.xlsx', sheet_name='Big5_Long_60')
print(f"✅ تم قراءة {len(df_college)} سؤال من Excel\n")

college_questions = []
question_num = 1

for _, row in df_college.iterrows():
    college_questions.append({
        'trait': row['Trait'],
        'question_id': row['ID'],
        'question_number': question_num,
        'question_en': row['English Question'],
        'question_ar': row['Arabic Question'],
        'is_reverse': row['Reverse'] == 'Yes',
        'scale_min': 1,
        'scale_max': 5,
        'notes': row.get('Notes', '')
    })
    question_num += 1

# إدراج في قاعدة البيانات
print("💾 جاري إدراج الأسئلة في قاعدة البيانات...")
try:
    result = supabase.table('big5_60_college_freshgrad').insert(college_questions).execute()
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
print(f"✅ تم قراءة {len(df_youth)} سؤال من Excel\n")

# تصفية أسئلة Middle
df_middle = df_youth[df_youth['Age Group'] == 'Gen Alpha (Middle)'].copy()
print(f"📊 عدد أسئلة Middle: {len(df_middle)}")

middle_questions = []
question_num = 1

for _, row in df_middle.iterrows():
    middle_questions.append({
        'trait': row['Trait'],
        'question_id': row['ID'],
        'question_number': question_num,
        'question_en': row['English Question'],
        'question_ar': row['Arabic Question'],
        'is_reverse': row['Reverse'] == 'Yes',
        'scale_min': 1,
        'scale_max': 5,
        'age_group': 'Gen Alpha (Middle)',
        'notes': row.get('Notes', '')
    })
    question_num += 1

print("💾 جاري إدراج الأسئلة في قاعدة البيانات...")
try:
    result = supabase.table('big5_60_middle').insert(middle_questions).execute()
    print(f"✅ تم إدراج {len(middle_questions)} سؤال بنجاح!\n")
except Exception as e:
    print(f"❌ خطأ: {e}\n")

# ==========================================
# 3. استيراد أسئلة High School
# ==========================================
print("=" * 60)
print("🎓 استيراد أسئلة High School (60 سؤال)")
print("=" * 60)

# تصفية أسئلة High
df_high = df_youth[df_youth['Age Group'] == 'Gen Z (High)'].copy()
print(f"📊 عدد أسئلة High: {len(df_high)}")

high_questions = []
question_num = 1

for _, row in df_high.iterrows():
    high_questions.append({
        'trait': row['Trait'],
        'question_id': row['ID'],
        'question_number': question_num,
        'question_en': row['English Question'],
        'question_ar': row['Arabic Question'],
        'is_reverse': row['Reverse'] == 'Yes',
        'scale_min': 1,
        'scale_max': 5,
        'age_group': 'Gen Z (High)',
        'notes': row.get('Notes', '')
    })
    question_num += 1

print("💾 جاري إدراج الأسئلة في قاعدة البيانات...")
try:
    result = supabase.table('big5_60_high').insert(high_questions).execute()
    print(f"✅ تم إدراج {len(high_questions)} سؤال بنجاح!\n")
except Exception as e:
    print(f"❌ خطأ: {e}\n")

# ==========================================
# 4. استيراد Career Tracks
# ==========================================
print("=" * 60)
print("💼 استيراد المسارات المهنية")
print("=" * 60)

df_tracks = pd.read_excel('big5/Big5_College_FreshGrad_Bilingual.xlsx', sheet_name='Career_Tracks')
print(f"✅ تم قراءة {len(df_tracks)} مسار من Excel\n")

career_tracks = []
for _, row in df_tracks.iterrows():
    career_tracks.append({
        'track_name': row['Track'],
        'description_en': row['Description_EN'],
        'description_ar': row['Description_AR'],
        'example_roles_en': row['Example_Roles_EN'],
        'example_roles_ar': row['Example_Roles_AR']
    })

print("💾 جاري إدراج المسارات في قاعدة البيانات...")
try:
    result = supabase.table('big5_career_tracks').insert(career_tracks).execute()
    print(f"✅ تم إدراج {len(career_tracks)} مسار بنجاح!\n")
except Exception as e:
    print(f"❌ خطأ: {e}\n")

# ==========================================
# 5. استيراد Rules
# ==========================================
print("=" * 60)
print("📋 استيراد قواعد الربط")
print("=" * 60)

df_rules = pd.read_excel('big5/Big5_College_FreshGrad_Bilingual.xlsx', sheet_name='Rules')
print(f"✅ تم قراءة {len(df_rules)} قاعدة من Excel\n")

rules = []
for idx, row in df_rules.iterrows():
    # تحويل المسارات إلى array
    recommended = [t.strip() for t in str(row['Recommended Tracks (Top)']).split(',') if t.strip()]
    alternates = []
    if pd.notna(row.get('Alternates')):
        alternates = [t.strip() for t in str(row['Alternates']).split(',') if t.strip()]
    
    rules.append({
        'condition': row['Condition'],
        'recommended_tracks': recommended,
        'alternate_tracks': alternates if alternates else None,
        'rationale_en': row['Rationale'],
        'rationale_ar': row['Rationale'],  # يمكن ترجمته لاحقاً
        'priority': idx + 1
    })

print("💾 جاري إدراج القواعد في قاعدة البيانات...")
try:
    result = supabase.table('big5_matching_rules').insert(rules).execute()
    print(f"✅ تم إدراج {len(rules)} قاعدة بنجاح!\n")
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
print(f"✅ Career Tracks: {len(career_tracks)} مسار")
print(f"✅ Matching Rules: {len(rules)} قاعدة")
print("=" * 60)
