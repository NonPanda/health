import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { BsPersonFill, BsSearch, BsCalendarCheck } from "react-icons/bs";
import { RiLoginCircleFill, RiHospitalLine } from "react-icons/ri";
import { FaUserMd } from "react-icons/fa";
import pic from "../assets/pic.png";
import sethescope from "../assets/stethoscope.svg";

export default function Navbar({ user, setUser, role }) {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setDropdown(false);
    setOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    if (user) {
      try {
        await axios.get('http://localhost:5000/api/user/logout', {
          withCredentials: true,
        });
        setUser("loading");
        localStorage.removeItem('userType');
        window.location.href = "/";
      } catch (err) {
        console.log(err);
      }
    }
    setOpen(false);
  };

  return (
    <nav className={`relative bg-white border-b z-50 ${
      scrolled ? "shadow-sm border-transparent" : "border-gray-100"
    }`}>
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 relative z-50">
        <Link to="/" className="flex items-center group transition-colors">
            <img src={sethescope} alt="logo" className="w-8 h-8 group-hover:scale-105 transition-all duration-300" />

            
            <span className="ml-3 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-cyan-300 to-blue-700 group-hover:from-sky-600 group-hover:to-blue-800 group-hover:scale-105 transition-all duration-300">DoctorWho</span>
        </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/find-doctors" 
              className="group flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[#3A8EF6] transition-all duration-200"
            >
              <BsSearch className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Find Doctors</span>
            </Link>
            <Link 
              to="/specialties" 
              className="group flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[#3A8EF6] transition-all duration-200"
            >
              <RiHospitalLine className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Specialties</span>
            </Link>
            <Link 
              to="/appointments" 
              className="group flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[#3A8EF6] transition-all duration-200"
            >
              <BsCalendarCheck className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Appointments</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-3 group focus:outline-none"
                >
                  <div className="relative">
                    <img
                      src={user.profile.avatar || pic}
                      alt="user"
                      className="w-9 h-9 rounded-lg object-cover ring-2 ring-transparent group-hover:ring-[#3A8EF6]/30 transition-all duration-300"
                    />
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-[#3A8EF6] transition-colors duration-200">
                    {user.name?.split(' ')[0]}
                  </span>
                </button>

                <div
        className={`absolute top-14 -right-6 w-42 rounded-xl bg-white shadow-lg border border-gray-200 backdrop-blur-sm transition-all duration-200 ease-in-out transform ${dropdown ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"}`}
      >
                  <div className="rounded-lg bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in using,</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link
                        to={localStorage.getItem('userType')=="doctor" ?"/doctor-profile" : "/profile"}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-[#3A8EF6] transition-all duration-200 hover:pl-2"
                      >
                        {user.role === "doctor" ? <FaUserMd className="w-4 h-4 mr-2" /> : <BsPersonFill className="w-4 h-4 mr-2" />}
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center px-4 py-[9px] text-sm text-gray-700 hover:bg-sky-50 hover:text-[#3A8EF6] transition-all duration-200 hover:pl-2"
                      >
                        <RiLoginCircleFill className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/signup"
                className="inline-flex items-center px-4 py-2 rounded-lg text-white bg-[#3A8EF6] hover:bg-[#3A8EF6]/90 transition-all duration-300 shadow-sm hover:shadow"
              >
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg transition-colors duration-200 focus:outline-none"
            >
              <div className="w-6 flex flex-col items-end gap-1.5">
                <span className={`block h-0.5 bg-gray-600 transition-all duration-300 ${open ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
                <span className={`block h-0.5 bg-gray-600 transition-all duration-300 ${open ? 'w-6 opacity-0' : 'w-4'}`}></span>
                <span className={`block h-0.5 bg-gray-600 transition-all duration-300 ${open ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className={`absolute left-0 w-full bg-white shadow-lg transition-all duration-300 transform z-40
    ${open ? 'translate-y-0 opacity-100 visible' : '-translate-y-5 opacity-0 invisible'} md:hidden`}>
        <div className="px-4 py-2 space-y-1 border-t border-gray-100">
          <Link
            to="/find-doctors"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#3A8EF6] transition-all duration-200"
          >
            <BsSearch className="w-4 h-4" />
            <span>Find Doctors</span>
          </Link>
          <Link
            to="/specialties"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#3A8EF6] transition-all duration-200"
          >
            <RiHospitalLine className="w-4 h-4" />
            <span>Specialties</span>
          </Link>
          <Link
            to="/appointments"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#3A8EF6] transition-all duration-200"
          >
            <BsCalendarCheck className="w-4 h-4" />
            <span>Appointments</span>
          </Link>

          {user ? (
            <>
              <Link
                to={user.role === "doctor" ? "/doctor-profile" : "/profile"}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#3A8EF6] transition-all duration-200"
              >
                {user.role === "doctor" ? <FaUserMd className="w-4 h-4" /> : <BsPersonFill className="w-4 h-4" />}
                <span>Profile</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#3A8EF6] transition-all duration-200"
              >
                <RiLoginCircleFill className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <Link
              to="/signup"
              className="block w-full px-3 py-2 text-center rounded-lg text-white bg-[#3A8EF6] hover:bg-[#3A8EF6]/90 transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}