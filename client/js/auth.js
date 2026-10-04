$(document).ready(function() {
  // Check auth state on load
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  // If on protected page without token, redirect
  const protectedPages = ['dashboard.html', 'courses.html', 'bookings.html', 'complaints.html', 'profile.html', 'timetable.html', 'announcements.html'];
  const adminPages = ['/admin/'];
  const facultyPages = ['/faculty/'];
  const currentPage = window.location.pathname;
  
  const isProtected = protectedPages.some(page => currentPage.includes(page));
  const isAdmin = adminPages.some(page => currentPage.includes(page));
  const isFaculty = facultyPages.some(page => currentPage.includes(page));

  const normalizedRole = (role || '').toUpperCase();

  if (isProtected && !token) {
    const roleParam = isFaculty ? '?role=faculty' : (isAdmin ? '?role=admin' : '');
    window.location.href = '/login.html' + roleParam;
    return;
  }

  if (isAdmin && normalizedRole !== 'ADMIN') {
    window.location.href = '/login.html?role=admin';
    return;
  }
  
  if (isFaculty && normalizedRole !== 'FACULTY' && normalizedRole !== 'ADMIN') {
    window.location.href = '/login.html?role=faculty';
    return;
  }

  // Populate User Info if logged in
  if (token) {
    API.me().done(function(res) {
      if(res.success && res.data) {
        $('.user-name').text(res.data.name);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('user', JSON.stringify(res.data));
      }
    }).fail(function() {
      // Invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      if (isProtected) {
        const roleParam = isFaculty ? '?role=faculty' : (isAdmin ? '?role=admin' : '');
        window.location.href = '/login.html' + roleParam;
      }
    });
  }

  $('#logoutBtn').click(function(e) {
    e.preventDefault();
    const prevRole = (localStorage.getItem('role') || '').toLowerCase();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    const roleParam = (prevRole === 'faculty' || prevRole === 'admin') ? `?role=${prevRole}` : '';
    window.location.href = '/login.html' + roleParam;
  });
});
