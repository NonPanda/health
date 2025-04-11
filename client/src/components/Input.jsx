import React, { useState } from "react";
import { Pencil } from "lucide-react";

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
  const smallbox = ["weight", "height", "age", "experience", "fees"].includes(name) ? "ml-[15.8px]" : "ml-[17px]";

  return (
     <div className="relative group">
         {isEditing ? (
           <input
             type="text"
             name={name}
             value={value}
             onChange={handleChange}
             onBlur={handleBlur}
             placeholder={placeholder}
             className={`lg:p-2 p-1 border border-[#3A8EF6]/20 rounded-md focus:outline-none focus:border-[#3A8EF6] focus:ring-2 focus:ring-[#3A8EF6]/20 shadow-md text-lg lg:text-xl ${inputClassName} ${centered} bg-white`}
             autoFocus
           />
         ) : (
           <div
             className={`p-1 lg:p-2 text-gray-800 cursor-pointer border border-transparent hover:border-[#3A8EF6]/20 hover:shadow-lg rounded-md flex items-center justify-between group lg:text-xl text-lg transition-all duration-300 hover:bg-[#3A8EF6]/5 ${inputClassName} ${centered} border-b-[2px] border-b-[#3A8EF6]/10`}
             onClick={handleClick}
           >
             <div className={`${smallbox} w-full text-lg lg:text-xl ${centered}`}>{value || placeholder || "Click to edit"}</div>
             <Pencil className="w-5 h-5 text-[#3A8EF6] opacity-0 group-hover:opacity-100 transition-opacity" />
           </div>
         )}
       </div>
  );
};

export default Input;