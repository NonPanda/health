import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import person from '../../assets/person.png';
import rainbow from '../../assets/rainbow.png';
import axios from 'axios';
import './Signup.css';
import { useNavigate } from 'react-router-dom';


const CustomInput = ({ 
  type,placeholder,name,onChange,error,value
}) => {
  return (
    <div className="mb-6 w-full">
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        value={value}
        className={`p-2 border rounded-md w-full ${
          error ? 'border-red-500' : 'border-gray-300 focus:outline-gray-300'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default function Signup({ setUser }) {


  const [isLoginForm, setIsLoginForm] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isDoctor, setIsDoctor] = useState(false);
  const navigate = useNavigate();


  const validateForm = () => {
    const newErrors = {};
    
    if (!isLoginForm) {
      if (!formData.username || formData.username.length < 3 || formData.username.length > 20) {
        newErrors.username = "Username must be between 3 and 20 characters.";
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = "Username must contain only letters, numbers, and underscores.";
      }
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (formData.email.length > 50) {
      newErrors.email = "Email must not exceed 50 characters.";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }


    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else if (!isLoginForm && !/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter and one special character";
    }


    setErrors(newErrors);
    console.log(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleToggleForm = () => {
    setIsLoginForm((prev) => !prev); 
    setFormData({
      username: "",
      email: "",
      password: "",
    });
    setErrors({}); 
  };

   const handleDoctorToggle = () => {
    setIsDoctor((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };


    const handleLoginSubmit = async (e) => {
      e.preventDefault();

      if(!validateForm()) {
        return;
      }
      if(!isDoctor){
               try {
            const response = await axios.post('http://localhost:5000/api/user/login', {
              email: formData.email,
              password: formData.password,
            }
            ,{withCredentials:true},

          );
            console.log('Response received:', response);
            if (response.status === 200) { 
               setUser(response.data.user);   
               localStorage.setItem('userType', 'user');          
                navigate('/profile');
                          
            }

          } catch (error) {
            if (error.response) {
              if (error.response.status === 401) {
                setErrors({password: "Invalid email or password."});
              } else if (error.response.status === 404) {
                setErrors({
                  password: "User does not exist.",
                  email: "User does not exist.",
                });
              }
            } else {
              setErrors({ general: "Please try again later." });
            }
          }
        }
        else{
          try {
            const response = await axios.post('http://localhost:5000/api/doctor/login', {
              email: formData.email,
              password: formData.password,
            }
            ,{withCredentials:true}
          );
          
            if (response.status === 200) {
              setUser(response.data.user);
              localStorage.setItem('userType', 'doctor');
              navigate('/doctor-profile');
            }
          } catch (error) {
            if (error.response) {
              if (error.response.status === 401) {
                setErrors({password: "Invalid email or password."});
              } else if (error.response.status === 404) {
                setErrors({ email: "User does not exist." });
              }
            } else {
              setErrors({ general: "Please try again later." });
            }
          }
        }
    };


       const handleRegisterSubmit = async (e) => {
          e.preventDefault();
        
          if (!validateForm()) {
            return;
          }
        
          try {
            const response = await axios.post('http://localhost:5000/api/user/register', {
              name: formData.username,
              email: formData.email,
              password: formData.password,
              role: isDoctor ? "doctor" : "patient",
            });
        
            console.log('Response received:', response);
        
            if (response.status === 201) {
              handleToggleForm();
            } else {
              setErrors({ general: "Registration Failed." });
            }
        
          } catch (error) {
        
            if (error.response) {
              if (error.response.status === 403) {
                setErrors({ email: "User already exists." });
              } else {
                setErrors({ general: "Registration Failed." });
              }
            } else {
              setErrors({ general: "Please try again later." });
            }
          }
        };

    return (
    
      <div className="flex flex-col md:flex-row justify-center items-center">
    <div className="relative w-full md:w-3/5 flex justify-center items-center md:mb-0 mb-40">
    <div className="absolute inset-0 overflow-hidden">
      <img
      src={rainbow}
      alt="Rainbow"
      className="absolute inset-0 scale-100 object-cover"
      />
    </div>
    <img
      src={person}
      alt="Person"
      className="mx-auto mt-12 md:mt-20 mb-4 scale-75"
    />
    </div>

    <div className={`w-[90%] mr-0 md:mr-8 md:w-2/5 perspective ${isLoginForm ? "" : "flipped"}`}>
    <div className="flipper">
      <div className="front flex flex-1 flex-col justify-center items-center bg-white">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-t from-blue-600 to-blue-800 py-4 text-center">
        Hello!<br />Welcome Back
      </h1>
      <form className="w-full flex justify-center items-center" onSubmit={handleLoginSubmit}>
        <div className="w-full max-w-[25rem]">
        <CustomInput
        type="email"
        placeholder="Email"
        name="email"
        onChange={handleChange}
        error={errors.email}
        value = {formData.email}
        />
        <CustomInput
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          error={errors.password}
          value={formData.password}
        />
        <div className="flex justify-between items-center -mt-4 mb-4">
  <div className="flex items-center">
    <input
      type="checkbox"
      id="doctorToggle"
      checked={isDoctor}
      onChange={handleDoctorToggle}
      className="mr-2 mt-1"
    />
    <label htmlFor="doctorToggle" className="text-sm text-gray-400">
      Doctor
    </label>
  </div>
  
  <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
    Forgot Password?
  </Link>
</div>

        <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm shadow-blue-500/40 text-center text-xl font-bold rounded-md">
          Log In
        </button>
        </div>
      </form>

      <div className="mt-4">
      <p className=" text-gray-400">Don't have an account? {' '}
      <button
      type="button"
      onClick={handleToggleForm}
      className="text-sm text-blue-600 hover:underline"
      >
      Register here
      </button>
      </p>
    </div>
      </div>

      <div className="back flex flex-1 flex-col justify-center items-center bg-white">
      <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-t from-blue-600 to-blue-800  text-center">Register Now</h1>
      <form className="w-full flex justify-center items-center" onSubmit={handleRegisterSubmit}>
        <div className="w-full max-w-[25rem]">
        <CustomInput
        type="text"
        placeholder="Name"
        name="username"
        onChange={handleChange}
        error={errors.username}
        value={formData.username}
        />
        <CustomInput
        type="email"
        placeholder="Email"
        name="email"
        onChange={handleChange}
        error={errors.email}
        value={formData.email}
        />
        <CustomInput
        type="password"
        placeholder="Password"
        name="password"
        onChange={handleChange}
        error={errors.password}
        value={formData.password}
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm shadow-blue-500/40 text-center text-xl font-bold rounded-md"
        >
          Sign Up
        </button>
        </div>
      </form>

      <p className="mt-3 text-gray-400 text-center">
        Already Have an Account?{' '}
        <button
        type="button"
        onClick={handleToggleForm}
        className="ml-2 text-sm text-blue-600 hover:underline"
        >
        Login here
        </button>
      </p>
      </div>
    </div>
    </div>
  </div>
    )
};