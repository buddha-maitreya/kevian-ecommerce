# Kevian Kenya E-Commerce

## Project Overview
Full-stack e-commerce website for Kevian Kenya Ltd — a Kenyan beverage manufacturer ("Pure African Delights"). Users sign up as wholesale or retail customers and shop for products with role-based pricing.

## Tech Stack
- **Backend:** TypeScript, Express 5, Drizzle ORM, PostgreSQL
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router
- **Auth:** JWT (bcrypt for password hashing)
- **Deployment target:** Railway.com

## Project Structure
```
kevian/
├── client/          # React frontend (Vite)
├── server/          # Express API server
│   ├── src/
│   │   ├── db/      # Drizzle schema & connection
│   │   ├── routes/  # Express route handlers
│   │   ├── middleware/ # Auth middleware
│   │   └── index.ts # Entry point
│   └── drizzle/     # Generated migrations
└── package.json     # Root workspace scripts
```

## Key Commands
- `npm run dev` — Start both client and server in dev mode
- `npm run dev:server` — Server only
- `npm run dev:client` — Client only
- `npm run db:generate` — Generate Drizzle migrations
- `npm run db:migrate` — Run migrations

## Business Context
- **Company:** Kevian Kenya Ltd
- **Brands:** AFIA, Pick N Peel, Acacia Kids, Mt Kenyan Water, Kevian Sauces
- **Tagline:** "Pure African Delights"
- **Brand colors:** Primary dark `#353535`, accent orange `#dd8c00`
- **Sales model:** Both wholesale and retail

## Wholesale vs Retail
- Users choose role at registration (retail or wholesale)
- Products have `retail_price` and `wholesale_price`
- Wholesale users must meet `wholesale_min_qty` per product
- Guests see retail pricing

## Chatbot Integration
This site is designed to be sold as a package with the Ruskins Conversational AI chatbot platform (`C:\Users\Admin\Documents\ruskins-chatbot-platform.v1.0`). All product API endpoints support server-side filtering (`?q=`, `?brand=`, `?category=`) so the chatbot LLM can query products efficiently. The widget is embedded via script tag in the frontend layout.

## Environment Variables (server/.env)
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret for signing JWTs
- `PORT` — Server port (default 3001)
- `CLIENT_URL` — Frontend URL for CORS (default http://localhost:5173)
