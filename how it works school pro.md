# SchoolPro Architecture Guide

## Stack
| Layer | Tech | Details |
|-------|------|---------|
| Frontend | React 19 + Vite 8 | `client/` — SPA with client-side routing |
| Backend | Express 5 | `server/` — REST API on port 3001 |
| Database | PostgreSQL (primary) + SQLite (fallback) | Auto-creates DB on startup |
| Auth | JWT (12h access) + refresh token rotation (7d) | Stored in localStorage |
| AI Chatbot | Google Gemini Flash (`gemini-flash-latest`) | Via `GEMINI_API_KEY` (free tier ~30 RPM) |
| Email | Nodemailer (SMTP) with Resend API fallback | DB-driven templates with `{{var}}` placeholders |
| SMS | Adverse SMS API | Webhook for delivery receipts |

## Directory Layout
```
/
├── client/                  # React SPA
│   ├── src/
│   │   ├── api.js           # Axios instance, JWT interceptor, refresh queue
│   │   ├── helpers.jsx       # Toast, modal, print, school setup, grade utils
│   │   ├── main.jsx          # Entry point; global error/audit ingestion via window.onerror + unhandledrejection
│   │   ├── App.jsx           # Routes, Shell layout, sidebar nav, TutorialTour + Chatbot
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx  # Login/logout, session restore, inactivity timeout (30 min), can() privileges
│   │   ├── pages/            # One component per route
│   │   ├── components/       # Shared UI (TutorialTour, Loader, etc.)
│   │   └── styles/           # CSS files
│   └── vite.config.js        # Proxy /api → localhost:3001
│
├── server/
│   ├── server.js             # Express app (~790 lines): routes, auth middleware, rate limiting, file uploads
│   ├── database.js           # ~3839 lines: Pool mgmt, schema init, all data-access functions
│   ├── tenancy.js            # Multi-school context via AsyncLocalStorage; school CRUD; settings
│   ├── saasFeatures.js       # Grading scales, audit log, platform overview, analytics, system reset
│   ├── emailService.js       # Nodemailer + Resend; DB email templates; verification/welcome/reset emails
│   ├── notificationService.js
│   ├── backupService.js
│   ├── chatbotService.js     # Gemini integration with function calling
│   ├── .env                  # JWT_SECRET, DATABASE_URL, GEMINI_API_KEY, SMTP_*, etc.
│   └── .env.example
```

## Key Data Flows

### 1. Authentication Flow
```
Login → POST /api/auth/login
  ├─ Check lockout (3 attempts → 10 min lock)
  ├─ Verify bcrypt password
  ├─ Generate JWT (12h) + refresh token (7d, SHA-256 hashed in DB)
  ├─ Store user + tokens in localStorage
  └─ Return { token, refreshToken, user }

On 401 → interceptor in api.js
  ├─ POST /api/auth/refresh (old token revoked = rotation)
  └─ On fail → clear localStorage, redirect /login

Logout → POST /api/auth/logout
  └─ Revoke all tokens for user
```

### 2. Authorization Middleware (server.js:378-434)
```
auth middleware runs on every /api/* request:
  1. Verify JWT from Authorization header or ?token= query param
  2. Resolve schoolId via tenancy.resolveSchoolId(user)
  3. If platform_admin & no actingSchoolId:
       GET requests → proceed without school context (read-only)
       POST/PUT/DELETE → 403 "Select a school first"
  4. Non-admin → must have schoolId or 403
  5. Wraps handler in tenancy.runWithSchoolContext() for DB scoping

Role middlewares applied on top:
  adminOnly         → super_admin, platform_admin, admin, or teacher w/ adminProfile
  superAdminOnly    → role === 'super_admin'
  platformAdminOnly → role === 'platform_admin'
  smsManagerOnly    → platform_admin (on balance/stats), super_admin, admin w/ 'sms'
  userHasPrivilege  → checks privileges array (all, teachers, attendance, etc.)
```

### 3. Multi-School Tenancy (tenancy.js)
```
AsyncLocalStorage per request → getSchoolContext() returns current school_id
  - platform_admin → actingSchoolId (from header/body) or null
  - Other roles → tied to one school (schoolId from user object)
  - Fallback → school_id = 1

All DB queries use getSchoolContext() to scope data:
  WHERE school_id = COALESCE(tenancy.getSchoolContext(), 1)
```

