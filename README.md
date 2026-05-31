# TaskFlow — Task Manager App

## Project Overview
TaskFlow is a production-ready MERN task manager built with secure authentication, task CRUD, Kanban-style workflow management, and a responsive dashboard. The app is designed for fast task capture, clear stage tracking, and a polished mobile-friendly experience.

## Features
- Secure user registration, login, and session restore flow.
- Protected dashboard with Kanban columns and drag-and-drop task movement.
- Create, edit, move, delete, and restore tasks with optimistic UI updates.
- Due date support, overdue indicators, toast notifications, and inline validation.
- Responsive layout that works across desktop and mobile breakpoints.
- Dark-mode friendly UI with reusable components and consistent design tokens.

## Tech Stack
| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Axios |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| Authentication | JWT, bcryptjs |
| UI / UX | Custom CSS, toast notifications, drag-and-drop |
| Deployment | Vercel, Render |

## Installation & Setup
### Prerequisites
- Node.js 18 or later
- npm
- MongoDB Atlas account or another MongoDB connection string

### Local installation
Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

Run the backend:

```bash
cd server
npm run dev
```

Run the frontend in a second terminal:

```bash
cd client
npm run dev
```

## Environment Variables
### Server
| Variable | Example | Purpose |
| --- | --- | --- |
| PORT | 5000 | Backend port |
| MONGO_URI | mongodb+srv://... | MongoDB connection string |
| JWT_SECRET | a_long_random_secret | Token signing secret |
| CLIENT_URL | https://your-frontend.vercel.app | Allowed frontend origin for CORS |

### Client
| Variable | Example | Purpose |
| --- | --- | --- |
| VITE_API_URL | https://task-manager-app-8m7m.onrender.com | Backend API base URL |

## Frontend Deployment Link
- [TaskFlow Frontend on Vercel](https://task-manager-app-seven-hazel.vercel.app)

## Backend Deployment Link
- [TaskFlow Backend on Render](https://task-manager-app-8m7m.onrender.com)

## API Endpoints
| Method | Endpoint | Auth Required | Description |
| --- | --- | --- | --- |
| POST | /api/auth/register | No | Register a new user |
| POST | /api/auth/login | No | Log in a user |
| GET | /api/auth/me | Yes | Return the authenticated user |
| GET | /api/tasks | Yes | Fetch the current user's tasks |
| POST | /api/tasks | Yes | Create a task |
| PATCH | /api/tasks/:id | Yes | Update an existing task |
| DELETE | /api/tasks/:id | Yes | Delete an existing task |

## Authentication Flow
1. The user registers or logs in from the frontend.
2. The client sends the request through the shared Axios instance in `client/src/api/axios.js`.
3. The backend validates the payload, checks the database, and returns a JWT.
4. The frontend stores the token in `localStorage` and restores the session on refresh.
5. Protected routes call `/api/auth/me` to refresh the current user state.

## Project Structure
```text
ROOT/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   ├── .env.example
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── package.json
└── README.md
```

## Assumptions
- Authentication uses JWTs stored in `localStorage` to keep the deployment simple and compatible with Vercel and Render.
- MongoDB Atlas is used as the production database, so deployment depends on a valid `MONGO_URI` and allowed network access.
- The frontend and backend are deployed separately, so CORS and API base URLs must be configured through environment variables.
- Task undo behavior is handled on the client side to keep the API small and the UI responsive.

## Technical Decisions
- A shared Axios instance is used for all requests so authentication headers and base URL behavior stay consistent.
- The backend exposes a small REST API with route-level separation for auth and task operations.
- Environment variables are used for both API configuration and CORS so the same codebase works locally and in production.
- The UI uses reusable components and context providers to keep the app maintainable as features grow.

## Tradeoffs
- Storing JWTs in `localStorage` is easy to deploy, but it is less resistant to XSS than HTTP-only cookies.
- The app prioritizes a polished single-user task workflow over real-time collaboration or team sharing.
- Undo is optimistic on the frontend rather than being backed by a dedicated soft-delete system.
- The backend keeps validation practical and lightweight instead of introducing a larger schema or workflow engine.

## Future Improvements
- Add task search, sorting, and filtering by due date or priority.
- Add recurring tasks and richer analytics.
- Move authentication to HTTP-only cookies for stronger token protection.
- Add team collaboration, sharing, and comments.
- Add automated tests for auth, task CRUD, and deployment checks.

## Screenshots
Add screenshots of the login, register, dashboard, and analytics views here for submission.

Suggested filenames:
- `docs/screenshots/login.png`
- `docs/screenshots/register.png`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/analytics.png`

## Author Information
- Name: Aryan Singhaniya
- Email: aryansinghaniya2004@gmail.com
- GitHub: https://github.com/AryanSinghaniya

## Deployment Checklist
### Server (Render)
- Build command: `npm install`
- Start command: `node server.js`
- Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `PORT`.

### Client (Vercel)
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to `https://task-manager-app-8m7m.onrender.com`

### After Deploy
- Update `CLIENT_URL` in Render to the actual Vercel domain.
- Update `VITE_API_URL` in Vercel to the Render backend URL.
- Redeploy both apps after any environment variable change.
