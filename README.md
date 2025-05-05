
# CalCountAI

CalCountAI is an AI calorie tracking application designed to help users log meals, track activities, set goals, join communities and receive real-time insights through an integrated AI chatbot.

## Features

- Meal & Activity Logging – Log meals and activities seamlessly, with calorie calculations powered by external APIs.

- AI-Powered Chatbot – Provides real-time support, personalized meal recommendations, and progress analysis using Google Gemini 2.0 Flash.

- Goal Setting & Progress Tracking – Users can define weight loss goals and monitor progress through interactive dashboards.

- Community Engagement – Join groups, share progress, and get motivation from others.

- Secure Authentication – JWT-based authentication for secure access.

- Challenges - Join, share, leave challenges to create healthier habits.

- Cross-Platform Compatibility – Built with React Native (Expo) for a seamless experience on iOS, Android, and mobile web.
## Tech Stack

**Frontend:** React Native (Expo), NativeWind

**Backend:** Node.js, Express.js, MongoDB, TypeScript

**Chabot:** Python, Flask 
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_URL`

`TOKEN_SECRET_KEY`

`TOKEN_EXPIRE_TIME`

`CLIENT_URL`

`PORT`

`GEMINI_API_KEY`

## Run Locally

1. Clone the project

```bash
  git clone https://link-to-project
```

2. Go to the project directory

```bash
  cd calcountai
```

3. Install dependencies

Frontend (Expo App):

```bash
  cd frontend
  npm install
  npx expo start
```

Backend (Node.js Server)

```bash
  cd backend
  npm install
  npm run dev
```

Chatbot (Flask)

```bash
  cd chatbot
  pip install -r requirements.txt
  gunicorn app:app
```