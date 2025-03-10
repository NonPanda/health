import React, { useState,useRef,useEffect } from "react";
import axios from "axios";
import { BsFunnel } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";

const DoctorSearch = () => {
  const [query, setQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState(10);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState("initial");
  const [error, setError] = useState("");
  const [filterdropdown, setFilterDropdown] = useState(false);
  const [minReviewRating, setMinReviewRating] = useState(0);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)&&filterdropdown) {
        setFilterDropdown(false);
      }
    };
    if (filterdropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterdropdown]);


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
          <BsFunnel className={`absolute -start-2 sm:start-2 w-6 h-6 text-blue-600 hover:text-blue-700 ${filterdropdown?'scale-105':'cursor-pointer hover:scale-105 transition-transform'}
          `} onClick={() => setFilterDropdown(!filterdropdown)}
           />
          <div ref={filterRef} className={`absolute start-0 top-12 sm:top-14 w-40 sm:w-52 bg-white border border-gray-200 rounded-lg shadow-md p-4 ${filterdropdown ? "block" : "hidden"}`}>
            <label className="block text-sm font-medium text-gray-600">Max Distance (km):</label>
            <input
              type="text"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              className="w-full p-2 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none"
            />
            <label className="block mt-4 text-sm font-medium text-gray-600">Minimum Rating:</label>
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
            className="p-2.5 sm:w-full w-5/6 px-4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none hover:bg-blue-50"
            placeholder="Describe your symptoms..."
            required
          />
  
          <button
            type="submit"
            className="absolute end-4 w-10 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-xl border border-blue-800 hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-blue-300"
          >
            <FaSearch className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  
    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
  
    <div className="mt-8">
      {(doctors.length > 0) ? (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Doctors Found:
          </h2>
          <ul className="space-y-4">
            {doctors.map((doctor) => (
              <li
                key={doctor._id}
                className="p-5 border rounded-lg shadow-md bg-gray-50"
              >
                <p className="text-lg font-semibold text-gray-900">
                  {doctor.name}
                </p>
                <p className="text-gray-700">
                  <strong>Specialization:</strong>{" "}
                  {doctor.specialization?.join(", ") || "Not Available"}
                </p>
                <p className="text-gray-700">
                  <strong>Distance:</strong>{" "}
                  {(doctor.distance / 1000).toFixed(2)} km
                </p>
                <p className="text-gray-700">
                  <strong>Rating:</strong> {doctor.rating || "N/A"}
                </p>
                <p className="text-gray-700">
                  <strong>Experience:</strong>{" "}
                  {doctor.experience
                    ? `${doctor.experience} years`
                    : "Not Available"}
                </p>
                <p className="text-gray-700">
                  <strong>Fees:</strong>{" "}
                  {doctor.fees ? `$${doctor.fees}` : "Not Available"}
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong>{" "}
                  {doctor.formattedAddress || "Unknown"}
                </p>
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

{/* <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
  <div className="w-full sm:w-3/4">
<input
type="text"
placeholder={"Describe your symptoms..."}
value={query}
onChange={(e) => setQuery(e.target.value)}
className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
/>
</div>

<div className="flex items-center gap-2 w-full sm:w-1/4">
  <label className="text-gray-600 font-medium whitespace-nowrap">
    Max Distance (km):
  </label>
  <input
    type="text"
    value={maxDistance}
    onChange={(e) => setMaxDistance(e.target.value)}
    className="w-20 p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>
</div>

  <button
    type="submit"
    className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
    disabled={loading}
  >
    {loading ? "Searching..." : "Search Doctors"}
  </button> */}