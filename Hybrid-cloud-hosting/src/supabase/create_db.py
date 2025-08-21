# Supabase Integration Example

import psycopg2
import os

def create_wp_database(db_name, user, password, host):
    conn = psycopg2.connect(
        dbname='postgres',
        user=os.getenv('SUPABASE_USER'),
        password=os.getenv('SUPABASE_PASS'),
        host=os.getenv('SUPABASE_HOST'),
        port=5432
    )
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute(f"CREATE DATABASE {db_name};")
    cur.execute(f"CREATE USER {user} WITH PASSWORD '{password}';")
    cur.execute(f"GRANT ALL PRIVILEGES ON DATABASE {db_name} TO {user};")
    cur.close()
    conn.close()

# Usage: create_wp_database('wp_site1', 'wp_user1', 'securepass', 'supabase-host-url')
