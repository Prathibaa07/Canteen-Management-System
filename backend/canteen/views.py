import json
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .mongo_db import users_collection, food_collection, orders_collection, messages_collection, notifications_collection, students_collection

def serialize_doc(doc):
    doc.pop('_id', None)
    return doc

@csrf_exempt
def api_menu(request):
    if request.method == 'GET':
        foods = [serialize_doc(f) for f in food_collection.find()]
        return JsonResponse(foods, safe=False)
    
    elif request.method == 'POST':
        data = json.loads(request.body)
        food_collection.insert_one(data.copy())
        return JsonResponse(data, status=201)
    
    elif request.method == 'PUT':
        data = json.loads(request.body)
        food_collection.update_one({'id': data['id']}, {'$set': data})
        return JsonResponse(data)

    elif request.method == 'DELETE':
        data = json.loads(request.body)
        food_collection.delete_one({'id': data['id']})
        return JsonResponse({'status': 'deleted'})

@csrf_exempt
def api_orders(request):
    if request.method == 'GET':
        orders = [serialize_doc(o) for o in orders_collection.find()]
        return JsonResponse(orders, safe=False)
        
    elif request.method == 'POST':
        data = json.loads(request.body)
        orders_collection.insert_one(data.copy())
        return JsonResponse(data, status=201)
        
    elif request.method == 'PUT':
        data = json.loads(request.body)
        orders_collection.update_one({'id': data['id']}, {'$set': data})
        return JsonResponse(data)
        
    elif request.method == 'DELETE':
        data = json.loads(request.body)
        orders_collection.delete_one({'id': data['id']})
        return JsonResponse({'status': 'deleted'})

@csrf_exempt
def api_users(request):
    if request.method == 'GET':
        users = [serialize_doc(u) for u in users_collection.find()]
        return JsonResponse(users, safe=False)
        
    elif request.method == 'POST':
        data = json.loads(request.body)
        # Check for duplicates
        username = data.get('username')
        email = data.get('email')
        
        if username or email:
            query = []
            if username: query.append({'username': username})
            if email: query.append({'email': email})
            if users_collection.find_one({'$or': query}):
                return JsonResponse({'error': 'Username or email already exists'}, status=400)
                
        users_collection.insert_one(data.copy())
        return JsonResponse(serialize_doc(data), status=201)

@csrf_exempt
def api_messages(request):
    if request.method == 'GET':
        msgs = [serialize_doc(m) for m in messages_collection.find()]
        return JsonResponse(msgs, safe=False)
        
    elif request.method == 'POST':
        data = json.loads(request.body)
        messages_collection.insert_one(data.copy())
        return JsonResponse(data, status=201)

@csrf_exempt
def api_notifications(request):
    if request.method == 'GET':
        nots = [serialize_doc(n) for n in notifications_collection.find()]
        return JsonResponse(nots, safe=False)
        
    elif request.method == 'POST':
        data = json.loads(request.body)
        notifications_collection.insert_one(data.copy())
        return JsonResponse(data, status=201)

@csrf_exempt
def api_student_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        student = users_collection.find_one({
            '$or': [{'username': username}, {'email': username}],
            'password': password
        })
        if student:
            return JsonResponse(serialize_doc(student))
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

