import React from "react";
import {useState} from "react";
import { Link } from "react-router-dom";
import pic from "../assets/pic.png";
import Cookies from "js-cookie";
import axios from "axios";
import sethescope from "../assets/stethoscope.svg";

export default function Navbar({ user, setUser }) {
    const [open, setOpen] = useState(false);

    const handleSignOut = () => {

        if(user){
            axios.get('http://localhost:5000/api/user/logout', {
                withCredentials: true,
            })
            .then(res => {
                setUser("loading");
                localStorage.removeItem('userType');
            })
            .catch(err => console.log(err));

        }
       

        setOpen(false);
        window.location.href = "/";

    }

    const toggleNavbar = () => {
        setOpen(!open);

    }
    window.onpopstate = () => {
        setOpen(false);
    }



    return (
        <>
         <div className="w-full flex items-center justify-between px-4 md:px-6 py-2 bg-white border-b border-slate-200 md:shadow-sm relative z-50">
         <Link to="/" className="flex items-center group transition-colors">
            <img src={sethescope} alt="logo" className="w-8 h-8" />

            
            <span className="ml-2 text-2xl font-bold text-blue-700 group-hover:text-blue-800">DoctorWho</span>
        </Link>

                <div className="hidden sm:flex items-center space-x-4">
                <Link to="/find-doctors" className="text-sm font-medium text-slate-700 relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-blue-700 after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100 hover:text-blue-700">
            Find Doctors
        </Link>
        <Link to="/specialties" className="text-sm font-medium text-slate-700 relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-blue-700 after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100 hover:text-blue-700">
            Specialties
        </Link>
        <Link to="/chat" className="text-sm font-medium text-slate-700 relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-blue-700 after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100 hover:text-blue-700">
            AI Chat
        </Link>
        {user && (
        <>
        {user.role=="user" && 
    
        (
            <Link to="/profile" className="text-sm font-medium text-slate-700 relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-blue-700 after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100 hover:text-blue-700">
                Profile
            </Link>
        )}
        {user.role=="doctor" && (
            <Link to="/doctor-profile" className="text-sm font-medium text-slate-700 relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-blue-700 after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100 hover:text-blue-700">    
                Doctor Profile
            </Link>

        )}
        </>
        )}

    </div>

                <div className="hidden sm:flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <img
                                src={user.pfp || pic}
                                alt="user"
                                className="w-10 h-10 rounded-full border-2 border-blue-700"
                            />
                            <button className="bg-blue-700 text-white px-4 py-2 rounded font-medium hover:bg-blue-800 transition-all hover:-translate-y-0.5" onClick={handleSignOut}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/signup" className="bg-blue-700 text-white px-6 py-2 rounded font-medium hover:bg-blue-800 transition-all hover:-translate-y-0.5">
                            Login
                        </Link>
                    )}
                </div>

                <div className="flex sm:hidden">
            <button className="p-2 rounded-lg" onClick={toggleNavbar}>
                <div className="w-6 h-[2px] bg-slate-700"></div>
                <div className="w-6 h-[2px] bg-slate-700 mt-1"></div>
                <div className="w-6 h-[2px] bg-slate-700 mt-1"></div>
            </button>
        </div>
    </div>

            <div className={`fixed top-[40px] left-0 w-full bg-white shadow-lg transition-all duration-300 transform z-40
    ${open ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'} 
    sm:hidden`}>
    <div className="flex flex-col p-4 space-y-4 w-full max-w-screen">
                    <Link to="/find-doctors" className="text-slate-700 text-lg font-medium py-2 px-4 hover:bg-blue-50 rounded-md"
                    onClick={toggleNavbar}
                    >
                        Find Doctors
                    </Link>
                    <Link to="/specialties" className="text-slate-700 text-lg font-medium py-2 px-4 hover:bg-blue-50 rounded-md"
                    onClick={toggleNavbar}>
                        Specialties
                    </Link>
                    <Link to="/chat" className="text-slate-700 text-lg font-medium py-2 px-4 hover:bg-blue-50 rounded-md"
                    onClick={toggleNavbar}>

                     AI Chat
                    </Link>
                    {user &&(
                        <>
                        
                        {user.role=="user" && (
                            <Link to="/profile" className="text-slate-700 text-lg font-medium py-2 px-4 hover:bg-blue-50 rounded-md
                            " onClick={toggleNavbar}>
                                Profile
                            </Link>
                        )}
                        {user.role=="doctor" && (
                            <Link to="/doctor-profile" className="text-slate-700 text-lg font-medium py-2 px-4 hover:bg-blue-50 rounded-md
                            " onClick={toggleNavbar}>
                                Doctor Profile
                            </Link>
                        )}
                        </>
                    )}

                    <div className="flex items-center justify-between pt-2 pb-0 px-2 border-t border-slate-200">
                        {user ? (
                            <div className="flex items-center justify-between w-full">
                                <img
                                    src={user.pfp || pic}
                                    alt="user"
                                    className="w-10 h-10 rounded-full border-2 border-blue-700"
                                />
                                <button className="bg-blue-700 text-white px-4 py-2 rounded font-medium hover:bg-blue-800" onClick={handleSignOut}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/signup" className="bg-blue-700 text-white px-4 py-2 rounded font-medium hover:bg-blue-800 w-full text-center" onClick={toggleNavbar}>
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}