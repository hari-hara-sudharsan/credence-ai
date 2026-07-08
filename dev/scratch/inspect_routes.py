import sys
import os
sys.path.insert(0, r"c:\Users\Windows\credence-ai\frontend\api")

from index import app

def print_routes(routes, indent=""):
    for route in routes:
        if hasattr(route, "path"):
            methods = getattr(route, "methods", None)
            print(f"{indent}Path: {route.path} | Methods: {methods} | Name: {route.name}")
        elif hasattr(route, "routes"):
            # It is a Mount or IncludedRouter
            path = getattr(route, "path", "") or getattr(route, "prefix", "")
            print(f"{indent}Mount/Router with prefix: {path}")
            print_routes(route.routes, indent + "  ")
        elif hasattr(route, "app") and hasattr(route.app, "routes"):
            path = getattr(route, "path", "") or getattr(route, "prefix", "")
            print(f"{indent}Mount with path: {path}")
            print_routes(route.app.routes, indent + "  ")

print("=== REGISTERED ROUTES ===")
print_routes(app.routes)
print("=========================")
