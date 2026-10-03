require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./config/db');
const serverless = require('serverless-http');
const path = require('path');

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://code.jquery.com", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"]
    }
  }
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/timetable', require('./routes/timetable'));

// Disable caching in development to prevent aggressive browser caching
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

// Serve static client files (for local dev mostly)
app.use(express.static(path.join(__dirname, '../client'), {
    etag: false,
    lastModified: false,
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    }
}));

// Not a SPA, so no catch-all needed. express.static handles it.


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Server Error' });
});


// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// For Netlify Serverless Deployment
module.exports.handler = serverless(app, {
    basePath: '/.netlify/functions/api'
});
