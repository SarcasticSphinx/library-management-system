# RUET Library Management System (LMS)
**Course:** CSE 3206 – Software Engineering Sessional  
**Lab 2 Milestone:** Software Process Models, Requirement Analysis & MVP Development  
**Department of Computer Science & Engineering, RUET**

---

## 📖 Project Overview
The **RUET Library Management System** is a modern, modular web application designed to streamline library cataloging, book issuance, return processing, and member activity tracking. Developed as a Minimum Viable Product (MVP) for CSE 3206.

---

## 👥 Team & Work Distribution

| Member | Assigned Module | Feature Branch | Scope & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Member 1** | Auth, Member Directory & Dashboard Shell | `feature/auth-and-members` | Authentication (Sign in/up), role protection (`ADMIN`/`MEMBER`), member list, and dashboard navigation layout. |
| **Member 2** | Book Catalog & Inventory CRUD | `feature/book-catalog` | Book listings, category filters, real-time search, and book CRUD (Add/Edit/Delete). |
| **Member 3** | Circulation Engine (Borrow & Return) | `feature/borrow-return-system` | Book checkout/issuance, return processing, due date calculations, and borrowing logs. |

For detailed breakdown and git guidelines, see [`docs/WORK_DISTRIBUTION.md`](./docs/WORK_DISTRIBUTION.md).

---

## 🛠 Tech Stack
* **Frontend & Backend:** [Next.js (App Router)](https://nextjs.org/) with TypeScript
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
* **Database:** [Neon Serverless PostgreSQL](https://neon.tech/)
* **ORM:** [Prisma ORM](https://www.prisma.io/)
* **Security:** `bcryptjs` for credential encryption

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js (v18 or higher)
* npm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/Library-Management-System.git
cd Library-Management-System

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file from the example:
```bash
cp .env.example .env
```
Update `.env` with your Neon PostgreSQL connection string:
```env
DATABASE_URL="postgresql://neondb_owner:...@ep-...-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 4. Database Setup & Seed
```bash
# Push Prisma schema to Neon
npx prisma db push

# Seed sample books and demo users
npx prisma db seed
```

### 5. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure
```text
.
├── docs/                     # Lab manual, work distribution, and reports
│   ├── lab-manual.md
│   └── WORK_DISTRIBUTION.md
├── prisma/                   # Database schema and seed scripts
│   ├── schema.prisma
│   └── seed.ts
├── public/                   # Static assets
└── src/
    ├── actions/              # Next.js Server Actions (CRUD & Transactions)
    ├── app/                  # App Router pages and layouts
    ├── components/           # Reusable UI components
    └── lib/                  # Shared utilities and Prisma client
```
