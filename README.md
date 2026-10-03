# CampusConnect

**University Student Management & Campus Services Portal**

CampusConnect is a complete web-based university portal built for a Software Development and Architecture (SDA) semester project. It explicitly demonstrates the **Layered Architecture** pattern using a modern HTML/CSS/JS frontend and a Node.js/Express backend with MongoDB.

---

## 🏗️ Architecture

The system is strictly divided into four distinct layers to ensure maintainability, scalability, and separation of concerns:
1. **Presentation Layer**: HTML5, CSS3, JavaScript, jQuery, and Express Controllers.
2. **Business Logic / Service Layer**: Express Services (`server/services`) enforcing business rules (e.g., booking conflict prevention, course capacity limits).
3. **Data Access Layer**: Repositories (`server/repositories`) handling all database interactions.
4. **Database Layer**: MongoDB Atlas & Mongoose Models (`server/models`).

For a detailed architectural breakdown, read `docs/architecture.md` and `docs/FINAL_DOCUMENTATION.md`.

---

## ✨ Features

- **Role-Based Access:** Separate panels for Students and Administrators.
- **Student Dashboard:** View/enroll/drop courses, book campus facilities, submit technical/academic complaints, view timetables and announcements.
- **Admin Dashboard:** Global statistics, manage and approve bookings, resolve complaints, and post announcements.
- **Premium UI/UX:** Features a state-of-the-art glassmorphism design with responsive elements, animations, and beautiful typography.
- **Security:** Stateless JWT authentication, bcrypt password hashing, and role-based middleware protection.

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript, jQuery
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Deployment:** Ready for Netlify Serverless Deployment

*(Note: React, Angular, Vue, Next.js, and TypeScript were strictly avoided per project requirements to focus on fundamental web architecture).*

---

## 🚀 How to Run Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- A local MongoDB instance running, or a MongoDB Atlas connection string.

### 2. Installation
Clone the repository, then navigate to the project folder and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Copy the example env file to create your own configuration:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campusconnect
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Database Seeding
To populate the database with realistic demo users, courses, and facilities, run the seed script:
```bash
npm run seed
```

### 5. Start the Server
Start the backend server and serve the frontend:
```bash
npm start
```
The application will be available at [http://localhost:5000](http://localhost:5000).

---

## 🔑 Demo Credentials

After running the seed script, you can log in with:
- **Admin Account:** `admin@campusconnect.edu` / `admin123`
- **Student Account:** `student1@campusconnect.edu` / `student123`

---

## ☁️ Deployment (Netlify)

This project is configured to deploy seamlessly on Netlify using Serverless Functions.
1. Upload this repository to GitHub.
2. Connect your GitHub repository to Netlify.
3. In Netlify **Site Settings > Build & Deploy > Environment**, add your `JWT_SECRET` and `MONGODB_URI` (from MongoDB Atlas).
4. Deploy! Netlify will use `netlify.toml` to map all `/api/*` requests to the Node.js backend.

---

## 📂 Folder Structure

```text
CampusConnect/
├── client/                 # Presentation Layer UI (HTML, CSS, JS)
├── server/
│   ├── models/             # Mongoose Schemas
│   ├── repositories/       # Data Access Layer
│   ├── services/           # Business Logic Layer
│   ├── controllers/        # Presentation Layer API Handlers
│   ├── routes/             # Express routing
│   ├── config/             # DB and App Configuration
│   └── server.js           # App Entry Point
├── scripts/                # Database Seeding scripts
├── docs/                   # SDA Documentation (FINAL_DOCUMENTATION.md, architecture.md)
└── netlify/                # Netlify Serverless configurations
```
