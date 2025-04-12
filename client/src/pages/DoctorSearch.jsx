
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaSearch, FaStar } from "react-icons/fa";
import pic from "../assets/pic.png";
import { BsFunnel } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const DoctorSearch = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const searchQuery = searchParams.get('q') || "";

  const [query, setQuery] = useState(searchQuery);
  const [maxDistance, setMaxDistance] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState("initial");
  const [error, setError] = useState("");
  const [minReviewRating, setMinReviewRating] = useState(0);
  const [specialization, setSpecialization] = useState("all");
  const [results, setResults] = useState(true);
  const [filtersChanged, setFiltersChanged] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [priceRange, setPriceRange] = useState([0, 500]);

  const getUniqueSpecializations = (doctors) => {
    const uniqueSpecs = new Set(["all"]);
    doctors.forEach(doctor => {
      if (doctor.profile.specialization && Array.isArray(doctor.profile.specialization)) {
        doctor.profile.specialization.forEach(spec => {
         
             uniqueSpecs.add(spec.toLowerCase());
         
        });
      }
    });
    return ["all", ...Array.from(uniqueSpecs).filter(spec => spec !== "all").sort()];
  };

  const [availableSpecializations, setAvailableSpecializations] = useState(["all"]);

  useEffect(() => {
    if (allDoctors.length > 0) {
      setAvailableSpecializations(getUniqueSpecializations(allDoctors));
      console.log("Available Specializations:", availableSpecializations);
    }
  }, [allDoctors]);

  useEffect(() => {
    if (searchQuery) {
      fetchDoctors({
        search: searchQuery,
        maxDistance: "",
        minReviewRating: 0,
        specialization: "all"
      });
    } if (loading === "initial" && searchQuery === "") {
      fetchDoctors({
        search: "General Physicians",
        maxDistance: "",
        minReviewRating: 0,
        specialization: "default"
      });
    }
  }, []);

  useEffect(() => {
    if (allDoctors.length > 0) {
      applyFilters();
    }
  }, [specialization, minReviewRating, maxDistance, priceRange]);


  useEffect(() => {
    if (specialization !== "all" || minReviewRating !== 0 || maxDistance !== "" || priceRange[0] !== 0 || priceRange[1] !== maxPrice) {
      setFiltersChanged(true);
    } else {
      setFiltersChanged(false);
    }
  }, [specialization, minReviewRating, maxDistance, priceRange, maxPrice]);

  const applyFilters = () => {
    let filteredDoctors = [...allDoctors];

    if (specialization !== "all") {
      filteredDoctors = filteredDoctors.filter(doctor => {
        const doctorSpecializations = doctor.profile.specialization?.map(s => s.toLowerCase()) || [];
        return doctorSpecializations.includes(specialization.toLowerCase());
      });
    }

    if (minReviewRating > 0) {
      filteredDoctors = filteredDoctors.filter(doctor =>
        doctor.rating >= minReviewRating
      );
    }

    if (maxDistance !== "") {
      const maxDistanceNum = parseFloat(maxDistance);
      if (!isNaN(maxDistanceNum) && maxDistanceNum > 0) {
          const maxDistanceMeters = maxDistanceNum * 1000;
          filteredDoctors = filteredDoctors.filter(doctor =>
              doctor.distance != null && doctor.distance <= maxDistanceMeters
          );
       }
    }


    filteredDoctors = filteredDoctors.filter(doctor => {
      const fee = doctor.profile.fees ? parseFloat(doctor.profile.fees) : 0;
      return fee >= priceRange[0] && fee <= priceRange[1];
    });

    setDoctors(filteredDoctors);
  };

  const handlePriceChange = (e) => {
    const newValue=parseInt(e.target.value);
    const gap=30;
    const dtm=Math.abs(newValue-priceRange[0]);
    const dtm1=Math.abs(newValue-priceRange[1]);

    if (dtm<dtm1){
      const min1=Math.min(newValue,priceRange[1]-gap);
      setPriceRange([min1<0?0:min1,priceRange[1]]);
    } else {
      const max1=Math.max(newValue, priceRange[0] + gap);
      setPriceRange([priceRange[0], max1 > maxPrice ? maxPrice : max1]);
    }
  }


  const fetchDoctors = async (searchParams = {}) => {
    setLoading(true);
    setError("");
    setResults(false); 

    try {

        const params = new URLSearchParams({
            search: searchParams.search || query || "", 
            maxDistance: searchParams.maxDistance === "" ? "" : (searchParams.maxDistance || maxDistance) * 1000,
            minReviewRating: (searchParams.minReviewRating != null ? searchParams.minReviewRating : minReviewRating).toString(),
            specialization: searchParams.specialization === "all" ? "" : (searchParams.specialization || specialization),
        });

        if (!params.get('maxDistance')) params.delete('maxDistance');
        if (params.get('minReviewRating') === '0') params.delete('minReviewRating');
        if (!params.get('specialization')) params.delete('specialization');


        const { data } = await axios.get(
            `http://localhost:5000/api/doctor/search?${params.toString()}`,
            { withCredentials: true }
        );

        const fetchedDoctors = data.data || [];
        setAllDoctors(fetchedDoctors);
        setDoctors(fetchedDoctors); 
        setResults(true);
    } catch (err) {
        setError("Failed to fetch doctors. Please try again.");
        setAllDoctors([]); 
        setDoctors([]);
    } finally {
        setLoading(false);
    }
};


  const handleSearch = async (e) => {
    e.preventDefault();
    setSpecialization("all");
    setMinReviewRating(0);
    setMaxDistance("");
    setPriceRange([0, 500]); 
    setFiltersChanged(false);

    fetchDoctors({
      search: query,
      maxDistance: "",
      minReviewRating: 0,
      specialization: "all",
    });
  };

  const resetFilters = () => {
    setSpecialization("all");
    setMinReviewRating(0);
    setMaxDistance("");
    setPriceRange([0, maxPrice]);
    setFiltersChanged(false);
  };

  const minPercent = maxPrice > 0 ? (priceRange[0] / maxPrice) * 100 : 0;
  const maxPercent = maxPrice > 0 ? (priceRange[1] / maxPrice) * 100 : 0;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-72 bg-white/80 p-8 space-y-8 border-r border-gray-100 shadow-lg sticky top-0 h-screen overflow-y-auto">
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
              {availableSpecializations.map((spec) => (
                <option
                  key={spec}
                  value={spec.toLowerCase()}
                  className="text-gray-900 font-medium"
                >
                  {spec === "all" ? "All" : spec.charAt(0).toUpperCase() + spec.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Maximum Distance (km)</label>
            <input
              type="number"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3A8EF6] focus:border-[#3A8EF6] bg-white/50 backdrop-blur-sm transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="e.g., 10"
              min="0"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Price Range (${priceRange[0]} - ${priceRange[1]})</label>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">

              <div className="relative h-5 flex items-center my-4">
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-lg z-10"></div>

                 <div
                  className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-[#3A8EF6] rounded-lg z-20"
                  style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
                ></div>

                <input
                  type="range"
                  name="min-range-input" 
                  min="0"
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={handlePriceChange} 
                  className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto opacity-0 z-30 cursor-pointer"
                />
                <input
                  type="range"
                  name="max-range-input" 
                  min="0"
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto opacity-0 z-40 cursor-pointer"
                />

                <div
                  className="absolute top-1/2 w-4 h-4 bg-[#3A8EF6] rounded-full shadow border-2 border-white pointer-events-none z-50"
                  style={{
                    left: `${minPercent}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
                <div
                  className="absolute top-1/2 w-4 h-4 bg-[#3A8EF6] rounded-full shadow border-2 border-white pointer-events-none z-50"
                  style={{
                    left: `${maxPercent}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>


              <div className="flex justify-between mt-8">
                <div className="w-16">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => {
                       const value = Math.max(0, Math.min(Number(e.target.value) || 0, priceRange[1] - 1));
                       setPriceRange([value, priceRange[1]]);
                     }}
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-[#3A8EF6] focus:border-[#3A8EF6] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0"
                    max={priceRange[1]}
                  />
                </div>
                <div className="w-16">
                  <input
                    type="number"
                    value={priceRange[1]}
                     onChange={(e) => {
                       const value = Math.min(maxPrice, Math.max(Number(e.target.value) || 0, priceRange[0] + 1));
                       setPriceRange([priceRange[0], value]);
                     }}
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-[#3A8EF6] focus:border-[#3A8EF6] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min={priceRange[0]}
                    max={maxPrice}
                  />
                </div>
              </div>
            </div>
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
                className="w-full p-5 pl-8 pr-14 text-xl text-gray-900 border border-gray-200 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-[#3A8EF6] focus:border-[#3A8EF6] bg-white/50 transition-all duration-300 hover:border-[#3A8EF6]/40 hover:shadow-lg"
                placeholder="Search by symptoms or specialization..."
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

          <div className={`mt-8 transition-all duration-200 ease-in-out ${results ? "transform opacity-100 backdrop-blur-" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
             {doctors.length > 0 && !loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="group bg-white/70 shadow-sm rounded-2xl border-blue-50 border-2 hover:shadow-lg shadow-blue-200 hover:shadow-blue-300/40 transition-all duration-700 hover:translate-y-[-2px] relative"
                  >
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1.5 px-4 py-2 bg-white shadow-md rounded-full transition-all duration-100 group-hover:shadow-lg shadow-blue-200 group-hover:shadow-blue-300/40">
                        <FaStar className="w-5 h-5 text-[#3A8EF6]" />
                        <span className="text-[#3A8EF6] font-bold text-lg">{doctor.rating ? doctor.rating.toFixed(2) : "N/A"}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative w-32 h-36 flex-shrink-0 mx-auto sm:mx-0">
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
                                  {doctor.distance != null ? (
                                    doctor.distance < 1000
                                      ? `${doctor.distance.toFixed(0)} m`
                                      : `${(doctor.distance / 1000).toFixed(1)} km`
                                  ) : "N/A"}
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
                              <p className="truncate font-medium">{doctor.location?.formattedAddress || "Address not available"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-100">
                       <Link to={`/doctor/${doctor._id}`}>
                          <button
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3.5 px-6 text-md rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md shadow-blue-500/40"
                          >
                            View Profile & Book
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               !loading && !error && loading !== "initial" && (
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
            )}
            {loading === "initial" && !searchQuery && (
                 <p className="text-gray-500 text-center mt-4">
                     Try searching for doctors based on your symptoms or specialization.
                 </p>
             )}
          </div>
        </div>
      </div>
    </div>
  );

};

export default DoctorSearch;