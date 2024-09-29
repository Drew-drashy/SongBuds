import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');  // Backend URL

function Dashboard() {
  const [songId, setSongId] = useState(null);
  const [timestamp, setTimestamp] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomId, setRoomId] = useState('room1');  // You can dynamically set this

  useEffect(() => {
    // Join a room for listening together
    socket.emit('joinRoom', { roomId });

    // Listen for song playback updates
    socket.on('playSong', ({ songId, timestamp }) => {
      console.log('Playing song:', songId);
      setSongId(songId);
      setTimestamp(timestamp);
      setIsPlaying(true);
    });

    socket.on('pauseSong', () => {
      console.log('Pausing song');
      setIsPlaying(false);
    });

    socket.on('seekSong', ({ timestamp }) => {
      console.log('Seeking to timestamp:', timestamp);
      setTimestamp(timestamp);
    });

    // Listen for chat messages
    socket.on('receiveMessage', ({ message }) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.off('playSong');
      socket.off('pauseSong');
      socket.off('seekSong');
      socket.off('receiveMessage');
    };
  }, [roomId]);

  // Handle playing song
  const playSong = (songId, timestamp) => {
    socket.emit('playSong', { roomId, songId, timestamp });
  };

  // Handle pausing song
  const pauseSong = () => {
    socket.emit('pauseSong', { roomId });
  };

  // Handle seeking song
  const seekSong = (timestamp) => {
    socket.emit('seekSong', { roomId, timestamp });
  };

  // Handle sending messages
  const sendMessage = () => {
    socket.emit('sendMessage', { roomId, message: newMessage });
    setNewMessage('');
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Music Playback Controls */}
      <div>
        <h2>Music Playback</h2>
        <button onClick={() => playSong('spotify:track:6rqhFgbbKwnb9MLmUQDhG6', timestamp)}>Play Song</button>

        <button onClick={pauseSong}>Pause Song</button>
        <button onClick={() => seekSong(60)}>Seek to 60 seconds</button>
      </div>

      {/* Chat Section */}
      <div>
        <h2>Chat</h2>
        <div>
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
        <input 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </div>
  );
}

export default Dashboard;
