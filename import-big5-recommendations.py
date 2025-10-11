import pandas as pd
from supabase import create_client
from dotenv import load_dotenv
import os
import json

load_dotenv('.env.local')

supabase = create_client(
    os.getenv('NEXT_PUBLIC_SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
)

print("🚀 بدء استيراد توصيات Big5...\n")

# قراءة Rules من Excel
df_rules = pd.read_excel('big5/Big5_College_FreshGrad_Bilingual.xlsx', sheet_name='Rules')
print(f"✅ تم قراءة {len(df_rules)} قاعدة من Excel\n")

# تحويل القواعد إلى توصيات
recommendations = []

for idx, row in df_rules.iterrows():
    condition = row['Condition']  # مثل: "O=High; C=High"
    recommended = row['Recommended Tracks (Top)']
    rationale = row['Rationale']
    
    # تحويل الشرط إلى profile_code
    # مثال: "O=High; C=High" → "OCEAN-High-High-Any-Any-Any"
    profile_parts = ['Any', 'Any', 'Any', 'Any', 'Any']  # O, C, E, A, N
    
    conditions = condition.split(';')
    for cond in conditions:
        cond = cond.strip()
        if '=' in cond:
            trait, level = cond.split('=')
            trait = trait.strip()
            level = level.strip()
            
            # تحديد موقع الـ trait
            trait_index = {'O': 0, 'C': 1, 'E': 2, 'A': 3, 'N': 4}.get(trait)
            if trait_index is not None:
                profile_parts[trait_index] = level
    
    profile_code = 'OCEAN-' + '-'.join(profile_parts)
    
    recommendations.append({
        'tool_code': 'BIG5',
        'profile_code': profile_code,
        'region': 'International',
        'education_level': 'College',
        'recommendations_ar': recommended,
        'recommendations_en': recommended,
        'rank': idx + 1,
        'metadata': json.dumps({
            'condition': condition,
            'rationale': rationale,
            'source': 'Big5_College_FreshGrad_Rules'
        })
    })

print(f"✅ تم تحويل {len(recommendations)} قاعدة إلى توصيات\n")

# إدراج في قاعدة البيانات
print("💾 جاري إدراج التوصيات في tool_recommendations...")

try:
    result = supabase.table('tool_recommendations').insert(recommendations).execute()
    print(f"✅ تم إدراج {len(recommendations)} توصية بنجاح!\n")
except Exception as e:
    print(f"❌ خطأ: {e}\n")

# التحقق
print("🔍 التحقق من البيانات...")
result = supabase.table('tool_recommendations').select('*', count='exact').eq('tool_code', 'BIG5').execute()
print(f"✅ إجمالي توصيات Big5: {result.count}")

# عرض عينة
print("\n📋 عينة من التوصيات:")
sample = supabase.table('tool_recommendations').select('*').eq('tool_code', 'BIG5').limit(3).execute()
for idx, rec in enumerate(sample.data):
    print(f"\n{idx + 1}. Profile: {rec['profile_code']}")
    print(f"   Recommendations: {rec['recommendations_ar'][:80]}...")
    print(f"   Rank: {rec['rank']}")

print("\n" + "=" * 60)
print("🎉 تم الانتهاء!")
print("=" * 60)
