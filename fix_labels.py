import os

def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

admin_replacements = [
    ("Qty: {item.quantity}", "Quantity: {item.quantity}"),
    (">${item.price.toFixed(2)}</span>", ">₹{item.price.toFixed(2)}</span>"),
    (">${order.total.toFixed(2)}</td>", ">₹{order.total.toFixed(2)}</td>"),
    (">${(order.total || 0).toFixed(2)}</td>", ">₹{(order.total || 0).toFixed(2)}</td>"),
    (">${dailySales.toFixed(2)}</span>", ">₹{dailySales.toFixed(2)}</span>"),
    ("for $${order.total.toFixed(2)}", "for ₹${order.total.toFixed(2)}"),
    ('style={{ fontSize: \'1.25rem\', fontWeight: \'bold\' }}>${item.price.toFixed(2)}', 'style={{ fontSize: \'1.25rem\', fontWeight: \'bold\', color: \'var(--primary)\' }}>₹{item.price.toFixed(2)}')
]

student_replacements = [
    ("Qty Available: {item.quantity}", "Quantity: {item.quantity}"),
    (">${item.price.toFixed(2)}</span>", ">₹{item.price.toFixed(2)}</span>"),
    (">${(item.price * item.cartQuantity).toFixed(2)}", ">₹{(item.price * item.cartQuantity).toFixed(2)}"),
    (">${total.toFixed(2)}</span>", ">₹{total.toFixed(2)}</span>"),
    (">${(order.total || 0).toFixed(2)}</td>", ">₹{(order.total || 0).toFixed(2)}</td>"),
]

replace_in_file(r'd:\Canteen Management System\frontend\src\pages\admin\AdminDashboard.jsx', admin_replacements)
replace_in_file(r'd:\Canteen Management System\frontend\src\pages\student\StudentDashboard.jsx', student_replacements)

