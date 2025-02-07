import React, { useState } from "react";
import { Pencil, PhoneIcon, MapPin, StethoscopeIcon, Clock10Icon, GraduationCapIcon, DollarSign } from "lucide-react";
import pic from "../assets/pic.png";
import MaleIcon from "../assets/male.svg";

const Input = ({ name, placeholder, value: initialValue, onChange, inputClassName = "" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || "");

  const handleClick = () => setIsEditing(true);
  const handleBlur = () => {
    setIsEditing(false);
    onChange(value);
  };
  const handleChange = (e) => setValue(e.target.value);
  const centered = [""].includes(name) ? "" : "text-center";
  const smallbox = ["experience", "fees"].includes(name) ? "ml-[15.8px]" : "ml-[17px]";

  return (
    <div className="relative">
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`p-2 border border-gray-300 rounded-md focus:outline-none shadow-md text-xl ${inputClassName} ${centered}`}
          autoFocus
        />
      ) : (
        <div
          className={`p-2 text-gray-800 cursor-pointer border border-white border-b-gray-200 hover:border-gray-400 rounded-md flex items-center justify-between group text-xl ${inputClassName} ${centered}`}
          onClick={handleClick}
        >
          <div className={`${smallbox} w-full text-xl ${centered}`}>{value || placeholder || "Click to edit"}</div>
          <Pencil className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </div>
  );
};

export default function DoctorProfile({ user }) {
  const handleInputChange = (name, newValue) => {
    console.log(`${name} changed to ${newValue}`);
  };

  return (
<div className="flex items-center justify-center">
  <div className="w-full px-4 md:px-24 py-12">
    {/* Top Section */}
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 mb-8 justify-between sm:-pr-4 sm:pr-4">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <img
          src={user?.pfp || pic}
          alt="user"
          className="ml-4 w-32 h-32 rounded-full shadow-md"
        />
        <div className="ml-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-4">
            <h1 className="text-4xl font-bold text-blue-900">
              {user?.name || "Username"}
            </h1>
            <img src={MaleIcon} className="w-10 h-10 ml-4" />
          </div>
          <p className="pr-5 text-xl text-slate-600">
            {user?.email || "email@example.com"}
          </p>
        </div>
      </div>
      <div className="sm:scale-100 scale-90 flex items-center space-x-2">
        <PhoneIcon className="w-6 h-6 text-blue-900" />
        <Input
          name="phone"
          placeholder="XXXXXXXXXX"
          value={user?.phone}
          onChange={(newValue) => handleInputChange("phone", newValue)}
          inputClassName="text-xl w-[175px]"
        />
      </div>
    </div>

    {/* Responsive Grid Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <StethoscopeIcon className="w-6 h-6 text-blue-900" />
          <h2 className="text-2xl font-semibold text-blue-900">Specialization</h2>
        </div>
        <Input
          name="specialization"
          placeholder="Cardiologist"
          value={user?.specialization?.join(", ")}
          onChange={(newValue) => handleInputChange("specialization", newValue)}
          inputClassName="w-[300px]"
        />
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <Clock10Icon className="w-6 h-6 text-blue-900" />
          <h2 className="text-2xl font-semibold text-blue-900">Working Hours</h2>
        </div>
        <Input
          name="workingHours"
          placeholder="9:00 AM - 5:00 PM"
          value={user?.workingHours}
          onChange={(newValue) => handleInputChange("workingHours", newValue)}
          inputClassName="w-[300px]"
        />
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <GraduationCapIcon className="w-6 h-6 text-blue-900 flex-shrink-0" />
          <h2 className="text-2xl font-semibold text-blue-900">Experience</h2>
        </div>
        <Input
          name="experience"
          placeholder="15 years"
          value={user?.experience}
          onChange={(newValue) => handleInputChange("experience", newValue)}
          inputClassName="w-40"
        />
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-6 h-6 text-blue-900 flex-shrink-0" />
          <h2 className="text-2xl font-semibold text-blue-900">Consultation Fees</h2>
        </div>
        <Input
          name="fees"
          placeholder="Rs. 500"
          value={user?.fees}
          onChange={(newValue) => handleInputChange("fees", newValue)}
          inputClassName="w-40"
        />
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <GraduationCapIcon className="w-6 h-6 text-blue-900" />
          <h2 className="text-2xl font-semibold text-blue-900">Education</h2>
        </div>
        <Input
          name="education"
          placeholder="MBBS, MD"
          value={user?.education?.join(", ")}
          onChange={(newValue) => handleInputChange("education", newValue)}
          inputClassName="w-[300px]"
        />
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <GraduationCapIcon className="w-6 h-6 text-blue-900" />
          <h2 className="text-2xl font-semibold text-blue-900">Certifications</h2>
        </div>
        <Input
          name="certifications"
          placeholder="XYZ Certification"
          value={user?.certifications?.join(", ")}
          onChange={(newValue) => handleInputChange("certifications", newValue)}
          inputClassName="w-[300px]"
        />
      </div>
    </div>
  </div>
</div>

  );
}