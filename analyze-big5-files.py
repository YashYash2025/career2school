import pandas as pd
import json

print("🔍 تحليل ملفات Big5...\n")

# قراءة ملف الطلبة
print("=" * 60)
print("📚 ملف الطلبة (College):")
print("=" * 60)

try:
    # قراءة كل الشيتات
    excel_file = pd.ExcelFile('big5/Big5_College_FreshGrad_Bilingual.xlsx')
    print(f"الشيتات الموجودة: {excel_file.sheet_names}\n")
    
    for sheet_name in excel_file.sheet_names:
        print(f"\n📋 Sheet: {sheet_name}")
        print("-" * 60)
        df = pd.read_excel(excel_file, sheet_name=sheet_name)
        print(f"عدد الصفوف: {len(df)}")
        print(f"الأعمدة: {df.columns.tolist()}\n")
        print("أول 3 صفوف:")
        print(df.head(3).to_string())
        print("\n")
        
except Exception as e:
    print(f"❌ خطأ: {e}")

# قراءة ملف الخريجين
print("\n" + "=" * 60)
print("🎓 ملف الخريجين (Youth):")
print("=" * 60)

try:
    excel_file2 = pd.ExcelFile('big5/Big5_Master_Bilingual_Youth.xlsx')
    print(f"الشيتات الموجودة: {excel_file2.sheet_names}\n")
    
    for sheet_name in excel_file2.sheet_names:
        print(f"\n📋 Sheet: {sheet_name}")
        print("-" * 60)
        df = pd.read_excel(excel_file2, sheet_name=sheet_name)
        print(f"عدد الصفوف: {len(df)}")
        print(f"الأعمدة: {df.columns.tolist()}\n")
        print("أول 3 صفوف:")
        print(df.head(3).to_string())
        print("\n")
        
except Exception as e:
    print(f"❌ خطأ: {e}")
