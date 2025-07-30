#!/bin/bash

# This script generates dummy data and inserts it into the Supabase database

echo "Starting dummy data generation..."

# Run the Python script to generate and insert data
python scripts/generate_dummy_data.py

echo "Dummy data generation script stopped."