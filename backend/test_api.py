import urllib.request
import urllib.error
import json

BASE_URL = "http://localhost:8000/api"

def make_post(url, data=None):
    req = urllib.request.Request(url, method="POST")
    req.add_header("Content-Type", "application/json")
    body = json.dumps(data).encode("utf-8") if data else b"{}"
    try:
        with urllib.request.urlopen(req, data=body) as response:
            return response.status, json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())
    except Exception as e:
        return 500, str(e)

print("1. Testing Place Order...")
order_data = {
    "name": "Test User",
    "username": "godson",
    "items": [{"id": 1, "name": "Crispy Dosa", "cartQuantity": 1}]
}
status, res = make_post(f"{BASE_URL}/orders/place/", order_data)
print(f"Status: {status}\n{res}")
order_id = res.get('id') if isinstance(res, dict) else None

if order_id:
    print(f"\n2. Testing Mark Ready for Order {order_id}...")
    status, res = make_post(f"{BASE_URL}/orders/{order_id}/ready/")
    print(f"Status: {status}\n{res}")

    print(f"\n3. Testing Mark Received for Order {order_id}...")
    status, res = make_post(f"{BASE_URL}/orders/{order_id}/received/")
    print(f"Status: {status}\n{res}")

print("\n4. Testing Subscription...")
status, res = make_post(f"{BASE_URL}/student/subscribe/", {"username": "godson"})
print(f"Status: {status}\n{res}")
