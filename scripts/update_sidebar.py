import glob

files = glob.glob('client/admin/*.html')
nav_link = '<a class="nav-link" href="students.html"><i class="fa-solid fa-users"></i> Students</a>\n          '

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    if 'href="students.html"' not in content:
        # Insert after Dashboard
        target = '<a class="nav-link" href="bookings.html">'
        if target in content:
            content = content.replace(target, nav_link + target)
        else:
            # Handle the active state in dashboard
            target = '<a class="nav-link active" href="bookings.html">'
            if target in content:
                content = content.replace(target, nav_link + target)
        
    with open(f, 'w') as file:
        file.write(content)

print("Sidebar updated")
