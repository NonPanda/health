import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { useEffect } from 'react'
import HomePage from './components/HomePage'
import SignUp from './components/Signup/Signup'
import ForgotPassword from './components/Signup/ForgotPassword'
import ResetPassword from './components/Signup/ResetPassword'
import axios from 'axios'
import Profile from './components/Profile'
import DoctorProfile from './components/DoctorProfile'
import DoctorSearch from './components/doctorsearch'

function App() {
  const [user,setUser] = useState(null);
  useEffect(()=>
  {
    const token=localStorage.getItem('token');
    if(token&&!user){
      axios.get('http://localhost:5000/user',{headers:{authorization:`Bearer ${token}`}})
      .then((res)=>{
        setUser(res.data);
        console.log(res.data);
      })
      .catch((err)=>{
        console.log(err);
        localStorage.removeItem('token');

      })

    }
  },[])
 

  return (
    <>
      <Router>
        <Navbar user={user} setUser={setUser}/>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword/>} />
        <Route path="profile" element={<Profile user={user} />} />
        <Route path="doctor-profile" element={<DoctorProfile user={user} />} />
        <Route path="doctorsearch" element={<DoctorSearch />} />
      
        </Routes>


      </Router>

      
    </>
  )
}

export default App
