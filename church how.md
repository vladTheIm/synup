# Synup Church Connect — Management System Guide

## What Is This?

Synup Church Connect is a web-based tool to help you run your church. It keeps track of your members, attendance at services, finances (giving and transactions), events, groups, volunteers, room bookings, and pastoral care follow-ups — all in one place.

You access it through a web browser (Chrome, Firefox, Safari, or Edge) on any computer, tablet, or phone. No installation needed on your device.

---

## Logging In

Open the app in your browser and you'll see the Sign In page.

1. Enter your **email address**
2. Enter your **password**
3. Select the **role** you're signing in as (Super Admin, Church Admin, Pastor, or Member) — this controls what you can see and do
4. Click **Sign In**

If you have **multi-factor authentication (MFA)** turned on, you'll be asked for either:
- A **code from your authenticator app** (like Google Authenticator or Microsoft Authenticator), or
- A **code sent to your email**

The app locks your account for 30 minutes after 5 failed login attempts. If you forget your password, click the "Forgot your password?" link to reset it via email.

---

## The Dashboard

After logging in, you land on the **Dashboard**. This is your home screen with a quick overview:

- **Total Members** — how many people are in your church directory
- **Attendance Rate** — percentage of members attending services
- **New Members This Month** — people recently added
- **Upcoming Events** — services and activities on the calendar
- **Quick Trends** — charts showing attendance patterns and member growth
- **Notifications** — alerts about members who've been absent, new follow-ups assigned, etc.

---

## Sidebar Navigation

The sidebar on the left is your main menu. What you see depends on your role.

### People Section

**Members** — The church directory. Here you can:
- View a searchable list of all members (name, email, phone, status, group membership)
- Add new members (name, contact info, address, birthday, marital status, groups, photo)
- Click a member's name to see their full profile, including attendance history, giving records, pastoral notes, and groups
- Edit member details

**Attendance** — Track who came to services:
- Manually check in members by name or member ID
- Select which service time (Early, Main, Second, Youth)
- View attendance records and trends over time
- Export attendance data to a CSV file (usable in Excel)

**Pastoral Care** — Record visits, calls, and counselling sessions with members. Each note is timestamped and linked to the member's profile.

**Follow-ups** — A task list for following up with members. Create follow-ups with different urgency levels (low, medium, high). Mark them complete when done.

### Operations Section

**Events** — Create and manage services and events. Each event can have a date, service time, and notes. Events link to attendance records.

**Room Bookings** — Book rooms for meetings, classes, or events. See what rooms are available and when.

**Volunteers** — View and manage the volunteer roster.

**Groups** — Organize members into groups (choir, Bible study, youth, etc.). Each group can have a leader and members. If you're a group leader, you can add or remove members.

**Scheduling** — Manage recurring schedules or time slots for activities.

### Communication Section

**Messages** — Send messages to members or groups. This is for internal church communication.

### System Section

**Reports** — View reports and metrics about your church's activity.

**Settings** — Your personal account settings:
- Update your name, email, and profile photo
- Change your password
- Turn on/off multi-factor authentication (MFA)
- View and manage your active sessions (log out of other devices)

**Finance** — A financial overview showing:
- Total income, expenses, and balances across funds
- A list of all transactions with member names, amounts, funds, and dates
- Export transactions to CSV for your accounting software
- Generate giving statements for members

**Giving** — Record individual gifts (name, amount, fund, date). Simpler than full finance tracking.

**Funds** — Create and manage funds that money is allocated to (e.g., Building Fund, Missions, General).

**Admin Console** — Only visible to Super Admin. Manage:
- **Users** — Create login accounts for members/staff, assign roles, reset passwords, lock/unlock accounts, delete users
- **Roles** — Define what each role can see and do (custom permissions)
- **Audit Logs** — See a record of every important action taken in the system
- **System Settings** — Configure site name and URL

---

## Roles & What Each Can Do

| Role | What They Can Access |
|---|---|
| **Super Admin** | Everything — all sections, user management, permissions, audit logs |
| **Church Admin** | Everything except Admin Console (users, roles, audit logs) |
| **Pastor** | Dashboard, Members, Attendance, Pastoral Care, Follow-ups, Events, Groups, Messages, Reports |
| **Department Lead** | Dashboard, Members, Attendance, Events, Volunteers, Groups, Schedule, Messages, Settings |
| **Member** | Dashboard, Members (view), Events, Groups (they belong to), Messages, Settings |

---

## Security Features

- **Passwords** — Must be at least 8 characters with uppercase, lowercase, number, and a symbol. Old passwords are remembered to prevent reuse.
- **Account Locking** — After 5 wrong password attempts, the account is locked for 30 minutes.
- **Multi-Factor Authentication (MFA)** — Optional but recommended. Adds a second step to login (authenticator app or email code).
- **Session Management** — Sessions expire after 30 minutes of inactivity. You can see and revoke active sessions in your Settings page.
- **Audit Logging** — Every important action (login, member created, transaction recorded, user deleted, etc.) is logged and visible to Super Admin.

---

## How Data Is Tracked

When you or your team use the system, the app sends anonymous traffic information (page visited, browser type, device type) to help improve performance. Important actions like member sign-ups, attendance marking, and financial transactions are also logged for accountability — your church's Super Admin can review these logs at any time.

---

## Getting Started

1. Your **Super Admin** creates login accounts for staff and ministry leaders
2. Start by **adding members** to the directory
3. Set up **Groups** (choir, ushers, Bible study, etc.) and assign leaders
4. Create **Funds** for giving categories
5. Begin tracking **Attendance** at services
6. Use **Finance** to record transactions and **Giving** to record individual gifts

---

## Need Help?

Contact your church's Super Admin for account issues, password resets, or questions about what you can access.
