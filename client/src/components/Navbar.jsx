import React from "react";
import { auth, provider, signInWithPopup } from "../firebaseConfig";
import {signOut} from "firebase/auth";
import {useState,useEffect } from "react";
import { GoogleAuthProvider } from "firebase/auth";
import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";



export default function Navbar({ user }) {
 const [show,isShow] = useState(false);

 const handleSignIn = async () => {
     try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });
         const result = await signInWithPopup(auth, provider); 
         const credential = GoogleAuthProvider.credentialFromResult(result);
         const token = credential.accessToken;
         const loggedInUser = result.user;
         console.log
         console.log("User signed in:", loggedInUser);
     } catch (error) {
         console.error("Error during sign-in:", error.message);
     }
    }
    
 const handleSignOut = async () => {
     try {
         await signOut(auth);
         console.log("User signed out");
     } catch (error) {
         console.error("Error during sign-out:", error.message);
     }
 }

    const togglenavbar = () => {
        isShow(!show);
    }
    

    

    return (
        <>
      <div className={`w-full flex flex-wrap items-center justify-between px-4 lg:px-6 h-16 bg-white border-b border-slate-200`}>
    <Link to="/" className="flex items-center justify-center">
        <Stethoscope className="h-8 w-8 text-blue-700" />
        <span className="ml-2 text-2xl font-bold text-blue-700">DoctorWho</span>
    </Link>
    
    <div className="space-x-6 hidden sm:flex"> 
        <Link to="/find-doctors" className="text-sm font-medium text-slate-700 relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-blue-700 after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100 hover:text-blue-700">
            Find Doctors
        </Link>
        <Link to="/specialties" className="text-sm font-medium text-slate-700 relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-blue-700 after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100 hover:text-blue-700">
            Specialties
        </Link>
        <Link to="/chat" className="text-sm font-medium text-slate-700 relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-blue-700 after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100 hover:text-blue-700">
            AI Chat Assistant
        </Link>
    </div>

    <div className="flex items-center">
        {user ? (
            <>
                <img
                    src={user.photoURL}
                    referrerPolicy="no-referrer"
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full cursor-pointer"
                />
                <button className="bg-blue-700 text-white px-4 py-2 rounded ml-4 text-sm hover:bg-blue-800 transition-colors" onClick={handleSignOut}>
                    Logout
                </button>
            </>
        ) : (
            <Link
                to="/login"
                className="bg-blue-700 text-white px-4 py-2 rounded text-l font-bold hover:bg-blue-800 transition-colors"
            >
                Login
            </Link>
        )}
    </div>

    <div className="flex flex-col items-center justify-center space-y-1 cursor-pointer sm:hidden" onClick={togglenavbar}>
        <div className="w-6 h-1 bg-slate-700"></div>
        <div className="w-6 h-1 bg-slate-700"></div>
        <div className="w-6 h-1 bg-slate-700"></div>
    </div>
</div>

<div className={`px-5 bg-white border-b border-slate-200 w-full h-full inline-flex flex-col cursor-pointer sm:hidden ${show ? "block" : "hidden"}`}>
    <Link to="/find-doctors" className="text-sm font-medium text-slate-700 py-2">Find Doctors</Link>
    <Link to="/specialties" className="text-sm font-medium text-slate-700 py-2">Specialties</Link>
    <Link to="/chat" className="text-sm font-medium text-slate-700 py-2">AI Chat Assistant</Link>
</div>
    
        </>
    );
}
