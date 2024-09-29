
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSpotifyLogin = () => {
        // console.log('hi')
        const authUrl = `http://localhost:5000/api/auth/spotify/login`;
        window.location.href = authUrl; // Redirect the user to Spotify for authentication
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            window.alert('Login failed! Wrong credentials');
            console.error('Login error:', error);
        }
    };

    return (
        <div 
            className="flex items-center justify-center min-h-screen"
            style={{
                backgroundImage: 'url("https://res.cloudinary.com/dqp1z12my/image/upload/v1725868230/pexels-pixabay-164745_swxusb.jpg")', 
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="p-24 bg-white/30 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-lg">
                <h1 className="text-5xl text-center mb-6 font-semibold">Login</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-4 items-center">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="p-2 w-full max-w-xs rounded-md border-transparent focus:border-gray-500 focus:ring-0"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="p-2 w-full max-w-xs rounded-md border-transparent focus:border-gray-500 focus:ring-0"
                    />
                    <button type="submit" className="px-6 py-2 text-white bg-violet-500 rounded-md hover:bg-violet-600">
                        Login
                    </button>
                </form>
                
                <div className="flex justify-center mt-6">
                    <button 
                        onClick={handleSpotifyLogin} 
                        className="px-6 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                    >
                        Login with Spotify
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
