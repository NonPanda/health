import React, { useState } from 'react';
import axios from 'axios';

const DoctorSearch = () => {
  const [searchType, setSearchType] = useState('specialty');
  const [query, setQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState(10);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const params = new URLSearchParams({
      search: query, 
      maxDistance: maxDistance * 1000, 
    });

    try {
      const { data } = await axios.get(`http://localhost:5000/api/doctor/search?${params.toString()}`, {
        withCredentials: true,
      });

      console.log("Doctors found:", data);
      setDoctors(data.data || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${searchType === 'specialty' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSearchType('specialty')}
        >
          Search by Specialty
        </button>
        <button
          className={`px-4 py-2 rounded-md ${searchType === 'symptoms' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSearchType('symptoms')}
        >
          Search by Symptoms
        </button>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <input
          type="text"
          placeholder={searchType === 'specialty' ? 'Enter medical specialty...' : 'Describe your symptoms...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded-md"
        />

        <div className="flex items-center gap-4">
          <label>Maximum Distance (km):</label>
          <input
            type="number"
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            className="w-20 p-2 border rounded-md"
            min="1"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search Doctors'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6">
        {doctors.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">Doctors Found:</h2>
            <ul className="space-y-2">
              {doctors.map((doctor) => (
                <li key={doctor._id} className="p-4 border rounded-md shadow-sm">
                  <p><strong>Name:</strong> {doctor.name}</p>
                  <p><strong>Specialization:</strong> {doctor.specialization?.join(', ') || 'Not Available'}</p>
                  <p><strong>Distance:</strong> {(doctor.distance / 1000).toFixed(2)} km</p>
                  <p><strong>Rating:</strong> {doctor.rating || 'N/A'}</p>
                  <p><strong>Experience:</strong> {doctor.experience ? `${doctor.experience} years` : 'Not Available'}</p>
                  <p><strong>Fees:</strong> {doctor.fees ? `$${doctor.fees}` : 'Not Available'}</p>
                  <p><strong>Address:</strong> {doctor.formattedAddress || 'Unknown'}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !loading && <p className="text-gray-500 mt-4">No doctors found. Try a different search.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;
