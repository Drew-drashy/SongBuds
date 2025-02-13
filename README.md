# Project Name: **Spotify Collaborative Room**

## Description
The Spotify Collaborative Room is a real-time music-sharing and chat application where users can join virtual rooms, search for songs, and listen to music together using the Spotify Web Playback SDK. It integrates messaging and synchronized playback features using **Socket.IO**.

## Features
- **User Authentication**: Login using email/password or Spotify OAuth.
- **Real-time Chat**: Users in the same room can send messages to each other.
- **Spotify Music Playback**: Play, pause, search, and stream music via the **Spotify Web Playback SDK**.
- **Room-based Music Synchronization**: Users in the same room listen to the same track simultaneously.
- **Volume Control**: Adjust volume individually.
- **Search Tracks**: Search for tracks using Spotify API and play them instantly.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **WebSocket Communication**: Socket.IO
- **Music API**: Spotify Web Playback SDK & Spotify API

## Installation & Setup

### Prerequisites
- **Node.js & npm** installed
- **Spotify Developer Account** with a registered application
- **MongoDB** for storing user details (optional)

### Steps to Run

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/spotify-collab-room.git
   cd spotify-collab-room
   ```

2. **Install Dependencies:**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Set Up Environment Variables:**
   Create a `.env` file in the backend directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/spotify/callback
   ```

4. **Start the Backend Server:**
   ```bash
   cd backend
   npm start
   ```

5. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application:**
   Open `http://localhost:3000` in your browser.

## Usage
1. **Login/Register**: Users can log in using their credentials or Spotify.
2. **Join/Create Room**: Enter a room ID or create a new room.
3. **Search for Songs**: Use the search bar to find songs via Spotify API.
4. **Play/Pause Music**: Users in the room can play/pause the song in sync.
5. **Chat**: Send messages to communicate in the room.

## API Endpoints
### Authentication
- `POST /api/auth/login` → User Login
- `GET /api/auth/spotify/login` → Spotify OAuth Login
- `GET /api/auth/profile` → Fetch logged-in user profile

### Room Management
- `POST /api/room/create` → Create a room
- `POST /api/room/join` → Join a room
- `POST /api/room/send-message` → Send a chat message

### Spotify Music Controls
- `POST /api/spotify/play` → Play a song
- `POST /api/spotify/pause` → Pause playback
- `POST /api/spotify/search` → Search for a song

## Known Issues & Fixes
- **Web Playback SDK Not Playing**: Ensure the Spotify token has `user-modify-playback-state` scope.
- **WebSocket Connection Failing**: Restart the backend and check for CORS errors.

## Contributions
Feel free to fork the repository and contribute by submitting pull requests.

## License
MIT License - See `LICENSE` file for details.

## Contact
For issues or improvements, reach out to `drashysesodia110053@gmail.com` or open a GitHub issue.

