import React from 'react';
import { Link } from 'react-router-dom';
import person from '../assets/person.png';
import rainbow from '../assets/rainbow.png';



export default function Register() {
    return (
    
        <div className="flex flex-row">
        <div className="flex relative">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={rainbow}
            alt="Rainbow"
            className="absolute inset-0 scale-100 object-cover"
          />
        </div>
  <img
    src= {person}
    alt="Person"
    className="mx-auto mt-20 scale-75"
  />
</div>
<div className="flex flex-1 flex-col justify-center items-center bg-white">
  <h1 className="text-4xl font-bold mb-8 text-center">
    Register Now
  </h1>
  <form className="w-3/4">
    <input
      type="email"
      placeholder="Email"
      className="w-full p-2 mb-6 border rounded-md"
    />
    <input
      type="password"
      placeholder="Password"
      className="w-full p-2 mb-12 border rounded-md"
    />

    <button className="w-full bg-black text-white p-4 text-xl font-bold rounded-md hover:bg-gray-800">
      Sign Up
    </button>
  </form>
  
  <p className="mt-4">
    Already Have an Account?{' '}
    <Link to="/login" className="text-blue-500">
        Login
    </Link>
  </p>
</div>
</div>

    )
};