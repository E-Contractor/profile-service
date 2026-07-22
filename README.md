# Profile Service

Holds the profiles that sit on top of an account: clients on one side,
contractors on the other. For contractors that means trades, specialties,
portfolio images, and a completion score that nudges them to fill in the rest.

- Port: 3002
- Routes: `/api/profiles/*`

## Running

```bash
npm install
npm run dev     # live reload
npm run build   # compile to dist/
```

## Environment (`.env`)

```
PORT=3002
MONGO_URI=<mongodb connection string>
FRONTEND_URL=http://localhost:5173
API_GATEWAY_URL=http://localhost:3000
JWT_ACCESS_SECRET=<shared with all services>
SERVICE_AUTH_SECRET=<shared with all services>
```

## Folder layout

```
src/
  config/       db connection
  controllers/  route handlers
  middleware/   auth, error handler
  models/       Client and Contractor schemas
  routes/       Express routers
  service/      profile logic and contractor matching
  index.ts      entry point
```
