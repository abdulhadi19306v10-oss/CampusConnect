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

  if (isProtected && !token) {
    window.location.href = 'login.html';
  }

  if (isAdmin && role !== 'ADMIN') {
    window.location.href = '../login.html';
  }
  
  if (isFaculty && role !== 'FACULTY') {
    window.location.href = '../login.html';
  }

  // Populate User Info if logged in
  if (token) {
    API.me().done(function(res) {
      if(res.success) {
        $('.user-name').text(res.data.name);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('user', JSON.stringify(res.data));
      }
    }).fail(function() {
      // Invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      if (isProtected) window.location.href = 'login.html';
    });
  }

  $('#logoutBtn').click(function(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  });
});
