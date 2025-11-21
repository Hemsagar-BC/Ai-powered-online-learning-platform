# AI-Powered Learning Platform — Starter

This repository contains a scaffolded Vite + React + Tailwind starter implementing the UI and core pages for the "AI-Powered Learning Platform" product spec.

What I added:
- Vite + React project files (`package.json`, `vite.config.js`)
- Tailwind CSS configuration and PostCSS
- Core pages: `Dashboard`, `CourseOverview`, `ChapterDetail`, `Profile`
- Components: `Sidebar`, `Navbar`, `CreateCourseModal`, `StudyBuddy`, `QuizModal`
- Tailwind-based design system tokens in `tailwind.config.cjs`

Notes:
- Firebase, Gemini AI API, and Firestore integrations are intentionally stubbed and left as placeholders. Do not store secrets in source.
- The UI implements the requested layout, components and flows as interactive stubs so you can integrate backend logic next.

Run locally:
1. Install dependencies:

```powershell
cd "c:/Users/n/DevRepos/Code-flux-"
npm install
```

2. Start dev server:

```powershell
npm run dev
```

Next steps I can take for you:
- Add Firebase auth (Google OAuth) and Firestore integration with environment variable support
- Implement Gemini API helpers to generate course content and quizzes
- Persist chats, quizzes, and gamification metrics in Firestore
- Add unit tests and a CI workflow

Tell me which integration you'd like next and I'll continue.

Firebase setup (quick):

1. Create a Firebase project in the Firebase Console and enable Google sign-in under Authentication > Sign-in method.
2. Create a Web app in Firebase and copy the config values.
3. Create a `.env` file in the repo root with the variables shown in `.env.example`.
4. Restart the dev server. The app uses `src/lib/firebase.js` which reads config from `import.meta.env.VITE_FIREBASE_*`.

Important: The repo includes a simple `Login` screen and an `AuthProvider` context that watches Firebase auth state. The login flow uses `signInWithPopup` and will redirect to the dashboard on success.

Gemini / AI generation setup (recommended):

- Do NOT call Gemini or other LLMs directly from the browser. The client-side
	helpers in `src/lib/gemini.js` are stubs for UI demonstration only.

Run the frontend locally:

```powershell
cd "c:/Users/n/DevRepos/Code-flux-"
npm install
npm run dev
```

Open http://localhost:5173 to view the app. The Create Course flow uses a local
stubbed generator so you can try the UI without any backend credentials.

