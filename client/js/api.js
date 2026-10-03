const API_URL = '/api';

// Set up AJAX to always include token if it exists
$.ajaxSetup({
  beforeSend: function(xhr) {
    const token = localStorage.getItem('token');
    if (token) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  }
});

const API = {
  login: (data) => $.post(`${API_URL}/auth/login`, data),
  register: (data) => $.post(`${API_URL}/auth/register`, data),
  me: () => $.get(`${API_URL}/auth/me`),
  
  // Courses
  getCourses: () => $.get(`${API_URL}/courses`),
  getMyEnrollments: () => $.get(`${API_URL}/courses/my-enrollments`),
  enrollCourse: (courseId) => $.post(`${API_URL}/courses/enroll`, { courseId }),
  dropCourse: (courseId) => $.ajax({ url: `${API_URL}/courses/drop/${courseId}`, type: 'DELETE' }),
  createCourse: (data) => $.post(`${API_URL}/courses`, data),
  
  // Facilities
  getFacilities: () => $.get(`${API_URL}/bookings/facilities`),
  
  // Bookings
  getMyBookings: () => $.get(`${API_URL}/bookings/my-bookings`),
  createBooking: (data) => $.post(`${API_URL}/bookings`, data),
  cancelBooking: (id) => $.ajax({ url: `${API_URL}/bookings/${id}/cancel`, type: 'PUT' }),
  getAllBookings: () => $.get(`${API_URL}/bookings`),
  updateBookingStatus: (id, status) => $.ajax({ url: `${API_URL}/bookings/${id}/status`, type: 'PUT', data: { status } }),
  
  // Complaints
  getMyComplaints: () => $.get(`${API_URL}/complaints/my-complaints`),
  submitComplaint: (data) => $.post(`${API_URL}/complaints`, data),
  getAllComplaints: () => $.get(`${API_URL}/complaints`),
  updateComplaintStatus: (id, data) => $.ajax({ url: `${API_URL}/complaints/${id}/status`, type: 'PUT', data }),
  
  // Announcements
  getAnnouncements: () => $.get(`${API_URL}/announcements`),
  getAllAnnouncements: () => $.get(`${API_URL}/announcements/all`),
  createAnnouncement: (data) => $.post(`${API_URL}/announcements`, data),
  deleteAnnouncement: (id) => $.ajax({ url: `${API_URL}/announcements/${id}`, type: 'DELETE' }),
  
  // Admin
  getStats: () => $.get(`${API_URL}/admin/stats`),
  getStudents: () => $.get(`${API_URL}/admin/students`),
  getFaculty: () => $.get(`${API_URL}/admin/faculty`),
  updateUser: (id, data) => $.ajax({ url: `${API_URL}/admin/users/${id}`, type: "PUT", data: JSON.stringify(data), contentType: "application/json" }),
  deleteUser: (id) => $.ajax({ url: `${API_URL}/admin/users/${id}`, type: "DELETE" }),

  // Timetable
  getTimetable: () => $.get(`${API_URL}/timetable`)
};

function showLoader() {
  $('#loader').removeClass('hidden');
}

function hideLoader() {
  $('#loader').addClass('hidden');
}

function showAlert(message, type = 'success') {
  const alertHtml = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  $('#alertContainer').html(alertHtml);
}
