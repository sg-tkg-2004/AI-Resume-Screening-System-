# 🤖 AI Resume Screening System

An AI-powered full-stack web application that analyzes a candidate's resume against a job description and generates a comprehensive interview preparation report including a match score, personalized interview questions, skill gap analysis, a day-wise preparation roadmap, and an ATS-optimized resume tailored for the role.

## 🧠 What Problem Does It Solve?

Job hunting is stressful. Candidates often apply to roles without knowing how well their resume actually matches the job description, what questions they are likely to face, which skills they are missing, or how to prepare strategically before the interview. This app solves all of that in one place. Upload your resume, paste a job description, and get a personalized interview prep kit in seconds along with an ATS-friendly resume PDF you can directly use to apply.

## ✨ Features

- **Resume-to-Job Match Score** — An AI-computed compatibility score (0-100) showing how well your profile aligns with the job, displayed with a color-coded ring
- **AI-Generated Interview Questions** — Technical and behavioral questions likely to appear in the interview, with the interviewer's intention and a structured answer guide for each
- **Skill Gap Analysis** — Identifies missing skills and how critical each one is, shown as color-coded tags (High / Medium / Low)
- **Day-wise Preparation Roadmap** — A personalized study plan with daily focus areas and actionable tasks on a visual timeline
- **ATS-Optimized Resume PDF** — Generates a tailored professional resume optimized for Applicant Tracking Systems and exports it as a downloadable PDF
- **User Authentication** — Secure registration and login with JWT-based session management and bcrypt password hashing
- **Protected Routes** — Interview reports are accessible only to authenticated users
- **Persistent Interview Sessions** — Each session is stored and retrievable via a unique ID

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router v7 | Client-side routing and protected routes |
| Vite | Build tool and dev server |
| SCSS (Sass) | Component styling with variables and BEM |
| Axios | HTTP client for API calls |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database and ODM |
| Google Gemini AI (`@google/genai`) | AI report and resume generation |
| Puppeteer | Headless Chrome for HTML-to-PDF conversion |
| Multer | Resume file upload handling |
| pdf-parse | PDF text extraction |
| JSON Web Token (JWT) | Authentication tokens |
| bcryptjs | Password hashing |
| Zod + zod-to-json-schema | Structured AI output schema validation |
| dotenv | Environment variable management |
| CORS + cookie-parser | Cross-origin support and cookie handling |

## 📁 Project Structure

```
AI-resume-Screening-system/
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── Login.jsx
│   │   │   │   │   └── Register.jsx
│   │   │   │   ├── components/
│   │   │   │   │   └── Protected.jsx      # Route guard
│   │   │   │   └── auth.context.jsx       # Auth state context
│   │   │   └── interview/
│   │   │       ├── pages/
│   │   │       │   ├── Home.jsx           # Resume + JD upload form
│   │   │       │   └── Interview.jsx      # Report viewer (3-column layout)
│   │   │       └── interview.context.jsx  # Interview state context
│   │   ├── style/
│   │   │   ├── style.scss                 # Global styles
│   │   │   └── interview.scss             # Interview page styles
│   │   ├── App.jsx
│   │   ├── app.routes.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── Backend/
    ├── src/
    │   ├── config/
    │   │   └── database.js                # MongoDB connection
    │   ├── features/
    │   │   ├── auth/                      # Auth routes, controllers, models
    │   │   └── interview/                 # Interview routes, controllers, models
    │   └── app.js                         # Express app setup
    ├── ai.service.js                      # Gemini AI + Puppeteer logic
    ├── server.js                          # Entry point
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- A [Google AI Studio](https://aistudio.google.com/) API key (for Gemini)

### 1. Clone the Repository

```bash
git clone https://github.com/Sanket296/AI-resume-Screening-system.git
cd AI-resume-Screening-system
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
```

Start the backend server:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔄 How It Works

1. **Register / Login** — Create an account or sign in to access the system
2. **Upload Resume** — Upload your resume as a PDF; the backend extracts the text using `pdf-parse`
3. **Enter Details** — Add a short self-description and paste the job description you are targeting
4. **AI Analysis** — The backend sends everything to Google Gemini with a strict Zod schema and gets back a structured JSON report
5. **View Report** — The 3-column dashboard shows left sidebar navigation, interview questions or roadmap in the center, and the match score ring with skill gap tags on the right
6. **Download Resume PDF** — Gemini generates an ATS-optimized HTML resume which Puppeteer converts to a downloadable PDF

## 📸 UI Overview

The interview report page has a dark-themed 3-column layout. The left nav lets you jump between Technical Questions, Behavioral Questions, and the Preparation Roadmap. The center panel shows expandable question cards with the question, interviewer's intention, and how to answer it, or a day-by-day vertical timeline for the prep plan. The right sidebar shows a circular match score ring color-coded by score and skill gap pills tagged by severity.

## 🔐 Authentication Flow

Passwords are hashed with bcryptjs before storage. On login a JWT is issued and stored as an HTTP-only cookie. All interview routes are wrapped in a Protected component that redirects unauthenticated users to the login page.

## 🤖 AI Service Details

The `ai.service.js` module exposes two core functions:

### `generateInterviewReport({ resume, selfDescription, jobDescription })`
Sends data to Gemini and returns a validated JSON object containing:
- `matchScore` — 0-100 compatibility score
- `technicalQuestions` — array of `{ question, intention, answer }`
- `behavioralQuestions` — array of `{ question, intention, answer }`
- `skillGaps` — array of `{ skill, severity: "low" | "medium" | "high" }`
- `preparationPlan` — array of `{ day, focus, tasks[] }`
- `title` — job title

### `generateResumePdf({ resume, selfDescription, jobDescription })`
Generates an ATS-friendly resume as HTML via Gemini, then converts it to a PDF buffer using Puppeteer.

## 📦 Dependencies

### Backend
```json
{
  "@google/genai": "^1.42.0",
  "bcryptjs": "^3.0.3",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.6",
  "dotenv": "^17.3.1",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.2.1",
  "multer": "^2.0.2",
  "pdf-parse": "^2.4.5",
  "puppeteer": "^24.37.5",
  "zod": "^3.25.76",
  "zod-to-json-schema": "^3.25.1"
}
```

### Frontend
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router": "^7.13.0",
  "axios": "^1.13.5",
  "sass": "^1.97.3"
}
```

## 🌱 Future Improvements

- [ ] Support for `.docx` resume uploads
- [ ] Email notifications when a report is ready
- [ ] Save and compare multiple interview reports
- [ ] Admin dashboard for bulk resume screening
- [ ] Interview question difficulty filter
- [ ] Share report via a public link

## 🤝 Contributing

Contributions are welcome. Fork the repository, create a new branch, make your changes, and open a Pull Request.

## 👤 Author

**Sanket** — [@Sanket296](https://github.com/Sanket296)
