import React, { useState } from "react";
import { CakeIcon, Pencil, WeightIcon, PhoneIcon, MapPin, Droplet, Ruler, Cake, SyringeIcon, StethoscopeIcon, Clock10Icon, Calendar1, GraduationCapIcon, ComputerIcon, DollarSign } from "lucide-react"; 
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
  const centered = ["location"].includes(name) ? "": "text-center";


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
          className={`p-2 border border-gray-300 rounded-md focus:outline-none shadow-sm ${inputClassName} ${centered} `}
          autoFocus
        />
      ) : (
        <div
          className={`p-2 text-gray-100 cursor-pointer border border-white border-b-gray-100 hover:border-gray-200 ease-in-out duration-300 rounded-md flex items-center justify-between group ${inputClassName} ${centered}`}
          onClick={handleClick}

        >
          <div className={`w-full text-gray-600 ${centered}`}>{value || placeholder || "Click to edit"}</div>
          <Pencil className="-ml-5 w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
    <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <div className="-mt-16 w-full max-w-[42rem] bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center space-x-6 mb-4">
                <img
                    src={user?.pfp || pic}
                    alt="user"
                    className="w-20 h-20 rounded-full shadow-md"
                />
                <div>
                    <div className="flex items-center mb-2">
                        <h1 className="text-2xl font-semibold text-blue-900">{user?.name || "Username"}</h1>
                        <img src={MaleIcon} className="w-8 h-8" />
                    </div>
                    <p className="text-sm text-slate-600">{user?.email || "drchinmay@gmail.com"}</p>
                </div>
                <div className="flex items-center pl-[25%] space-x-2">
                    <PhoneIcon className="-mr-2 w-5 h-5 text-blue-900" />
                    <Input
                        name="phone"
                        placeholder="XXXXXXXXXX"
                        value={user?.phone}
                        onChange={(newValue) => handleInputChange("phone", newValue)}
                        inputClassName="text-sm w-32"
                    />
                </div>
            </div>


            
    
                <div className="grid grid-cols-3 gap-6 py-4">
        <div className="space-y-1">
            <div className="flex items-center space-x-2">
                <StethoscopeIcon className="w-5 h-5 text-blue-900" />
                <h2 className="px-3 text-lg font-semibold text-blue-900">Specialization</h2>
            </div>
            <Input
                    name="specialization"
                    placeholder="Cardiologist"
                    value={user?.specialization?.join(", ")}
                    onChange={(newValue) => handleInputChange("specialization", newValue)}
                    inputClassName="w-full"
            />
        </div>

        <div className="mx-[50%] border-r border-gray-200"></div>

        <div className="space-y-1">
            <div className="flex items-center space-x-2">
                <Clock10Icon className="w-5 h-5 text-blue-900" />
                <h2 className="px-2 text-lg font-semibold text-blue-900">Working Hours</h2>
            </div>
            <Input
                    name="workingHours"
                    placeholder="9:00 AM - 5:00 PM"
                    value={user?.workingHours}
                    onChange={(newValue) => handleInputChange("workingHours", newValue)}
                    inputClassName="w-full"
            />

        </div>
    </div>

        <div className="grid grid-cols-3 gap-6 py-4">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <ComputerIcon className="w-5 h-5 text-blue-900 flex-shrink-0" />
          <h2 className="px-5 text-lg font-semibold text-blue-900 whitespace-nowrap">Online Meet</h2>
        </div>
        <Input
          name="onlineConsultation"
          placeholder="Yes/No"
          value={user?.onlineConsultation}
          onChange={(newValue) => handleInputChange("onlineConsultation", newValue)}
          inputClassName="w-full"
        />
      </div>
    
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <GraduationCapIcon className="w-5 h-5 text-blue-900 flex-shrink-0" />
          <h2 className="px-4 text-lg font-semibold text-blue-900 whitespace-nowrap">Experience</h2>
        </div>
        <Input
          name="experience"
          placeholder="15 years"
          value={user?.experience}
          onChange={(newValue) => handleInputChange("experience", newValue)}
          inputClassName="w-full"
        />
      </div>
    
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-blue-900 flex-shrink-0" />
          <h2 className="text-lg font-semibold text-blue-900 whitespace-nowrap">Consultation Fees</h2>
        </div>
        <Input
          name="fees"
          placeholder="Rs. 500"
          value={user?.fees}
          onChange={(newValue) => handleInputChange("fees", newValue)}
          inputClassName="w-full"
        />
      </div>
    </div>



        <div className="grid grid-cols-3 gap-6 py-4">
        <div className="space-y-1">
            <div className="flex items-center space-x-2">
                <GraduationCapIcon className="w-5 h-5 text-blue-900" />
                <h2 className="px-5 text-lg font-semibold text-blue-900">Education</h2>
            </div>
            <Input
                    name="education"
                    placeholder="MBBS, MD"
                    value={user?.education?.join(", ")}
                    onChange={(newValue) => handleInputChange("education", newValue)}
                    inputClassName="w-full"
            />
        </div>
        <div className="mx-[50%] border-r border-gray-200"></div>
        <div className="space-y-1">
            <div className="flex items-center space-x-2">
                <GraduationCapIcon className="w-5 h-5 text-blue-900" />
                <h2 className="px-5 text-lg font-semibold text-blue-900">Certifications</h2>
                </div>
                    <Input
                            name="certifications"
                            placeholder="XYZ Certification"
                            value={user?.certifications?.join(", ")}
                            onChange={(newValue) => handleInputChange("certifications", newValue)}
                            inputClassName="w-full"
                    />
            </div>
        </div>

      



        <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-semibold text-blue-900">Clinic Address</h2>
        </div>
        <Input
            name="location"
            placeholder="ABC City, XYZ"
            value={user?.location}
            onChange={(newValue) => handleInputChange("location", newValue)}
            inputClassName="w-full px-7"
        />
</div>
</div>
);
}
