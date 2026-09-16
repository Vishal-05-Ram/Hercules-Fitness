# Hercules Fitness

A starter gym membership management web app.

## Included in V1

- Dashboard
- Member search
- Add member
- Membership plans
- Admission date
- Fee due date
- Member profile
- Delete member
- Supabase database schema for members and payments
- Responsive mobile layout

## Run locally

1. Install Node.js 20+.
2. Open this folder in a terminal.
3. Run:

```bash
npm install
npm run dev
```

4. Open http://localhost:3000

The current UI uses sample data so it can be tested immediately. The `supabase/schema.sql` file prepares the database for the next step, where the UI can be connected to real persistent data.

## Environment

Copy `.env.example` to `.env.local` and add your Supabase project values when database integration is enabled.