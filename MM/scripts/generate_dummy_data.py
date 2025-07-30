import os
from supabase import create_client, Client
from dotenv import load_dotenv
import random
import time

load_dotenv()

SUPABASE_URL = os.environ.get("https://itupkanpgbscijstpsrt.supabase.co/")
SUPABASE_ANON_KEY = os.environ.get("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0dXBrYW5wZ2JzY2lqc3Rwc3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NjEzNzgsImV4cCI6MjA2OTMzNzM3OH0.XYzO-ilHyew6L_lvkI-J7XvnJinvzjmduUs12axCZF4")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise ValueError("Supabase URL and Anon Key must be set as environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def generate_and_insert_dummy_data():
    dummy_data = {
        "rpm": random.randint(800, 1800),
        "speed": random.randint(40, 100),
        "coolantTemp": random.randint(85, 105),
        "batteryVoltage": round(random.uniform(12.0, 14.5), 1),
        "fuelLevel": random.randint(10, 90),
        "engineLoad": random.randint(20, 80),
        "timestamp": int(time.time())
    }

    try:
        # Assuming you have a table named 'vehicle_data' in Supabase
        response = supabase.from_('vehicle_data').insert([dummy_data]).execute()
        print("Inserted dummy data:", dummy_data)
        # print("Supabase response:", response)
    except Exception as e:
        print("Error inserting dummy data:", e)

if __name__ == "__main__":
    # Generate and insert data periodically (e.g., every 5 seconds)
    while True:
        generate_and_insert_dummy_data()
        time.sleep(5)
