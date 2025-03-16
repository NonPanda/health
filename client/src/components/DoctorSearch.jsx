
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaStar } from "react-icons/fa";
import pic from "../assets/pic.png";
import { BsFunnel } from "react-icons/bs";
import { Link } from "react-router-dom";

const DoctorSearch = () => {
  const [query, setQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState(50);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState("initial");
  const [error, setError] = useState("");
  const [minReviewRating, setMinReviewRating] = useState(0);
  const [specialization, setSpecialization] = useState("all");
  const [results, setResults] = useState(true);
  const [filtersChanged, setFiltersChanged] = useState(false);

  const specializations = [
    "All",
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Pediatrician",
    "Psychiatrist",
    "Orthopedist",
    "Gynecologist",
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if(specialization !== "all" || minReviewRating !== 0 || maxDistance !== 50) {
    setFiltersChanged(true);
    } 
    

  }, [specialization, minReviewRating, maxDistance]);

  const fetchDoctors = async (searchParams = {}) => {
    if (query === "") return;
    setLoading(true);
    setError("");
    setResults(false);

    try {
      const params = new URLSearchParams({
        search: searchParams.search || "",
        maxDistance: (searchParams.maxDistance || maxDistance) * 1000,
        minReviewRating: searchParams.minReviewRating || minReviewRating,
        specialization: searchParams.specialization === "all" ? "" : (searchParams.specialization || specialization),
      });

      const { data } = await axios.get(
        `http://localhost:5000/api/doctor/search?${params.toString()}`,
        { withCredentials: true }
      );

      console.log("Doctors found:", data);
      setDoctors(data.data || []);
      setResults(true);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchDoctors({
      search: query,
      maxDistance,
      minReviewRating,
      specialization,
    });
  };

  const resetFilters = () => {
    setSpecialization("all");
    setMinReviewRating(0);
    setMaxDistance(50);
    setFiltersChanged(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-72 bg-white/80 p-8 space-y-8 border-r border-gray-100 shadow-lg sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="flex gap-3 pb-4 border-b border-gray-100">
            <BsFunnel className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#3a72f6] to-[#3A8EF6]/80 text-transparent bg-clip-text">Filters</h2>
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Specialization</label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value.toLowerCase())}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3A8EF6] focus:border-[#3A8EF6] bg-white/50 backdrop-blur-sm transition-all duration-200"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec.toLowerCase()}>{spec}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Maximum Distance</label>
            <input
              type="text"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3A8EF6] focus:border-[#3A8EF6] bg-white/50 backdrop-blur-sm transition-all duration-200"
              placeholder="Distance in km"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Minimum Rating</label>
            <div className="flex items-center justify-between p-4 rounded-xl shadow-md border-t-[0.5px] bg-white/50 backdrop-blur-sm transition-all duration-200">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinReviewRating(rating)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
                    minReviewRating === rating
                      ? "bg-[#3A8EF6] text-white shadow-lg scale-110"
                      : "bg-white text-gray-600 hover:bg-sky-100 shadow-md"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
        </div>
        
            <button
              onClick={resetFilters}
              className={`w-full bg-[#3A8EF6] text-white py-3.5 px-6 rounded-xl hover:bg-blue-600 transition-all duration-500 shadow-lg hover:shadow-xl active:scale-95 font-medium text-lg ${filtersChanged ? "transform opacity-100 backdrop-blur-md" : "opacity-0 -translate-y-2 pointer-events-none"}`}
            >
              Reset Filters
            </button>
        
      </div>


      <div className="flex-1 p-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-10">
            <form onSubmit={handleSearch} className="group relative max-w-4xl mx-auto">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-5 pl-8 pr-14 text-xl text-gray-900 border border-gray-200 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-[#3A8EF6] focus:border-[#3A8EF6] bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-[#3A8EF6]/40 hover:shadow-lg"
                placeholder="Search by symptoms, specialization, or doctor name..."
                required
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-white bg-[#3A8EF6] rounded-xl hover:bg-[#3A8EF6]/90 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none"
              >
                <FaSearch className="w-5 h-5" />
              </button>
            </form>
          </div>

          {loading === true && (
            <div className="flex justify-center mt-10">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#3A8EF6]"></div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center mt-6 p-6 bg-red-50 rounded-xl max-w-4xl mx-auto border border-red-100 shadow-sm">
              {error}
            </div>
          )}

          <div className={`mt-8 transition-all duration-500 ease-in-out ${results ? "transform opacity-100 backdrop-blur-xl" : "opacity-0 -translate-y-4 pointer-events-none"}`}> 
            {doctors.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="group bg-white/70 shadow-sm rounded-2xl border-blue-50 border-2 hover:shadow-lg shadow-blue-200 hover:shadow-blue-300/40 transition-all duration-700 hover:translate-y-[-2px] relative"
                  >
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1.5 px-4 py-2 bg-white shadow-md rounded-full transition-all duration-100 group-hover:shadow-lg shadow-blue-200 group-hover:shadow-blue-300/40">
                        <FaStar className="w-5 h-5 text-[#3A8EF6]" />
                        <span className="text-[#3A8EF6] font-bold text-lg">{doctor.rating || "N/A"}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex gap-6">
                        <div className="relative w-32 h-36 flex-shrink-0">
                          <img
                            src={doctor.profile.avatar || pic}
                            alt={doctor.name}
                            className="w-full h-full object-cover rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col">
                            <Link className="text-2xl font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-300" to={`/doctor/${doctor._id}`}>
                              {doctor.name}
                            </Link>
                            
                            <p className="text-blue-600 text-base font-semibold mb-4">
                              {doctor.profile.specialization?.join(", ") || "General Physician"}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-3 group-hover:bg-[#3A8EF6]/5 transition-colors duration-300">
                              <span className="text-gray-500 text-sm font-medium">Distance</span>
                              <p className="font-semibold text-gray-900 mt-1">
                                {doctor.distance < 1000 
                                  ? `${doctor.distance.toFixed(0)} m` 
                                  : `${(doctor.distance / 1000).toFixed(1)} km`}
                              </p>
                            </div>
                              <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-3 group-hover:bg-[#3A8EF6]/5 transition-colors duration-300">
                                <span className="text-gray-500 text-sm font-medium">Consultation Fee</span>
                                <p className="font-semibold text-gray-900 mt-1">${doctor.profile.fees || "N/A"}</p>
                              </div>
                              <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-3 group-hover:bg-[#3A8EF6]/5 transition-colors duration-300">
                                <span className="text-gray-500 text-sm font-medium">Experience</span>
                                <p className="font-semibold text-gray-900 mt-1">{doctor.profile.experience || "N/A"} years</p>
                              </div>
                              <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-3 group-hover:bg-[#3A8EF6]/5 transition-colors duration-300">
                                <span className="text-gray-500 text-sm font-medium">Status</span>
                                <p className="font-semibold text-green-500 mt-1">Available Today</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50/80 backdrop-blur-sm p-3 rounded-xl group-hover:bg-[#3A8EF6]/5 transition-colors duration-300">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3A8EF6] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              <p className="truncate font-medium">{doctor.location.formattedAddress || "Unknown"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <button
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3.5 px-6 text-md rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md shadow-blue-500/40"
                          onClick={() => console.log("Book appointment with", doctor.name)}
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              loading !== "initial"?(
                (!loading) && (
                <div className="text-center mt-10 p-8 bg-white/70 backdrop-blur-lg rounded-2xl border border-gray-100 shadow-md max-w-3xl mx-auto">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#3A8EF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-xl font-bold">No doctors found matching your criteria</p>
                  <p className="text-gray-500 text-base mt-2">Try adjusting your filters or search terms</p>
                </div>
              )
              ):(
                <p className="text-gray-500 text-center mt-4">
                           Try searching for doctors based on your symptoms.
                         </p>
              )

            )}
          
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default DoctorSearch;