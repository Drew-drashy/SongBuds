import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

let socket;

function Room() {
  const { roomId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [trackUri, setTrackUri] = useState('spotify:track:6rqhFgbbKwnb9MLmUQDhG6');

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    
    // Fetch user profile
    axios.get('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      setUser(response.data);
    }).catch((error) => {
      console.error('Error fetching profile', error);
    });

    // Connect to the socket server
    socket = io('http://localhost:5000');
    socket.emit('joinRoom', { roomId });

    // Listen for messages from the server
    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Listen for playSong events from other users
    socket.on('playSong', ({ songUri }) => {
      console.log('Received playSong event for URI:', songUri);
      playSpotifySong(songUri);
    });

    // Initialize Spotify Player SDK when ready
    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Collaborative Player',
        getOAuthToken: cb => { cb(token); },
        volume: volume,
      });

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id);
        console.log('Ready with Device ID', device_id);
      });

      spotifyPlayer.addListener('player_state_changed', (state) => {
        if (state) {
          setCurrentTrack(state.track_window.current_track);
          setIsPlaying(!state.paused);
        }
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };

    return () => {
      socket.disconnect();
      if (player) {
        player.disconnect();
      }
    };
  }, [roomId, volume]);

  // Play song using Spotify SDK
  const playSpotifySong = (spotifyUri) => {
    if (player && deviceId) {
      axios({
        method: 'PUT',
        url: `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        headers: { Authorization: `Bearer ${localStorage.getItem('spotify_token')}` },
        data: { uris: [spotifyUri] },
      }).then(() => {
        console.log('Playing song:', spotifyUri);
      }).catch((error) => {
        console.error('Error playing song:', error);
      });
    }
  };

  const handlePlaySong = () => {
    socket.emit('playSong', { roomId, songUri: trackUri });
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (player) player.setVolume(newVolume);
  };

  const togglePlayPause = () => {
    if (player) {
      player.togglePlay();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h1 className="text-3xl text-center mb-4 font-bold">Room: {roomId}</h1>

        <div className="mb-4">
          <h2 className="text-xl">Messages:</h2>
          <div className="h-48 overflow-y-auto border p-2 mb-4">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <strong>{msg.user?.username || 'Unknown'}:</strong> {msg.message}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 border rounded mb-2"
          />
          <button onClick={sendMessage} className="w-full bg-indigo-500 text-white py-2 rounded">
            Send Message
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-xl">Spotify Player:</h2>
          {currentTrack && (
            <div>
              <p>Now Playing: {currentTrack.name} by {currentTrack.artists.map(artist => artist.name).join(', ')}</p>
              <button onClick={togglePlayPause} className="bg-green-500 text-white py-2 px-4 rounded">
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          )}

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full mt-2"
          />
          <button onClick={handlePlaySong} className="bg-blue-500 text-white py-2 px-4 rounded">
            Play Selected Song
          </button>
        </div>
      </div>
    </div>
  );
}

export default Room;
