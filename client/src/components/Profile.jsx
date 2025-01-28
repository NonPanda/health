import React, { useState } from "react";
import { Pencil } from "lucide-react"; 
import {
  PhoneIcon,
  MapPin,
  Droplet,
  BarChart,
  Ruler,
  Heart,
  Cake,
} from "lucide-react"; 
import pic from "../assets/pic.png";
import MaleIcon from "../assets/male.svg";

const EditableInput = ({ name, placeholder, value: initialValue, onChange, inputClassName = "" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || "");

  const handleClick = () => setIsEditing(true);
  const handleBlur = () => {
    setIsEditing(false);
    onChange(value);
  };
  const handleChange = (e) => setValue(e.target.value);

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
          className={`p-2 border border-gray-300 rounded-md focus:outline-none shadow-sm ${inputClassName}`}
          autoFocus
        />
      ) : (
        <div
          className={`p-2 cursor-pointer border border-gray-300 border-opacity-0 hover:border-gray-300 transition-opacity rounded-md flex items-center justify-between group ${inputClassName}`}
          onClick={handleClick}
        >
          <span className="text-gray-700 truncate">{value || placeholder || "Click to edit"}</span>
          <Pencil className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div className="flex items-center space-x-6 mb-6">
          <img
            src={user?.pfp || pic}
            alt="user"
            className="w-20 h-20 rounded-full shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-2xl font-semibold text-blue-900">{user?.name || "Username"}</h1>
              <img src={MaleIcon} className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-600">{user?.email || "chinmay@gmail.com"}</p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <PhoneIcon className="w-5 h-5 text-blue-900" />
            <EditableInput
              name="phone"
              placeholder="Enter phone number"
              value={user?.phone}
              onChange={(newValue) => handleInputChange("phone", newValue)}
              inputClassName="text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <BarChart className="w-5 h-5 text-blue-900" />
              <h2 className="text-lg font-semibold text-blue-900">Weight</h2>
            </div>
            <EditableInput
              name="weight"
              placeholder="Enter weight"
              value={user?.weight}
              onChange={(newValue) => handleInputChange("weight", newValue)}
              inputClassName="text-sm w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Ruler className="w-5 h-5 text-blue-900" />
              <h2 className="text-lg font-semibold text-blue-900">Height</h2>
            </div>
            <EditableInput
              name="height"
              placeholder="Enter height"
              value={user?.height}
              onChange={(newValue) => handleInputChange("height", newValue)}
              inputClassName="text-sm w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-blue-900" />
              <h2 className="text-lg font-semibold text-blue-900">Blood Pressure</h2>
            </div>
            <EditableInput
              name="bloodPressure"
              placeholder="Enter blood pressure"
              value={user?.bloodPressure}
              onChange={(newValue) => handleInputChange("bloodPressure", newValue)}
              inputClassName="text-sm w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Cake className="w-5 h-5 text-blue-900" />
              <h2 className="text-lg font-semibold text-blue-900">Age</h2>
            </div>
            <EditableInput
              name="age"
              placeholder="Enter age"
              value={user?.age}
              onChange={(newValue) => handleInputChange("age", newValue)}
              inputClassName="text-sm w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-semibold text-blue-900">Location</h2>
          </div>
          <EditableInput
            name="location"
            placeholder="Enter location"
            value={user?.location}
            onChange={(newValue) => handleInputChange("location", newValue)}
            inputClassName="h-20 w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Droplet className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-semibold text-blue-900">Allergies</h2>
          </div>
          <EditableInput
            name="allergies"
            placeholder="Enter allergies"
            value={user?.allergies?.join(", ")}
            onChange={(newValue) => handleInputChange("allergies", newValue)}
            inputClassName="h-20 w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Droplet className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-semibold text-blue-900">Medications</h2>
          </div>
          <EditableInput
            name="medications"
            placeholder="Enter medications"
            value={user?.medications?.join(", ")}
            onChange={(newValue) => handleInputChange("medications", newValue)}
            inputClassName="h-20 w-full"
          />
        </div>
      </div>
    </div>
  );
}
