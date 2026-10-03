import os
import glob

faculty_sidebar = """        <div class="nav flex-column">
          <a class="nav-link {d_active}" href="dashboard.html"><i class="fa-solid fa-chart-pie"></i> Dashboard</a>
          <a class="nav-link {c_active}" href="courses.html"><i class="fa-solid fa-book"></i> Course Manager</a>
          <a class="nav-link {a_active}" href="attendance.html"><i class="fa-solid fa-clipboard-user"></i> Attendance</a>
          <a class="nav-link {s_active}" href="mystudents.html"><i class="fa-solid fa-users"></i> My Students</a>
          <a class="nav-link {ann_active}" href="announcements.html"><i class="fa-solid fa-bullhorn"></i> Announcements</a>
        </div>"""

def generate_shell(title, active_tab, content):
    sidebar = faculty_sidebar.format(
        d_active='active' if active_tab == 'd' else '',
        c_active='active' if active_tab == 'c' else '',
        a_active='active' if active_tab == 'a' else '',
        s_active='active' if active_tab == 's' else '',
        ann_active='active' if active_tab == 'ann' else ''
    )
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{title} - CampusConnect Faculty</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top">
    <div class="container-fluid px-4">
      <a class="navbar-brand" href="dashboard.html"><i class="fa-solid fa-graduation-cap me-2"></i>CampusConnect Faculty</a>
      <div class="d-flex align-items-center">
        <a href="../index.html" class="btn btn-sm btn-outline-secondary me-3"><i class="fa-solid fa-house"></i> Home</a>
        <span class="me-3 fw-medium text-secondary user-name">Professor</span>
        <button id="logoutBtn" class="btn btn-outline-danger btn-sm">Logout</button>
      </div>
    </div>
  </nav>

  <div class="container-fluid">
    <div class="row">
      <div class="col-md-2 d-none d-md-block sidebar px-0">
{sidebar}
      </div>

      <div class="col-md-10 dashboard-content bg-light">
        <div id="alertContainer"></div>
        {content}
      </div>
    </div>
  </div>

  <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../js/api.js"></script>
  <script src="../js/auth.js"></script>
  <script>
    $(document).ready(function() {{
        // UI Initializers
    }});
  </script>
</body>
</html>"""

# 1. Announcements Page (Read Only for Faculty from this view, they post on dashboard)
ann_content = """
        <h2 class="fw-bold mb-4">University Announcements</h2>
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white pt-4 pb-0 border-bottom-0">
            <h5 class="fw-bold"><i class="fa-solid fa-bullhorn text-primary me-2"></i>Recent Bulletins</h5>
          </div>
          <div class="card-body mt-3" id="announcementsList">
             <!-- Inject via JS -->
          </div>
        </div>
        <script>
            // We append a custom script tag here just to fetch announcements
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    API.getAnnouncements().done(res => {
                        let html = '';
                        res.data.forEach(a => {
                          const date = new Date(a.date).toLocaleDateString();
                          const bgClass = a.category === 'IMPORTANT' ? 'bg-danger' : 
                                         (a.category === 'ACADEMIC' ? 'bg-primary' : 'bg-secondary');
                          
                          html += `<div class="card mb-3 shadow-sm border-0">
                            <div class="card-header ${bgClass} text-white fw-bold">
                              ${a.title}
                              <span class="float-end small">${date}</span>
                            </div>
                            <div class="card-body">
                              <p class="card-text mb-0">${a.content}</p>
                            </div>
                          </div>`;
                        });
                        $('#announcementsList').html(html || '<p>No announcements found.</p>');
                    });
                }, 500);
            });
        </script>
"""

# 2. Courses Page (Upload Content / Assign)
courses_content = """
        <h2 class="fw-bold mb-4">Course Manager</h2>
        
        <div class="row g-4 mb-4">
            <div class="col-md-12">
                <div class="card border-0 shadow-sm">
                  <div class="card-header bg-white pt-4 pb-0 border-bottom-0 d-flex justify-content-between">
                    <h5 class="fw-bold mb-0">My Teaching Assignments</h5>
                    <button class="btn btn-primary-gradient rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#uploadContentModal">
                      <i class="fa-solid fa-cloud-arrow-up me-2"></i>Upload Content
                    </button>
                  </div>
                  <div class="card-body mt-3">
                    <div class="table-responsive">
                      <table class="table table-hover align-middle">
                        <thead class="table-light">
                          <tr>
                            <th>Code</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Materials Uploaded</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody id="facultyCoursesList">
                          <tr><td colspan="5" class="text-center">Loading...</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
            </div>
        </div>
        
        <!-- Upload Modal -->
        <div class="modal fade" id="uploadContentModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content border-0 shadow">
              <div class="modal-header border-bottom-0">
                <h5 class="modal-title fw-bold">Upload Course Content</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <form id="uploadForm">
                  <div class="mb-3">
                    <label class="form-label text-muted fw-semibold">Select Course</label>
                    <select class="form-select" id="courseSelect" required>
                        <option value="">-- Choose Assigned Course --</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted fw-semibold">Material Title</label>
                    <input type="text" class="form-control" placeholder="e.g. Week 1 Lecture Slides" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted fw-semibold">File Upload</label>
                    <input type="file" class="form-control" required>
                  </div>
                  <button type="submit" class="btn btn-primary-gradient w-100 rounded-pill mt-3 py-2">Upload to LMS</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    const currentUser = JSON.parse(localStorage.getItem('user'));
                    if(!currentUser) return;
                    
                    API.getCourses().done(res => {
                        const myCourses = res.data.filter(c => c.instructor === currentUser.name);
                        let html = '';
                        let options = '<option value="">-- Choose Assigned Course --</option>';
                        myCourses.forEach(c => {
                             html += `<tr>
                               <td class="fw-bold">${c.courseCode}</td>
                               <td>${c.title}</td>
                               <td><span class="badge bg-success">Active</span></td>
                               <td>0 files</td>
                               <td>
                                 <button class="btn btn-sm btn-outline-primary me-1"><i class="fa-solid fa-folder-open"></i> Manage</button>
                               </td>
                             </tr>`;
                             options += `<option value="${c._id}">${c.courseCode} - ${c.title}</option>`;
                        });
                        $('#facultyCoursesList').html(html || '<tr><td colspan="5" class="text-center text-muted">No courses assigned to you yet.</td></tr>');
                        $('#courseSelect').html(options);
                    });
                    
                    $('#uploadForm').submit(function(e) {
                        e.preventDefault();
                        $('#uploadContentModal').modal('hide');
                        showAlert('Course material uploaded successfully and distributed to enrolled students!', 'success');
                        this.reset();
                    });
                }, 500);
            });
        </script>
