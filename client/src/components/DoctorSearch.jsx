import React, { useState,useRef,useEffect } from "react";
import axios from "axios";
import { BsFunnel } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import pic from "../assets/pic.png";

const DoctorSearch = () => {
  const [query, setQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState(10);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState("initial");
  const [error, setError] = useState("");
  const [filterdropdown, setFilterDropdown] = useState(false);
  const [minReviewRating, setMinReviewRating] = useState(0);
  const filterRef = useRef(null);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (filterdropdown&&filterRef.current && !filterRef.current.contains(event.target){
  //       setFilterDropdown(false);
  //     }
  //   };
  //   if (filterdropdown) {
  //       document.addEventListener("mousedown", handleClickOutside);
  //   }
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [filterdropdown]);


  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      search: query,
      maxDistance: maxDistance * 1000,
      minReviewRating,
    });

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/doctor/search?${params.toString()}`,
        { withCredentials: true }
      );

      console.log("Doctors found:", data);
      setDoctors(data.data || []);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="mt-8 max-w-7xl mx-auto p-10 bg-white rounded-xl">
    <div className="flex justify-center">
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="w-full relative flex items-center justify-center">
          <BsFunnel className={`absolute -start-2 sm:start-2 w-6 h-6 hover:text-blue-700 cursor-pointer ${filterdropdown?'scale-110 text-blue-800':'hover:scale-110 transition-transform duration-200 text-blue-600'}
          `} onClick={(e)=>{
            e.stopPropagation();
            setFilterDropdown((prev)=>!prev);
          }}
           />
          <div ref={filterRef} className={`absolute start-0 top-12 sm:top-14 w-40 sm:w-52 bg-white border border-blue-100 rounded-lg backdrop-blur-md shadow-sm transition-all p-4 duration-200 ease-in-out transform ${filterdropdown ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
            <label className="block text-sm font-medium text-gray-600 mb-1">Max Distance (km):</label>
            <input
              type="text"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              className="w-full p-2 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none"
            />
            <label className="block mt-4 text-sm font-medium text-gray-600 mb-1">Minimum Rating:</label>
            <select
              value={minReviewRating}
              onChange={(e) => setMinReviewRating(e.target.value)}
              className="w-full p-2 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none"
            >
              <option value="0">Any</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

  
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p-2.5 sm:w-full w-5/6 px-4 text-sm text-gray-900 bg-gray-50 rounded-full border border-gray-200 focus:outline-none hover:bg-blue-50 shadow-sm"
            placeholder="Describe your symptoms..."
            required
          />
  
          <button
            type="submit"
            className="absolute end-5 w-10 sm:w-12 p-2.5 sm:p-3.5 text-sm font-medium h-full text-white bg-blue-600 rounded-e-full border-l-1 border-blue-700 hover:bg-blue-700 focus:ring-1 focus:outline-none focus:ring-blue-300 shadow-sm"
          >
            <FaSearch className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  
    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    {loading === true && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}
  
    <div className="mt-8">
      {(doctors.length > 0) ? (
       <div>
       <ul className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
  {doctors.map((doctor) => (
    <li
      key={doctor._id}
      className="p-4 bg-blue-50 rounded-2xl shadow-sm hover:shadow-md shadow-blue-200 hover:shadow-blue-300 transition-shadow duration-300 w-full max-w-2xl"
    > 
    
      <div className="flex items-start gap-8">
        <div className="flex flex-col items-center border-r-2 border-accent pr-8">
          <img
            src={doctor.profile.avatar || pic}
            alt={doctor.name}
            className="w-36 h-40 object-cover border-2 border-accent rounded-md"
          />
          <div className="mt-8">
            <button
              className="w-full bg-primary text-white py-[8px] px-[14px] text-md rounded-md hover:bg-blue-700 transition-colors duration-200"
              onClick={() => {
                console.log("Book appointment with", doctor.name);
              }}
            >
              Book Appointment
            </button>
          </div>
        </div>

        {/* Doctor Details */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row text-md text-blue-900 gap-4">
            <span className="font-medium sm:w-24">Name:</span>
            <span className="flex-1">{doctor.name}</span>
          </div>
          <div className="flex flex-col sm:flex-row text-md text-blue-900 gap-4">
            <span className="font-medium sm:w-24">Specialization:</span>
            <span className="flex-1">
              {doctor.profile.specialization?.join(", ") || "General Physician"}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row text-md text-blue-900 gap-4">
            <span className="font-medium sm:w-24">Distance:</span>
            <span className="flex-1">{(doctor.distance / 1000).toFixed(2)} km</span>
          </div>
          <div className="flex flex-col sm:flex-row text-md text-blue-900 gap-4">
            <span className="font-medium sm:w-24">Rating:</span>
            <span className="flex-1">{doctor.rating || "N/A"}</span>
          </div>
          <div className="flex flex-col sm:flex-row text-md text-blue-900 gap-4">
            <span className="font-medium sm:w-24">Fees:</span>
            <span className="flex-1">
              {doctor.profile.fees ? `$${doctor.profile.fees}` : "Not Available"}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row text-md text-blue-900 gap-4">
            <span className="font-medium sm:w-24">Experience:</span>
            <span className="flex-1">
              {doctor.profile.experience
                ? `${doctor.profile.experience} years`
                : "Not Available"}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row text-md text-blue-900 gap-4">
            <span className="font-medium sm:w-24">Address:</span>
            <span className="flex-1">
              {doctor.location.formattedAddress || "Unknown"}
            </span>
          </div>
        </div>
      </div>
    </li>
  ))}
</ul>
     </div>
      ) : (
      loading!=="initial" ?
      (
        (!loading) && (
          <p className="text-gray-500 text-center mt-4">
            No doctors found. Try a different search.
          </p>
        )
      ):
      (
        <p className="text-gray-500 text-center mt-4">
          Search for doctors based on your symptoms.
        </p>
      )
      )}

      
    </div>
  </div>
  );
};

export default DoctorSearch;



