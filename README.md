# QuickMove AI Operations Hub

A production-quality AI Operations platform built for **QuickMove** — a relocation management company. This replaces WhatsApp + Google Sheets + Email with a single, intelligent operations hub.

---

## 🚀 Live Demo

```
npm install
npm run dev
```
Open → http://localhost:5173

---

## 🧩 What It Solves

QuickMove's 5-person operations team was managing everything through WhatsApp, Google Sheets, and email — with no visibility, no task ownership, and no proactive alerts. This platform centralizes all relocation operations and adds intelligent operational assistance.

---

## ✨ Features

### Smart Dashboard
- Active & delayed relocations at a glance
- Smart alert banners (overdue tasks, missing docs, scheduling conflicts)
- Team workload monitor
- Upcoming moves countdown
- Daily operational insights

### Customer Management
- Individual & corporate customer profiles
- Coordinator assignment
- Active relocation count per customer

### Relocation Pipeline
- 10-stage pipeline: Inquiry → Onboarding → Property Search → Property Finalized → Move Planning → Packing & Moving → Utility Setup → Address Change → Post-Move Support → Completed
- Visual progress tracker
- Priority badges (Urgent / High / Medium / Low)
- "Next action" recommendation per relocation
- Days-to-move countdown with color coding

### Property Tracking
- Shortlist, visit, select, or reject properties
- Broker contact tracking
- Per-customer property history

### Vendors & Movers
- Vendor database with ratings and availability
- Booking management with status tracking
- Conflict detection (vendor availability)

### Utility Setup Tracker
- Track electricity, gas, internet, water, LPG
- One-click status advancement (Pending → Applied → Active)
- Per-customer progress view

### Address Change Checklist
- Categorized checklist: Government ID, Banking, Insurance, Employment, Online Services
- Submission and completion tracking per institution

### Task Management
- Create, assign, prioritize, and complete tasks
- Overdue task detection with visual indicators
- Filter by status, priority, assignee

### Notifications
- Smart alerts for overdue tasks, missing documents, upcoming moves
- Priority-based notification feed
- Mark read / mark all read

### Reports & Analytics
- Monthly moves and revenue charts
- Pipeline stage distribution
- Task completion trends
- Utility activation status
- Vendor performance table
- City-wise relocation flow
- Pipeline velocity (avg days per stage)
- Coordinator workload stats

### Activity Timeline
- Chronological log of all operations events
- Filter by event type

### Settings
- Company configuration
- Team member management
- Corporate client management
- Notification rule configuration

---

## 🏗️ Architecture

```
Frontend Only (no backend required for demo)
├── React 18 + TypeScript
├── Tailwind CSS (styling)
├── Zustand (state management)
├── React Router v6 (routing)
├── Recharts (data visualization)
├── Sonner (toast notifications)
└── Lucide React (icons)
```

### Folder Structure

```
src/
├── components/
│   ├── layout/       # Sidebar, TopNav, Layout
│   └── ui/           # Badge, Button, Card, Modal, Input, Avatar, ProgressBar
├── data/
│   └── mockData.ts   # Seed data — 8 customers, 8 relocations, full tasks/docs/utils
├── lib/
│   └── utils.ts      # Formatters, status maps, next-action logic
├── pages/            # 15 route-level pages
├── store/
│   └── useStore.ts   # Zustand store (data + UI state)
└── types/
    └── index.ts      # All TypeScript interfaces and enums
```

---

## 📋 Business Analysis

### Stakeholders
- Operations Manager, Relocation Coordinators (2–3), Field Liaison, Admin/Finance
- Customers (individual + corporate HR), Property Brokers, Packers & Movers, Utility Providers

### Key Problems Solved
| Problem | Solution |
|---------|----------|
| Zero operational visibility | Real-time dashboard with status of every relocation |
| No task ownership | Assigned tasks with due dates and overdue detection |
| No proactive alerts | Smart alert system for risks before they become crises |
| Data fragmentation | Single source of truth replacing WhatsApp + Sheets + Email |
| No document tracking | Document checklist with missing-doc warnings |
| Manual utility tracking | Structured utility tracker with one-click updates |
| No address change tracking | Categorized checklist with completion tracking |

---

## 🔄 Path to Production Backend

The frontend is architected for a clean backend swap:

- **Database:** Supabase (Postgres)
- **Auth:** Supabase Auth
- **API:** Replace Zustand mock store with `fetch()` calls
- **File storage:** Supabase Storage for document uploads
- **Notifications:** Trigger-based alerts via Supabase Edge Functions

---

## 👤 Author

Built as an AI Ops Engineer hiring assignment for QuickMove.
