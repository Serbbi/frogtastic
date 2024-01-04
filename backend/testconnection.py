import psycopg2

try:
    conn = psycopg2.connect(
        dbname="frogexp1",
        user="postgres",
        password="frog4life",
        host="localhost",
        port="5432"
    )
    print("Connection successful!")
    conn.close()
except psycopg2.Error as e:
    print("Unable to connect to the database:", e)
