import React, { useState } from "react";
import { CakeIcon, Pencil, WeightIcon, PhoneIcon, MapPin, Droplet, Ruler, Cake, SyringeIcon } from "lucide-react"; 
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

export default function Profile({ user }) {
  const handleInputChange = (name, newValue) => {
    console.log(`${name} changed to ${newValue}`);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
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
            <p className="text-sm text-slate-600">{user?.email || "chinmay@gmail.com"}</p>
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


        
          <div className="grid grid-cols-5 gap-6 py-4 ">
            <div className="space-y-1 flex-1">
              <div className="flex items-center space-x-2">
                <WeightIcon className="w-5 h-5 text-blue-900" />
                <h2 className="text-lg font-semibold text-blue-900">Weight</h2>
              </div>
              <Input
                name="weight"
                placeholder="X kg"
                value={user?.weight}
                onChange={(newValue) => handleInputChange("weight", newValue)}
                inputClassName="text-sm w-24"
              />
            </div>
            <div className="mx-[50%] border-r border-gray-200"></div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center space-x-2">
                <Ruler className="w-5 h-5 text-blue-900" />
                <h2 className="text-lg font-semibold text-blue-900">Height</h2>
              </div>
              <Input
                name="height"
                placeholder="X cm"
                value={user?.height}
                onChange={(newValue) => handleInputChange("height", newValue)}
                inputClassName="text-sm w-24"
              />
            </div>
        
            
            <div className="mx-[50%] border-r border-gray-200"></div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center space-x-2">
                <Cake className="w-5 h-5 text-blue-900" />
                <h2 className="text-lg font-semibold text-blue-900">Age</h2>
              </div>
              <Input
                name="age"
                placeholder="XX"
                value={user?.age}
                onChange={(newValue) => handleInputChange("age", newValue)}
                inputClassName="text-sm w-16"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 py-4">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Droplet className="w-5 h-5 text-blue-900" />
          <h2 className="pl-1 text-lg font-semibold text-blue-900">Allergic Reactions</h2>
        </div>
        <Input
          name="allergies"
          placeholder="Peanuts, Shellfish"
          value={user?.allergies?.join(", ")}
          onChange={(newValue) => handleInputChange("allergies", newValue)}
          inputClassName="w-full"
        />
      </div>

      <div className="mx-[50%] border-r border-gray-200"></div>

      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <PhoneIcon className="w-5 h-5 text-blue-900" />
          <h2 className="text-lg font-semibold text-blue-900">Emergency Contact</h2>
        </div>
        <Input
          name="emergency"
          placeholder="XXXXXXXX
          "
          value={user?.emergency}
          onChange={(newValue) => handleInputChange("emergency", newValue)}
          inputClassName="w-full"
        />
      </div>
    </div>



      <div className="grid grid-cols-3 gap-6 py-4">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <SyringeIcon className="w-5 h-5 text-blue-900" />
          <h2 className="pl-5 text-lg font-semibold text-blue-900">Medications</h2>
        </div>
        <Input
          name="medications"
          placeholder="Aspirin, Ibuprofen"
          value={user?.medications?.join(", ")}
          onChange={(newValue) => handleInputChange("medications", newValue)}
          inputClassName="w-full"
        />
      </div>
      <div className="mx-[50%] border-r border-gray-200"></div>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <CakeIcon className="w-5 h-5 text-blue-900" />
          <h2 className="pl-2 text-lg font-semibold text-blue-900">Diet Preferences</h2>
          </div>
          <Input
            name="diet"
            placeholder="Vegan, Vegetarian"
            value={user?.diet?.join(", ")}
            onChange={(newValue) => handleInputChange("diet", newValue)}
            inputClassName="w-full"
          />
        </div>
      </div>
        
  


      <div className="flex items-center space-x-2">
        <MapPin className="w-5 h-5 text-blue-900" />
        <h2 className="text-lg font-semibold text-blue-900">Location</h2>
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
