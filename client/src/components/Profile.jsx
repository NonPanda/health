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

  const centered = ["location"].includes(name) ? "" : "text-center";
  const smallbox = ["weight", "height", "age"].includes(name) ? "ml-[15.8px]" : "ml-[17px]";

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
          className={`lg:p-2 p-1 border border-gray-300 rounded-md focus:outline-none shadow-md text-lg lg:text-xl ${inputClassName} ${centered}`}
          autoFocus
        />
      ) : (
        <div
          className={`p-1 lg:p-2 text-gray-800 cursor-pointer border border-white border-b-gray-200 hover:border-gray-400 rounded-md flex items-center justify-between group lg:text-xl text-lg ${inputClassName} ${centered}`}
          onClick={handleClick}
        >
          <div className={`${smallbox} w-full text-lg lg:text-xl ${centered}`}>{value || placeholder || "Click to edit"}</div>
          <Pencil className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
    <div className="flex items-center justify-center">
      <div className="w-full px-4 md:px-24 py-20">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 mb-8 justify-between -pr-4 sm:pr-4">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <img src={user?.pfp || pic} alt="user" className="sm:ml-0 ml-4 w-32 h-32 rounded-full shadow-md" />
            <div className="ml-10 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900">{user?.name || "Username"}</h1>
                <img src={MaleIcon} className="w-10 h-10 ml-4" />
              </div>
              <p className="pr-5 text-lg lg:text-xl text-slate-600">{user?.email || "email@example.com"}</p>
            </div>
          </div>
          <div className="sm:scale-100 scale-90 flex items-center space-x-2">
            <PhoneIcon className="w-6 h-6 text-blue-900" />
            <Input
              name="phone"
              placeholder="XXXXXXXXXX"
              value={user?.phone}
              onChange={(newValue) => handleInputChange("phone", newValue)}
              inputClassName="lg:text-lg w-[160px] mr-2 md:mr-0"
            />
          </div>
        </div>


        <div className="hidden lg:flex flex-col md:flex-row py-6 space-y-8 md:space-y-0 md:space-x-8">
          <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-[15%] w-full">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-3">
                <WeightIcon className="w-6 h-6 text-blue-900" />
                <h2 className="text-2xl font-semibold text-blue-900">Weight</h2>
              </div>
              <Input
                name="weight"
                placeholder="X kg"
                value={user?.weight}
                onChange={(newValue) => handleInputChange("weight", newValue)}
                inputClassName="w-full md:w-36"
              />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-3">
                <Ruler className="w-6 h-6 text-blue-900" />
                <h2 className="text-2xl font-semibold text-blue-900">Height</h2>
              </div>
              <Input
                name="height"
                placeholder="X cm"
                value={user?.height}
                onChange={(newValue) => handleInputChange("height", newValue)}
                inputClassName="w-full md:w-36"
              />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-3">
                <Cake className="w-6 h-6 text-blue-900" />
                <h2 className="text-2xl font-semibold text-blue-900">Age</h2>
              </div>
              <Input
                name="age"
                placeholder="XX"
                value={user?.age}
                onChange={(newValue) => handleInputChange("age", newValue)}
                inputClassName="w-full md:w-36"
              />
            </div>
          </div>
          <div className="flex flex-col items-center space-y-2 w-full md:w-auto">
            <div className="flex items-center space-x-3">
              <Droplet className="w-6 h-6 text-blue-900" />
              <h2 className="text-2xl font-semibold text-blue-900">Allergic Reactions</h2>
            </div>
            <Input
              name="allergies"
              placeholder="Peanuts, Shellfish"
              value={user?.allergies?.join(", ")}
              onChange={(newValue) => handleInputChange("allergies", newValue)}
              inputClassName="w-full md:min-w-[300px]"
            />
          </div>
        </div>

        <div className="hidden lg:flex flex-col md:flex-row items-center justify-between w-full space-y-8 md:space-y-0">
          <div className="flex flex-col items-center space-y-2 w-full md:w-auto">
            <div className="flex items-center space-x-3">
              <PhoneIcon className="w-6 h-6 text-blue-900" />
              <h2 className="text-2xl font-semibold text-blue-900">Emergency Contact</h2>
            </div>
            <Input
              name="emergency"
              placeholder="XXXXXXXXXX"
              value={user?.emergency}
              onChange={(newValue) => handleInputChange("emergency", newValue)}
              inputClassName="w-full md:min-w-[300px]"
            />
          </div>
          <div className="flex flex-col items-center space-y-2 w-full md:w-auto">
            <div className="flex items-center space-x-3">
              <SyringeIcon className="w-6 h-6 text-blue-900" />
              <h2 className="text-2xl font-semibold text-blue-900">Medications</h2>
            </div>
            <Input
              name="medications"
              placeholder="Aspirin, Ibuprofen"
              value={user?.medications?.join(", ")}
              onChange={(newValue) => handleInputChange("medications", newValue)}
              inputClassName="w-full md:min-w-[300px]"
            />
          </div>
          <div className="flex flex-col items-center space-y-2 w-full md:w-auto">
            <div className="flex items-center space-x-3">
              <CakeIcon className="w-6 h-6 text-blue-900" />
              <h2 className="text-2xl font-semibold text-blue-900">Diet Preferences</h2>
            </div>
            <Input
              name="diet"
              placeholder="Vegan, Vegetarian"
              value={user?.diet?.join(", ")}
              onChange={(newValue) => handleInputChange("diet", newValue)}
              inputClassName="w-full md:min-w-[300px]"
            />
          </div>
        </div>

        <div className="[@media(max-width:390px)]:scale-75 [@media(max-width:390px)]:-mt-16 flex lg:hidden flex-col space-y-8">
  <div className="flex justify-center space-x-8">
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-3">
        <Cake className="w-6 h-6 text-blue-900" />
        <h2 className="text-2xl font-semibold text-blue-900">Age</h2>
      </div>
      <Input
        name="age"
        placeholder="XX"
        value={user?.age}
        onChange={(newValue) => handleInputChange("age", newValue)}
        inputClassName="w-30"
      />
    </div>
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-3">
        <WeightIcon className="w-6 h-6 text-blue-900" />
        <h2 className="text-2xl font-semibold text-blue-900">Weight</h2>
      </div>
      <Input
        name="weight"
        placeholder="X kg"
        value={user?.weight}
        onChange={(newValue) => handleInputChange("weight", newValue)}
        inputClassName="w-30"
      />
    </div>
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-3">
        <Ruler className="w-6 h-6 text-blue-900" />
        <h2 className="text-2xl font-semibold text-blue-900">Height</h2>
      </div>
      <Input
        name="height"
        placeholder="X cm"
        value={user?.height}
        onChange={(newValue) => handleInputChange("height", newValue)}
        inputClassName="w-30"
      />
    </div>
  </div>

  <div className="flex flex-col md:flex-row justify-center md:space-x-8 md:space-y-0 space-y-8">
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-3">
        <Droplet className="w-6 h-6 text-blue-900" />
        <h2 className="text-2xl font-semibold text-blue-900">Allergic Reactions</h2>
      </div>
      <Input
        name="allergies"
        placeholder="Peanuts, Shellfish"
        value={user?.allergies?.join(", ")}
        onChange={(newValue) => handleInputChange("allergies", newValue)}
        inputClassName="w-full min-w-[300px]"
      />
    </div>
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-3">
        <PhoneIcon className="w-6 h-6 text-blue-900" />
        <h2 className="text-2xl font-semibold text-blue-900">Emergency Contact</h2>
      </div>
      <Input
        name="emergency"
        placeholder="XXXXXXXXXX"
        value={user?.emergency}
        onChange={(newValue) => handleInputChange("emergency", newValue)}
        inputClassName="w-full min-w-[300px]"
      />
    </div>
  </div>

  <div className="flex flex-col md:flex-row justify-center md:space-x-8 md:space-y-0 space-y-8">
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-3">
        <SyringeIcon className="w-6 h-6 text-blue-900" />
        <h2 className="text-2xl font-semibold text-blue-900">Medications</h2>
      </div>
      <Input
        name="medications"
        placeholder="Aspirin, Ibuprofen"
        value={user?.medications?.join(", ")}
        onChange={(newValue) => handleInputChange("medications", newValue)}
        inputClassName="w-full min-w-[300px]"
      />
    </div>
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-3">
        <CakeIcon className="w-6 h-6 text-blue-900" />
        <h2 className="text-2xl font-semibold text-blue-900">Diet Preferences</h2>
      </div>
      <Input
        name="diet"
        placeholder="Vegan, Vegetarian"
        value={user?.diet?.join(", ")}
        onChange={(newValue) => handleInputChange("diet", newValue)}
        inputClassName="w-full min-w-[300px]"
      />
    </div>
  </div>
</div>

        

        {/* <div className="scale-75 sm:scale-100 space-y-2">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-blue-900" />
            <h2 className="text-2xl font-semibold text-blue-900">Location</h2>
          </div>
          <Input
            name="location"
            placeholder="ABC City, XYZ"
            value={user?.location}
            onChange={(newValue) => handleInputChange("location", newValue)}
            inputClassName="w-full"
          />
        </div> */}
      </div>
    </div>
  );
}