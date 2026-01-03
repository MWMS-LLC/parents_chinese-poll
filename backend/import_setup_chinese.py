"""
Import script for parents_chinese_db database.

This script exists to prevent cross-database imports. It hard-locks the target
database to parents_chinese_db and will refuse to run if connected to any other
database (including parents_db). This prevents accidental data imports into
the wrong database.

DO NOT modify this script to allow imports into other databases. If you need
to import into a different database, create a separate script following this pattern.
"""
import psycopg2
import csv
import os
from datetime import datetime
from dotenv import load_dotenv, find_dotenv
import pandas as pd

# Load environment variables robustly (backend .env)
env_path = os.path.join(os.path.dirname(__file__), '.env')
loaded = load_dotenv(dotenv_path=env_path)
if not loaded:
    # Try auto-discovery from current directory
    auto_env = find_dotenv(usecwd=True)
    if auto_env:
        load_dotenv(auto_env)

# Database URL for parents_chinese_db - MUST use parents_chinese_db, NOT parents_db
# Get from environment variable or use the config value
DATABASE_URL_CHINESE = os.getenv('DATABASE_URL_CHINESE')
if not DATABASE_URL_CHINESE:
    # Fallback: construct from config or use default pattern
    # IMPORTANT: This must point to parents_chinese_db
    DATABASE_URL_CHINESE = "postgresql://postgres:NBem0YTOfN94yKqFSw5F@mwms-instance.c320aqgmywbc.us-east-2.rds.amazonaws.com:5432/parents_chinese_db?sslmode=require"

# Verify we're using the correct database
if 'parents_chinese_db' not in DATABASE_URL_CHINESE:
    raise RuntimeError(f"ERROR: DATABASE_URL_CHINESE must point to parents_chinese_db, but got: {DATABASE_URL_CHINESE.split('/')[-1].split('?')[0]}")

# Debug: show connection info without leaking secrets
_db_url_safe = DATABASE_URL_CHINESE.split('://')[0] + '://****@' + DATABASE_URL_CHINESE.split('@')[-1] if '@' in DATABASE_URL_CHINESE else DATABASE_URL_CHINESE
print(f"ENV OK: DATABASE_URL_CHINESE loaded ({_db_url_safe})")
print(f"TARGET DATABASE: parents_chinese_db (confirmed)")

def clean_csv_value(value):
    """Clean CSV values and handle multi-line content"""
    if value is None:
        return None
    # Remove BOM and strip whitespace
    value = str(value).strip().replace('\ufeff', '')
    # Handle multi-line content
    if '\n' in value:
        value = value.replace('\n', ' ')
    return value

