# ANTI GRAVITY PORTFOLIO — BACKEND ENGINE & REST API

**Candidate:** Anurag Sahu  
**Role:** B.Tech CSE (AI & ML) Sophomore • Full-Stack Web & AI/ML Developer  
**Email:** `shivasahu0612@gmail.com`  

---

## 🚀 Overview

This Express + Node.js + MongoDB backend provides REST APIs for:
1. **Direct Recruiter Contact Inquiries** (`POST /api/contact`) with Nodemailer email delivery to `shivasahu0612@gmail.com`.
2. **Telemetry Admin Dashboard** (`GET /api/admin/dashboard`).
3. **Analytics Tracking** (`POST /api/analytics/track` & `GET /api/analytics/summary`).
4. **Projects CRUD API** (`GET /api/projects`, `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`).

---

## 📡 REST API Endpoint Documentation

| Method | Endpoint | Description | Auth / Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | Submits candidate inquiry & emails `shivasahu0612@gmail.com` | Public (Rate Limited) |
| `GET` | `/api/admin/dashboard` | Returns visitor stats, unread contact messages, & telemetry | Admin |
| `POST` | `/api/analytics/track` | Logs page views, resume downloads, and project clicks | Public |
| `GET` | `/api/analytics/summary` | Returns aggregated telemetry totals | Admin |
| `GET` | `/api/projects` | Returns all portfolio projects & showcase items | Public |
| `POST` | `/api/projects` | Creates a new portfolio project | Admin |

---

## 🗄️ Database Schemas (Mongoose)

### 1. `Contact` Collection
```js
{
  fullName: String,
  email: String,
  company: String,
  subject: String,
  message: String,
  status: 'unread' | 'read' | 'archived',
  ipAddress: String,
  createdAt: Date
}
```

### 2. `Analytics` Collection
```js
{
  type: 'page_view' | 'resume_download' | 'project_click' | 'contact_submission',
  path: String,
  ipAddress: String,
  userAgent: String,
  createdAt: Date
}
```

---

## ⚙️ Local Environment Setup Instructions

1. **Install Node dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure `.env` file:**
   ```env
   PORT=5001
   RECIPIENT_EMAIL=shivasahu0612@gmail.com
   MONGODB_URI=mongodb://127.0.0.1:27017/anti_gravity_portfolio
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=shivasahu0612@gmail.com
   SMTP_PASS=your-gmail-app-password
   ```

3. **Launch Express API Server:**
   ```bash
   npm start
   ```
