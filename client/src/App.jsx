import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { useEffect } from 'react'
import './App.css'
import {auth } from './firebaseConfig'
import { use } from 'react'
import HomePage from './components/HomePage'
import SignUp from './components/Signup/Signup'
import ForgotPassword from './components/Signup/ForgotPassword'
import ResetPassword from './components/Signup/ResetPassword'


function App() {

  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword/>} />
        </Routes>


      </Router>

      
    </>
  )
}

export default App