@csrf_exempt
def api_place_order(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        cart_items = data.get('items', [])
        
        # Calculate total and check stock securely on the backend
        total = 0
        valid_items = []
        for item in cart_items:
            food_item = food_collection.find_one({'id': item.get('id')})
            if not food_item:
                return JsonResponse({'error': f"Item {item.get('name')} not found"}, status=400)
            
            cart_qty = item.get('cartQuantity', 1)
            if food_item.get('quantity', 0) < cart_qty:
                return JsonResponse({'error': f"Not enough stock for {item.get('name')}"}, status=400)
            
            # Use authoritative price
            total += food_item.get('price', 0) * cart_qty
            
            # Deduct stock
            food_collection.update_one(
                {'id': food_item['id']},
                {'$inc': {'quantity': -cart_qty}}
            )
            
            # Prepare validated item to save in order
            valid_item = item.copy()
            valid_item['price'] = food_item.get('price', 0)
            valid_items.append(valid_item)
            
        # Determine new order ID
        highest_order = orders_collection.find_one(sort=[("id", -1)])
        new_id = highest_order['id'] + 1 if highest_order else 1
        
        new_order = {
            'id': new_id,
            'name': data.get('name', 'Student'),
            'username': data.get('username'), # Changed to use username instead of email for student identification
            'date': datetime.now().isoformat().split('T')[0],
            'items': valid_items,
            'total': total,
            'status': 'Pending',
            'preOrderDay': data.get('preOrderDay'),
            'preOrderDate': data.get('preOrderDate'),
            'preOrderTime': data.get('preOrderTime')
        }
        
        orders_collection.insert_one(new_order.copy())
        return JsonResponse(serialize_doc(new_order), status=201)

@csrf_exempt
def api_cancel_order(request, order_id):
    if request.method == 'POST':
        order = orders_collection.find_one({'id': int(order_id)})
        if not order:
            return JsonResponse({'error': 'Order not found'}, status=404)
            
        is_admin = request.GET.get('admin', 'false').lower() == 'true'
            
        # Restore stock
        for item in order.get('items', []):
            food_collection.update_one(
                {'id': item.get('id')},
                {'$inc': {'quantity': item.get('cartQuantity', 1)}}
            )
            
        # Update order status or delete. Let's delete it based on previous logic.
        orders_collection.delete_one({'id': int(order_id)})
        
        # Create notifications
        username = order.get('username', 'Student')
        name = order.get('name', username)
        
        if is_admin:
            admin_msg = f"Administrator canceled Order #{order_id} for {name}."
            student_msg = f"Your order #{order_id} for ₹{order.get('total', 0)} has been canceled by the administrator."
        else:
            admin_msg = f"Student canceled Order #{order_id} for ₹{order.get('total', 0)}. The items have been returned to the menu."
            student_msg = f"You have successfully canceled order #{order_id}. The items have been returned to the menu."
        
        admin_notification = {
            'id': int(datetime.now().timestamp() * 1000) + 1,
            'type': 'cancel',
            'name': name,
            'username': username,
            'message': admin_msg,
            'date': datetime.now().isoformat()
        }
        messages_collection.insert_one(admin_notification)
        
        student_notification = {
            'id': f"cancel-{order_id}-{int(datetime.now().timestamp() * 1000)}",
            'username': username,
            'date': datetime.now().isoformat().split('T')[0],
            'message': student_msg,
            'type': 'warning'
        }
        notifications_collection.insert_one(student_notification)
        
        return JsonResponse({'status': 'Canceled'})

@csrf_exempt
def api_mark_order_ready(request, order_id):
    if request.method == 'POST':
        orders_collection.update_one({'id': int(order_id)}, {'$set': {'status': 'Ready'}})
        return JsonResponse({'status': 'Ready'})

@csrf_exempt
def api_mark_order_received(request, order_id):
    if request.method == 'POST':
        order = orders_collection.find_one({'id': int(order_id)})
        if not order:
            return JsonResponse({'error': 'Order not found'}, status=404)
            
        orders_collection.update_one({'id': int(order_id)}, {'$set': {'status': 'Received'}})
        
        student_notification = {
            'id': f"received-{order_id}-{int(datetime.now().timestamp() * 1000)}",
            'username': order.get('username'),
            'date': datetime.now().isoformat(),
            'message': f"Your order #{order_id} has been marked as Received. Enjoy your food!",
            'type': 'success'
        }
        notifications_collection.insert_one(student_notification)
        
        return JsonResponse({'status': 'Received'})

@csrf_exempt
def api_subscribe_student(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        
        if not username:
            return JsonResponse({'error': 'Username required'}, status=400)
            
        today = datetime.now().isoformat()
        
        users_collection.update_one(
            {'$or': [{'username': username}, {'email': username}]},
            {'$set': {
                'hasSubscription': True,
                'subscriptionDate': today
            }}
        )
        
        student = users_collection.find_one({'$or': [{'username': username}, {'email': username}]})
        return JsonResponse(serialize_doc(student))
