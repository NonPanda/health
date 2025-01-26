import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import person from "../../assets/person.png";
import rainbow from "../../assets/rainbow.png";


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
            error ? 'border-red-500' : 'border-gray-300 focus:outline-gray-400'
          }`}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  };

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    
  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
        setErrors({ email: "Email is required" });
      return;
    }

    try {
      await axios.post("http://localhost:5000/forgot-password", { email });
      setErrors({});
        setSuccess(true);
    } catch (err) {
        if(err.status === 404) {
            setErrors({ email: "User not found" });
        
    }
    }
  };


   

  return (
     <div className="flex flex-col md:flex-row justify-center items-center">
       <div className="relative w-full md:w-3/5 flex justify-center items-center">
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
         className="mx-auto mt-20 scale-75"
       />
       </div>
       {!success ? (
        <div className={`w-full md:w-2/5`}>
              <div className="flex flex-1 flex-col justify-center items-center bg-white">
              <h1 className="text-4xl font-bold mb-8 text-center">
                Forgot Password
              </h1>
              <form className="w-full flex justify-center items-center" onSubmit={handleReset}>
                <div className="w-full max-w-[25rem]">
                <CustomInput
                type="email"
                placeholder="Email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                error = {errors.email}
                />
                <button className="w-full bg-black text-white p-4 text-xl font-bold rounded-md hover:bg-gray-800">
                    Reset Password
                </button>
            </div>
              </form>
        
              <p className="mt-3 text-gray-400 text-center">
        Remembered your password?{' '}
         </p>
        <button className="text-blue-600 hover:underline">
            <Link to="/signup">Login</Link>
        </button>


             
        </div>
            
          </div>
    
        ) : (
            <div className="w-full md:w-2/5 flex justify-center items-center">
             
                 <div className="flex flex-1 flex-col justify-center items-center bg-white">
                 <h1 className="text-4xl font-bold mb-8 text-center">Password Reset Email Sent</h1>
                 <p className="mt-3 text-gray-400 text-center">
                    Please check your email to reset your password.
                    </p>

                    <button className="text-blue-600 hover:underline">
                    <Link to="/signup">Login</Link>
                </button>
                </div>
                </div>
        )}

                

    </div>


  );
}