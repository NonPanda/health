import { Link } from 'react-router-dom';
import { Stethoscope, Search, Star, Calendar, Heart,MessageCircle, CheckCircle,Clock, AudioWaveform } from 'lucide-react';
import doc from '../assets/doc.png';
import docs from '../assets/docs.svg';
import general from '../assets/general.png';
import cardi from '../assets/cardi.png';
import nutri from '../assets/nutri.png';
import optha from '../assets/optha.png';
import ortho from '../assets/ortho.png';
import pedia from '../assets/pedia.png';
import visual from '../assets/Visual.png';
import React, { useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';


export default function HomePage() {
  const changingtext = ["Perfect", "Ideal", "Personalized", "Ultimate", "Optimal", "Trusted"];
  const [index, setIndex] = useState(0);
  const [currentText, setCurrentText] = useState(changingtext[0]);
  const [animationClass, setAnimationClass] = useState('animate-slide-in');
  const [query, setQuery] = useState('');
  const [displayText, setDisplayText] = useState('');
  const fullText = "DoctorWho";
  const [typingComplete, setTypingComplete] = useState(false);
  const [isImageInView, setIsImageInView] = useState(false);
  const imageRef = useRef(null); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsImageInView(true); 
        } else {
          setIsImageInView(false); 
        }
      },
      {
        threshold: 0.5
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current); 
      }
    };
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    const text = fullText;

    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setTypingComplete(true);
        }, 200);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const intervalTime = 3000;
    const animationDuration = 500;

    const interval = setInterval(() => {
      setAnimationClass('animate-slide-out');

      setTimeout(() => {
        const nextIndex = (index + 1) % changingtext.length;
        setIndex(nextIndex);
        setCurrentText(changingtext[nextIndex]);
        setAnimationClass('animate-slide-in');
      }, animationDuration);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [index]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("searching for:", query);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateY(40px); opacity: 0; filter: blur(2px); }
            to { transform: translateY(0); opacity: 1; filter: blur(0); }
          }
          
          @keyframes slideOut {
            from { transform: translateY(0); opacity: 1; filter: blur(0); }
            to { transform: translateY(-40px); opacity: 0; filter: blur(2px); }
          }
          
          .animate-slide-in {
            animation: slideIn 0.5s ease forwards;
          }
          
          .animate-slide-out {
            animation: slideOut 0.5s ease forwards;
          }
          
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          
          .typing-cursor {
            display: inline-block;
            width: 3px;
            height: 1em;
            background-color: #3B82F6;
            margin-left: 2px;
          }
          
          .typing-cursor.hidden {
            opacity: 0;
          }
        `}
      </style>

      <main className="flex-1">
        <div className="relative min-h-screen">
          {/* Hero Section */}
          <div className="w-full relative flex flex-col items-center justify-center min-h-[70vh] py-8 text-center bg-gradient-to-b from-white via-blue-50/50 to-white">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            
            <div className="relative z-10 max-w-5xl mx-auto px-6 -mt-20">
              <h1 className="py-[8px] text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-blue-600 to-blue-800 flex items-center justify-center leading-tight">
                Welcome to {displayText}
                {!typingComplete && <span className="typing-cursor ml-4"></span>}
                {typingComplete && <span className="ml-1">{' '}</span>}
              </h1>

              <p className={`text-xl text-gray-600 mt-6 mb-12 max-w-2xl mx-auto transform transition-all duration-1000 ease-in-out ${typingComplete ? "opacity-100 " : "opacity-0 translate-y-8"}`}>
                Meet all the healthcare experts you'll ever need in one place with a single click.
              </p>

              <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
                <div className="flex items-center w-full relative group">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-8 py-6 pr-16 text-xl text-gray-600 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg hover:shadow-xl transition-all duration-300"
                    placeholder="Search doctors, specialties, symptoms..."
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <FaSearch className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Features Section */}
            <div className="absolute bottom-0 left-0 right-0 w-full max-w-6xl mx-auto px-6 transform translate-y-1/2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Service</h3>
                      <p className="text-gray-600">Our search engine is available 24/7 to help you find the right doctor.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
                      <p className="text-gray-600">Book appointments with your preferred doctors in just a few clicks.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Care</h3>
                      <p className="text-gray-600">Access to the best healthcare providers for your specific needs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="bg-gradient-to-b from-white via-blue-50/30 to-white pt-48 pb-24">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <h2 className="text-5xl font-bold text-gray-900">
                    Find Your
                    <span className={`block text-blue-600 mt-2 ${animationClass}`}>
                      {currentText}
                    </span>
                    Medical Match
                  </h2>
                  <p className="text-xl text-gray-600">
                    Connect with the best healthcare professionals in your area and book appointments instantly.
                  </p>
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <MessageCircle className="w-6 h-6 mr-2" />
                    Get Started Now
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl transform rotate-3"></div>
                  <img
                    ref={imageRef}
                    src={docs}
                    alt="Doctors"
                    className={`relative rounded-3xl shadow-2xl transition-all duration-700 ${
                      isImageInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-gradient-to-b from-blue-50 to-white py-32">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Our Medical Specialties</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience comprehensive healthcare through our wide range of medical specialties, each staffed with expert professionals dedicated to your well-being.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {/* General Medicine */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-[2rem] transform transition-transform group-hover:scale-[1.02] group-hover:rotate-1"></div>
                  <div className="relative bg-white rounded-[2rem] p-8 shadow-lg transition-all duration-300 group-hover:-translate-y-2">
                    <div className="flex justify-center mb-8">
                      <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-5 group-hover:scale-110 transition-all duration-300 shadow-inner">
                        <img src={general} alt="General Medicine" className="w-full h-full object-contain drop-shadow-lg" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">General Medicine</h3>
                    <p className="text-gray-600 mb-8 text-center">Comprehensive primary healthcare services for all your general medical needs.</p>
                    <button className="w-full px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:translate-y-0 flex items-center justify-center gap-3">
                      <Calendar className="w-5 h-5" />
                      Book Appointment
                    </button>
                  </div>
                </div>

                {/* Pediatrics */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-[2rem] transform transition-transform group-hover:scale-[1.02] group-hover:rotate-1"></div>
                  <div className="relative bg-white rounded-[2rem] p-8 shadow-lg transition-all duration-300 group-hover:-translate-y-2">
                    <div className="flex justify-center mb-8">
                      <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-5 group-hover:scale-110 transition-all duration-300 shadow-inner">
                        <img src={pedia} alt="Pediatrics" className="w-full h-full object-contain drop-shadow-lg" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Pediatrics</h3>
                    <p className="text-gray-600 mb-8 text-center">Specialized care for children's health and developmental needs.</p>
                    <button className="w-full px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:translate-y-0 flex items-center justify-center gap-3">
                      <Calendar className="w-5 h-5" />
                      Book Appointment
                    </button>
                  </div>
                </div>

                {/* Nutritional */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r  from-blue-500 to-blue-600 rounded-[2rem] transform transition-transform group-hover:scale-[1.02] group-hover:rotate-1"></div>
                  <div className="relative bg-white rounded-[2rem] p-8 shadow-lg transition-all duration-300 group-hover:-translate-y-2">
                    <div className="flex justify-center mb-8">
                      <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-5 group-hover:scale-110 transition-all duration-300 shadow-inner">
                        <img src={nutri} alt="Nutritional" className="w-full h-full object-contain drop-shadow-lg" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Nutritional</h3>
                    <p className="text-gray-600 mb-8 text-center">Expert dietary guidance and nutritional counseling services.</p>
                    <button className="w-full px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:translate-y-0 flex items-center justify-center gap-3">
                      <Calendar className="w-5 h-5" />
                      Book Appointment
                    </button>
                  </div>
                </div>

                {/* Cardiology */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r  from-blue-500 to-blue-600 rounded-[2rem] transform transition-transform group-hover:scale-[1.02] group-hover:rotate-1"></div>
                  <div className="relative bg-white rounded-[2rem] p-8 shadow-lg transition-all duration-300 group-hover:-translate-y-2">
                    <div className="flex justify-center mb-8">
                      <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 p-5 group-hover:scale-110 transition-all duration-300 shadow-inner">
                        <img src={cardi} alt="Cardiology" className="w-full h-full object-contain drop-shadow-lg" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Cardiology</h3>
                    <p className="text-gray-600 mb-8 text-center">Advanced cardiac care and heart health management.</p>
                    <button className="w-full px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:translate-y-0 flex items-center justify-center gap-3">
                      <Calendar className="w-5 h-5" />
                      Book Appointment
                    </button>
                  </div>
                </div>

                {/* Ophthalmology */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r  from-blue-500 to-blue-600 rounded-[2rem] transform transition-transform group-hover:scale-[1.02] group-hover:rotate-1"></div>
                  <div className="relative bg-white rounded-[2rem] p-8 shadow-lg transition-all duration-300 group-hover:-translate-y-2">
                    <div className="flex justify-center mb-8">
                      <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 group-hover:scale-110 transition-all duration-300 shadow-inner">
                        <img src={optha} alt="Ophthalmology" className="w-full h-full object-contain drop-shadow-lg" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Ophthalmology</h3>
                    <p className="text-gray-600 mb-8 text-center">Comprehensive eye care and vision correction services.</p>
                    <button className="w-full px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:translate-y-0 flex items-center justify-center gap-3">
                      <Calendar className="w-5 h-5" />
                      Book Appointment
                    </button>
                  </div>
                </div>

                {/* Orthopedics */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r  from-blue-500 to-blue-600 rounded-[2rem] transform transition-transform group-hover:scale-[1.02] group-hover:rotate-1"></div>
                  <div className="relative bg-white rounded-[2rem] p-8 shadow-lg transition-all duration-300 group-hover:-translate-y-2">
                    <div className="flex justify-center mb-8">
                      <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 group-hover:scale-110 transition-all duration-300 shadow-inner">
                        <img src={ortho} alt="Orthopedics" className="w-full h-full object-contain drop-shadow-lg" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Orthopedics</h3>
                    <p className="text-gray-600 mb-8 text-center">Expert care for bone, joint, and musculoskeletal conditions.</p>
                    <button className="w-full px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:translate-y-0 flex items-center justify-center gap-3">
                      <Calendar className="w-5 h-5" />
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features Section */}
          <div className="bg-white py-24">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose DoctorWho?</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience healthcare like never before with our comprehensive platform designed for your needs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Column */}
                <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                      <Star className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Top Rated Doctors</h3>
                      <p className="text-gray-600">Access to the highest-rated healthcare professionals in your area, vetted and reviewed by our community.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Scheduling</h3>
                      <p className="text-gray-600">Book appointments at your convenience with our intuitive scheduling system. No more waiting on hold.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                      <AudioWaveform className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Virtual Consultations</h3>
                      <p className="text-gray-600">Connect with doctors remotely through secure video consultations from the comfort of your home.</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Image */}
                <div className="relative">
                    <img 
                      src={visual} 
                      alt="Healthcare Features" 
                      className="w-96 h-96 object-cover ml-28 transform transition-transform duration-700 hover:scale-105"
                    />
                  </div>
              </div>

              {/* Bottom Stats */}
              <div className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
                  <p className="text-gray-600">Active Doctors</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">100k+</div>
                  <p className="text-gray-600">Happy Patients</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
                  <p className="text-gray-600">Medical Specialties</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                  <p className="text-gray-600">Cities Covered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="bg-gradient-to-b from-white via-blue-50/30 to-white py-24">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">Real experiences from people who have transformed their healthcare journey with DoctorWho.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Testimonial Card 1 */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                      SK
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Sarah Kim</h3>
                      <p className="text-blue-600">Patient</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="flex gap-1 text-yellow-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      "Finding the right doctor used to be a hassle. With DoctorWho, I found my perfect match in minutes. The booking process was seamless, and the care was exceptional!"
                    </p>
                  </div>
                  <div className="pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Verified Patient • New York</p>
                  </div>
                </div>

                {/* Testimonial Card 2 */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group md:translate-y-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      JD
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
                      <p className="text-purple-600">Patient</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="flex gap-1 text-yellow-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      "The virtual consultation feature is a game-changer! I got expert medical advice from home, saving time and avoiding unnecessary travel. Highly recommended!"
                    </p>
                  </div>
                  <div className="pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Verified Patient • Los Angeles</p>
                  </div>
                </div>

                {/* Testimonial Card 3 */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl font-bold">
                      EM
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Emily Martinez</h3>
                      <p className="text-green-600">Patient</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="flex gap-1 text-yellow-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      "The quality of healthcare professionals on this platform is outstanding. I found a specialist who really understood my concerns and provided excellent care."
                    </p>
                  </div>
                  <div className="pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Verified Patient • Chicago</p>
                  </div>
                </div>
              </div>

              <div className="mt-16 text-center">
                <Link
                  to="/testimonials"
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  Read More Stories
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500">© 2024 DoctorWho. All rights reserved.</p>
            <div className="flex gap-8">
              <Link to="/terms" className="text-gray-500 hover:text-blue-600 transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-500 hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}