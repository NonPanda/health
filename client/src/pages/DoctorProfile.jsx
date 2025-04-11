import React, { useState, useEffect } from "react";
import { Pencil, PhoneIcon, StethoscopeIcon, Clock10Icon, GraduationCapIcon, DollarSign } from "lucide-react";
import pic from "../assets/pic.png";
import MaleIcon from "../assets/male.svg";
import axios from "axios";
import Input from "../components/Input";


export default function DoctorProfile({ user, setUser }) {
  console.log(user);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    avatar:"",
    email: "",
    phone: "",
    specialization: [],
    workingHours: "",
    experience: "",
    fees: "",
    education: [],
    certifications: [],
  });

  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setUpdatedProfile({
        name: user?.name || "",
        avatar: user?.profile?.avatar || "",
        email: user?.email || "",
        phone: user?.profile?.phone || "",
        specialization: Array.isArray(user?.profile?.specialization) ? user?.profile?.specialization : [],
        workingHours: user?.profile?.workingHours || "", 
        experience: user?.profile?.experience || "",
        fees: user?.profile?.fees || "",
        education: Array.isArray(user?.profile?.education) ? user?.profile?.education : [],
        certifications: Array.isArray(user?.profile?.certifications) ? user?.profile?.certifications : [],
      });
    }
  }, [user]);

  const handleInputChange = (name, newValue) => {
    setUpdatedProfile((prevState) => {
      let updatedValue = newValue;
      if (name === "specialization" || name === "education" || name === "certifications") {
        updatedValue = typeof newValue === "string" ? newValue.split(",").map((item) => item.trim()) : newValue;
      }

      if (JSON.stringify(prevState[name]) !== JSON.stringify(updatedValue)) {
        setChanged(true);
      }

      return {
        ...prevState,
        [name]: updatedValue,
      };
    });
  };

  const handleSave = async () => {
    try {
      const profileUpdate = {
        userId: user._id,
        profile: {
          avatar: updatedProfile.avatar,
          phone: updatedProfile.phone,
          specialization: updatedProfile.specialization,
          workingHours: updatedProfile.workingHours, 
          experience: updatedProfile.experience,
          fees: updatedProfile.fees,
          education: updatedProfile.education,
          certifications: updatedProfile.certifications,
        },
      };

      const res = await axios.put(`http://localhost:5000/api/doctor/updateprofile`, profileUpdate, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setChanged(false);
      console.log("Profile updated successfully:", res.data);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleProfilePictureChange = async (e) => {
    try {
      const file = e.target.files[0];
      if(!file) return;

      const formData = new FormData();
      formData.append("profilePicture", file);
      formData.append("userId", user._id);

      const res = await axios.put(`http://localhost:5000/api/doctor/uploadpfp`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(res.data);
      console.log(res.data.user);
      if(res.data.success){
        const updatedUser = res.data.user;
        setUpdatedProfile((prevState) => ({
          ...prevState,
          profilePicture: updatedUser.profile.avatar,
        }));
        setUser(updatedUser);
        
      }
      


    } catch (err) {
      console.log(err);
    }
  };

  if (!user || Object.keys(updatedProfile).length === 0) {
    return <div>Loading...</div>;
  }



  return (
    <div className="min-h-screen bg-[#3A8EF6]/5">
    <div className={`py-1 sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm shadow-sm transform transition-all duration-1000 ease-in-out ${changed ? "opacity-100" : "opacity-0"}`}>
      <div className="mx-auto px-4 py-2 flex items-center justify-between">
        <div className={`text-sm font-medium ${changed ? 'text-[#3A8EF6]' : 'text-gray-500'}`}>
          {changed ? "Changes pending..." : "All changes saved"}
        </div>
        <button 
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
              name="phone"
              placeholder="XXXXXXXXXX"
              value={user?.profile?.phone}
              onChange={(newValue) => handleInputChange("phone", newValue)}
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
                <StethoscopeIcon className="w-6 h-6 text-[#3A8EF6]" />
                <h2 className="text-2xl font-semibold text-[#3A8EF6]">Specialization</h2>
              </div>
              <Input
                name="specialization"
                placeholder="Cardiologist"
                value={Array.isArray(user?.profile?.specialization) ? user?.profile?.specialization.join(", ") : ""}
                onChange={(newValue) => {
                  const specializationArray = newValue.split(",").map((item) => item.trim());
                  handleInputChange("specialization", specializationArray);
                }}
                inputClassName="w-full"
              />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-3">
                <Clock10Icon className="w-6 h-6 text-[#3A8EF6]" />
                <h2 className="text-2xl font-semibold text-[#3A8EF6]">Working Hours</h2>
              </div>
              <Input
                name="workingHours"
                placeholder="9:00 AM - 5:00 PM"
                value={user?.profile?.workingHours}
                onChange={(newValue) => handleInputChange("workingHours", newValue)}
                inputClassName="w-full"
              />
            </div>
          </div>
        </div>
  
        <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-3">
                <GraduationCapIcon className="w-6 h-6 text-[#3A8EF6]" />
                <h2 className="text-2xl font-semibold text-[#3A8EF6]">Experience</h2>
              </div>
              <Input
                name="experience"
                placeholder="15 years"
                value={user?.profile?.experience}
                onChange={(newValue) => handleInputChange("experience", newValue)}
                inputClassName="w-full md:w-36"
              />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-6 h-6 text-[#3A8EF6]" />
                <h2 className="text-2xl font-semibold text-[#3A8EF6]">Consultation Fees</h2>
              </div>
              <Input
                name="fees"
                placeholder="Rs. 500"
                value={user?.profile?.fees}
                onChange={(newValue) => handleInputChange("fees", newValue)}
                inputClassName="w-full md:w-36"
              />
            </div>
          </div>
        </div>
  
        <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-3">
                <GraduationCapIcon className="w-6 h-6 text-[#3A8EF6]" />
                <h2 className="text-2xl font-semibold text-[#3A8EF6]">Education</h2>
              </div>
              <Input
                name="education"
                placeholder="MBBS, MD"
                value={Array.isArray(user?.profile?.education) ? user?.profile?.education.join(", ") : ""}
                onChange={(newValue) => {
                  const educationArray = newValue.split(",").map((item) => item.trim());
                  handleInputChange("education", educationArray);
                }}
                inputClassName="w-full"
              />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-3">
                <GraduationCapIcon className="w-6 h-6 text-[#3A8EF6]" />
                <h2 className="text-2xl font-semibold text-[#3A8EF6]">Certifications</h2>
              </div>
              <Input
                name="certifications"
                placeholder="XYZ Certification"
                value={Array.isArray(user?.profile?.certifications) ? user?.profile?.certifications.join(", ") : ""}
                onChange={(newValue) => {
                  const certificationsArray = newValue.split(",").map((item) => item.trim());
                  handleInputChange("certifications", certificationsArray);
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