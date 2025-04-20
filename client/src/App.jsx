import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { useEffect } from 'react'
import HomePage from './pages/HomePage'
import SignUp from './pages/Signup/Signup'
import ForgotPassword from './pages/Signup/ForgotPassword'
import ResetPassword from './pages/Signup/ResetPassword'
import axios from 'axios'
import Profile from './pages/Profile'
import DoctorProfile from './pages/DoctorProfile'
import DoctorSearch from './pages/DoctorSearch'
import PublicProfile from './pages/PublicProfile'
import Appointment from './pages/Appointment'
import Medications from './pages/Medications'


function App() {
  const [user,setUser] = useState(null);

  useEffect(() => {
    const role=localStorage.getItem('userType');
    console.log(role);
    console.log("user",user);

    if (user!=="loading"&&user==null) {
      if(role==="user"){
      axios.get('http://localhost:5000/api/user/getprofile', {
        withCredentials: true,
      })
      .then(res => setUser(res.data.user))
      .catch(err => console.log(err));
    }
    else if(role==="doctor"){
    
      axios.get('http://localhost:5000/api/doctor/getprofile', {
        withCredentials: true,
      })
      .then(res => setUser(res.data.doctor))
      .catch(err => console.log(err));
    }
    }
    else if (user==="loading") {
      setUser(null);
    }

  }, []);

  return (
    <>
      <Router>
        <Navbar user={user} setUser={setUser}/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp setUser={setUser}  />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword/>} />
          <Route path="profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="doctor-profile" element={<DoctorProfile user={user} setUser={setUser} />} />
          <Route path="find-doctors" element={<DoctorSearch user={user} />} />
          <Route path="doctor/:id" element={<PublicProfile />} />
          <Route path="appointments" element={<Appointment />} />
          <Route path="medications" element={<Medications />} />
        </Routes>
      </Router>
    </>
  );
}

export default App
