import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Navbar from './components/Navbar'
import { useEffect } from 'react'
import './App.css'
import {auth } from './firebaseConfig'
import { use } from 'react'

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
        <Route path="/" element={<Home />} />
        </Routes>


      </Router>

      
    </>
  )
}

export default App
