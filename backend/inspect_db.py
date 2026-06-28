import datetime
from canteen.mongo_db import db
import json
from bson import ObjectId

def custom_encoder(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, datetime.datetime):
        return obj.isoformat()
    raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

target_collections = ['Students', 'foods', 'orders', 'users']

for coll_name in target_collections:
    print(f"\n--- Collection: {coll_name} ---")
    doc = db[coll_name].find_one()
    if doc:
        print(json.dumps(doc, default=custom_encoder, indent=2))
    else:
        print("Empty collection")
