from fastapi import FastAPI
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import random
import time

load_dotenv()

app = FastAPI()

SUPABASE_URL = os.environ.get("https://itupkanpgbscijstpsrt.supabase.co/")
SUPABASE_ANON_KEY = os.environ.get("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0dXBrYW5wZ2JzY2lqc3Rwc3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NjEzNzgsImV4cCI6MjA2OTMzNzM3OH0.XYzO-ilHyew6L_lvkI-J7XvnJinvzjmduUs12axCZF4")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise ValueError("Supabase URL and Anon Key must be set as environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

@app.get("/")
async def read_root():
    return {"message": "MechaMind+ Backend"}

@app.get("/vehicle-data")
async def get_vehicle_data():
    # In a real application, you would fetch the latest data from Supabase here.
    # For this MVP, we'll return some simulated data.
    # Replace with actual Supabase query when you have data inserted.
    # Example: data = supabase.from_('vehicle_data').select('*').order('timestamp', desc=True).limit(1).execute()
    
    # Simulated data (replace with Supabase fetch)
    simulated_data = {
        "rpm": random.randint(800, 1800),
        "speed": random.randint(40, 100),
        "coolantTemp": random.randint(85, 105),
        "batteryVoltage": round(random.uniform(12.0, 14.5), 1),
        "fuelLevel": random.randint(10, 90),
        "engineLoad": random.randint(20, 80),
        "timestamp": int(time.time())
    }
    return simulated_data
