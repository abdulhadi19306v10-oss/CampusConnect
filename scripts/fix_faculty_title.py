import os

# 1. Update User.js Model
user_model_path = 'server/models/User.js'
with open(user_model_path, 'r') as f:
    user_model = f.read()

if 'title: { type: String }' not in user_model:
    user_model = user_model.replace('semester: { type: Number },', 'semester: { type: Number },\n  title: { type: String },')
    with open(user_model_path, 'w') as f:
        f.write(user_model)

# 2. Update client/admin/faculty.html
faculty_html_path = 'client/admin/faculty.html'
with open(faculty_html_path, 'r') as f:
    faculty_html = f.read()

# Replace all occurrences of semester logic with title logic in the faculty context
faculty_html = faculty_html.replace('name="semester" id="editFacultySemester"', 'name="title" id="editFacultyTitle"')
faculty_html = faculty_html.replace('name="semester" class="form-control" placeholder="Professor"', 'name="title" class="form-control" placeholder="Professor"')
faculty_html = faculty_html.replace('${s.semester || \'\'}', '${s.title || \'\'}')
faculty_html = faculty_html.replace('${s.semester || \'-\'}', '${s.title || \'-\'}')
faculty_html = faculty_html.replace('data-semester', 'data-title')
faculty_html = faculty_html.replace('editFacultySemester', 'editFacultyTitle')

with open(faculty_html_path, 'w') as f:
    f.write(faculty_html)

print("Fixed title field validation issue")