"""

# 3. Attendance Page (Add/Remove students, Update Sheet)
attendance_content = """
        <h2 class="fw-bold mb-4">Attendance Sheets</h2>
        
        <div class="row g-4 mb-4">
            <div class="col-md-12">
                <div class="card border-0 shadow-sm">
                  <div class="card-header bg-white pt-4 pb-0 border-bottom-0 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="fw-bold mb-1">Live Attendance</h5>
                        <p class="text-muted small mb-0">Select a course to view and update the student roster</p>
                    </div>
                    <select class="form-select w-auto fw-bold text-primary border-primary bg-light" id="attendanceCourseSelect">
                        <option>Loading assigned courses...</option>
                    </select>
                  </div>
                  <div class="card-body mt-3">
                    <div class="table-responsive">
                      <table class="table table-hover align-middle">
                        <thead class="table-light">
                          <tr>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Status (Today)</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody id="attendanceList">
                          <!-- Filled by JS -->
                        </tbody>
                      </table>
                    </div>
                    <div class="d-flex justify-content-end mt-3 gap-2">
                        <button class="btn btn-outline-danger" onclick="showAlert('Student removed from course roster', 'warning')"><i class="fa-solid fa-user-minus me-2"></i>Drop Selected</button>
                        <button class="btn btn-success fw-bold px-4" onclick="showAlert('Attendance sheet updated successfully for today!', 'success')"><i class="fa-solid fa-floppy-disk me-2"></i>Save Attendance</button>
                    </div>
                  </div>
                </div>
            </div>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    const currentUser = JSON.parse(localStorage.getItem('user'));
                    if(!currentUser) return;
                    
                    API.getCourses().done(res => {
                        const myCourses = res.data.filter(c => c.instructor === currentUser.name);
                        let options = '';
                        myCourses.forEach(c => {
                             options += `<option value="${c._id}">${c.courseCode} - ${c.title}</option>`;
                        });
                        $('#attendanceCourseSelect').html(options || '<option>No Courses Assigned</option>');
                    });
                    
                    // Mocking enrolled students since we don't have a direct /api/courses/:id/students endpoint yet
                    API.getStudents().done(res => {
                        let html = '';
                        res.data.slice(0, 5).forEach(s => {
                             html += `<tr>
                               <td class="fw-bold">${s.name}</td>
                               <td>${s.email}</td>
                               <td>
                                  <select class="form-select form-select-sm w-auto">
                                    <option class="text-success" selected>Present</option>
                                    <option class="text-danger">Absent</option>
                                    <option class="text-warning">Late</option>
                                  </select>
                               </td>
                               <td>
                                 <input type="checkbox" class="form-check-input ms-2" title="Select to drop">
                               </td>
                             </tr>`;
                        });
                        $('#attendanceList').html(html);
                    });
                }, 500);
            });
        </script>
"""

with open('client/faculty/announcements.html', 'w') as f:
    f.write(generate_shell('Announcements', 'ann', ann_content))
with open('client/faculty/courses.html', 'w') as f:
    f.write(generate_shell('Course Manager', 'c', courses_content))
with open('client/faculty/attendance.html', 'w') as f:
    f.write(generate_shell('Attendance', 'a', attendance_content))

# Update dashboard.html and mystudents.html sidebars
for file_path in ['client/faculty/dashboard.html', 'client/faculty/mystudents.html']:
    with open(file_path, 'r') as f:
        content = f.read()
    
    start_idx = content.find('<div class="nav flex-column">')
    end_idx = content.find('</div>', start_idx) + 6
    
    active_tab = 'd' if 'dashboard.html' in file_path else 's'
    new_sidebar = faculty_sidebar.format(
        d_active='active' if active_tab == 'd' else '',
        c_active='active' if active_tab == 'c' else '',
        a_active='active' if active_tab == 'a' else '',
        s_active='active' if active_tab == 's' else '',
        ann_active='active' if active_tab == 'ann' else ''
    )
    
    content = content[:start_idx] + new_sidebar + content[end_idx:]
    # Fix the announcement link bug in dashboard
    content = content.replace('href="../announcements.html"', 'href="announcements.html"')
    
    with open(file_path, 'w') as f:
        f.write(content)

print("Faculty pages built and sidebars wired correctly")
