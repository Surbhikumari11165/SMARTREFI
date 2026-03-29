import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, "database", "fridge.db")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT * FROM items")
rows = cursor.fetchall()

print("📊 DATA IN DB:\n")
for row in rows:
    print(row)

conn.close()