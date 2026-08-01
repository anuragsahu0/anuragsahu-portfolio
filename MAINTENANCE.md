# 🛠️ ANTI GRAVITY PORTFOLIO — PRODUCTION MAINTENANCE & SRE MANUAL
**Candidate:** Anurag Sahu  
**Platform Version:** v3.0  
**Custom Domain:** `https://anuragsahu.dev` / `https://anuragsahu.in`  
**Hosting Platforms:** Vercel (Frontend & Serverless API), Render / Railway (Dedicated Web Service)  
**Database:** MongoDB Atlas  

---

## 📑 Table of Contents
1. [Architecture & System Sitemap](#1-architecture--system-sitemap)
2. [Environment Variables Reference](#2-environment-variables-reference)
3. [Deployment & 1-Click Rollback Runbook](#3-deployment--1-click-rollback-runbook)
4. [Database Backup & Restore Guide](#4-database-backup--restore-guide)
5. [Monitoring & Health Diagnostics](#5-monitoring--health-diagnostics)
6. [Security & Access Control](#6-security--access-control)

---

## 1. Architecture & System Sitemap

```
Portfolio Root
├── index.html           # Main Portfolio Website (3-sec Cinematic Intro, WebGL particles)
├── admin.html           # Desktop Admin Control Center (Telemetry, Status Switches)
├── mobile.html          # Mobile Admin Web App (Touch Navigation, Recruiter Inbox)
├── app.js               # Standalone Telemetry & 2-Way Cross-Device Status Sync Engine
├── styles.css           # Core Design System (Glassmorphism, Dark Tokens)
├── vercel.json          # Vercel Production Build & Serverless Rewrite Rules
├── render.yaml          # Render / Railway Infrastructure Blueprint
├── api/
│   └── index.js         # Vercel Serverless Express API Handler
├── server/
│   ├── index.js         # Express Application Entry Point
│   ├── config/          # DB & Email Configuration
│   ├── controllers/     # Auth, Contact, Analytics, Admin, Roadmap Handlers
│   ├── middleware/      # JWT Auth, Rate Limiter, Error Handler
│   ├── models/          # Mongoose Schemas (User, Project, Roadmap, Contact, etc.)
│   ├── routes/          # Express REST API Routes
│   └── scripts/         # Seed & Automated Backup Utilities
└── public/
    ├── robots.txt       # Search Engine Indexing Rules
    └── sitemap.xml      # XML Search Engine Sitemap
```

---

## 2. Environment Variables Reference

| Variable Name | Required | Purpose / Description | Production Example |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | Yes | Frontend API endpoint URL | `https://anuragsahu.dev/api` |
| `PORT` | Yes | Express backend port | `5001` |
| `NODE_ENV` | Yes | Node environment mode | `production` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Yes | Secret key for signing JWT tokens | `min-32-character-crypto-secret` |
| `CORS_ORIGIN` | Yes | Allowed CORS origin URLs | `https://anuragsahu.dev,https://www.anuragsahu.dev` |
| `SMTP_HOST` | No | Nodemailer SMTP server host | `smtp.gmail.com` |
| `SMTP_USER` | No | SMTP authentication email | `shivasahu0612@gmail.com` |
| `SMTP_PASS` | No | SMTP App Password | `app-password-here` |

---

## 3. Deployment & 1-Click Rollback Runbook

### Deploying Updates to Production:
```bash
# 1. Stage and commit changes
git add .
git commit -m "Production Update: Description of changes"

# 2. Push to main branch (triggers automatic Vercel build)
git push -u origin main
```

### 1-Click Rollback Procedure:
If a breaking bug is deployed to production:

1. Open **[Vercel Deployments Dashboard](https://vercel.com/dashboard)**.
2. Select the **Portfolio** project ➔ **Deployments**.
3. Find the previous stable build and click **"Promote to Production"**.
4. To rollback locally via Git:
   ```bash
   git revert HEAD
   git push origin main
   ```

---

## 4. Database Backup & Restore Guide

### Automated JSON Snapshot Backup:
Run the backup script from your terminal:
```bash
cd server
node scripts/backup.js
```
*Backups are saved to `server/backups/snapshot_YYYY-MM-DDTHH-MM-SS.json`.*

### Database Restore Procedure:
To restore data from a JSON snapshot:
```bash
cd server
node scripts/seed.js
```

---

## 5. Monitoring & Health Diagnostics

### Live Production Health Checks:
- **API Health Check**: `GET https://anuragsahu.dev/api/health`
- **Projects Endpoint**: `GET https://anuragsahu.dev/api/projects`
- **Skills Endpoint**: `GET https://anuragsahu.dev/api/skills`

### Expected Health Response:
```json
{
  "success": true,
  "status": "online",
  "system": "ANTI GRAVITY BACKEND ENGINE v3.0",
  "candidate": "Anurag Sahu",
  "database": "MongoDB / Mongoose"
}
```

---

## 6. Security & Access Control

- **Admin Login Credentials**: `anurag@admin.com` / `anurag123`
- **Desktop Control Center**: `https://anuragsahu.dev/admin.html`
- **Mobile Control Center**: `https://anuragsahu.dev/mobile.html`
- **Stateless JWT Security**: Admin sessions expire in 7 days or upon clicking Logout.
