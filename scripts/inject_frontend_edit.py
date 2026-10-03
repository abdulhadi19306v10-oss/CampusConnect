import os

files_to_update = ['client/admin/students.html', 'client/admin/faculty.html']

for file_path in files_to_update:
    with open(file_path, 'r') as f:
        html = f.read()

    is_student = 'students.html' in file_path
    entity_name = 'Student' if is_student else 'Faculty'
    table_id = 'studentsTable' if is_student else 'facultyTable'
    load_func = 'loadStudents()' if is_student else 'loadFaculty()'

    # 1. Add "Actions" column header
    if '<th>Actions</th>' not in html:
        html = html.replace('<th>Email</th>\n                    <th>Department</th>', '<th>Email</th>\n                    <th>Department</th>') # no-op just to find spot
        if is_student:
            html = html.replace('<th>Semester</th>\n                  </tr>', '<th>Semester</th>\n                    <th>Actions</th>\n                  </tr>')
        else:
            html = html.replace('<th>Title (e.g. Professor)</th>\n                  </tr>', '<th>Title (e.g. Professor)</th>\n                    <th>Actions</th>\n                  </tr>')

    # 2. Add Edit Modal HTML
    if f'edit{entity_name}Modal' not in html:
        edit_modal = f"""
  <!-- Edit {entity_name} Modal -->
  <div class="modal fade" id="edit{entity_name}Modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content border-0 shadow">
        <div class="modal-header border-bottom-0">
          <h5 class="modal-title fw-bold">Edit {entity_name}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="edit{entity_name}Form">
            <input type="hidden" name="id" id="edit{entity_name}Id">
            <div class="mb-3">
              <label class="form-label text-muted fw-semibold">Full Name</label>
              <input type="text" name="name" id="edit{entity_name}Name" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label text-muted fw-semibold">Email</label>
              <input type="email" name="email" id="edit{entity_name}Email" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label text-muted fw-semibold">Department</label>
              <input type="text" name="department" id="edit{entity_name}Department" class="form-control">
            </div>
            <div class="mb-3">
              <label class="form-label text-muted fw-semibold">{'Semester' if is_student else 'Title (e.g. Professor)'}</label>
              <input type="{'number' if is_student else 'text'}" name="semester" id="edit{entity_name}Semester" class="form-control" {'min="1" max="8"' if is_student else ''}>
            </div>
            <div class="mb-3">
              <label class="form-label text-muted fw-semibold">New Password (Leave blank to keep current)</label>
              <input type="password" name="password" class="form-control">
            </div>
            <button type="submit" class="btn btn-warning w-100 rounded-pill mt-3 py-2 text-dark fw-bold">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  </div>
"""
        html = html.replace('<!-- Add', edit_modal + '\n  <!-- Add')

    # 3. Update table rows logic in JS to include action buttons and serialize user data
    if f"edit-{entity_name.lower()}-btn" not in html:
        # Inject data attribute and buttons
        row_str = f"""
              <td>${{s.semester || '-'}}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary edit-{entity_name.lower()}-btn me-1" 
                  data-id="${{s._id}}" 
                  data-name="${{s.name}}" 
                  data-email="${{s.email}}" 
                  data-department="${{s.department || ''}}" 
                  data-semester="${{s.semester || ''}}">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-user-btn" data-id="${{s._id}}">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>`;"""
        html = html.replace("<td>${s.semester || '-'}</td>\n            </tr>`;", row_str)

    # 4. Add JS handlers for edit and delete
    if 'edit-user-logic' not in html:
        handlers = f"""
      // edit-user-logic
      $(document).on('click', '.edit-{entity_name.lower()}-btn', function() {{
        const btn = $(this);
        $('#edit{entity_name}Id').val(btn.data('id'));
        $('#edit{entity_name}Name').val(btn.data('name'));
        $('#edit{entity_name}Email').val(btn.data('email'));
        $('#edit{entity_name}Department').val(btn.data('department'));
        $('#edit{entity_name}Semester').val(btn.data('semester'));
        $('#edit{entity_name}Modal').modal('show');
      }});

      $('#edit{entity_name}Form').submit(function(e) {{
        e.preventDefault();
        const rawData = $(this).serializeArray();
        const data = {{}};
        rawData.forEach(item => {{
            if (item.value) data[item.name] = item.value;
        }});
        
        const id = data.id;
        delete data.id; // don't send id in body

        API.updateUser(id, data).done(res => {{
          showAlert('{entity_name} updated successfully!', 'success');
          $('#edit{entity_name}Modal').modal('hide');
          this.reset();
          {load_func};
        }}).fail(err => {{
          showAlert(err.responseJSON?.message || 'Error updating {entity_name.lower()}', 'danger');
        }});
      }});

      $(document).on('click', '.delete-user-btn', function() {{
        if(!confirm('Are you sure you want to completely delete this user? This cannot be undone.')) return;
        const id = $(this).data('id');
        API.deleteUser(id).done(res => {{
          showAlert('User deleted successfully!', 'success');
          {load_func};
        }}).fail(err => {{
          showAlert(err.responseJSON?.message || 'Error deleting user', 'danger');
        }});
      }});
    """
        html = html.replace('});\n  </script>', handlers + '\n    });\n  </script>')

    with open(file_path, 'w') as f:
        f.write(html)

print("Frontend edit/delete logic injected")
