import glob
import os

# 1. Update root client files (student dashboard, courses, etc)
root_files = glob.glob('client/*.html')
for f in root_files:
    if os.path.basename(f) in ['index.html', 'login.html']:
        continue
    
    with open(f, 'r') as file:
        content = file.read()
    
    # Check if we already added it
    if 'fa-house' not in content:
        # Find the navbar right section: <div class="d-flex align-items-center">
        target = '<div class="d-flex align-items-center">'
        if target in content:
            home_btn = '<div class="d-flex align-items-center">\n        <a href="index.html" class="btn btn-sm btn-outline-secondary me-3"><i class="fa-solid fa-house"></i> Home</a>'
            content = content.replace(target, home_btn)
            
            with open(f, 'w') as file:
                file.write(content)

# 2. Update nested client files (admin, faculty)
nested_dirs = ['client/admin/*.html', 'client/faculty/*.html']
for d in nested_dirs:
    for f in glob.glob(d):
        with open(f, 'r') as file:
            content = file.read()
        
        if 'fa-house' not in content:
            target = '<div class="d-flex align-items-center">'
            if target in content:
                home_btn = '<div class="d-flex align-items-center">\n        <a href="../index.html" class="btn btn-sm btn-outline-secondary me-3"><i class="fa-solid fa-house"></i> Home</a>'
                content = content.replace(target, home_btn)
                
                with open(f, 'w') as file:
                    file.write(content)

# 3. Explicitly update login.html to make it obvious
with open('client/login.html', 'r') as f:
    login_content = f.read()

if 'Back to Home' not in login_content:
    target_login = '<h4 class="text-center mb-4 fw-bold">Sign In</h4>'
    if target_login in login_content:
        back_btn = '<div class="text-center mb-3"><a href="index.html" class="text-decoration-none text-secondary small"><i class="fa-solid fa-arrow-left me-1"></i>Back to Home</a></div>\n    <h4 class="text-center mb-4 fw-bold">Sign In</h4>'
        login_content = login_content.replace(target_login, back_btn)
        
        with open('client/login.html', 'w') as f:
            f.write(login_content)

print("Home buttons added successfully!")
