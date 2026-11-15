# RouteShield 🛡️

RouteShield is a road hazard reporting and community verification platform.

It allows users to report road hazards, find nearby active reports, and confirm existing reports through upvotes.

## What We Built

- User registration and login
- JWT-based authentication
- Role-based access for users and moderators
- Road hazard reporting with location details
- Nearby active hazard discovery
- Community upvoting with duplicate vote prevention
- Automatic expiry of old hazard reports
- Database integration with PostgreSQL

## Tech Stack

- Node.js and Express.js
- PostgreSQL
- Prisma ORM
- JWT and bcrypt
- Zod
- node-cron

## Run Locally

```bash
npm install
npm run dev


Configure your PostgreSQL DATABASE_URL, JWT_SECRET, and PORT in a .env file before starting.

RouteShield — Report. Verify. Stay Aware.
