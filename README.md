# Magi's Kitchen — Cloud Kitchen Management Suite

A full-stack, responsive web application for **Magi's Kitchen Cloud Kitchen Admin**, meticulously built from the Google Stitch design system (`project_id: 5756489333283358878`).

---

## 🚀 Key Highlights & Architectural Features

1. **Portable Across Desktop & Mobile**:
   - Built with Next.js 14 (App Router), React 18, and Tailwind CSS.
   - Fully responsive design: collapsible mobile navigation drawer, fluid bento grids, and touch-optimized controls for phones, tablets, and wide desktop displays.
   - *Requirement strictly respected*: The separate 11th point screen (`Magi's Kitchen Management Suite — 390×884`) was omitted in favor of unified responsive layouts across all screens.

2. **Neon PostgreSQL Integration with Automatic Fallback**:
   - Simply paste your Neon PostgreSQL connection string in `.env` under `DATABASE_URL`.
   - **Automatic Table Migration**: Automatically creates `customers`, `menu_items`, `orders`, `order_items`, `payments`, `deliveries`, and `admin_settings` if they do not exist.
   - **Automatic Seeding**: Populates realistic mock data extracted from the Stitch screens on first initialization.
   - **Zero-Config In-Memory Fallback**: When `DATABASE_URL` is empty, the application functions seamlessly in in-memory mode, ensuring full offline functionality.

3. **Stitch Design System Faithful**:
   - Typography: **DM Sans** + **Material Symbols Outlined**.
   - Color Palette: Sage green (`#789b79`), forest dark green (`#456648`), light sage (`#e8f0e6`), mint canvas (`#f0fdef`), cards (`#ffffff`), and borders (`#e5eae3`).

---

## 📱 Page Overview

| Route | Page | Features |
|---|---|---|
| `/login` | **Login** | Split branded layout, admin auth, password show/hide toggle. |
| `/` | **Dashboard** | 4 bento metric cards, weekly/monthly SVG sales chart, recent orders table with one-click status transitions, food category cards, quick-view modal. |
| `/customers` | **Customers** | Metric cards, search filter, Add/Edit customer modal, and Delete customer confirmation. |
| `/menu` | **Menu Management** | Category pill filters (*Starters*, *Main Course*, *Desserts*), live availability toggle switch, Add/Edit item modal, image preview. |
| `/orders` | **Orders Overview** | Metrics, order status filter tabs (*All*, *Pending*, *Preparing*, *Ready*, *Completed*), live status changer, view details modal. |
| `/orders/[id]` | **Order Details** | Full invoice breakdown, items list with thumbnails and subtotal calculations, customer details card, delivery address, status selector, and **Print Invoice**. |
| `/deliveries` | **Deliveries** | Active deliveries tracker, multi-city hubs (*Chennai*, *Bengaluru*, *Hyderabad*), status filter pills, live route map preview modal, and **Print Waybill**. |
| `/payments` | **Payments** | Revenue summary, payment method badges (*UPI*, *Card*, *Cash*), status chips, Record Payment form modal, digital receipt modal, and **Export CSV**. |
| `/reports` | **Reports & Analytics** | Period selector (*This Month*, *Last 30 Days*, *Year to Date*), frequency bar chart (*Orders per Customer*), category pricing breakdown, top-performing recipes leaderboard, and kitchen efficiency gauge. |
| `/settings` | **Settings** | Admin profile, password change form, theme toggle (*Light/Dark*), branch switcher, tax rate and delivery fee parameters, notification alerts, and Neon DB status indicator. |

---

## 🛠️ How to Connect Your Neon PostgreSQL Database

1. Open the [`.env`](file:///.env) file located in the project root:
   ```env
   DATABASE_URL="postgresql://[user]:[password]@[neon-hostname]/[dbname]?sslmode=require"
   ```
2. Paste your Neon PostgreSQL connection string inside `DATABASE_URL`.
3. Save the file.
4. When the server runs, it connects to Neon with SSL enabled (`ssl: { rejectUnauthorized: false }`), automatically creates all required tables, seeds the initial Stitch records, and persists all updates directly to your cloud database!

---

## 💻 How to Run

### Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Start:
```bash
npm run build
npm run start
```

