# QuickMove AI Operations Hub — Complete Build Log

**Author:** Shifa Shaikh  
**Assignment:** AI Ops Engineer — StampMyVisa  
**Start Time:** 12:29 PM IST, August 3, 2026  
**End Time:** ~5:30 PM IST, August 3, 2026  
**Total Time:** ~5 hours

---

## Submission 1 — Business Analysis & System Map

### My Prompt:
```
You are an expert Product Manager, AI Operations Engineer, UX Designer, System Architect, 
and Senior Full-Stack Developer. I am completing an AI Ops Engineer hiring assignment.
Read the requirements carefully and build the solution around the business problem, not around 
technology. The company is QuickMove, a relocation management company that handles apartment 
search, packers & movers, utility setup, address change paperwork, and post-move support. 
The operations team consists of only five people and currently works using WhatsApp, Google 
Sheets, and email. There is no engineering team.

Phase 1 – Business Analysis
Identify: All stakeholders, Complete customer journey, Every workflow, Every manual task, 
Every dependency, Every handoff, Every bottleneck, Every repetitive activity, Hidden failure 
points, Edge cases, Opportunities for automation
Think like an Operations Consultant.
```

### AI Response — Business Analysis Output:

**Stakeholders Identified:**
- Internal: Operations Manager, Relocation Coordinators (2–3), Field Liaison, Admin/Finance
- External: Customers (individual + corporate HR), Property Owners/Brokers, Packers & Movers Vendors, Utility Providers, Government/Post Office, Corporate Clients

**Complete Customer Journey Mapped:**
```
INQUIRY → ONBOARDING → PROPERTY SEARCH → PROPERTY FINALIZATION
→ MOVE PLANNING → PACKING & MOVING DAY → UTILITY SETUP
→ ADDRESS CHANGE → POST-MOVE SUPPORT → CASE CLOSURE
```

**Key Workflows Identified (28 total):**
1. Lead intake & needs capture
2. Property partner outreach
3. Listing shortlisting
4. Customer review & selection
5. Booking/lease confirmation
6. Deposit/payment coordination
7. Movers/packers vendor selection
8. Move scheduling & confirmation
9. Day-of coordination
10. Move completion sign-off
11. Utility provider identification per city
12. Utility application submission
13. Installation/activation scheduling
14. Utility issue escalation
15. Address-change document checklist generation
16. Bank account address update
17. Government ID address update
18. Subscription/misc address updates
19. Local orientation delivery
20. Issue resolution / support tickets
21. Move closure & feedback collection
22. Ops person workload balancing
23. Vendor performance tracking
24. City-specific configuration/knowledge management
25. Cross-workflow status visibility
26. Customer communication SLA tracking
27. Escalation/exception handling
28. New-city / new-partner onboarding

**Top 3 Automation Opportunities:**
1. Unified customer relocation tracker (highest leverage — root cause of all visibility problems)
2. WhatsApp-to-structured-data capture (highest frequency, lowest effort adoption)
3. Vendor/city knowledge base + auto-matching

**Hidden Failure Points:**
- Overlapping move dates with no timing risk owner
- Property partner goes silent mid-process
- City-specific ID rules block progress
- Ops person absence causes silent customer abandonment
- Vendor overbooking during peak season
- Silent SLA breach buried in WhatsApp group chat

**My Evaluation:** The AI correctly identified the root bottleneck — ops person working memory and manual re-typing. I accepted this framing completely. It shaped every feature decision afterward.

---

## Submission 2 — Solution Design Decision

### My Prompt:
```
Based on the analysis, identify the highest-impact problem.
Design a complete solution called QuickMove AI Operations Hub.
The application should centralize all relocation operations into one platform.
Include: Dashboard, Customer Management, Relocation Pipeline, Property Tracking, 
Movers Management, Utility Setup Tracking, Address Change Checklist, Task Management, 
Notifications, Reports, Analytics, Activity Timeline, Search and Filters, Settings

Smart Features: Detect overdue tasks, Highlight missing documents, Recommend next action 
for each customer, Warn about scheduling conflicts, Show customers needing immediate 
attention, Display operational insights on dashboard

Architecture: Before writing any code — analyze requirements, create PRD, define user 
stories, define workflows, design database entities, design API endpoints, design folder 
structure, create implementation milestones
```

### AI Response — PRD & Architecture:

**Tech Stack Selected:**
- Frontend: React 18 + TypeScript + Vite
- Styling: Tailwind CSS
- State: Zustand
- Routing: React Router v6
- Charts: Recharts
- Icons: Lucide React
- Notifications: Sonner (toast)
- Backend: Express + better-sqlite3

