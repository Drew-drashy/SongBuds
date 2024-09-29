import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Correct usage of navigate

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Call preventDefault as a function

    if (password !== confirmPassword) {
      window.alert('Password Mismatch!!');
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      // Post the form data to the backend
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username, // You were mistakenly using useState
        email,
        password
      });

      // On successful sign-up, navigate to the login page
      navigate('/connect-spotify');
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className=" p-8 rounded shadow-lg bg-white/30 backdrop-blur-md w-96">
        <h1 className="text-3xl text-center font-bold mb-4">Sign Up</h1>
        {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
