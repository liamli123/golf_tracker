# Golf Tracker

An AI-powered golf tracking application that helps you log and analyze your golf rounds using natural language input.

## Features

- Natural language input via chatbox
- AI-powered data extraction using DeepSeek API
- Automatic extraction of: date, time, course, green fee, caddy fee, wagers, and score
- Comprehensive statistics and analytics
- Interactive charts showing score trends and monthly data
- Firebase Firestore database for persistent storage
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: React + Vite
- **Database**: Firebase Firestore
- **AI**: DeepSeek API
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/liamli123/golf_tracker.git
cd golf_tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Firestore Database
4. Copy your Firebase configuration

### 4. Set up DeepSeek API

1. Go to [DeepSeek Platform](https://platform.deepseek.com)
2. Sign up and get your API key

### 5. Configure environment variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Firebase and DeepSeek credentials in `.env.local`

### 6. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. Type a natural language description of your golf round in the chatbox
   - Example: "Played at Pebble Beach today, paid $400 green fee, $50 caddy tip, shot 85, won $200"

2. The AI will extract the data and show you a confirmation form

3. Review and edit the extracted data if needed

4. Click "Confirm & Save" to save the round to the database

5. View your statistics and round history below

## Deployment to Vercel

1. Push your code to GitHub

2. Import your repository in Vercel

3. Add environment variables in Vercel dashboard:
   - All variables from `.env.local`

4. Deploy!

## License

MIT