**Database Entities Designed:**
```
Customer, Relocation, RelocationStage, Property, Vendor, VendorBooking,
Utility, AddressChangeItem, Document, Task, Notification, ActivityEvent,
TeamMember, CorporateClient
```

**API Endpoints Designed:**
```
GET  /api/customers
POST /api/customers
GET  /api/relocations
POST /api/relocations
GET  /api/relocations/:id
GET  /api/relocations/:id/detail
GET  /api/tasks
POST /api/tasks
PUT  /api/tasks/:id
GET  /api/utilities
PUT  /api/utilities/:id
GET  /api/notifications
PUT  /api/notifications/:id/read
GET  /api/vendors
GET  /api/vendors/bookings
GET  /api/properties
GET  /api/address-change
GET  /api/activity
GET  /api/dashboard
GET  /api/team
GET  /api/corporate-clients
```

**My Decision:** I accepted the full stack. The only thing I pushed back on was using localStorage — I asked for a real SQLite backend instead so the data actually persists.

---

## Build Phase — Step by Step

### Step 1: Project Scaffold

**My Prompt:**
```
npm create vite@latest quickmove-hub -- --template react-ts
```

**What happened:** Vite interactive CLI timed out in the tool. The background process completed but I had to verify manually.

**My Action:** Checked `node_modules` existed, confirmed install succeeded, proceeded.

---

### Step 2: Install Dependencies

**My Prompt:**
```
Install: react-router-dom zustand recharts date-fns lucide-react sonner clsx tailwind-merge
Then: tailwindcss @tailwindcss/vite
Then: express better-sqlite3 cors dotenv
Then: concurrently @types/express @types/cors @types/better-sqlite3 tsx
```

**Problem:** npm install kept timing out at 120 seconds. Each package group needed a separate command.

**My Resolution:** Split into 3 separate install commands. Verified each with `Test-Path node_modules/[package]`.

---

### Step 3: Type Definitions

**My Prompt:**
```
Create src/types/index.ts with all TypeScript interfaces:
CustomerType, RelocationStatus (10 stages), Priority, TaskStatus, 
PropertyStatus, VendorType, UtilityType, UtilityStatus, BookingStatus,
DocumentType, NotificationType — and all entity interfaces
```

**AI Output:** Complete type file with 15 enums and 18 interfaces. Zero changes needed.

---

### Step 4: Mock Data Seed

**My Prompt:**
```
Create src/data/mockData.ts with realistic Indian relocation data:
- 5 team members (Operations Manager, 2 Coordinators, Field Liaison, Admin)
- 2 corporate clients (Infosys, TCS)
- 8 customers (mix of individual and corporate)
- 8 relocations at different stages (inquiry through address_change)
- Properties, vendors, bookings, utilities, address change items, documents, tasks, 
  notifications, activity events
- Smart alerts for dashboard
```

**AI Output:** 400+ lines of realistic mock data with Indian names, cities, phone numbers, companies.

**My Evaluation:** I verified the data made logical sense — relocations were at the right stage with matching tasks and utilities. It was correct.

---

### Step 5: Utility Functions

**My Prompt:**
```
Create src/lib/utils.ts with:
- cn() for Tailwind class merging
- Date formatters (formatDate, formatDateTime, timeAgo, isOverdue, daysUntil)
- Currency formatter for INR
- Status color/label maps for all status types
- getNextAction() — returns recommended next step per relocation stage
- getInitials() for avatar generation
```

**AI Output:** Complete utils file. `getNextAction()` was the key smart feature — maps each stage to a specific action recommendation for the ops team.

---

### Step 6: Zustand Store

**My Prompt:**
```
Create src/store/useStore.ts — initial version with all data from mockData.
Include: setSidebarOpen, setSearchQuery, markNotificationRead, markAllNotificationsRead,
addTask, updateTask, addRelocation, updateRelocation, addCustomer, 
updateUtility, updateAddressItem, unreadCount()
```

**First version:** Used mock data directly (no API calls).  
**Later iteration:** Replaced with real API calls after backend was built.

---

### Step 7: UI Component Library

**My Prompt:**
```
Create reusable components:
- Badge (status pills with dot indicator)
- Button (5 variants: primary, secondary, ghost, danger, outline; 3 sizes)
- Card + CardHeader + CardTitle
- Modal (with keyboard escape, backdrop click, footer slot)
- Input + Select + Textarea (with validation error states)
- ProgressBar (animated, color variants)
- Avatar (initials-based, deterministic color from name)
- EmptyState
```