def import_setup_data_chinese():
    """Import CSV data into parents_chinese_db PostgreSQL database"""
    
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.normpath(os.path.join(backend_dir, '..'))
    
    # Double-check we're using the correct database
    if 'parents_chinese_db' not in DATABASE_URL_CHINESE:
        raise RuntimeError('ERROR: Must use parents_chinese_db, not parents_db!')
    
    try:
        # Connect to PostgreSQL - parents_chinese_db
        print(f"Connecting to parents_chinese_db...")
        conn = psycopg2.connect(DATABASE_URL_CHINESE)
        cursor = conn.cursor()
        
        # Verify we're connected to the correct database
        cursor.execute("SELECT current_database();")
        current_db = cursor.fetchone()[0]
        if current_db != 'parents_chinese_db':
            raise RuntimeError(f"ERROR: Connected to wrong database: {current_db}. Expected: parents_chinese_db")
        
        print(f"SUCCESS: Connected to PostgreSQL database: {current_db}")
        
        # Read and execute fresh schema
        print("Setting up fresh database schema...")
        
        # Execute setup schema
        with open(os.path.join(backend_dir, 'schema_setup.sql'), 'r', encoding='utf-8') as f:
            setup_schema = f.read()
        cursor.execute(setup_schema)
        print("SUCCESS: Setup schema created")

        # Clear old data before inserting new (in correct order due to foreign keys)
        print("Truncating existing data...")
        cursor.execute("TRUNCATE TABLE options RESTART IDENTITY CASCADE;")
        cursor.execute("TRUNCATE TABLE questions RESTART IDENTITY CASCADE;")
        cursor.execute("TRUNCATE TABLE blocks RESTART IDENTITY CASCADE;")
        cursor.execute("TRUNCATE TABLE categories RESTART IDENTITY CASCADE;")
        conn.commit()
        print("SUCCESS: Existing setup data truncated")
        
        # Import CSV data in correct order: categories -> blocks -> questions -> options
        print("\nImporting CSV data...")
        
        # 1. Import categories
        print("  [1/4] Importing categories...")
        categories_count = 0
        with open(os.path.join(root_dir, 'data', 'categories.csv'), 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Parse day_of_week array from PostgreSQL format "{0,1,2,3,4,5,6}"
                day_of_week_str = clean_csv_value(row.get('day_of_week', ''))
                day_of_week_array = None
                if day_of_week_str and day_of_week_str.startswith('{') and day_of_week_str.endswith('}'):
                    content = day_of_week_str[1:-1]  # Remove { and }
                    day_of_week_array = [int(day.strip()) for day in content.split(',') if day.strip()]
                
                cursor.execute("""
                    INSERT INTO categories (category_name, category_text, day_of_week, description, category_text_long, version, uuid, sort_order, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    clean_csv_value(row['category_name']),
                    clean_csv_value(row.get('category_text', '')),
                    day_of_week_array,
                    clean_csv_value(row.get('description', '')),
                    clean_csv_value(row.get('category_text_long', '')),
                    clean_csv_value(row.get('version', '')),
                    clean_csv_value(row.get('uuid', '')),
                    int(row.get('sort_order', 0)),
                    datetime.now()
                ))
                categories_count += 1
        conn.commit()
        print(f"    SUCCESS: {categories_count} categories imported")
        
        # 2. Import blocks
        print("  [2/4] Importing blocks...")
        blocks_count = 0
        with open(os.path.join(root_dir, 'data', 'blocks.csv'), 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                cursor.execute("""
                    INSERT INTO blocks (category_id, block_number, block_code, block_text, version, uuid, category_name, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    int(row['category_id']),
                    int(row['block_number']),
                    clean_csv_value(row['block_code']),
                    clean_csv_value(row['block_text']),
                    clean_csv_value(row.get('version', '')),
                    clean_csv_value(row.get('uuid', '')),
                    clean_csv_value(row.get('category_name', '')),
                    datetime.now()
                ))
                blocks_count += 1
        conn.commit()
        print(f"    SUCCESS: {blocks_count} blocks imported")
        
        # 3. Import questions
        print("  [3/4] Importing questions...")
        questions_count = 0
        with open(os.path.join(root_dir, 'data', 'questions.csv'), 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                cursor.execute("""
                    INSERT INTO questions (category_id, question_code, question_number, question_text, check_box, max_select, block_number, block_text, is_start_question, parent_question_id, color_code, version, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    int(row['category_id']),
                    clean_csv_value(row['question_code']),
                    int(row['question_number']),
                    clean_csv_value(row['question_text']),
                    row.get('check_box', 'false').lower() == 'true',
                    int(row.get('max_select', 10)) if row.get('max_select') and row.get('max_select').strip() and row.get('max_select') != '' else (10 if row.get('check_box', 'false').lower() == 'true' else 1),
                    int(row['block_number']),
                    clean_csv_value(row.get('block_text', '')),
                    row.get('is_start_question', 'false').lower() == 'true',
                    int(row['parent_question_id']) if row.get('parent_question_id') and row.get('parent_question_id').strip() else None,
                    clean_csv_value(row.get('color_code', '')),
                    clean_csv_value(row.get('version', '')),
                    datetime.now()
                ))
                questions_count += 1
        conn.commit()
        print(f"    SUCCESS: {questions_count} questions imported")
        
        # 4. Import options
        print("  [4/4] Importing options...")
        options_count = 0
        with open(os.path.join(root_dir, 'data', 'options.csv'), 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                cursor.execute("""
                    INSERT INTO options (category_id, question_code, question_number, question_text, check_box, block_number, block_text, option_select, option_code, option_text, response_message, companion_advice, tone_tag, next_question_id, version, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    int(row['category_id']),
                    clean_csv_value(row['question_code']),
                    int(row['question_number']),
                    clean_csv_value(row['question_text']),
                    row.get('check_box', 'false').lower() == 'true',
                    int(row['block_number']),
                    clean_csv_value(row['block_text']),
                    clean_csv_value(row['option_select']),
                    clean_csv_value(row['option_code']),
                    clean_csv_value(row['option_text']),
                    clean_csv_value(row.get('response_message', '')),
                    clean_csv_value(row.get('companion_advice', '')),
                    clean_csv_value(row.get('tone_tag', '')),
                    int(row['next_question_id']) if row.get('next_question_id') and row.get('next_question_id').strip() else None,
                    clean_csv_value(row.get('version', '')),
                    datetime.now()
                ))
                options_count += 1
        conn.commit()
        print(f"    SUCCESS: {options_count} options imported")
        
        print("\nSUCCESS: All data imported successfully!")
        
        # ===== SANITY CHECKS =====
        print("\n" + "="*60)
        print("RUNNING SANITY CHECKS")
        print("="*60)
        
        # 1. Count rows in each setup table
        print("\n1. Row counts in each setup table:")
        print("-" * 60)
        
        tables = ['categories', 'blocks', 'questions', 'options']
        counts = {}
        
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            counts[table] = count
            print(f"   {table:15s}: {count:6d} rows")
        
        # 2. Sample query: fetch 1-2 categories
        print("\n2. Sample categories (first 2):")
        print("-" * 60)
        cursor.execute("SELECT id, category_name, category_text FROM categories ORDER BY id LIMIT 2")
        categories = cursor.fetchall()
        for cat in categories:
            print(f"   ID: {cat[0]}, Name: {cat[1]}, Text: {cat[2][:50] if cat[2] else 'N/A'}...")
        
        # 3. Sample query: fetch 1-2 questions
        print("\n3. Sample questions (first 2):")
        print("-" * 60)
        cursor.execute("SELECT id, question_code, question_text FROM questions ORDER BY id LIMIT 2")
        questions = cursor.fetchall()
        for q in questions:
            print(f"   ID: {q[0]}, Code: {q[1]}, Text: {q[2][:50] if q[2] else 'N/A'}...")
        
        # 4. Verify foreign key relationships
        print("\n4. Foreign key relationship checks:")
        print("-" * 60)
        
        # Check blocks reference valid categories
        cursor.execute("""
            SELECT COUNT(*) FROM blocks b 
            WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.id = b.category_id)
        """)
        orphan_blocks = cursor.fetchone()[0]
        print(f"   Orphan blocks (invalid category_id): {orphan_blocks}")
        
        # Check questions reference valid blocks/categories
        cursor.execute("""
            SELECT COUNT(*) FROM questions q 
            WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.id = q.category_id)
        """)
        orphan_questions = cursor.fetchone()[0]
        print(f"   Orphan questions (invalid category_id): {orphan_questions}")
        
        # Check options reference valid questions
        cursor.execute("""
            SELECT COUNT(*) FROM options o 
            WHERE NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_code = o.question_code)
        """)
        orphan_options = cursor.fetchone()[0]
        print(f"   Orphan options (invalid question_code): {orphan_options}")
        
        # Summary
        print("\n" + "="*60)
        print("SANITY CHECK SUMMARY")
        print("="*60)
        print(f"✓ Database: parents_chinese_db (confirmed)")
        print(f"✓ Categories: {counts['categories']} rows")
        print(f"✓ Blocks: {counts['blocks']} rows")
        print(f"✓ Questions: {counts['questions']} rows")
        print(f"✓ Options: {counts['options']} rows")
        print(f"✓ Orphan records: {orphan_blocks + orphan_questions + orphan_options}")
        
        if orphan_blocks + orphan_questions + orphan_options == 0:
            print("\n✅ All sanity checks passed!")
        else:
            print(f"\n⚠️  WARNING: Found {orphan_blocks + orphan_questions + orphan_options} orphan records")
        
        print("="*60)
        
    except Exception as e:
        print(f"\nERROR: {e}")
        if 'conn' in locals() and conn:
            conn.rollback()
        raise
    finally:
        if 'conn' in locals() and conn:
            conn.close()
            print("\nDatabase connection closed.")

if __name__ == "__main__":
    import_setup_data_chinese()

