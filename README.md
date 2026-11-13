# Scrollz - Music/Karaoke Platform

A full-stack music/karaoke platform where users can scroll through a feed of songs and sing along with synchronized lyrics.

## 🎵 Features

- **Song Feed**: Browse through a vertical scrollable feed of songs with album art
- **Karaoke Player**: Play songs with synchronized lyrics that highlight in real-time
- **Auto-Scroll Lyrics**: Lyrics automatically scroll to keep the current line in view
- **Upload Songs**: Admin interface to add new songs with lyrics in LRC or JSON format
- **Dark Mode Theme**: Beautiful dark aesthetic with deep purples, blacks, and neon accents

## 🛠️ Tech Stack

### Frontend
- React 19 with TypeScript
- Vite (build tool)
- React Router (routing)
- CSS Modules (styling - **NO Tailwind**)

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- CORS enabled

## 📁 Project Structure

```
Scrollz/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── SongFeed/
│   │   │   ├── SongCard/
│   │   │   ├── PlayerView/
│   │   │   └── UploadForm/
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── Song.ts
│   │   ├── App.tsx
│   │   └── index.css
│   └── package.json
│
└── server/           # Express backend
    ├── models/
    │   └── Song.js
    ├── routes/
    │   └── songs.js
    ├── server.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Configure MongoDB

Edit `server/.env` to set your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/scrollz
PORT=5000
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scrollz
```

### 3. Start the Backend Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

### 4. Install Frontend Dependencies

```bash
cd client
npm install
```

### 5. Start the Frontend Development Server

```bash
cd client
npm run dev
```

The app will run on `http://localhost:5173`

## 📝 API Endpoints

- `GET /api/songs` - Fetch all songs (sorted by newest)
- `GET /api/songs/:id` - Get a single song by ID
- `POST /api/songs` - Create a new song

### Example: Create a Song

```bash
curl -X POST http://localhost:5000/api/songs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Example Song",
    "artist": "Example Artist",
    "audioUrl": "https://example.com/audio.mp3",
    "coverArtUrl": "https://example.com/cover.jpg",
    "lyrics": [
      {"time": 0, "text": "First line of lyrics"},
      {"time": 5.5, "text": "Second line of lyrics"},
      {"time": 12, "text": "Third line of lyrics"}
    ]
  }'
```

## 🎤 Lyrics Format

The upload form supports two formats:

### LRC Format
```
[00:12.00] First line of lyrics
[00:18.50] Second line of lyrics
[00:25.00] Third line of lyrics
```

### JSON Format
```json
[
  {"time": 12, "text": "First line of lyrics"},
  {"time": 18.5, "text": "Second line of lyrics"},
  {"time": 25, "text": "Third line of lyrics"}
]
```

## 🎨 Design Philosophy

- **Dark Mode**: Deep purples (#8b5cf6), blacks (#0a0a0f), and neon accents
- **No Tailwind**: Uses CSS Modules for scoped, maintainable styles
- **Glassmorphism**: Cards with backdrop blur effects
- **Smooth Animations**: Transitions and hover effects throughout
- **Responsive**: Works on desktop and mobile devices

## 🔧 Development Scripts

### Backend (`/server`)
- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start production server

### Frontend (`/client`)
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎯 Key Features Implementation

### Synchronized Lyrics
The `PlayerView` component uses the HTML5 audio API's `timeupdate` event to track playback position and highlight the current lyric line. The active line is:
- Larger font size (1.75rem vs 1.125rem)
- Bright neon purple color
- Automatically scrolled into view with smooth scroll behavior

### Auto-Scroll
Uses `scrollIntoView({ behavior: 'smooth', block: 'center' })` to keep the active lyric centered in the container.

## 📄 License

ISC

## 👥 Authors

Atharv - Bhavish

---

Made with 💜 for music lovers and karaoke enthusiasts