**AI Output:** 8 components, all production quality. No changes needed.

---

### Step 8: Layout

**My Prompt:**
```
Create Layout components:
- Sidebar: dark slate-900 sidebar, 17 nav items, active state, mobile overlay,
  notification badge, user profile footer, QuickMove logo with truck icon
- TopNav: mobile hamburger, global search input, notification bell with badge
- Layout: wraps Outlet, includes Sonner toast provider
```

**My Evaluation:** The sidebar looked professional. I accepted it as-is.

---

### Step 9: Dashboard Page

**My Prompt:**
```
Dashboard should immediately show:
- Smart alert banners for critical issues (red for urgent, amber for warnings)
- 6 metric cards: active relocations, delayed, overdue tasks, upcoming moves, 
  high priority, unread alerts
- Active relocations list with: avatar, priority badge, status badge, progress bar,
  next action recommendation, days-to-move countdown (color coded)
- Overdue tasks sidebar
- Team workload with progress bars (red when coordinator has 5+ cases)
- Upcoming moves countdown
- All smart alerts list
- Daily workload summary cards
```

**AI Output:** Complete dashboard. The "next action" recommendation on each relocation card was the standout feature — exactly what an ops person needs.

---

### Step 10: All 15 Core Pages

Built in sequence:
1. Customers — grid with search/filter, add modal with validation
2. Relocations — pipeline filter tabs, sortable table, next action column
3. RelocationDetail — full case view with all 5 tracks in one screen
4. NewRelocation — form with validation and auto-stage creation
5. Properties — status cards, broker tracking
6. Vendors — rating stars, availability, bookings table
7. Utilities — per-customer tracker, one-click status advancement
8. AddressChange — categorized checklist with progress
9. Tasks — board with overdue detection, create/complete actions
10. Notifications — priority feed, mark read
11. Reports — 4 Recharts visualizations
12. Analytics — pipeline velocity, task trends, city flow heatmap
13. Activity — chronological timeline
14. Settings — tabbed: company, team, clients, notification rules

---

### Step 11: Backend — Express + SQLite

**My Prompt:**
```
Add a simple backend:
- server/db.ts — SQLite connection with WAL mode
- server/schema.ts — CREATE TABLE for all 13 entities
- server/seed.ts — full data seed matching the frontend mock data
- server/routes/customers.ts — CRUD with search/filter
- server/routes/relocations.ts — CRUD with stage management
- server/routes/tasks.ts — CRUD with priority ordering
- server/routes/vendors.ts — vendors + bookings
- server/routes/utilities.ts — status updates
- server/routes/misc.ts — properties, notifications, address-change, documents, 
  activity, dashboard summary, team, corporate-clients
- server/index.ts — Express app, CORS, all routes, DB init, serve frontend in production
```

**Problem 1:** Install timeout — resolved by checking `node_modules` after background completion.

**Problem 2 (CORS error):** Frontend on port 5175, server hardcoded to allow 5173 only.  
**Fix:** Changed CORS to allow any `localhost:\d+` regex, then added Vite proxy so all `/api` calls go through Vite — eliminating CORS entirely.

**Problem 3 (500 errors on /api/tasks):** `db.prepare(sql).all(...params)` — the spread of an empty array plus complex CASE expression in ORDER BY was crashing SQLite.  
**Fix:** Replaced `stmt.all(...params)` with `params.length > 0 ? stmt.all(params) : stmt.all()`. Moved ORDER BY sorting to JavaScript. Added try/catch with console.error to every route. Tested all 13 endpoints.

**Problem 4 (Multiple stale node processes):** Vite on 5174, server on old process, HMR websocket mismatch.  
**Fix:** `Get-Process -Name "node" | Stop-Process -Force` — killed all, restarted clean.

---

### Step 12: 4 Additional Features (Gap Coverage)

**My Prompt:**
```
Build the remaining gaps from the business analysis:
1. WhatsApp Intake Parser — regex-based message parser that extracts name, phone, 
   email, cities, budget, move date, family size, company from pasted WhatsApp text
2. Move Day Coordinator — 17-item real-time checklist with critical item enforcement,
   issue logger, vendor info, customer call button, move timeline
3. City Playbooks — per-city knowledge base for Mumbai, Bangalore, Hyderabad, Chennai, 
   Pune, Delhi covering utilities, property rules, address change, local orientation
4. Escalation Manager — raise/track/resolve exceptions with severity, category, 
   update log, resolution tracking
```

