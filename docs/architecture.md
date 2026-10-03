# CampusConnect Architecture

## 1. What is Software Architecture?
Software architecture refers to the fundamental structures of a software system and the discipline of creating such structures and systems. It serves as a blueprint for the system, detailing how components interact, the technologies used, and the principles governing its design and evolution. Good architecture ensures the system is robust, scalable, maintainable, and aligned with business goals.

## 2. Why Layered Architecture Was Selected
For the CampusConnect portal, **Layered Architecture** was chosen over Pipe & Filter and Shared Data styles because:
- **Separation of Concerns:** It naturally divides the system into UI, business logic, data access, and database, making it intuitive for web applications.
- **Maintainability:** Changes in the presentation layer (e.g., swapping Bootstrap for another UI library) do not affect the business rules or database queries.
- **Testability:** Each layer can be tested independently (e.g., testing `bookingService.js` without a frontend).
- **Security:** The presentation layer never communicates directly with the database, protecting it from direct manipulation.

## 3. Overview of Layered Architecture
Layered architecture organizes code into distinct horizontal tiers. A strict layered architecture enforces that a layer can only communicate with the layer immediately below it.

Our CampusConnect implementation consists of:
1. **Presentation Layer (Client & Controllers)**
2. **Business Logic / Service Layer (Services)**
3. **Data Access Layer (Repositories)**
4. **Database Layer (MongoDB)**

### Architecture Diagram

```text
Browser (HTML/CSS/JS)
         |  (HTTP/AJAX)
         v
+-------------------------------+
|       Presentation Layer      | (Express Controllers & Routes)
+-------------------------------+
         |  (Function Calls)
         v
+-------------------------------+
|     Business Logic Layer      | (Services e.g., authService, bookingService)
+-------------------------------+
         |  (Function Calls)
         v
+-------------------------------+
|      Data Access Layer        | (Repositories e.g., bookingRepository)
+-------------------------------+
         |  (Mongoose/MongoDB Protocol)
         v
+-------------------------------+
|        Database Layer         | (MongoDB Atlas Collections)
+-------------------------------+
```

## 4. Layer Responsibilities & Mapping

### A. Presentation Layer
**Technologies:** HTML5, CSS3, Bootstrap 5, jQuery (Client-side) + Express Routes/Controllers (Server-side).
**Responsibilities:** 
- Renders the UI to the user.
- Captures user input (e.g., booking forms, login).
- Performs client-side validation.
- Handles HTTP request parsing and sends HTTP responses (JSON).
**Files mapped:** `client/*.html`, `client/js/api.js`, `server/routes/*.js`, `server/controllers/*.js`.

### B. Business Logic (Service) Layer
**Technologies:** Node.js, Express.js (Services folder).
**Responsibilities:**
- Enforces business rules (e.g., "A student cannot book a facility if there is a time conflict").
- Processes data before saving.
- Handles authentication/authorization logic.
**Files mapped:** `server/services/authService.js`, `server/services/bookingService.js`, etc.

### C. Data Access Layer
**Technologies:** Mongoose (Repositories folder).
**Responsibilities:**
- Encapsulates all database interactions.
- Provides CRUD operations to the Service layer.
- Hides the specific implementation of database queries.
**Files mapped:** `server/repositories/userRepository.js`, `server/repositories/bookingRepository.js`, etc.

### D. Database Layer
**Technologies:** MongoDB Atlas.
**Responsibilities:**
- Persistently stores application data.
- Ensures data integrity through schemas and indexes.
**Files mapped:** `server/models/*.js` (Schema definitions).

## 5. Communication Between Layers
Communication flows downwards. 
For example, in the **Booking Flow**:
1. User clicks "Submit Booking" -> `client/bookings.html` sends AJAX POST request.
2. `server/routes/bookings.js` catches the route and passes to `bookingController.createBooking`.
3. The controller extracts data and calls `bookingService.createBooking(data)`.
4. The service checks business rules (conflict checking via `bookingRepository.checkConflict()`).
5. If no conflict, service calls `bookingRepository.create(data)`.
6. The repository executes the Mongoose query to insert into MongoDB.
7. The result travels back up the chain, and the controller sends a `201 Created` JSON response.

## 6. Advantages and Limitations
**Advantages:**
- Highly structured and easy for new developers to understand.
- Strong isolation allows replacing a layer (e.g., swapping MongoDB for PostgreSQL requires only changing the Data Access Layer).
- Promotes code reuse.

**Limitations:**
- "Sinkhole Anti-pattern": Sometimes requests pass through layers without any business logic being applied (e.g., just fetching a list of students), creating slight overhead.
- Can lead to monolithic deployments if not carefully managed (though Serverless/Netlify mitigates this).
