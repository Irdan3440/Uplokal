import socket
import sys

host = "db.sxvxakynxajogexoobvl.supabase.co"
port = 5432

print(f"Testing DNS resolution for {host}...")
try:
    addr_info = socket.getaddrinfo(host, port)
    for res in addr_info:
        print(f"Result: {res}")
except Exception as e:
    print(f"❌ DNS Resolution failed: {e}")

# Also test a known host
print(f"\nTesting DNS resolution for google.com...")
try:
    print(f"Result: {socket.getaddrinfo('google.com', 80)[0]}")
except Exception as e:
    print(f"❌ Google DNS Resolution failed: {e}")
