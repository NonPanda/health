import React, { useState } from "react";
import { Pencil } from "lucide-react";

const EditableInput = ({ name, placeholder, value: initialValue }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || "");

  const handleEdit = () => setIsEditing(true);
  const handleBlur = () => setIsEditing(false);
  const handleChange = (e) => setValue(e.target.value);

  return (
    <div className="relative w-full flex items-center">
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder || "Enter text"}
          className="p-2 border border-gray-300 rounded-md w-full focus:outline-blue-500"
          autoFocus
        />
      ) : (
        <div
          className="p-2 border border-gray-300 rounded-md w-full flex items-center justify-between cursor-pointer hover:bg-gray-50"
          onClick={handleEdit}
        >
          <span className="text-gray-700">
            {value || placeholder || "Click to edit"}
          </span>
          <Pencil className="w-4 h-4 text-gray-500" />
        </div>
      )}
    </div>
  );
};

export default EditableInput;
