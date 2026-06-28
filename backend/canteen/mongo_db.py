from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable is not set. Please check your .env file or server settings.")

client = MongoClient(MONGO_URI)
db = client['Vmanage_V-1']

# Collections
users_collection = db['users']
food_collection = db['foods']
orders_collection = db['orders']
messages_collection = db['messages']
notifications_collection = db['notifications']
students_collection = db['Students']
