import React from 'react';

const CustomInput = ({ 
    type,placeholder,name,onChange,error,value
  }) => {
    return (
      <div className="mb-4 w-full">
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          value={value}
          className={`p-2 border rounded-md w-full ${
            error ? 'border-red-500' : 'border-gray-300 focus:outline-gray-400'
          }`}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  };

  export default CustomInput;

