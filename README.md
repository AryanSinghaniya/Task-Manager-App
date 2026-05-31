# TaskFlow — Task Manager App

## Overview
TaskFlow is a production-ready MERN task manager with secure authentication, optimistic task operations, and a responsive Kanban dashboard.
It is designed for fast task capture, clear stage tracking, and a polished mobile-friendly workflow.

## Live Demo
- Frontend: [your-vercel-link](your-vercel-link)
- Backend: [your-render-link](your-render-link)

## Tech Stack
| Frontend | Backend | Database | Auth | Deployment |
| --- | --- | --- | --- | --- |
| React, Vite, React Router, Axios | Node.js, Express, Mongoose | MongoDB | JWT | Vercel, Render |

## Features
- Secure register, login, and session restore flow.
- Protected dashboard with sticky navigation and responsive Kanban columns.
- Create, edit, move, delete, and undo tasks with optimistic updates.
- Toasts, inline validation, empty states, and accessibility-focused UI.
- Mobile-first layout that adapts cleanly across common breakpoints.

## Local Setup
### Prerequisites
- Node.js 18 or later.
- npm.
- A MongoDB connection string.

### Installation
Install dependencies for both applications:

```bash
cd server
npm install
```

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
| Variable | Example | Description |
| --- | --- | --- |
| PORT | 5000 | Server port |
| MONGO_URI | your_mongodb_connection_string | MongoDB connection string |
| JWT_SECRET | your_super_secret_key | JWT signing secret |
| CLIENT_URL | http://localhost:5173 | Allowed frontend origin |

### Client
| Variable | Example | Description |
| --- | --- | --- |
| VITE_API_URL | http://localhost:5000 | Backend API base URL |

## Project Structure
```text
ROOT/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── SkeletonCard.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── tasks/
│   │   │       ├── TaskCard.jsx
│   │   │       ├── TaskColumn.jsx
│   │   │       ├── TaskForm.jsx
│   │   │       └── KanbanBoard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── TaskContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useTasks.js
│   │   │   └── useToast.js
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   └── vite.config.js
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   └── server.js
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints
| Method | Endpoint | Auth Required | Description |
| --- | --- | --- | --- |
| POST | /api/auth/register | No | Register a new user |
| POST | /api/auth/login | No | Log in a user |
| GET | /api/auth/me | Yes | Return the authenticated user |
| GET | /api/tasks | Yes | Fetch the current user's tasks |
| POST | /api/tasks | Yes | Create a task |
| PATCH | /api/tasks/:id | Yes | Update an owned task |
| DELETE | /api/tasks/:id | Yes | Delete an owned task |

## Assumptions & Tradeoffs
- JWTs are stored in `localStorage` to keep the scaffold simple and easy to deploy.
- Delete undo is handled client-side as an optimistic restore instead of a soft-delete API.
- Toasts and empty-state UI are kept on the frontend to avoid extra backend endpoints.
- CORS is controlled through `CLIENT_URL` so Render and Vercel can be updated independently.
- The board focuses on responsiveness and clarity over advanced collaboration features.

## AI Tools Used
- GitHub Copilot was used for code generation and scaffolding.
- Per assignment requirements, backend implementation is included.

## Deployment Checklist
### Server (Render)
- Build command: `npm install`
- Start command: `node server.js`
- Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `PORT`.

### Client (Vercel)
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to your Render backend URL.

### After Deploy
- Update `CLIENT_URL` in Render to your Vercel URL to fix CORS.
- Update `VITE_API_URL` in Vercel to your Render URL.
- Redeploy both apps after any environment variable change.
