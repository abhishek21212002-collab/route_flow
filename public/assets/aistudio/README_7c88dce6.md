# RouteFlow Transport Marketplace Prototype

A front-end-only interactive prototype for a transport marketplace with role-specific interfaces.

## Features
- Switch between Party, First Transporter, Second Transporter, Truck Owner, and Admin demo roles.
- Search sample loads and inspect route/cargo details.
- Party freight calculator with dimensions, weight, distance, delivery target, costs, and margin.
- Create a sample order from the Party role.
- Submit demo bids as transporter roles.
- Admin-only private company estimate and winner selection.
- Party bid privacy until a winning bid is selected.
- Local in-memory demo state; refresh resets changes.

## Run locally
Requirements: Node.js 20+ recommended.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Build
```bash
npm run build
npm run preview
```

## Important limitations
This is a UI prototype only. It has no real authentication, database, persistent storage, route API, live bidding deadline enforcement, payments, notifications, or production-grade authorization. Do not use real customer, transporter, or financial data. The freight calculator uses an illustrative formula, not a market quote. Production use requires a secured backend, server-side role permissions, PostgreSQL, audit logs, transactional bid/assignment handling, and accounting integration.
