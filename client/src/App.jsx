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
import Cookies from 'js-cookie'

function App() {
  const [user,setUser] = useState(null);
  

  useEffect(() => {
    const token = Cookies.get('token'); 
  
    if (token) {
      axios
        .get('http://localhost:5000/api/user/check', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true, 
        })
        .then((res) => {
          setUser(res.data); 
          console.log("User data from backend:", res.data);
        })
        .catch((err) => {
          console.log("Error fetching user:", err);
          Cookies.remove('token');
        });
    }
  }, []);

  console.log("User data from frontend:", user);
  

 

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
      
        </Routes>


      </Router>

      
    </>
  )
}

export default App
