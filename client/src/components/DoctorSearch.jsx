import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorSearch = () => {
  const [searchType, setSearchType] = useState('specialty');
  const [query, setQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState(10);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      [searchType]: query,
      maxDistance: maxDistance * 1000
    });

    try {
      const response = await fetch(`/api/doctors/search?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      navigate('/doctors', { state: data.doctors });
    } catch (error) {
      console.error('Search failed:', error);
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
        >
          Search Doctors
        </button>
      </form>
    </div>
  );
};

export default DoctorSearch;