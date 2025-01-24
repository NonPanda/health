import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { useEffect } from 'react'
import './App.css'
import {auth } from './firebaseConfig'
import { use } from 'react'
import HomePage from './components/HomePage'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
  const unsubscribe=auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user)
    } else {
      setUser(null)
    }
  });
  return () => {
    unsubscribe();
  }

  }, []);


  console.log(user);



  return (
    <>
      <Router>
        <Navbar user={user} />
        <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        </Routes>


      </Router>

      
    </>
  )
}

export default App
