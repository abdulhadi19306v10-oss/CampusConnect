import os
import glob

admin_files = glob.glob('client/admin/*.html')

for filepath in admin_files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Fix Navbar
    content = content.replace('<nav class="navbar navbar-expand-lg bg-dark navbar-dark sticky-top">', '<nav class="navbar navbar-expand-lg sticky-top">')
    content = content.replace('<a class="navbar-brand text-white"', '<a class="navbar-brand"')
    content = content.replace('<span class="me-3 fw-medium text-light user-name">', '<span class="me-3 fw-medium text-secondary user-name">')
    content = content.replace('<button id="logoutBtn" class="btn btn-outline-light btn-sm">', '<button id="logoutBtn" class="btn btn-outline-danger btn-sm">')
    
    # Fix Sidebar
    content = content.replace('<div class="col-md-2 d-none d-md-block sidebar px-0 bg-dark">', '<div class="col-md-2 d-none d-md-block sidebar px-0">')
    content = content.replace('<a class="nav-link text-light', '<a class="nav-link')
    
    with open(filepath, 'w') as f:
        f.write(content)

print("Admin UI fixed")
