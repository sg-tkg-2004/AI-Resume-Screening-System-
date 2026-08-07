# AI-Resume-Screening-System-
AI-powered interview preparation platform. Upload your resume, add a job description and a short self-description, and get a personalized interview report — a match score, likely technical and behavioral questions with model answers, skill gaps, and a day-by-day preparation plan. You can also generate a tailored, ATS-friendly resume PDF for the role.

Built with a React + Vite frontend and a Node.js/Express backend powered by Google's Gemini API.

## Features

- **JWT-based authentication** — register, login, logout, and session persistence via HTTP-only cookies with a server-side token blacklist for logout invalidation
- **Resume upload & parsing** — upload a PDF resume (up to 3MB) which is parsed to plain text on the server
- **AI-generated interview report** — combines your resume, self-description, and the target job description to produce:
  - A candidate/job match score (0–100)
  - Technical questions with interviewer intent and model answers
  - Behavioral questions with interviewer intent and model answers
  - Identified skill gaps with severity ratings
  - A day-wise interview preparation plan
- **Report history** — view all previously generated interview reports for the logged-in user
- **AI-tailored resume PDF** — generates a role-specific, ATS-friendly resume as HTML and converts it to a downloadable PDF via Puppeteer

## Tech Stack

### Frontend
- React 19 + Vite 7
- React Router 7
- Axios
- Sass

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- Google Gemini API (`@google/genai`) with Zod schemas for structured JSON output
- Puppeteer (HTML → PDF generation)
- JWT (`jsonwebtoken`) + `bcryptjs` for authentication
- Multer (in-memory file uploads) + `pdf-parse` (resume text extraction)

## Project Structure

```
interview-ai-yt-main/
├── Backend/
│   ├── server.js                  # Entry point, connects DB and starts server
│   └── src/
│       ├── app.js                 # Express app setup & route mounting
│       ├── config/
│       │   └── database.js        # MongoDB connection
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── interview.controller.js
│       ├── middlewares/
│       │   ├── auth.middleware.js # JWT verification + blacklist check
│       │   └── file.middleware.js # Multer config for resume uploads
│       ├── models/
│       │   ├── user.model.js
│       │   ├── blacklist.model.js
│       │   └── interviewReport.model.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── interview.routes.js
│       └── services/
│           └── ai.service.js       # Gemini prompts, schemas, PDF generation
│
└── Frontend/
    └── src/
        ├── App.jsx
        ├── app.routes.jsx
        └── features/
            ├── auth/
            │   ├── auth.context.jsx
            │   ├── components/     # e.g. Protected route wrapper
            │   ├── hooks/useAuth.js
            │   ├── pages/           # Login, Register
            │   └── services/auth.api.js
            └── interview/
                ├── interview.context.jsx
                ├── hooks/useInterview.js
                ├── pages/           # Home, Interview
                └── services/interview.api.js
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB instance (local or Atlas)
- A Google Gemini API key

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/` with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

Run the backend (defaults to port `3000`):

```bash
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` by default and is pre-configured (CORS + Axios `baseURL`) to talk to the backend at `http://localhost:3000`.

## API Overview

### Auth (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Log in with email & password | Public |
| GET | `/logout` | Clear session, blacklist token | Public |
| GET | `/get-me` | Get current logged-in user | Private |

### Interview (`/api/interview`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/` | Generate a new interview report (multipart: `resume` file + `selfDescription`, `jobDescription`) | Private |
| GET | `/` | Get all interview reports for the logged-in user | Private |
| GET | `/report/:interviewId` | Get a specific interview report | Private |
| POST | `/resume/pdf/:interviewReportId` | Generate & download a tailored resume PDF | Private |

Authentication is handled via an HTTP-only `token` cookie, validated by the `authUser` middleware on every private route.

## How It Works

1. The user registers/logs in; the backend issues a JWT stored as an HTTP-only cookie.
2. On the interview form, the user submits a resume PDF, a self-description, and a job description.
3. The backend extracts text from the PDF (`pdf-parse`) and sends the resume, self-description, and job description to Gemini with a strict Zod-derived JSON schema.
4. Gemini returns a structured interview report (match score, questions, skill gaps, preparation plan), which is saved to MongoDB and returned to the client.
5. From a saved report, the user can request a tailored resume PDF: Gemini generates resume HTML tailored to the job description, which Puppeteer renders to a PDF for download.

## License

ISC
