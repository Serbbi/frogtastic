import psycopg2

# Database connection parameters
conn = psycopg2.connect(
    dbname="frogexp1",
    user="postgres",
    password="frog4life",
    host="localhost"
)
cur = conn.cursor()

# Define the same attribute values for all entities
name = 'John Doe'
position = 'Software Engineer'
salary = 75000
hire_date = '2023-01-15'
# frog_number = 

# Number of entities to insert
num_entities = 160

# Insert entities
for _ in range(num_entities):
    cur.execute("""
        INSERT INTO Employee (name, position, salary, hire_date)
        VALUES (%s, %s, %s, %s)
    """, (name, position, salary, hire_date))

# Commit the transaction
conn.commit()

# Close the connection
cur.close()
conn.close()
