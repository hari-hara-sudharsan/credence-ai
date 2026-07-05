import os
import json
import shutil

# Check if running in Vercel serverless or if local directory is read-only
is_vercel = os.environ.get("VERCEL") == "1" or os.environ.get("VERCEL") is not None
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if is_vercel or not os.access(base_dir, os.W_OK):
    DATA_DIR = "/tmp/data"
    SRC_DATA_DIR = os.path.join(base_dir, "data")
else:
    DATA_DIR = os.path.join(base_dir, "data")
    SRC_DATA_DIR = None

def ensure_data_dir():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR, exist_ok=True)
    
    # Seed files from read-only directory to /tmp/data if not present
    if SRC_DATA_DIR and os.path.exists(SRC_DATA_DIR):
        for filename in os.listdir(SRC_DATA_DIR):
            src_path = os.path.join(SRC_DATA_DIR, filename)
            dest_path = os.path.join(DATA_DIR, filename)
            if os.path.isfile(src_path) and not os.path.exists(dest_path):
                try:
                    shutil.copy2(src_path, dest_path)
                except Exception as e:
                    print(f"Failed to copy seed file {filename} to {dest_path}: {e}")

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
