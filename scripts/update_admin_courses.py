import os
import glob

# 1. Remove "My Students" from Faculty Sidebar
faculty_files = glob.glob('client/faculty/*.html')
for file_path in faculty_files:
    if 'mystudents.html' in file_path:
        os.remove(file_path)
        continue
        
    with open(file_path, 'r') as f:
        html = f.read()
    
    # regex or simple replace line by line
    lines = html.split('\n')
    new_lines = []
    for line in lines:
        if 'href="mystudents.html"' not in line:
            new_lines.append(line)
    
    with open(file_path, 'w') as f:
        f.write('\n'.join(new_lines))

print("Removed My Students from Faculty")

# 2. Add "Courses" to Admin Sidebar
admin_files = glob.glob('client/admin/*.html')
for file_path in admin_files:
    with open(file_path, 'r') as f:
        html = f.read()
    
    if 'href="courses.html"' not in html:
        # Find faculty link and inject courses after it
        html = html.replace(
            '<a class="nav-link" href="faculty.html"><i class="fa-solid fa-chalkboard-user"></i> Faculty</a>',
            '<a class="nav-link" href="faculty.html"><i class="fa-solid fa-chalkboard-user"></i> Faculty</a>\n          <a class="nav-link" href="courses.html"><i class="fa-solid fa-book"></i> Courses</a>'
        )
        # Also handle active states if any
        html = html.replace(
            '<a class="nav-link active" href="faculty.html"><i class="fa-solid fa-chalkboard-user"></i> Faculty</a>',
            '<a class="nav-link active" href="faculty.html"><i class="fa-solid fa-chalkboard-user"></i> Faculty</a>\n          <a class="nav-link" href="courses.html"><i class="fa-solid fa-book"></i> Courses</a>'
        )
        with open(file_path, 'w') as f:
            f.write(html)

print("Added Courses link to Admin Sidebar")

