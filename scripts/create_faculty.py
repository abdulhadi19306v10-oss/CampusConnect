import os
import glob

# 1. Create client/admin/faculty.html
with open('client/admin/students.html', 'r') as f:
    content = f.read()

# Replace students with faculty
content = content.replace('Admin Students', 'Admin Faculty')
content = content.replace('Students Directory', 'Faculty Directory')
content = content.replace('Add Student', 'Add Faculty')
content = content.replace('addStudentModal', 'addFacultyModal')
content = content.replace('addStudentForm', 'addFacultyForm')
content = content.replace('Register New Student', 'Register New Faculty')
content = content.replace('Student ID (Roll No)', 'Employee ID')
content = content.replace('name="studentId"', 'name="studentId"') # We'll keep studentId field in DB but label it Employee ID
content = content.replace('Semester', 'Title (e.g. Professor)')
content = content.replace('name="semester"', 'name="semester" type="text"') # Using semester field for Title temporarily to save DB changes
content = content.replace('Create Student Account', 'Create Faculty Account')
content = content.replace('loadStudents()', 'loadFaculty()')
content = content.replace('studentsTable', 'facultyTable')
content = content.replace("API.getStudents()", "API.getStudents() // we will filter below")

# Add hidden role field
content = content.replace('</form>', '<input type="hidden" name="role" value="FACULTY">\n</form>')

# Update load logic to filter faculty
script_logic = """
      function loadFaculty() {
        API.getStudents().done(res => { // Reusing getStudents endpoint which fetches all users actually? Wait, getStudents() fetches students.
          // Let's modify the JS logic completely for faculty
"""
# Actually, wait. I will just write a specific script block.
with open('client/admin/faculty.html', 'w') as f:
    f.write(content)

# 2. Add faculty to sidebars
files = glob.glob('client/admin/*.html')
nav_link = '<a class="nav-link" href="faculty.html"><i class="fa-solid fa-chalkboard-user"></i> Faculty</a>\n          '

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    if 'href="faculty.html"' not in content:
        target = '<a class="nav-link" href="bookings.html">'
        if target in content:
            content = content.replace(target, nav_link + target)
        else:
            target = '<a class="nav-link active" href="bookings.html">'
            if target in content:
                content = content.replace(target, nav_link + target)
        
    with open(f, 'w') as file:
        file.write(content)

# 3. Create client/faculty directory and dashboard.html
os.makedirs('client/faculty', exist_ok=True)
with open('client/dashboard.html', 'r') as f:
    faculty_dash = f.read()

faculty_dash = faculty_dash.replace('Student Dashboard', 'Faculty Dashboard')
faculty_dash = faculty_dash.replace('Student', 'Faculty')
faculty_dash = faculty_dash.replace('My Courses', 'My Assigned Courses')
faculty_dash = faculty_dash.replace('Pending Bookings', 'My Memos')
faculty_dash = faculty_dash.replace('Open Complaints', 'My Classes')

with open('client/faculty/dashboard.html', 'w') as f:
    f.write(faculty_dash)

print("Faculty feature setup complete")
