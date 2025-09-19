# Social Media Post Management

A small recommendation demo that uses a Node/Express backend with MongoDB and a React frontend (Create React App). The backend serves simple user and post endpoints and implements a lightweight recommendation endpoint that prioritizes posts matching user interests and then popular posts.

## Repo layout

- `backend/` - Express server connecting to MongoDB. Key files:
  - `server.js` - main server and API routes
  - `package.json` - backend dependencies

- `frontend/` - Create React App frontend. Key files:
  - `package.json` - frontend scripts and deps
  - `build/` - production build output (already present)
  - `src/` - React source (pages: `home.js`, `feed.js`, `login.js`)

---

## Requirements

- Node.js (16+ recommended)
- npm or yarn
- MongoDB running locally (default URI used: `mongodb://localhost:27017`)

## Backend

The backend is a minimal Express app. It expects a running MongoDB instance on `mongodb://localhost:27017` and uses a database named `recommend` with two collections: `users` and `posts`.

Main endpoints (defined in `backend/server.js`):

- POST /login
  - Body: { username, password }
  - Response: { status: "success", userId } or { status: "failed" }

- POST /addPost
  - Body: { userId, content, tags }
  - Adds a post for the user. Returns { status: "success", postId }

- POST /deletePost
  - Body: { userId, postId }
  - Deletes a post if it belongs to the user.

- GET /feed
  - Returns all posts

- POST /like
  - Body: { userId, postId }
  - Toggles like/unlike. If liked, post.tags (if any) are added to the user's `interests` array.

- POST /recommend
  - Body: { userId }
  - Returns posts prioritized by user's interests (matching tags) sorted by like count, followed by other popular posts.

The server listens on port 5000 by default.

Start the backend:

```powershell
cd backend
npm install
node server.js
```

(You can also use a process manager like `nodemon` during development.)

## Frontend

The frontend is a Create React App project. Scripts are standard:

- `npm start` - start dev server
- `npm run build` - produce production build into `frontend/build`

Start the frontend (development):

```powershell
cd frontend
npm install
npm start
```

If you want to serve the existing production build locally (the `build/` folder is already included):

- Option A: Serve with a static server (e.g., `serve` package)

```powershell
npm install -g serve
serve -s frontend/build -l 3000
```

- Option B: Copy `frontend/build` into a hosting/static server.

The frontend expects the backend API to be available (default backend URL: `http://localhost:5000`). If the app uses a different host/port, update the client-side configuration or reverse-proxy accordingly.

## Data notes

- The backend uses a `users` collection. Users should have `_id`, `username`, `password`, and optionally `interests` (array of tags).
- The `posts` collection stores posts with fields: `userId`, `user` (username), `content`, `tags` (array), `likes` (array of userIds).

## Development tips

- Run MongoDB locally (e.g., `mongod` or using a Docker container):

```powershell
# with Docker (Linux/Windows w/ Docker Desktop)
docker run --name mongodb -p 27017:27017 -d mongo:6.0
```

- Seed the database with a few users and posts to test login, liking, and recommendations.

## Known limitations

- No authentication/session management — the demo uses plain username/password checks and returns the user _id to represent an authenticated user.
- Passwords are stored in plaintext in this example (unsafe for production). Use hashing, HTTPS, and proper auth for real apps.
- No rate limiting, input validation, or robust error handling — suitable for demo and learning only.

## Next steps / improvements

- Add proper auth (JWT or sessions), password hashing
- Add input validation and error handling
- Add unit/integration tests
- Add environment-based configuration (use .env for MongoDB URI, ports)
- Add CORS restrictions and production-ready security hardening

---
