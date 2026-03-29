import sqlite3

conn = sqlite3.connect("database/fridge.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    expiry TEXT
)
""")

# Sample data
sample_items = [
    ("milk", "2026-03-30"),
    ("bread", "2026-03-28"),
    ("eggs", "2026-04-02")
]

cursor.executemany("INSERT INTO items (name, expiry) VALUES (?, ?)", sample_items)

conn.commit()
conn.close()

print("✅ Database ready")