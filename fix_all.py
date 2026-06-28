import os

def fix_all(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # In earlier mangling, literal ?{ was written instead of ${ for template literals
    # We will replace them all back to ${
    content = content.replace('?{', '${')
    
    # Also, some places might have had double question marks for currency like ??{
    # But wait, did they? Yes: for ??{order.total...}
    # But if we just replace '?{' with '${', then '??{' becomes '?${'.
    # So we should also replace '?${' with '₹${'
    content = content.replace('?${', '₹${')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_all(r'd:\Canteen Management System\frontend\src\pages\admin\AdminDashboard.jsx')
fix_all(r'd:\Canteen Management System\frontend\src\pages\student\StudentDashboard.jsx')
