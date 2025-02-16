import React, { useState } from "react";
import axios from "axios";

const DoctorSearch = () => {
  const [searchType, setSearchType] = useState("specialty");
  const [query, setQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState(10);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      search: query,
      maxDistance: maxDistance * 1000,
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
    <div className="mt-8 max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-sm">
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-2 sm:px-6 py-2 sm:py-4 font-semibold rounded-lg transition ${
            searchType === "specialty"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setSearchType("specialty")}
        >
          Search by Specialty
        </button>
        <button
          className={`px-2 sm:px-6 py-2 sm:py-4 font-semibold rounded-lg transition ${
            searchType === "symptoms"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setSearchType("symptoms")}
        >
          Search by Symptoms
        </button>
      </div>

      <form onSubmit={handleSearch} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
        <div className="w-full sm:w-3/4">
    <input
      type="text"
      placeholder={
        searchType === "specialty"
          ? "Enter medical specialty..."
          : "Describe your symptoms..."
      }
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
        </button>
      </form>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      <div className="mt-8">
        {doctors.length > 0 ? (
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
          !loading && (
            <p className="text-gray-500 text-center mt-4">
              No doctors found. Try a different search.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;
