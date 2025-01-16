import React from "react";
import { auth, provider, signInWithPopup } from "../firebaseConfig";
import {signOut} from "firebase/auth";
import {useState,useEffect } from "react";
import { GoogleAuthProvider } from "firebase/auth";


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
        <div className={`w-full flex flex-wrap items-center justify-between px-5 py-3 bg-primary ${!show ?"border-b-accent border-b-4" : ""}`}>
            
            <a href="/" className="text-4xl text-text font-extrabold">Test</a>
            <div className="space-x-8 hidden sm:flex"> 
            <a href="/link1" className="text-text text-xl relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-accent after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100">Link1</a>
            <a href="/link2" className="text-text text-xl relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-accent after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100">Link2</a>
            <a href="/link3" className="text-text text-xl relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-accent after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100">Link3</a>

            </div>
            <div className="flex items-center">
                {user ? (
                    <>
                        <img
                            src={user.photoURL}
                            referrerPolicy="no-referrer"
                            alt={user.displayName}
                            className="w-10 h-10 rounded-full cursor-pointer"
                        />
                    <button className="bg-secondary text-text px-4 py-2 rounded ml-6 transition duration-500 ease-in-out hover:scale-110" onClick={handleSignOut}>
                        Logout
                    </button>
                    </>
            
                ) : (
                    
                    <button
                        className="bg-secondary text-text px-4 py-2 rounded transition duration-500 ease-in-out hover:scale-110"
                        onClick={handleSignIn}
                    >
                        Login
                    </button>
                )}
        </div>

                <div className="flex flex-col items-center justify-center space-y-1 cursor-pointer sm:hidden" onClick={togglenavbar}>
                    <div className="w-6 h-1 bg-text"></div>
                    <div className="w-6 h-1 bg-text"></div>
                    <div className="w-6 h-1 bg-text"></div>
                </div>
                </div>

            
                <div className={`px-5 bg-primary border-b-accent border-b-4 w-full h-full inline-flex flex-col cursor-pointer sm:hidden ${show ? "block" : "hidden"}`}>
                    <a href="/link1" className="text-text text-right">Link1</a>
                    <a href="/link2" className="text-text text-right">Link2</a>
                    <a href="/link3" className="text-text text-right">Link3</a>

                </div>
    
        </>
    );
}
