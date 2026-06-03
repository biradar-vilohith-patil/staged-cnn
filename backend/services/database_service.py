import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_user_by_email(email: str):
    response = (
        supabase.table("users")
        .select("*")
        .eq("email", email)
        .limit(1)
        .execute()
    )
    data = response.data
    return data[0] if data else None


def get_user_by_id(user_id: str):
    response = (
        supabase.table("users")
        .select("*")
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )
    data = response.data
    return data[0] if data else None


def create_user(user_data: dict):
    response = (
        supabase.table("users")
        .insert(user_data)
        .execute()
    )
    data = response.data
    return data[0] if data else None


def create_scan(scan_data: dict):
    response = (
        supabase.table("scans")
        .insert(scan_data)
        .execute()
    )
    data = response.data
    return data[0] if data else None


def get_scans_by_user_id(user_id: str):
    response = (
        supabase.table("scans")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return response.data or []