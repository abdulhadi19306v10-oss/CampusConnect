import os
import glob

# Read admin/students.html
with open('client/admin/students.html', 'r') as f:
    html = f.read()

# Replace references to make it Faculty specific and read-only
html = html.replace('<title>Admin Students - CampusConnect</title>', '<title>My Students - CampusConnect</title>')
html = html.replace('CampusConnect Admin', 'CampusConnect Faculty')

# Fix sidebar to match new faculty sidebar
new_sidebar = """<div class="nav flex-column">
          <a class="nav-link" href="dashboard.html"><i class="fa-solid fa-chart-pie"></i> Dashboard</a>
          <a class="nav-link active" href="mystudents.html"><i class="fa-solid fa-users"></i> My Students</a>
          <a class="nav-link" href="../announcements.html"><i class="fa-solid fa-bullhorn"></i> Announcements</a>
        </div>"""
html = html.replace(html[html.find('<div class="nav flex-column">'):html.find('</div>\n      </div>', html.find('<div class="nav flex-column">')) + 6], new_sidebar)

# Remove the Add Student Button and change title
html = html.replace('<h5 class="fw-bold mb-0">Students Directory</h5>', '<h5 class="fw-bold mb-0">Student Roster</h5>')
html = html.replace('<button class="btn btn-primary-gradient rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#addStudentModal">\n              <i class="fa-solid fa-plus me-2"></i>Add Student\n            </button>', '')

# Remove Actions column header
html = html.replace('<th>Actions</th>\n                  </tr>', '</tr>')

# In JS, remove action buttons from the row building
js_row_start = html.find('<td>${s.semester || \'-\'}</td>')
js_row_end = html.find('</tr>`;', js_row_start)
html = html[:js_row_start] + "<td>${s.semester || '-'}</td>\n            </tr>`;" + html[js_row_end + 7:]

# Write to faculty/mystudents.html
with open('client/faculty/mystudents.html', 'w') as f:
    f.write(html)

print("Created mystudents.html for Faculty")
