
# Interview Portal Backend

Express + MongoDB backend for a unique frontend interview challenge.

## 🚀 Frontend Connection Instructions

### If you have a deployed frontend, update these configurations:

1. **Update CORS_ORIGIN in `.env`:**
   ```
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

2. **For multiple frontend URLs (development + production):**
   ```
   CORS_ORIGIN=https://your-frontend-domain.com,http://localhost:5173
   ```

3. **Your backend API base URL for frontend:**
   - **Local development:** `http://localhost:5000`
   - **If deployed:** `https://your-backend-domain.com`

### Frontend should make requests to these endpoints:
- **Base URL:** `http://localhost:5000/api` (or your deployed backend URL)
- **Health Check:** `GET /health`
- **Authentication:** `POST /api/auth/login`, `POST /api/auth/register`
- **Interviews:** `GET /api/interviews`, `POST /api/interviews`, etc.

## API Endpoints (9 total)
1. `POST /api/auth/register` — Register (candidate/hr/admin)
2. `POST /api/auth/login` — Login (returns JWT)
3. `POST /api/interviews` — Create interview (hr/admin)
4. `GET /api/interviews` — List all interviews
5. `GET /api/my-interviews` — Candidate's booked interviews
6. `POST /api/interviews/:id/book` — Book an interview (candidate)
7. `POST /api/interviews/:id/answers` — Submit answers (candidate)
8. `POST /api/interviews/:id/feedback` — HR/Admin feedback + rating
9. `GET /api/leaderboard` — Aggregated candidate scores

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Environment Setup:**
   - Your `.env` file is already configured
   - Update `CORS_ORIGIN` if needed for your frontend domain

3. **Run the server:**
```bash
npm run dev   # Development with nodemon
# or
npm start     # Production mode
```

4. **Verify server is running:**
   - Health check: `GET http://localhost:5000/health`
   - Server will run on port 5000 (or your specified PORT)

## Roles
- `candidate` — book interview, submit answers, view my interviews.
- `hr` or `admin` — create interview slots, add feedback, view everything.

## Notes
- JWT required for all non-auth routes via `Authorization: Bearer <token>` header.
- Basic validations via `express-validator`.
- CORS allowed via `CORS_ORIGIN` env.

## Example cURL

```bash
# Register HR
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \  -d '{ "name": "HR", "email": "hr@example.com", "password": "secret123", "role": "hr" }'

# Login
curl -X POST http://localhost:5000/api/auth/login \  -H "Content-Type: application/json" \  -d '{ "email": "hr@example.com", "password": "secret123" }'

# Create interview (use token)
curl -X POST http://localhost:5000/api/interviews \  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \  -d '{ "title": "Frontend Dev Interview", "date": "2025-08-25T11:00:00.000Z" }'
```

## Folder Structure
```
interview-portal-backend/
  server.js
  src/
    config/db.js
    controllers/
    middleware/
    models/
    routes/
  package.json
  README.md
  .env.example
```
