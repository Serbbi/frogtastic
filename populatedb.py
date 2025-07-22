import json
import psycopg2

# Replace with your actual database connection details
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "frog4life"
DB_HOST = "localhost"
DB_PORT = "5432"

# Load JSON data from file
with open("frogs.json", "r") as f:
    frogs = json.load(f)

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT
)
cur = conn.cursor()

# Insert data
for frog in frogs:
    cur.execute(
        """
        INSERT INTO frogs (frog_number, current_tank_id, tank_id, organization_id, image_path, attributes, history)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """,
        (
            frog["frog_number"],
            frog["current_tank_id"],
            frog["tank_id"],
            frog["organization_id"],
            frog["image_path"],
            json.dumps(frog["attributes"]),
            json.dumps(frog["history"])
        )
    )

conn.commit()
cur.close()
conn.close()

print("Data inserted successfully.")