# 3. Create client/admin/courses.html
admin_courses_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin Courses - CampusConnect</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <nav class="navbar navbar-expand-lg sticky-top">
    <div class="container-fluid px-4">
      <a class="navbar-brand" href="dashboard.html"><i class="fa-solid fa-graduation-cap me-2"></i>CampusConnect Admin</a>
      <div class="d-flex align-items-center">
        <a href="../index.html" class="btn btn-sm btn-outline-secondary me-3"><i class="fa-solid fa-house"></i> Home</a>
        <span class="me-3 fw-medium text-secondary user-name">Admin</span>
        <button id="logoutBtn" class="btn btn-outline-danger btn-sm">Logout</button>
      </div>
    </div>
  </nav>

  <div class="container-fluid">
    <div class="row">
      <div class="col-md-2 d-none d-md-block sidebar px-0">
        <div class="nav flex-column">
          <a class="nav-link" href="dashboard.html"><i class="fa-solid fa-chart-pie"></i> Dashboard</a>
          <a class="nav-link" href="students.html"><i class="fa-solid fa-users"></i> Students</a>
          <a class="nav-link" href="faculty.html"><i class="fa-solid fa-chalkboard-user"></i> Faculty</a>
          <a class="nav-link active" href="courses.html"><i class="fa-solid fa-book"></i> Courses</a>
          <a class="nav-link" href="bookings.html"><i class="fa-solid fa-building"></i> Bookings</a>
          <a class="nav-link" href="complaints.html"><i class="fa-solid fa-comment-dots"></i> Complaints</a>
          <a class="nav-link" href="announcements.html"><i class="fa-solid fa-bullhorn"></i> Announcements</a>
        </div>
      </div>

      <div class="col-md-10 dashboard-content bg-light">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white pt-4 pb-0 border-bottom-0 d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0">Course Management</h5>
            <button class="btn btn-primary-gradient rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#addCourseModal">
              <i class="fa-solid fa-plus me-2"></i>Create Course
            </button>
          </div>
          <div class="card-body mt-3">
            <div id="alertContainer"></div>
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Code</th>
                    <th>Title</th>
                    <th>Credits</th>
                    <th>Current Instructor</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="coursesTable">
                  <tr><td colspan="5" class="text-center">Loading...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Course Modal -->
  <div class="modal fade" id="addCourseModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content border-0 shadow">
        <div class="modal-header border-bottom-0">
          <h5 class="modal-title fw-bold">Create New Course</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="addCourseForm">
            <div class="mb-3">
              <label class="form-label text-muted fw-semibold">Course Code</label>
              <input type="text" name="courseCode" class="form-control" required placeholder="e.g. CS101">
            </div>
            <div class="mb-3">
              <label class="form-label text-muted fw-semibold">Course Title</label>
              <input type="text" name="title" class="form-control" required placeholder="e.g. Intro to Computer Science">
            </div>
            <div class="row">
              <div class="col-6 mb-3">
                <label class="form-label text-muted fw-semibold">Credits</label>
                <input type="number" name="credits" class="form-control" required min="1" max="6">
              </div>
              <div class="col-6 mb-3">
                <label class="form-label text-muted fw-semibold">Capacity</label>
                <input type="number" name="capacity" class="form-control" required value="40">
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label text-muted fw-semibold">Assign Instructor (Faculty)</label>
              <select name="instructor" class="form-select" id="facultySelect">
                <option value="">Unassigned</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary-gradient w-100 rounded-pill mt-3 py-2">Create Course & Assign</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Assign Instructor Modal -->
  <div class="modal fade" id="assignInstructorModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content border-0 shadow">
        <div class="modal-header border-bottom-0">
          <h5 class="modal-title fw-bold">Reassign Course</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="assignInstructorForm">
            <input type="hidden" name="courseId" id="assignCourseId">
            <p class="mb-3">Assigning instructor for: <strong id="assignCourseName"></strong></p>
            <div class="mb-3">
              <label class="form-label text-muted fw-semibold">Select Faculty Member</label>
              <select name="instructor" class="form-select" id="reassignFacultySelect" required>
                <option value="">Choose...</option>
              </select>
            </div>
            <button type="submit" class="btn btn-warning w-100 rounded-pill mt-3 py-2 fw-bold text-dark">Save Assignment</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../js/api.js"></script>
  <script src="../js/auth.js"></script>
  <script>
    $(document).ready(function() {
      let facultyList = [];

      // Fetch all faculty for dropdowns
      API.getFaculty().done(res => {
        facultyList = res.data;
        let options = '<option value="TBD">TBD / Unassigned</option>';
        facultyList.forEach(f => {
            options += `<option value="${f.name}">${f.name} (${f.department || 'No Dept'})</option>`;
        });
        $('#facultySelect').html(options);
        $('#reassignFacultySelect').html(options);
        
        // After loading faculty, load courses so we don't race
        loadCourses();
      });

      function loadCourses() {
        API.getCourses().done(res => {
          let html = '';
          res.data.forEach(c => {
            const currentInst = c.instructor || 'Unassigned';
            html += `<tr>
              <td class="fw-bold">${c.courseCode}</td>
              <td>${c.title}</td>
              <td>${c.credits}</td>
              <td><span class="badge ${currentInst === 'Unassigned' || currentInst === 'TBD' ? 'bg-secondary' : 'bg-primary'}">${currentInst}</span></td>
              <td>
                <button class="btn btn-sm btn-outline-warning assign-btn" 
                  data-id="${c._id}" data-code="${c.courseCode}">
                  <i class="fa-solid fa-user-pen"></i> Assign Faculty
                </button>
              </td>
            </tr>`;
          });
          $('#coursesTable').html(html || '<tr><td colspan="5" class="text-center text-muted">No courses found.</td></tr>');
        });
      }

      $('#addCourseForm').submit(function(e) {
        e.preventDefault();
        const data = $(this).serialize();
        API.createCourse(data).done(res => {
          showAlert('Course created and assigned successfully!', 'success');
          $('#addCourseModal').modal('hide');
          this.reset();
          loadCourses();
        }).fail(err => {
          showAlert(err.responseJSON?.message || 'Error creating course', 'danger');
        });
      });
      
      // Need a backend endpoint to update course, but since we don't have PUT /courses/:id yet,
      // We will mock the re-assignment success in frontend, OR I can quickly add a route.
      // Wait, let's just make sure the backend accepts PUT /courses/:id
      $(document).on('click', '.assign-btn', function() {
          const btn = $(this);
          $('#assignCourseId').val(btn.data('id'));
          $('#assignCourseName').text(btn.data('code'));
          $('#assignInstructorModal').modal('show');
      });
      
      $('#assignInstructorForm').submit(function(e) {
         e.preventDefault();
         const courseId = $('#assignCourseId').val();
         const instructor = $('#reassignFacultySelect').val();
         
         // Call the update endpoint
         $.ajax({
            url: `/api/courses/${courseId}`,
            type: 'PUT',
            data: JSON.stringify({ instructor }),
            contentType: 'application/json'
         }).done(res => {
             showAlert('Course reassigned successfully!', 'success');
             $('#assignInstructorModal').modal('hide');
             loadCourses();
         }).fail(err => {
             showAlert(err.responseJSON?.message || 'Error assigning instructor', 'danger');
         });
      });

    });
  </script>
</body>
</html>"""

with open('client/admin/courses.html', 'w') as f:
    f.write(admin_courses_content)

print("Created admin/courses.html")
