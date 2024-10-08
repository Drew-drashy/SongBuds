import Login from './components/Login'
import React from 'react';
import Home from './pages/Home';
import SignUp from './components/Signup';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ConnectSpotify from './components/ConnectSpotify';

import Room from './pages/Room'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/connect-spotify" element={<ConnectSpotify/>}/>
        <Route path="/room/:roomId" element={<Room/>}/>
        <Route path="/home" element={<Home/>}/>

      </Routes>
    </Router>
  )
}

export default App
