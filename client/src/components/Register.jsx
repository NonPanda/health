import React from 'react';
import { Link } from 'react-router-dom';
import person from '../assets/person.png';
import rainbow from '../assets/rainbow.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';


export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (e) => {

  
      e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/register', {
            name,
            email,
            password,
          });

    
    
          if (response.status === 200) {
            console.log('Token:', response.data.token); 
            localStorage.setItem('token', response.data.token); 
            window.location.href = "/login";
            


          } else {
            alert(response.data.message || 'Registration Failed!');
          }
        } catch (error) {
          console.error('Error during registration:', error);
          alert('An error occurred. Please try again.');
        }
      };
    return (
    
        <div className="flex flex-row">
      <div className="flex relative hidden md:block">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={rainbow}
            alt="Rainbow"
            className="absolute inset-0 scale-100 object-cover"
          />
        </div>
        <img src={person} alt="Person" className="mx-auto mt-20 scale-75" />
      </div>
      <div className="flex flex-1 flex-col justify-center items-center bg-white">
        <h1 className="text-4xl font-bold mb-8 text-center">Register Now</h1>
        <form className="w-3/4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-2 mb-6 border rounded-md"
            required
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 mb-6 border rounded-md"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 mb-12 border rounded-md"
            required
            onChange={(e) => setPassword(e.target.value)}

          />
          <button
            type="submit"
            className="w-full bg-black text-white p-4 text-xl font-bold rounded-md hover:bg-gray-800"
          >
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