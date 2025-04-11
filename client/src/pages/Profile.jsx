import React, { useState,useEffect } from "react";
import { CakeIcon, Pencil, WeightIcon, PhoneIcon, MapPin, Droplet, Ruler, Cake, SyringeIcon, Cookie } from "lucide-react";
import pic from "../assets/pic.png";
import MaleIcon from "../assets/male.svg";
import axios from "axios";
import Input from "../components/Input";  



export default function Profile({ user, setUser }) {
  const [updateProfile, setUpdateProfile] = useState({
    name: "",
    avatar: "",
    email: "",
    contact: "",
    weight: 0,
    height: 0,
    age: 0,
    allergies: [],
    medications: [],
    dietPreferences: [],
    emergency: "",
    location: {
      coordinates: [],
      formattedAddress: "",
      city: "",
      state: "",
      zipcode: "",
    },
  });
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setUpdateProfile({
        name: user?.name || "",
        avatar: user?.profile?.avatar || "",
        email: user?.email || "",
        contact: user?.profile?.contact || "",
        weight: user?.profile?.weight || 0,
        height: user?.profile?.height || 0,
        age: user?.profile?.age || 0,
        allergies: Array.isArray(user?.profile?.allergies) ? user?.profile?.allergies : [],
        medications: Array.isArray(user?.profile?.medications) ? user?.profile?.medications : [],
        dietPreferences: Array.isArray(user?.profile?.dietPreference) ? user?.profile?.dietPreference : [],
        emergency: user?.profile?.emergency || "",
        location: user?.profile?.location || {
          coordinates: [],
          formattedAddress: "",
          city: "",
          state: "",
          zipcode: "",
        },
      });
    }
  }, [user]);


  const handleInputChange = (name, newValue) => {
    setUpdateProfile((prevState) => {
      let updatedValue = newValue;
  
      if (name === "allergies" || name === "medications" || name === "dietPreferences") {
        updatedValue = typeof newValue === "string" ? newValue.split(",").map((item) => item.trim()) : newValue;
  
        const isArrayEqual = Array.isArray(prevState[name]) && Array.isArray(updatedValue) && prevState[name].length === updatedValue.length &&prevState[name].every((val, index) => val === updatedValue[index]);
  
        if (!isArrayEqual) {
          setChanged(true);
        }
      } else {
        if (prevState[name] !== updatedValue) {
          setChanged(true);
        }
      }
  
      return {
        ...prevState,
        [name]: updatedValue,
      };
    });
  };
  const handleSave = async () => {
    try {
      if (Object.keys(updateProfile).length === 0) return;
  
      const profileUpdate = {
        userId: user._id,
        profile: {
          avatar: updateProfile.avatar,
          contact: updateProfile.contact,
          weight: updateProfile.weight,
          height: updateProfile.height,
          age: updateProfile.age,
          allergies: updateProfile.allergies,
          medications: updateProfile.medications,
          dietPreference: updateProfile.dietPreferences,
          emergency: updateProfile.emergency,
          location: updateProfile.location
        }
      };
  
      const res = await axios.put(`http://localhost:5000/api/user/updateprofile`, profileUpdate, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        setChanged(false);
        setUser(res.data.user); 
      } else {
        throw new Error(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.message || "Failed to update profile. Please try again.");
    }
  };

  const handleProfilePictureChange = async (e) => {
    try {
      const file = e.target.files[0];
      console.log(file);
      if(!file) return;

      const formData = new FormData();
      formData.append("profilePicture", file);
      formData.append("userId", user._id);

      const res = await axios.put(`http://localhost:5000/api/user/uploadpfp`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(res.data);
      console.log(res.data.user);
      if(res.data.success){
        const updatedUser = res.data.user;
        setUpdateProfile((prevState) => ({
          ...prevState,
          profilePicture: updatedUser.profile.avatar,
        }));
        setUser(updatedUser);
        
      }
      


    } catch (err) {
      console.log(err);
    }
  };
  
      


  if (!user || Object.keys(updateProfile).length === 0) {
    return (
      <div className="fixed inset-0 bg-[#3A8EF6]/90 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <div className="animate-spin w-8 h-8 border-4 border-[#3A8EF6] border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg font-medium text-[#3A8EF6]">Loading your profile...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#3A8EF6]/5">
      <div className={`py-1 sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm shadow-sm transform transition-all duration-1000 ease-in-out ${changed ? "opacity-100" : "opacity-0"}`}>
        <div className="mx-auto px-4 py-2 flex items-center justify-between">
          <div className={`text-sm font-medium ${changed ? 'text-[#3A8EF6]' : 'text-gray-500'}`}>
            {changed ? "Changes pending..." : "All changes saved"}
          </div>
          <button 
            id="saveButton"
            onClick={handleSave} 
            className={`
              transform transition-all duration-700 ease-in-out px-6 py-2 rounded-lg font-medium w-[150px]
              ${changed ? 'bg-[#3A8EF6] hover:bg-[#3A8EF6]/90 text-white translate-y-0 opacity-100 shadow-md hover:shadow-lg active:scale-95': 'bg-gray-100 text-gray-400 opacity-0 pointer-events-none'
              }
            `}
            disabled={!changed}
          >
            {changed ? 'Save Changes' : 'Saved'}
          </button>
        </div>
      </div>

      <div className="w-full px-4 md:px-24 py-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 justify-between">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative inline-block">
                <img src={user?.profile?.avatar || pic} alt="user" className="sm:ml-0 ml-4 w-32 h-32 rounded-full shadow-lg border-4 border-[#3A8EF6]/40" />
                <label
                  htmlFor="profilePictureInput"
                  className="absolute bottom-0 right-0 bg-[#3A8EF6] text-white rounded-full p-2 cursor-pointer hover:bg-[#3A8EF6]/90 transition-opacity shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5H21a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h5.768M16 3l-4 4m0 0l-4-4m4 4V15"
                    />
                  </svg>
                </label>
                <input
                  id="profilePictureInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </div>
              <div className="ml-10 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-4">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3A8EF6]">{user?.name || "Username"}</h1>
                  <img src={MaleIcon} className="w-10 h-10 ml-4" />
                </div>
                <p className="pr-5 text-lg lg:text-xl text-slate-600">{user?.email || "email@example.com"}</p>
              </div>
            </div>
            <div className="sm:scale-100 scale-90 flex items-center space-x-2">
              <PhoneIcon className="w-6 h-6 text-[#3A8EF6]" />
              <Input
                name="contact"
                placeholder="XXXXXXXXXX"
                value={user?.profile?.contact}
                onChange={(newValue) => handleInputChange("contact", newValue)}
                inputClassName="lg:text-lg w-[160px] mr-2 md:mr-0"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-3">
                  <WeightIcon className="w-6 h-6 text-[#3A8EF6]" />
                  <h2 className="text-2xl font-semibold text-[#3A8EF6]">Weight</h2>
                </div>
                <Input
                  name="weight"
                  placeholder="X kg"
                  value={user?.profile?.weight}
                  onChange={(newValue) => handleInputChange("weight", newValue)}
                  inputClassName="w-full md:w-36"
                />
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-3">
                  <Ruler className="w-6 h-6 text-[#3A8EF6]" />
                  <h2 className="text-2xl font-semibold text-[#3A8EF6]">Height</h2>
                </div>
                <Input
                  name="height"
                  placeholder="X cm"
                  value={user?.profile?.height}
                  onChange={(newValue) => handleInputChange("height", newValue)}
                  inputClassName="w-full md:w-36"
                />
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-3">
                  <Cake className="w-6 h-6 text-[#3A8EF6]" />
                  <h2 className="text-2xl font-semibold text-[#3A8EF6]">Age</h2>
                </div>
                <Input
                  name="age"
                  placeholder="XX"
                  value={user?.profile?.age}
                  onChange={(newValue) => handleInputChange("age", newValue)}
                  inputClassName="w-full md:w-36"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-3">
                  <Droplet className="w-6 h-6 text-[#3A8EF6]" />
                  <h2 className="text-2xl font-semibold text-[#3A8EF6]">Allergies</h2>
                </div>
                <Input
                  name="allergies"
                  placeholder="Peanuts, Shellfish"
                  value={Array.isArray(user?.profile?.allergies) ? user.profile.allergies.join(", ") : ""}
                  onChange={(newValue) => {
                    const allergyArray = newValue.split(",").map((item) => item.trim());
                    handleInputChange("allergies", allergyArray);
                  }}
                  inputClassName="w-full"
                />
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-3">
                  <SyringeIcon className="w-6 h-6 text-[#3A8EF6]" />
                  <h2 className="text-2xl font-semibold text-[#3A8EF6]">Medications</h2>
                </div>
                <Input
                  name="medications"
                  placeholder="Aspirin, Ibuprofen"
                  value={Array.isArray(user?.profile?.medications) ? user?.profile?.medications.join(", ") : ""}
                  onChange={(newValue) => {
                    const medicationArray = newValue.split(",").map((item) => item.trim());
                    handleInputChange("medications", medicationArray);
                  }}
                  inputClassName="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-6 h-6 text-[#3A8EF6]" />
                  <h2 className="text-2xl font-semibold text-[#3A8EF6]">Emergency</h2>
                </div>
                <Input
                  name="emergency"
                  placeholder="XXXXXXXXXX"
                  value={user?.profile?.emergency}
                  onChange={(newValue) => handleInputChange("emergency", newValue)}
                  inputClassName="w-full min-w-48"
                />
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-3">
                  <CakeIcon className="w-6 h-6 text-[#3A8EF6]" />
                  <h2 className="text-2xl font-semibold text-[#3A8EF6]">Diet</h2>
                </div>
                <Input
                  name="dietPreferences"
                  placeholder="Vegan, Vegetarian"
                  value={Array.isArray(user?.profile?.dietPreference) ? user?.profile?.dietPreference.join(", ") : ""}
                  onChange={(newValue) => {
                    const dietPreferenceArray = newValue.split(",").map((item) => item.trim());
                    handleInputChange("dietPreferences", dietPreferenceArray);
                  }}
                  inputClassName="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}