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
    <nav className={`relative bg-white border-b ${
      scrolled ? "shadow-sm border-transparent" : "border-gray-100"
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <img 
                src={sethescope} 
                alt="logo" 
                className="w-7 h-7 relative z-10 transition-transform duration-300 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors duration-300"></div>
            </div>
            <span className="text-xl font-bold text-[#3A8EF6]">
              DoctorWho
            </span>
          </Link>

          {/* Desktop Navigation */}
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

          {/* User Menu */}
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

                {/* Dropdown Menu */}
                <div className={`absolute right-0 mt-2 w-48 transition-all duration-200 ${
                  dropdown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
                }`}>
                  <div className="rounded-lg bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to={user.role === "doctor" ? "/doctor-profile" : "/profile"}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3A8EF6] transition-all duration-200"
                      >
                        {user.role === "doctor" ? <FaUserMd className="w-4 h-4 mr-2" /> : <BsPersonFill className="w-4 h-4 mr-2" />}
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3A8EF6] transition-all duration-200"
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
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

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        open ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 pointer-events-none'
      }`}>
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