import os

# 1. Update Faculty Attendance UI (client/faculty/attendance.html)
with open('client/faculty/attendance.html', 'r') as f:
    html = f.read()

# Add a "Stats" column to the table header
html = html.replace('<th>Status (Today)</th>', '<th>Total Stats</th>\n                            <th>Status (Today)</th>')

# Add the fetching logic in the JS
js_update = """
                $.get(`/api/courses/${courseId}/students`, {
                   headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } 
                }).done(res => {
                    // Fetch stats too
                    $.get(`/api/attendance/course/${courseId}/stats`, {
                        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } 
                    }).done(statsRes => {
                        const stats = statsRes.data || {};
                        let html = '';
                        if(res.data.length === 0) {
                            html = '<tr><td colspan="5" class="text-center text-muted">No students enrolled yet.</td></tr>';
                        } else {
                            res.data.forEach(s => {
                                 const st = stats[s._id] || { present: 0, absent: 0, late: 0, total: 0 };
                                 // 4 lates = 1 absent (which means 4 lates cancel 1 present effectively, or we just show raw counts)
                                 // Let's show raw counts and effective percentage
                                 const effectivePresents = st.present + (st.late * 0.75); // 4 lates = 1 absent means 1 late = 0.75 present
                                 const perc = st.total === 0 ? 0 : Math.round((effectivePresents / st.total) * 100);
                                 
                                 html += `<tr>
                                   <td class="fw-bold">${s.name}</td>
                                   <td>${s.email}</td>
                                   <td>
                                      <span class="badge bg-success" title="Presents">${st.present} P</span>
                                      <span class="badge bg-danger" title="Absents">${st.absent} A</span>
                                      <span class="badge bg-warning text-dark" title="Lates">${st.late} L</span>
                                      <span class="ms-2 fw-bold text-${perc >= 75 ? 'success' : (perc >= 50 ? 'warning' : 'danger')}">${perc}%</span>
                                   </td>
                                   <td>
                                      <select class="form-select form-select-sm w-auto attendance-status" data-student="${s._id}">
                                        <option value="Present" class="text-success" selected>Present</option>
                                        <option value="Absent" class="text-danger">Absent</option>
                                        <option value="Late" class="text-warning">Late</option>
                                      </select>
                                   </td>
                                   <td>
                                     <button class="btn btn-sm btn-outline-danger drop-student-btn" data-student="${s._id}" data-course="${courseId}">
                                        <i class="fa-solid fa-user-minus"></i> Drop
                                     </button>
                                   </td>
                                 </tr>`;
                            });
                        }
                        $('#attendanceList').html(html);
                    });
                });
"""

# Replace the old $.get for students with this combined one
start_idx = html.find('$.get(`/api/courses/${courseId}/students`')
end_idx = html.find('});\n            });\n            \n            // 3. Drop Student')
if start_idx != -1 and end_idx != -1:
    html = html[:start_idx] + js_update.strip() + html[end_idx + 3:]

with open('client/faculty/attendance.html', 'w') as f:
    f.write(html)


# 2. Update Student Dashboard UI (client/dashboard.html)
with open('client/dashboard.html', 'r') as f:
    dash = f.read()

dash_js = """
      // Fetch Attendance Stats Aggregated per Course
      $.ajax({
          url: '/api/attendance/my-attendance',
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      }).done(res => {
          let html = '';
          if(res.data.length === 0) {
              html = '<li class="list-group-item text-muted text-center">No attendance records yet.</li>';
          } else {
              // Aggregate by course
              const courseStats = {};
              res.data.forEach(r => {
                  const cId = r.course._id;
                  if(!courseStats[cId]) {
                      courseStats[cId] = { title: r.course.title, code: r.course.courseCode, present: 0, absent: 0, late: 0, total: 0 };
                  }
                  courseStats[cId].total++;
                  if(r.status === 'Present') courseStats[cId].present++;
                  else if(r.status === 'Absent') courseStats[cId].absent++;
                  else if(r.status === 'Late') courseStats[cId].late++;
              });
              
              Object.values(courseStats).forEach(st => {
                  const effectivePresents = st.present + (st.late * 0.75);
                  const perc = st.total === 0 ? 0 : Math.round((effectivePresents / st.total) * 100);
                  const percColor = perc >= 75 ? 'success' : (perc >= 50 ? 'warning' : 'danger');
                  
                  html += `<li class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <strong class="d-block text-primary">${st.code} - ${st.title}</strong>
                        <span class="fs-5 fw-bold text-${percColor}">${perc}%</span>
                    </div>
                    <div class="d-flex gap-2 small">
                        <span class="badge bg-success-subtle text-success border border-success-subtle">${st.present} Present</span>
                        <span class="badge bg-danger-subtle text-danger border border-danger-subtle">${st.absent} Absent</span>
                        <span class="badge bg-warning-subtle text-dark border border-warning-subtle">${st.late} Late</span>
                    </div>
                  </li>`;
              });
          }
          $('#myAttendanceList').html(html);
      });
"""

start_dash = dash.find('// Fetch Attendance')
end_dash = dash.find('});\n    });', start_dash)
if start_dash != -1 and end_dash != -1:
    dash = dash[:start_dash] + dash_js.strip() + dash[end_dash + 3:]

with open('client/dashboard.html', 'w') as f:
    f.write(dash)

print("Frontend stats integrated successfully")
