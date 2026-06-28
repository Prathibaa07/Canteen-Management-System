import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Revert ?{ back to ${
    content = content.replace('?{', '${')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file(r'd:\Canteen Management System\frontend\src\pages\admin\AdminDashboard.jsx')
fix_file(r'd:\Canteen Management System\frontend\src\pages\student\StudentDashboard.jsx')
