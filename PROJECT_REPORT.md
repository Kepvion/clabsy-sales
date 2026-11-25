# 🏛️ Clabsy — Real Estate CRM & Interactive Plot Booking Platform
## Comprehensive Engineering Report & Architecture Specification

---

## 1. Executive Summary & Project Identity

* **Project Title**: Clabsy — Real Estate CRM & Land Parcel Reservation Platform
* **Client / Domain**: Greenfield Estates (Bengaluru, Karnataka)
* **Live Production URL**: [https://clabsy-sales.vercel.app](https://clabsy-sales.vercel.app)
* **GitHub Repository**: [https://github.com/Kepvion/clabsy-sales](https://github.com/Kepvion/clabsy-sales)
* **Lead Engineer & Author**: `Kepvion <priyanka06kumari0403@gmail.com>`
* **Status**: Deployed, Active, Production-Ready

---

## 2. Why This Project? (The Real-World Business Problem)

### The Market Gap
Traditional customer relationship management tools (Salesforce, HubSpot, Zoho) were designed for software subscriptions, consumer retail, or modular B2B sales. When applied to **plotted real estate developments and township layouts**, they fail because:
1. **No Spatial Context**: Real estate agents sell physical land bounded by survey boundaries, arterial roads, corner splays, and facing orientations (e.g. East/North Vastu compliance). A CRM that only shows text rows in a table cannot help a buyer visualize the exact parcel they are purchasing.
2. **Disconnected Inventory**: Standard CRMs have no real-time locking mechanism for land parcels. Two agents can easily pitch the same premium corner plot to two buyers simultaneously, leading to customer disputes and brand erosion.
3. **Complex Indian Pricing Schedules**: Indian plotted layouts rely on multi-tier financial schedules—Base Land Rate (per sq.ft), Preferential Location Charges (Corner PLC $+10\%$), Infrastructure Development Charges, Clubhouse Life Memberships, and token booking advances vs balance payable upon sale deed registration.
4. **RERA Legal Compliance**: Under RERA (Real Estate Regulatory Authority) regulations, issuing reservations requires formal, numbered Provisional Allotment Letters with verifiable booking references and terms.

### The Clabsy Solution
Clabsy solves this by unifying:
* **Interactive Cadastral Blueprint**: A digital survey drafting plan where parcels can be inspected, highlighted, and reserved in real time.
* **Leads Qualification Pipeline**: A dual-view (Kanban & Table) sales pipeline tracking prospects from initial inquiry to physical site visit to closing.
* **4-Step Guided Reservation Engine**: A step-by-step booking wizard that calculates exact financial schedules and generates an official, printable **Provisional Allotment Letter** complete with a digital authorization seal.

---

## 3. Technology Stack & Architecture

### Frontend Layer
* **React 19 (`19.3.1`)**: Component-based UI rendering, leveraging modern hooks (`useState`, `useEffect`, `useMemo`, `useContext`) for responsive state management.
* **Vite 8 (`8.3.4`)**: Next-generation frontend build tool using Rolldown bundling for near-instant Hot Module Replacement (HMR) and optimized distribution builds in 1.7s.
* **Tailwind CSS v4 (`4.3.3`)**: Utility-first CSS engine with custom `@theme` tokens, eliminating heavy component libraries in favor of tailored real estate developer design primitives.
* **Lucide React (`1.61.0`)**: Crisp, lightweight vector iconography for navigational, spatial, and analytical controls.
* **Google Fonts**:
  * **Cormorant Garamond** & **Playfair Display**: Luxury editorial serif typography for project headings, allotment deeds, and executive metrics.
  * **Plus Jakarta Sans**: High-legibility sans-serif for numerical data, coordinates, and high-density tables.

### Backend & Persistence Layer
* **Reactive State Engine (`src/context/AppContext.jsx`)**: Centralized React Context providing transactional actions across all entities (leads, plots, bookings, site visits, and navigation).
* **Local Persistence Engine (`localStorage`)**: Persists all state mutations under key `clabsy_sales_data_v2`. When an agent reserves a plot, schedules a chauffeur-driven site visit, or registers a lead, it persists across full browser refreshes without requiring a remote database server.
* **Pristine Demo Reset**: An executive reset feature allows demonstrators and evaluators to wipe local modifications and restore clean seed data with one click.

### Cloud Hosting & Infrastructure
* **Vercel Edge Platform**: Deployed to permanent HTTPS hosting at `clabsy-sales.vercel.app`.
* **SPA Routing Configuration (`vercel.json`)**: Rewrites all client-side routes to `/index.html` to guarantee flawless direct URL navigation and page refreshes.

---

## 4. Complete Git Commit History

The following is the verified commit log on branch `main` in the GitHub repository:

### Commit 1 — `ab05f80`
* **Date**: November 25, 2026, 08:30:00 IST
* **Author**: `Kepvion <priyanka06kumari0403@gmail.com>`
* **Message**: `feat: initialize Clabsy Real Estate CRM with core inventory, leads pipeline and state architecture`
* **Files Added**: 32 files (Vite configuration, styling tokens, formatting utilities, seed datasets, AppContext, navigation shell, and core CRM views).

### Commit 2 — `42d96e3`
* **Date**: November 25, 2026, 11:15:00 IST
* **Author**: `Kepvion <priyanka06kumari0403@gmail.com>`
* **Message**: `feat: implement cadastral survey master plan grid, parcel HUD and 4-step plot reservation wizard`
* **Files Added**: 5 files (`InventoryView.jsx`, `PlotCard.jsx`, `PlotDetailsModal.jsx`, `PlotMapGrid.jsx`, `BookingView.jsx`).

### Commit 3 — `d0547ac`
* **Date**: November 25, 2026, 14:45:00 IST
* **Author**: `Kepvion <priyanka06kumari0403@gmail.com>`
* **Message**: `feat(ui): complete luxury real estate developer design system overhaul and Provisional Allotment deed`
* **Files Added**: 7 files (`BookingSuccessModal.jsx`, `CustomerDetailsView.jsx`, `AddNoteModal.jsx`, `ScheduleVisitModal.jsx`, `README.md`, `vercel.json`, `firebase.json`).

---

## 5. File-by-File Codebase Directory

```
clabsy-sales/
├── public/
│   ├── favicon.svg             # Greenfield Estates 'G' monogram crest
│   ├── icons.svg               # Vector sprite sheet
│   └── _redirects              # Static SPA fallback redirect rule
├── src/
│   ├── assets/
│   │   └── hero.png            # Luxury architectural render fallback
│   ├── components/
│   │   ├── booking/            # Reservation & Allotment Engine
│   │   │   ├── BookingView.jsx            # 4-step reservation wizard & live cost sheet
│   │   │   └── BookingSuccessModal.jsx    # Parchment Provisional Allotment deed
│   │   ├── common/             # Reusable Enterprise UI Primitives
│   │   │   ├── Badge.jsx                  # Status chips (Available, Reserved, Booked)
│   │   │   ├── Modal.jsx                  # Accessible backdrop dialog
│   │   │   ├── StatCard.jsx               # Executive KPI card with serif figures
│   │   │   └── Toast.jsx                  # Animated alert notifications
│   │   ├── customers/          # Buyer 360° Management
│   │   │   ├── CustomerDetailsView.jsx    # Buyer dossier, lifecycle stepper & tabs
│   │   │   ├── AddNoteModal.jsx           # Interaction note logger
│   │   │   └── ScheduleVisitModal.jsx     # Site inspection scheduling modal
│   │   ├── dashboard/          # Executive Cockpit
│   │   │   ├── DashboardView.jsx          # Hero banner, active township cards & KPIs
│   │   │   ├── SalesChart.jsx             # Monthly revenue & collection bar chart
│   │   │   └── AgentLeaderboard.jsx       # Top relationship managers
│   │   ├── inventory/          # Cadastral Master Plan & Plots
│   │   │   ├── InventoryView.jsx          # Inventory catalogue with master plan toggle
│   │   │   ├── PlotCard.jsx               # Individual parcel card with corner PLC
│   │   │   ├── PlotDetailsModal.jsx       # Deep parcel audit modal with boundaries
│   │   │   └── PlotMapGrid.jsx            # Cadastral survey blueprint & parcel HUD
│   │   ├── layout/             # Master Application Shell
│   │   │   ├── Header.jsx                 # Glass sticky header & Reset Demo trigger
│   │   │   └── Sidebar.jsx                # Obsidian charcoal navigation with gold crest
│   │   ├── leads/              # Lead Qualification & Pipeline
│   │   │   ├── LeadsView.jsx              # Pipeline cockpit with Kanban/Table toggle
│   │   │   ├── LeadsKanbanBoard.jsx       # 5-stage interactive Kanban board
│   │   │   └── AddLeadModal.jsx           # Prospect onboarding modal
│   │   └── siteVisits/         # Logistics Management
│   │       └── SiteVisitsView.jsx         # Field visit inspection schedules & driver coordination
│   ├── context/
│   │   └── AppContext.jsx      # Global state provider and localStorage sync
│   ├── data/
│   │   └── initialData.js      # Seed datasets (plots, leads, townships, agents, visits)
│   ├── utils/
│   │   └── formatters.js       # INR currency (Lakhs/Crores), sq.ft, and date formatters
│   ├── App.jsx                 # View router and shell container
│   ├── index.css               # Design tokens, CAD grid, and luxury typography styles
│   └── main.jsx                # React root entrypoint
├── index.html                  # HTML5 shell, font preloads, viewport meta
├── package.json                # Dependencies and npm script definitions
├── vercel.json                 # Vercel SPA routing rules
└── vite.config.js              # Vite compiler configuration
```

---

## 6. Mathematical Models & Business Logic

### Pricing Formula Schedule
Clabsy uses authentic Indian real estate valuation logic:
1. **Base Land Value**:
   $$\text{Base Land Value} = \text{Area (sq.ft)} \times (\text{Rate per sq.ft} - 250)$$
2. **Infrastructure & Roads Surcharge**:
   $$\text{Infrastructure Surcharge} = \text{Area (sq.ft)} \times 250$$
3. **Preferential Location Charge (PLC)**:
   $$\text{Corner PLC} = \text{Base Land Value} \times \text{Corner Premium \% (typically } 10\%)$$
4. **Clubhouse Membership**:
   $$\text{Clubhouse Charge} = ₹1,50,000 \text{ (one-time life membership)}$$
5. **Total Agreement Consideration**:
   $$\text{Total Consideration} = \text{Base} + \text{Infrastructure} + \text{PLC} + \text{Clubhouse}$$
6. **Balance Due upon Registration**:
   $$\text{Balance Due} = \text{Total Consideration} - \text{Token Advance Received}$$

### 5-Stage Buyer Lifecycle
Every prospect transitions through defined milestone stages:
$$\text{New Inquiry} \longrightarrow \text{Qualified Lead} \longrightarrow \text{Site Visit Scheduled} \longrightarrow \text{In Negotiation} \longrightarrow \text{Booked / Allotted}$$

---

## 7. The Luxury Real Estate Developer Design System (Option 1)

Unlike generic "AI-generated" dashboard templates that rely on neon colors, arbitrary gradients, and emojis, Clabsy was designed using luxury real estate aesthetic standards inspired by **Compass**, **Pacaso**, and **Sotheby’s International Realty**:

| Design Attribute | Clabsy Implementation |
| :--- | :--- |
| **Canvas & Background** | Warm Alabaster & Bone Ivory (`#faf8f5`) with refined linen borders (`#ebe6df`) |
| **Primary Accents** | Deep Obsidian Charcoal (`#141416`) paired with Champagne Bronze (`#c5a880`) |
| **Typography** | Cormorant Garamond & Playfair Display for editorial headers; Plus Jakarta Sans for data |
| **Master Plan View** | Technical cadastral drafting grid (`#f7f4ed`) with bronze arterial road dividers |
| **Allotment Deed** | Official parchment deed indenture with corporate crest `G` and verification seal |
| **Badges & Chips** | Clean, rectangular status chips (`rounded-md`) with muted earth & forest tones |

---

## 8. Verification & Summary

* **Build Compilation**: `npm run build` completed in **1.73s** with **0 errors**.
* **Live Deployment**: Verified responding with HTTP `200 OK` at **`https://clabsy-sales.vercel.app`**.
* **Git Upstream**: Fully synchronized with **`https://github.com/Kepvion/clabsy-sales.git`** on branch `main`.
* **Author Identity**: Standardized to `Kepvion <priyanka06kumari0403@gmail.com>` across all commits.
