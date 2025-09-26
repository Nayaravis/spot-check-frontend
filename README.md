# Spot Check — Frontend (React + Vite)

This is the React frontend for Spot Check. It is built with Vite, React 19, and Tailwind CSS.

## Prerequisites
- Node.js 18+ and npm

## Install & Run
```bash
npm install
npm run dev
```
Vite will print a local URL such as `http://127.0.0.1:5173`.

## Scripts
- `npm run dev` — Start the Vite dev server
- `npm run build` — Production build
- `npm run preview` — Preview the production build
- `npm run lint` — Lint the project

## Environment Variables
Create a `.env` file in this directory to configure the backend base URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```
The frontend uses this URL to call the Flask backend.

## Routing
Client-side routes are defined in `client_code/src/App.jsx`:
- `/` — Home page
- `/places/:id` — Place details
- `/favorites` — User favorites
- `/login` — Login
- `/register` — Registration

## API Usage
See backend README for full details. Common endpoints:
- `POST /login` → returns `{ user, token }`
- `POST /users` → returns `{ user, token }`
- `GET /places?latitude=<lat>&longitude=<lng>`
- Authenticated requests include `Authorization: Bearer <token>` header.

## Styling
Tailwind CSS v4 is configured via the `@tailwindcss/vite` plugin. No separate CLI step is necessary; styles are processed automatically by Vite.

## Project Structure
- `client_code/src/` — App source
  - `components/` — UI components such as `HomePage`, `PlaceDetails`, `Navbar`, `Login`, `Register`, `Favorites`
  - `App.jsx` — Routes and shell layout

For backend setup and API documentation, refer to the root `README.md`.