### 4. API Route Structure (all in server.js)
```
/api/auth/*           — login, refresh, logout, schools list, signup, unlock, password reset
/api/dashboard/*      — stats
/api/students/*       — CRUD + photo upload
/api/teachers/*       — CRUD + photo upload
/api/attendance/*     — teacher + student attendance, reports
/api/grades/*         — SBA, terminal, Bece, cumulative results
/api/fees/*           — fee structure, payments, receipts, reports
/api/reports/*        — report cards, terminals, broadsheets
/api/settings/*       — school settings, templates, SMTP config, form fields
/api/timetable/*      — timetable CRUD, absences, replacements
/api/notifications/*  — fetch, mark read, notify
/api/lesson-materials/* — upload, review
/api/inventory/*      — items, warehouse, transactions
/api/reception/*      — reception records, visitor logs
/api/hr/*             — HR profiles
/api/cards/*          — card people
/api/exam-master/*    — sessions, supervisors, attendance
/api/sms/*            — send, balance, stats, webhook
/api/events/*         — school events
/api/audit-log/*      — audit logs (scoped)
/api/analytics/*      — per-school analytics
/api/platform/*       — platform overview, school management, system reset
/api/health           — health check
/api/errors/ingest    — forward to remote audit service
/api/audit-report/ingest
/api/traffic/ingest
```

### 5. Client-Side Routing (App.jsx)
```
/login               — LoginPage
/signup              — SignupPage
/dashboard           — Dashboard
/students            — StudentList
/students/:id        — StudentDetail
/students/add        — AddStudent
/teachers            — TeacherList
/teachers/:id        — TeacherDetail
/teachers/add        — AddTeacher
/attendance          — Attendance
/attendance/teacher  — TeacherAttendance
/grades              — Grades (SBA)
/grades/cumulative   — CumulativeResults
/grades/bece         — BECEResults
/grades/mock         — MockResults
/grades/terminal     — TerminalReport
/fees                — Fees
/reports             — ReportGenerator
/reports/report-card — ReportCard
/settings            — Settings
/timetable           — Timetable
/notifications       — Notifications
/lesson-materials    — LessonMaterials
/inventory           — Inventory
/warehouse           — Warehouse
/reception           — Reception
/hr                  — HR
/cards               — Cards
/exam-master         — ExamMaster
/sms                 — SMS
/events              — SchoolEvents
/analytics           — Analytics
/audit-log           — AuditLog
/platform            — PlatformOverview
/admin/settings      — AdminSettings
```

### 6. Error Handling Strategy
```
Server:
  asyncHandler(fn)   — wraps every route, catches thrown errors
  captureError(err, req) — inserts into system_errors table
  sendAuditEvent()   — POSTs to remote render.com audit service (static app_id)
  Global error middleware (line 263) — catches unhandled, captures, forwards, logs

Client:
  window.onerror               — global JS errors → POST /api/errors/ingest
  window.onunhandledrejection  — unhandled promise rejections → POST /api/errors/ingest
  api.js interceptor           — 401 → auto refresh or logout
  Components use .catch() on API calls + showToast() for user feedback
```

### 7. Key Design Decisions
- **No ORM** — raw SQL queries throughout database.js
- **No route files** — all routes defined inline in server.js
- **Manual multipart parsing** — custom parser for file uploads instead of multer
- **Permission model** — privileges array on user object ('all', 'teachers', 'attendance', 'grades', etc.) checked via `userHasPrivilege()`
- **File uploads** — stored on filesystem under `UPLOADS_DIR` (default `./server/uploads/`), subdirectories per entity type
- **CSP** — Helmet with `'unsafe-eval'` (needed by some deps), `'unsafe-inline'` (for styles), CSP headers stripped from `/api/` responses
- **Audit** — dual system: local `audit_log` table + remote ingest to render.com
- **Database fallback** — if PostgreSQL is unavailable, code paths use SQLite via the `better-sqlite3` pattern in some utilities
