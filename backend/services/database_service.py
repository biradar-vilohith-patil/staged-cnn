import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load variables from the .env file
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials. Check your backend/.env file.")

# Initialize the Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def create_user(name: str, email: str, password_hash: str):
    response = supabase.table('users').insert({
        "name": name, 
        "email": email, 
        "password_hash": password_hash
    }).execute()
    return response.data

def get_user_by_email(email: str):
    response = supabase.table('users').select("*").eq("email", email).execute()
    # Return the first user found, or None if no user exists
    return response.data[0] if response.data else None

def save_scan_history(user_email: str, file_name: str, prediction: str, confidence: float):
    response = supabase.table('history').insert({
        "user_email": user_email,
        "file_name": file_name,
        "prediction": prediction,
        "confidence": confidence
    }).execute()
    return response.data

def get_user_history(user_email: str):
    # Fetch history and order by newest first
    response = supabase.table('history').select("*").eq("user_email", user_email).order("created_at", desc=True).execute()
    return response.data