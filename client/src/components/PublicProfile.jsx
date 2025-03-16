import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaStethoscope, FaUserMd, FaClock, FaCalendar, FaGraduationCap, FaAward, FaHospital } from 'react-icons/fa';
import { MdVerified, MdHealthAndSafety } from 'react-icons/md';
import pic from '../assets/pic.png';
import { useParams } from 'react-router-dom';

const PublicProfile = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();


  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctor/doc/${id}`, {
          withCredentials: true,
        });
        setDoctor(response.data.doctor);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching the doctor profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  const placeholderDoctor = {
    name: "Dr. Sarah Wilson",
    specialization: ["Cardiologist", "Internal Medicine"],
    rating: 4.8,
    totalReviews: 124,
    about: "A highly skilled and experienced specialist with a passion for helping patients lead healthier lives. A certified professional with a focus on patient care and satisfaction.",
    experience: 15,
    totalPatients: 5000,
    languages: ["English", "Spanish"],
    education: [
      {
        degree: "Doctor of Medicine (MD)",
        institution: "Harvard Medical School",
        year: "2008"
      },
      {
        degree: "Cardiology Fellowship",
        institution: "Mayo Clinic",
        year: "2012"
      },
      {
        degree: "Internal Medicine Residency",
        institution: "Johns Hopkins Hospital",
        year: "2010"
      }
    ],
    location: {
      formattedAddress: "123 Medical Center Drive, Boston, MA 02115"
    },
    phone: "+1 (555) 123-4567",
    email: "dr.sarah.wilson@medical.com",
    fees: 150,
    isVerified: true,
    avatar: null
  };

  const doctorData = doctor || placeholderDoctor;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden mb-12">
          {/* Header Background */}
          <div className="absolute top-0 left-0 w-full h-48">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30"></div>
            <div className="absolute inset-0" style={{ 
              backgroundImage: `
                radial-gradient(circle at 1px 1px, rgb(59 130 246 / 0.08) 1px, transparent 0),
                radial-gradient(circle at 2.5px 2.5px, rgb(59 130 246 / 0.04) 1px, transparent 0)
              `,
              backgroundSize: '20px 20px, 40px 40px'
            }}></div>
          </div>
          
          <div className="relative px-8 pt-24 pb-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Image */}
              <div className="relative z-10 -mt-16">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-white rounded-2xl shadow-2xl"></div>
                  <img
                    src={doctorData.avatar || pic}
                    alt={doctorData.name}
                    className="relative w-48 h-48 rounded-xl object-cover shadow-md transition duration-300 group-hover:shadow-lg"
                  />
                  {doctorData.isVerified && (
                    <div className="absolute -right-3 -top-3 bg-white rounded-full p-2.5 shadow-lg">
                      <MdVerified className="w-7 h-7 text-blue-600" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{doctorData.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    <FaStethoscope className="w-4 h-4 mr-1" />
                    {doctorData.specialization.join(", ")}
                  </span>
                  
                
                </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={`w-4 h-4 ${i < Math.floor(doctorData.rating) ? 'text-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="font-medium text-gray-900">{doctorData.rating}</span>
                    <span className="text-gray-500 text-sm">({placeholderDoctor.totalReviews} reviews)</span>
                  </div>
                  
                  <button
                    onClick={() => console.log('Book appointment')}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-xl active:scale-95"
                  >
                    <FaCalendar className="mr-2 h-4 w-4" />
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl p-8 border border-blue-100/20">
              <div className="flex items-center gap-4 mb-8">
                <span className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-inner">
                  <MdHealthAndSafety className="w-7 h-7 text-blue-600" />
                </span>
                <h2 className="text-3xl font-bold text-gray-900">About</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                {placeholderDoctor.about}
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
                {[
                  { label: "Experience", value: `${doctorData.experience} years`, icon: FaUserMd, gradient: "from-blue-500 to-blue-400" },
                  { label: "Patients", value: `${placeholderDoctor.totalPatients}+`, icon: FaHospital, gradient: "from-green-500 to-emerald-400" },
                  { label: "Response Time", value: "Less than 2 hours", icon: FaClock, gradient: "from-purple-500 to-pink-400" },
                   { label: "Languages", value: placeholderDoctor.languages.join(", "), icon: FaAward, gradient: "from-indigo-500 to-blue-400" }
                ].map((stat, index) => (
                  <div key={index} 
                    className="group relative transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <div className="absolute -inset-0.5 bg-gradient-to-r rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative bg-white p-4 rounded-xl border border-gray-100 group-hover:border-transparent transition duration-300 shadow-lg group-hover:shadow-xl">
                      <div className={`w-12 h-12 mb-4 rounded-lg bg-gradient-to-r ${stat.gradient} p-2.5 shadow-lg group-hover:scale-110 transition duration-300`}>
                        <stat.icon className="w-full h-full text-white" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                      <p className="text-gray-900 font-bold mt-1 text-md">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl p-8 border border-blue-100/20">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <FaGraduationCap className="w-7 h-7 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Education & Experience</h2>
              </div>
              
              <div className="grid gap-6">
              {(placeholderDoctor.education).map((edu, index) => (
                <div key={index} 
                  className="group bg-gradient-to-r from-white to-blue-50/30 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-blue-100/20 hover:border-blue-200/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-300"></div>
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                      <span className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold group-hover:bg-blue-100 transition-colors duration-300">
                        {edu.year}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <FaHospital className="w-5 h-5 text-blue-500" />
                      <span className="text-lg font-medium text-gray-700">{edu.institution}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <FaClock className="w-4 h-4 text-blue-500" />
                        <span>Program Duration: 2 years</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaAward className="w-4 h-4 text-blue-500" />
                        <span>Full-time</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900">Contact Information</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: FaMapMarkerAlt, value: doctorData.location, label: "Address" },
                    { icon: FaPhone, value: doctorData.phone, label: "Phone" },
                    { icon: FaEnvelope, value: doctorData.email, label: "Email" }
                  ].map((contact, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <contact.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">{contact.label}</p>
                        <p className="font-semibold text-gray-900">{contact.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900">Availability</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { day: "Monday", hours: "9:00 AM - 5:00 PM", isAvailable: true },
                    { day: "Tuesday", hours: "9:00 AM - 5:00 PM", isAvailable: true },
                    { day: "Wednesday", hours: "10:00 AM - 6:00 PM", isAvailable: true },
                    { day: "Thursday", hours: "9:00 AM - 5:00 PM", isAvailable: true },
                    { day: "Friday", hours: "9:00 AM - 4:00 PM", isAvailable: true }
                  ].map((schedule) => (
                    <div key={schedule.day} className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaCalendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${schedule.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <p className="text-sm font-medium text-gray-500">{schedule.day}</p>
                        </div>
                        <p className="font-semibold text-gray-900">{schedule.hours}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Consultation Fee */}
            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900">Consultation Details</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaUserMd className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Consultation Fee</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-blue-600">${doctorData.fees}</span>
                        <span className="text-gray-500">/visit</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaClock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-900">30 minutes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaCalendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Next Available</p>
                      <p className="font-semibold text-gray-900">Today, 2:00 PM</p>
                    </div>
                  </div>

                  <button
                    onClick={() => console.log('Book appointment')}
                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transform hover:translate-y-[-2px] active:translate-y-0 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-4"
                  >
                    <FaCalendar className="h-5 w-5" />
                    Schedule Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;