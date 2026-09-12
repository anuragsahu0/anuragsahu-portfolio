# Production Database Backup & Disaster Recovery Strategy
**Anurag Sahu Personal Portfolio & Control Center**

## 1. Overview & Objectives
This document establishes the official backup, snapshot retention, disaster recovery, and data integrity runbook for the Anurag Sahu Control Center.

The primary database is **MongoDB** (Atlas in production, local fallback in dev). The system enforces:
- **Zero Secret Leakage**: Backups strip sensitive user passwords, session tokens, and JWT secrets.
- **Off-Web Isolation**: Snapshots are stored strictly outside the web document root (`server/backups/`), never served by static middleware, and ignored by Git.
- **Deterministic Restore**: Every snapshot contains schema metadata and record checksums for safe rollback.

---

## 2. Backup Methods

### A. Provider-Managed Automated Backups (Recommended for MongoDB Atlas)
- **Continuous Cloud Backups**: Point-in-time recovery (PITR) with automated continuous write-ahead oplog archiving.
- **Daily Snapshots**: Automated daily full snapshots taken at 02:00 UTC with a 30-day retention window.
- **Multi-Region Replication**: Atlas clusters maintain 3-node replica sets across availability zones.

### B. Self-Hosted / On-Demand Backup Utility
The application includes a built-in backup CLI for pre-migration snapshots and disaster recovery:

```bash
# Create an on-demand snapshot
node server/scripts/backup.js
```

**Output Structure:**
- `server/backups/snapshot_<timestamp>.json`: Timestamped point-in-time snapshot.
- `server/backups/snapshot_latest.json`: Convenience alias pointing to the most recent backup.

**Collections Backed Up:**
1. `profile`: Candidate name, headline, bio, contact email.
2. `hero`: Main headlines, availability badge, hero CTAs.
3. `about`: Narrative story, career milestones, timeline entries.
4. `projects`: Full project details, metrics, tech stack, architecture.
5. `skills`: Skill inventory, proficiency ratings, categories.
6. `experience`: Career roles, responsibilities, bullet points.
7. `education`: Degrees, coursework, achievements.
8. `certificates`: Accreditations, issuers, credential URLs.
9. `roadmap`: Development milestones, active build status.
10. `socialLinks`: Verified developer handles and platform links.
11. `media`: Asset metadata, SHA-256 hashes, categories, alt text.
12. `resume`: Active resume version, PDF file paths, changelogs.
13. `settings`: Global site settings, feature flags, SEO metadata.
14. `contacts`: Inbound visitor inquiries, read status, replies.
15. `notifications`: System security alerts and notifications.
16. `activityLogs`: Immutable administrative audit trail.

---

## 3. Restore & Rollback Runbook

### Pre-Restore Verification (Dry Run)
Always run a dry run first to validate the snapshot structure without modifying database records:

```bash
node server/scripts/restore.js --dry-run
```

### Full Database Restoration
```bash
node server/scripts/restore.js --snapshot=server/backups/snapshot_latest.json
```

### Single-Collection Restoration
To recover a specific module without touching other data:

```bash
node server/scripts/restore.js --collection=projects
node server/scripts/restore.js --collection=resume
```

---

## 4. Retention & Archival Policy
- **Hot Tier (Local / Primary)**: Last 7 days of daily snapshots stored in `server/backups/`.
- **Warm Tier (Cloud S3 / Cloud Storage)**: Last 30 daily snapshots encrypted at rest (AES-256).
- **Cold Tier (Monthly Archive)**: 1 snapshot per month retained for 12 months for compliance and historical audit.

---

## 5. Security & Isolation Checklist
- [x] `.gitignore` explicitly excludes `server/backups/` and `*.snapshot.json`.
- [x] No static web route serves `server/backups/`.
- [x] User passwords (`password`, `passwordHash`) are excluded from JSON snapshots.
- [x] Pre-save hooks prevent overwriting existing user credentials with null during restore.
