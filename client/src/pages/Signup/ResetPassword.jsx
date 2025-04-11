import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import person from "../../assets/person.png";
import rainbow from "../../assets/rainbow.png";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import CustomInput from "../../components/CustomInput";





export default function ResetPassword() {
    const { id, token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const [success, setSuccess] = useState(false);

    // useEffect (() => {
    //      setErrors({});
    // }, [password, confirmPassword]);


    const validateForm = () => {
        const newErrors = {};

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }
        else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
            newErrors.password =
              "Password must contain at least one uppercase letter and one special character";
          }



        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required";
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


  

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if(!validateForm()) {
            return;
        }

        
        try {
            await axios.post(`http://localhost:5000/reset-password/${id}/${token}`, { password });
            setErrors({});
            setSuccess(true);
            navigate("/signup");
        }
        catch (err) {
            console.log(err);
            setErrors(err.response?.data?.error || "Something went wrong");
        }
    }


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
         <div className="w-full md:w-2/5 flex justify-center items-center">
        
              <div className="flex flex-1 flex-col justify-center items-center bg-white">
              <h1 className="text-4xl font-bold mb-8 text-center">Reset Password</h1>
              {!success? (
              <form className="w-full flex justify-center items-center" onSubmit={handlePasswordUpdate}>
                <div className="w-full max-w-[25rem]">
                <CustomInput
                type="password"
                placeholder="Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)
                }

                error={errors.password}
                value={password}
                />
                <CustomInput
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                value={confirmPassword}
                />

                <button
                  type="submit"
                  className="w-full bg-black text-white p-4 text-xl font-bold rounded-md hover:bg-gray-800"
                >
                    Confirm Password
                </button>
                </div>
              </form>

                ): 
                (
                    <div className="w-full max-w-[25rem]">
                    <p className="text-green-500 text-center">Password updated successfully</p>
                    <Link to="/signup" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                    </div>
                )}



        

       
            </div>
          </div>
        </div>

  );
}