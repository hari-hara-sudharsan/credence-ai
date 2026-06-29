import os
import json

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))

def ensure_data_dir():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR, exist_ok=True)

def read_json(filename: str, default_value):
    ensure_data_dir()
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        return default_value
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default_value

def write_json(filename: str, data):
    ensure_data_dir()
    filepath = os.path.join(DATA_DIR, filename)
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
    except Exception as e:
        print(f"Error writing to {filepath}: {e}")
