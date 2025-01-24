import React from 'react';
import { Link } from 'react-router-dom';
import person from '../assets/person.png';
import rainbow from '../assets/rainbow.png';



export default function Login() {
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
    Hello!<br />Welcome Back
  </h1>
  <form className="w-3/4">
    <input
      type="email"
      placeholder="Email"
      className="w-full p-2 mb-8 border rounded-md"
    />
    <input
      type="password"
      placeholder="Password"
      className="w-full p-2 mb-2 border rounded-md"
    />
    <a href="#" className="text-blue-500 text-sm mb-8 block text-right">
      Forgot Password?
    </a>
    <button className="w-full bg-black text-white p-4 text-xl font-bold rounded-md hover:bg-gray-800">
      Log In
    </button>
  </form>
  
  <p className="mt-4">
    Don't Have an Account?{' '}
    <Link to="/register" className="text-blue-500">
        Register
    </Link>
  </p>
</div>
</div>

    )
};