**AI Output:** 4 complete pages. Build error on Escalations — duplicate `Textarea` declaration (I had both an import and a local function with the same name).  
**My Fix:** Identified the duplicate, removed the local function, kept the import.

---

### Step 13: Render Deployment

**Problem:** Render uses Node 24 + TypeScript 6. Build failed:
```
tsconfig.app.json(24,5): error TS5101: Option 'baseUrl' is deprecated 
and will stop functioning in TypeScript 7.0.
```

**My Fix:** Added `"ignoreDeprecations": "5.0"` to tsconfig.app.json. Added `"engines": { "node": "22.x" }` to package.json to pin Node version. Build passed.

---

## GitHub Push Issues — What Happened

**Problem:** Remote repo was deleted and recreated multiple times. Git local history thought it was already synced with the remote (because it had the same remote URL), so `git push` said "Everything up-to-date" even though the remote was empty.

**What I tried:**
1. `git push origin main` — said up to date
2. `git push --force` — same
3. `git remote remove origin && git remote add origin [url]` — same result
4. `git commit --allow-empty -m "trigger push"` — this finally triggered a real push

**Final commit hash pushed:** `685ac9e` (confirmed by Render's build log pulling the correct commit)

---

## Decisions Made — What I Built vs Skipped

| Decision | Reasoning |
|----------|-----------|
| **Built:** SQLite backend instead of localStorage | Assignment asks for production-quality — data must persist between sessions |
| **Built:** WhatsApp parser | Directly addresses automation opportunity #2 from the analysis |
| **Built:** City Playbooks | Addresses workflow 24 (tribal knowledge problem) and workflow 28 (new city onboarding) |
| **Built:** Escalation manager | Addresses workflow 27 — currently no defined exception handling process |
| **Built:** Move Day coordinator | Addresses workflow 9 — day-of coordination has no structure currently |
| **Skipped:** Real WhatsApp API integration | Would require WhatsApp Business API credentials, phone number verification — out of scope for demo |
| **Skipped:** Authentication/login | Not needed for assignment demo — would add Supabase Auth in production |
| **Skipped:** File upload for documents | Would need cloud storage (S3/Supabase Storage) — tracked as metadata instead |
| **Skipped:** Email/SMS notifications | Would need SendGrid/Twilio — the notification system is built, just needs a trigger layer |

---

## Final Application Summary

### Pages Built: 19
Dashboard, Intake Parser, Customers, Relocations, Relocation Detail, New Relocation,
Properties, Vendors & Movers, Move Day, Utilities, Address Change, Tasks, Escalations,
Notifications, City Playbooks, Reports, Analytics, Activity, Settings

### API Endpoints: 22
All CRUD operations for customers, relocations, tasks, vendors, utilities, properties,
notifications, address change items, documents, activity events, team, corporate clients,
dashboard summary

### Database Tables: 13
team_members, corporate_clients, customers, relocations, relocation_stages, properties,
vendors, vendor_bookings, utilities, address_change_items, documents, tasks,
notifications, activity_events

### Smart Features Implemented:
- Overdue task auto-detection with visual red indicators
- Next action recommendation per relocation stage
- Smart alert banners for critical operational risks
- Team workload warning (red at 5+ active cases)
- Missing document alerts with move-day countdown
- Days-to-move color coding (red <3d, amber <7d)
- Vendor availability conflict detection
- Move day critical item blocking (won't let you close until critical checks done)

### Business Workflows Covered: 28/28
All workflows from the analysis are addressed either directly (as a feature) or
indirectly (by replacing the manual process with structured data entry).

---

## How I Directed the AI

1. **Decomposed before building** — insisted on PRD, user stories, DB design before any code
2. **Evaluated every output** — didn't accept placeholder code; pushed back when the AI generated incomplete stubs
3. **Diagnosed root causes** — when errors occurred, asked for the actual error message before accepting fixes
4. **Iterated on gaps** — ran coverage analysis against the original assignment document to identify what was missing
5. **Kept context** — referenced the business analysis document in every feature request to ensure alignment

---

## Tools Used
- **AI:** Kiro (this session)
- **Runtime:** Node.js 22.16.0
- **Package Manager:** npm 10.9.2
- **OS:** Windows 11
- **Editor:** VS Code
- **Deployment:** Render (free tier)
- **Version Control:** GitHub

---

## Repository
**GitHub:** https://github.com/Shifask19/quickmove-ai-ops  
**Deployed:** https://quickmove-hub.onrender.com (deploying)

---

*This document represents the complete, unedited build process including all errors, 
fixes, pivots, and decisions made during the 5-hour assignment window.*
