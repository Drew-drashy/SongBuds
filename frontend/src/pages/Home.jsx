// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000'); // Connect to your Socket.IO server

// function Home() {
//   const [profile, setProfile] = useState(null);
//   const [roomName, setRoomName] = useState('');
//   const [roomId, setRoomId] = useState('');
//   const [error, setError] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   // Fetch user profile on component load
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const regularToken=localStorage.getItem('token');
//         // const spotToken=localStorage.getItem('spotify-token');
//         // console.log(regularToken,'home-token');
//         const tokentouse=regularToken;
//         const response = await axios.get('http://localhost:5000/api/auth/profile', {
//           headers: {
//             Authorization: `Bearer ${tokentouse}` // Authenticated request
//           }
//         });
//         setProfile(response.data);
//       } catch (err) {
//         console.log(err.messages);
//         setError('Error fetching profile');
//       }
//     };

//     fetchProfile();
//   }, []);

//   // Create a room
//   const handleCreateRoom = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/auth/create-room',
//         { roomName },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );
//       navigate(`/room/${response.data.roomId}`); // Redirect to the room
//     } catch (err) {
//       setError('Error creating room');
//     }
//   };

//   // Join a room
//   const handleJoinRoom = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/auth/join-room',
//         { roomId },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );
//       navigate(`/room/${response.data.roomId}`); // Redirect to the room
//     } catch (err) {
//       setError('Error joining room');
//     }
//   };

//   // Handle sending a message
//   const sendMessage = (e) => {
//     e.preventDefault();
//     socket.emit('sendMessage', {
//       roomId,
//       message,
//       user: profile?.username, // Attach the current user profile
//     });
//     setMessage(''); // Clear the input
//   };

//   // Listen for incoming messages
//   useEffect(() => {
//     socket.on('receiveMessage', ({ user, message }) => {
//       setMessages((prevMessages) => [...prevMessages, { user, message }]);
//     });

//     return () => {
//       socket.off('receiveMessage');
//     };
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-lg w-96">
//         <h1 className="text-3xl text-center mb-4 font-bold">Home</h1>

//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//         {profile ? (
//           <>
//             <div className="mb-4">
//               <h2 className="text-xl font-semibold">Welcome, {profile.username}</h2>
//               <p>Email: {profile.email}</p>
//             </div>

//             <div className="mb-4">
//               <form onSubmit={handleCreateRoom}>
//                 <input
//                   type="text"
//                   placeholder="Room Name"
//                   value={roomName}
//                   onChange={(e) => setRoomName(e.target.value)}
//                   required
//                   className="w-full px-4 py-2 border rounded mb-4"
//                 />
//                 <button type="submit" className="w-full bg-indigo-500 text-white py-2 rounded">
//                   Create Room
//                 </button>
//               </form>
//             </div>

//             <div className="mb-4">
//               <form onSubmit={handleJoinRoom}>
//                 <input
//                   type="text"
//                   placeholder="Room ID"
//                   value={roomId}
//                   onChange={(e) => setRoomId(e.target.value)}
//                   required
//                   className="w-full px-4 py-2 border rounded mb-4"
//                 />
//                 <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
//                   Join Room
//                 </button>
//               </form>
//             </div>

//             {/* Messaging section */}
//             <div className="mt-6">
//               <h2 className="text-lg font-semibold mb-4">Room Chat</h2>
//               <div className="h-32 bg-gray-200 p-4 rounded mb-4 overflow-y-scroll">
//                 {messages.map((msg, index) => (
//                   <div key={index}>
//                     <strong>{msg.user}:</strong> {msg.message}
//                   </div>
//                 ))}
//               </div>
//               <form onSubmit={sendMessage}>
//                 <input
//                   type="text"
//                   placeholder="Type your message"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   className="w-full px-4 py-2 border rounded mb-4"
//                 />
//                 <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
//                   Send Message
//                 </button>
//               </form>
//             </div>
//           </>
//         ) : (
//           <p>Loading profile...</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Home;

import React from 'react'

const Home = () => {
  return (
    <div>
      hi
    </div>
  )
}

export default Home
