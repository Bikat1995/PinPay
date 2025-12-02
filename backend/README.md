# PinPay Backend

A Node.js backend for PinPay payment system using Express, Prisma, PostgreSQL, JWT, and more.

## Features

- User registration and authentication with JWT
- Wallet management with credit/debit operations
- Payment processing
- Transaction history
- Webhook handling for Telebirr and CBE Birr
- Rate limiting, CORS, Helmet security
- Swagger API documentation

## Prerequisites

- Node.js 18+
- Docker and Docker Compose

## Running with Docker

1. Clone the repository
2. Navigate to backend directory
3. Copy .env.example to .env and fill in the values
4. Run `docker-compose up --build`
5. The app will be available at http://localhost:3000
6. API docs at http://localhost:3000/api-docs

## Running Locally

1. Install dependencies: `npm install`
2. Set up PostgreSQL database
3. Copy .env.example to .env and configure
4. Run migrations: `npm run prisma:migrate`
5. Seed database: `npm run prisma:seed`
6. Start server: `npm run dev`

## API Endpoints

### User
- POST /api/users/register
- POST /api/users/login
- GET /api/users/me
- PATCH /api/users/update
- GET /api/users/:id

### Wallet
- POST /api/wallets
- GET /api/wallets/user/:userId
- GET /api/wallets/:id
- POST /api/wallets/:id/credit
- POST /api/wallets/:id/debit

### Payment
- POST /api/payments
- GET /api/payments/:id
- GET /api/payments/order/:merchantOrderId
- PATCH /api/payments/:id/status
- POST /api/payments/:id/confirm

### Transaction
- GET /api/transactions/wallet/:walletId
- GET /api/transactions/:id

### Webhook
- POST /api/webhooks/telebirr
- POST /api/webhooks/cbebirr
- GET /api/webhooks
- GET /api/webhooks/:id

## Testing

Run `npm test`