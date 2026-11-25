# 🏢 Clabsy Sales — Real Estate CRM & Inventory Management Platform

A modern, responsive real estate CRM and sales enablement platform built with **React 19**, **Tailwind CSS v4**, and **Vite**. Designed to streamline property inventory tracking, interactive plot mapping, lead pipeline management, customer scheduling, and sales analytics for real estate agencies.

---

## ✨ Key Features

- **📊 Executive Dashboard & Analytics**: Real-time sales KPIs, conversion metrics, performance trends, and an active sales agent leaderboard.
- **🗺️ Interactive Plot & Inventory Grid**: Visual grid map visualizing plot availability (Available, Booked, Reserved, Blocked) with instant property inspection modals.
- **📋 Kanban Lead Management Pipeline**: Full drag-and-drop style lead stage tracking (New Lead, Site Visit Scheduled, Negotiation, Closed Won/Lost).
- **📅 Site Visit & Customer Scheduling**: Integrated visit appointment management, customer profiles, and follow-up tracking.
- **⚡ Reactive State Architecture**: Centralized React Context (`AppContext.jsx`) ensuring instantaneous UI updates and consistent state across all modules without heavy external state libraries.
- **🎨 Modern Dark/Light Design**: Responsive interface crafted with Tailwind CSS v4 and Lucide React icons.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Kepvion/clabsy-sales.git
   cd clabsy-sales
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
clabsy-sales/
├── src/
│   ├── components/
│   │   ├── booking/       # Booking workflows and confirmation modals
│   │   ├── common/        # Reusable UI primitives (Modals, Badges, Toasts)
│   │   ├── customers/     # Customer profiles and visit scheduling
│   │   ├── dashboard/     # Metric cards, sales charts, agent leaderboard
│   │   ├── inventory/     # Plot map grid, inventory filters, plot modals
│   │   ├── layout/        # Responsive header and navigation sidebar
│   │   ├── leads/         # Kanban pipeline and lead creation forms
│   │   └── siteVisits/    # Site visit tracking and history
│   ├── context/           # AppContext state provider
│   ├── data/              # Initial seed datasets & mock store
│   └── utils/             # Currency, date, and data formatters
├── public/                # Static assets & brand icons
├── package.json
└── vite.config.js
```

---

## 📄 License

MIT © [Priyanka Kumari (Kepvion)](https://github.com/Kepvion)
