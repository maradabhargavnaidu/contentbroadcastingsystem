# 📡 Content Broadcasting System (Backend)

## 🚀 Overview

This project is a **Content Broadcasting System** built using Node.js and PostgreSQL.

Teachers upload subject-based content, which is reviewed by a Principal. Once approved, the content is **broadcasted via a public API** with **subject-based scheduling and rotation logic**.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT
- **Validation:** Joi
- **File Upload:** Multer
- **Security:** RBAC (Role-Based Access Control)

---

## 📂 Project Structure

```
src/
  controllers/     # Request handlers
  services/        # Business logic
  routes/          # API routes
  middlewares/     # Auth, RBAC, error handling
  utils/           # Multer (file upload)
  config/          # Prisma, Redis configs
  uploads/         # Uploaded files
```

---

## ⚠️ Assumptions & Known Limitations

- **Timezone Handling**
  - All timestamps (`start_time`, `end_time`) are stored in UTC.
  - The system compares using server time (`new Date()`).
  - It assumes that input timestamps are provided in ISO UTC format.
  - No explicit timezone conversion layer is implemented for different regions.
  - During local testing, differences between UTC and IST may cause confusion in content visibility.

- **Scheduling Simplification**
  - Content is automatically scheduled after approval for simplicity.
  - Advanced scheduling controls (manual ordering, editing schedules) are not implemented.

- **Single Subject Query**
  - The `/content/live` API expects a subject parameter.
  - Multi-subject aggregation is not implemented.

- **File Storage**
  - Files are stored locally.
  - Cloud storage (e.g., AWS S3) is not integrated.

- **No Background Jobs**
  - Rotation logic is computed dynamically at request time.
  - No cron jobs or queue-based scheduling are used.

- **Basic Validation**
  - Input validation is implemented using Joi.
  - Advanced validations (file scanning, duplicate detection) are not included.

- **Scalability (Prototype Level)**
  - Redis caching is implemented for performance.
  - Horizontal scaling, load balancing, and CDN are not configured.

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone <your-repo-link>
cd content-broadcasting
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/content_db"
JWT_SECRET=your_secret
REDIS_URL=redis://localhost:6379
```

---

### 4️⃣ Setup Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### 5️⃣ Run the server

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## 🔐 Authentication & Roles

### Roles:

- **Teacher**
- **Principal**

### Flow:

- Login → get JWT token
- Pass token in headers:

```
Authorization: Bearer <token>
```

---

## 📦 API Endpoints

### 🔑 Auth

#### Register

```
POST /api/auth/register
```

#### Login

```
POST /api/auth/login
```

---

### 📤 Content (Teacher)

#### Upload Content

```
POST /api/content/upload
```

Form-data:

- file (image)
- title
- subject
- description (optional)
- start_time
- end_time

---

#### View My Content

```
GET /api/content/my
```

---

### ✅ Approval (Principal)

#### Approve Content

```
POST /api/content/:id/approve
```

#### Reject Content

```
POST /api/content/:id/reject
```

---

### 📡 Public API (Broadcasting)

#### Get Live Content (Subject-based Rotation)

```
GET /api/content/live/:teacherId?subject=maths
```

Response:

- Returns currently active content
- Applies scheduling and rotation logic

---

## 🔁 Scheduling & Rotation Logic

- Each subject has its own rotation
- Content is shown based on:
  - `start_time` and `end_time`
  - `rotation_order`
  - `duration`

Example:

```
Maths:
A → 1 min
B → 1 min
C → 1 min
(loop)
```

---

## ⚠️ Edge Cases Handled

- No content available → returns empty message
- Approved but not scheduled → ignored
- Invalid subject → empty response
- File validation (type & size)

---

## ⚡ Performance Optimizations

- Redis caching for `/content/live` API
- Stateless rotation logic
- Efficient DB queries with Prisma

---

## 🔮 Future Improvements

- AWS S3 for file storage
- CDN for content delivery
- Background jobs for scheduling
- Analytics dashboard

---

## 👨‍💻 Author

**Marada Bhargav Naidu**

---
