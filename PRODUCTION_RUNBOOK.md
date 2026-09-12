# Production Runbook & Operations Manual
**ANURAG SAHU CONTROL CENTER & PUBLIC PORTFOLIO**
**Production Domain**: `https://anuragsahu.com` | **Admin Portal**: `https://anuragsahu.com/admin`

---

## 1. System Architecture
```
PUBLIC USER (Desktop / Mobile)
        ↓ HTTPS
https://anuragsahu.com (/ & /mobile.html)
        ↓
GET /api/public/site (Single-fetch cached aggregation, CDN Cache-Control)
        ↓
MongoDB Database (Mongoose Schema Models)
```

```
ADMINISTRATOR
        ↓ HTTPS
https://anuragsahu.com/admin
        ↓
HTTP-Only Cookie / Bearer Token Auth (JWT, bcryptjs salt 12)
        ↓
Protected Admin API Gateway (/api/admin/*)
        ↓
MongoDB Database
        ↓
Real-Time BroadcastChannel / Immediate Public Site Rehydration
```

---

## 2. Environment Variables Checklist

### Private Server-Side Secrets (Never Expose to Frontend)
| Variable | Description | Production Requirement |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB Connection String | Required (e.g. `mongodb+srv://...`) |
| `JWT_SECRET` | HMAC Secret for Session Token Signing | Required (Min 32 random characters) |
| `JWT_EXPIRES_IN` | Session validity duration | Default: `7d` |
| `ADMIN_EMAIL` | Default administrator email | Required |
| `ADMIN_PASSWORD` | Seed / Bootstrap administrator password | Required for initial provisioning |
| `SMTP_HOST` | SMTP Server Host | Required for email delivery |
| `SMTP_PORT` | SMTP Port | e.g. `587` (TLS) or `465` (SSL) |
| `SMTP_USER` | SMTP Authentication Username | Required |
| `SMTP_PASS` | SMTP App-Specific Password | Required |
| `CONTACT_NOTIFICATION_EMAIL` | Inbound inquiry recipient address | e.g. `shivasahu0612@gmail.com` |

### Public Environment Variables (Build-Time / Client-Side)
| Variable | Description | Safe Value |
| :--- | :--- | :--- |
| `VITE_APP_TITLE` | Application Tab Title | `Anurag Sahu — Personal Portfolio & Control Center` |
| `VITE_API_URL` | Public API Base URL | `https://anuragsahu.com` |

---

## 3. Secret Rotation Recommendations
If any development credentials were ever shared or placed in local test files during development:
1. **Rotate MongoDB Atlas Password**: Change database user password in Atlas console and update `MONGODB_URI`.
2. **Rotate JWT Secret**: Generating a new `JWT_SECRET` instantly invalidates all legacy sessions.
3. **Rotate SMTP Password**: In Google Workspace / Gmail, generate a fresh App Password and update `SMTP_PASS`.

---

## 4. Health Monitoring & Observability
The server exposes an unauthenticated health check designed for uptime monitors (Better Uptime, UptimeRobot):
- **Endpoint**: `GET /api/health` or `GET /health`
- **Expected Status**: HTTP 200 OK
- **Response Format**:
```json
{
  "success": true,
  "status": "online",
  "system": "ANURAG SAHU CONTROL CENTER & BACKEND CMS",
  "version": "2.0.0",
  "owner": "Anurag Sahu",
  "database": "connected",
  "timestamp": "2026-09-12T06:00:00.000Z"
}
```
*Zero internal database connection strings, passwords, or filesystem paths are ever exposed in this output.*

---

## 5. Standard Content Management Workflow
1. Log into `https://anuragsahu.com/admin`.
2. Select target module (Projects, Hero, Profile, Skills, Experience, Education, etc.).
3. **Save Draft**: Saves work to the database without publishing to the public portfolio.
4. **Publish**: Transitions status to `PUBLISHED` / `ACTIVE`.
5. **Instant Live Update**: The public website detects the update via BroadcastChannel / Cache-Control revalidation and rehydrates in place **with zero code edits and zero frontend redeployment**.

---

## 6. Incident Response & Emergency Procedures
- **Database Connection Outage**: Application gracefully falls back to bundled in-memory seed records so public visitors never experience an HTTP 500 blank screen.
- **SMTP Failure**: If email provider is temporarily unreachable, inbound inquiries are safely committed to the MongoDB `contacts` collection and marked with `emailNotificationStatus: "FAILED"` for review in the Admin Inbox.
- **Rollback Content**: Use single-collection restore (`node server/scripts/restore.js --collection=<name>`) to revert content without downtime.
