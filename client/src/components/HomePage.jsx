import { Link } from 'react-router-dom';
import { Stethoscope, Search, Star, Calendar, Heart,MessageCircle, CheckCircle,Clock, AudioWaveform } from 'lucide-react';
import doc from '../assets/doc.png';
import docs from '../assets/docs.svg';
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
        <div className="w-full relative flex flex-col items-center justify-center py-12 text-center bg-gradient-to-t from-white via-sky-50 to-white">
          <h1 className="py-[8px] text-7xl font-bold z-10 bg-clip-text text-transparent bg-gradient-to-b from-sky-500 to-blue-700 flex items-center justify-center leading-tight overflow-visible">
            Welcome to {displayText}
            {!typingComplete && <span className="typing-cursor ml-4"></span>}
            {typingComplete && <span className="ml-1">{' '}</span>}
          </h1>

          <p className={`text-lg text-gray-500 mb-6 z-10 backdrop-blur-sm transform transition-all duration-1000 ease-in-out ${typingComplete ? "opacity-100 " : "opacity-0 translate-y-8"}`}>
            Meet all the healthcare experts you'll ever need in one place with a single click.
          </p>
          <form onSubmit={handleSearch} className="w-1/2 z-10">
            <div className="flex items-center w-full relative group">
              <div className="absolute inset-0 border-gray-700 rounded-full transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none">
                <span className="absolute inset-x-0 top-0 h-[1.7px] bg-blue-400 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></span>
                <span className="absolute inset-y-0 right-0 w-[1.5px] bg-blue-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top"></span>
                <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right"></span>
                <span className="absolute inset-y-0 left-0 w-[1.5px] bg-blue-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-bottom"></span>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-8 py-6 pr-16 text-xl text-gray-600 bg-white rounded-md border border-gray-200 focus:outline-none hover:shadow-md transition-shadow duration-300"
                placeholder="Describe your symptoms..."
                required
              />
              <button
                type="submit"
                className="w-14 absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-gradient-to-br from-sky-500 to-blue-500 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl py-4 rounded-lg"
              >
                <FaSearch className="w-6 h-6" />
              </button>
            </div>
          </form>
        <hr className="mt-20 mx-auto w-4/5 border border-sky-100 opacity-85" />
        </div>


        <section className="pb-32 w-full bg-gradient-to-b from-white via-sky-50 to-white">
          <div className="container mx-auto px-4 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="px-24 space-y-4">
                <h1 className="flex flex-col text-4xl sm:text-6xl font-bold tracking-tighter text-blue-950 mb-12 gap-6">
                  Discover Your
                  <span className={`text-blue-800 inline-block ${animationClass}`}>
                    {currentText}
                  </span>
                  Medical Match
                </h1>
                <div className="flex gap-4 flex-col">
                  <p className="text-lg text-gray-600">
                    Connect with the best healthcare professionals in your area and book an appointment in minutes.
                  </p>
                  
                  <Link to="/signup" className="w-60 text-white px-6 py-4 rounded-3xl font-bold bg-gradient-to-br from-sky-500 to-blue-600 shadow-md shadow-blue-500/40 text-xl transition-all duration-300 ease-in-out">
                  <div className="flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 mr-2" />
                    Get Started Now
                  </div>
                  </Link>

                </div>
              </div>
              <img
                ref={imageRef}
                src={docs}
                alt="Doctor"
                className={`w-full h-full object-cover rounded-lg transition-transform duration-500 ease-in-out ${
                  isImageInView ? 'scale-100' : 'scale-90'
                }`}
              />
            </div>
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 max-w-[1100px] mx-auto gap-8">
      <div className="max-w-[350px] flex space-x-4 bg-gradient-to-tl from-sky-500 to-blue-500 shadow-md shadow-blue-500/40 rounded-2xl px-4 flex-row items-center transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/60">
        <div className="flex-shrink-0">
          <Clock className="w-12 h-12 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">24 Hour Service</h2>
          <p className="text-md text-gray-100" style={{ lineHeight: '1.3'}}> Our search engine is available 24/7 to help you find the right doctor.</p>
        </div>
      </div>
      <div className="max-w-[350px] flex space-x-4 bg-gradient-to-tl from-sky-500 to-blue-500 shadow-md shadow-blue-500/40 rounded-2xl px-4 py-3 flex-row items-center transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/60">
        <div className="flex-shrink-0">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Book Appointments</h2>
          <p className="text-md text-gray-100" style={{ lineHeight: '1.3'}}> Book an appointment with your doctor in just a few clicks.</p>
        </div>
      </div>
      <div className="max-w-[350px] flex space-x-4 bg-gradient-to-tl from-sky-500 to-blue-500 shadow-md shadow-blue-500/40 rounded-2xl px-4 py-3 flex-row items-center transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/60">
        <div className="flex-shrink-0">
          <Heart className="w-12 h-12 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">High Quality Care</h2>
          <p className="text-md text-gray-100 " style={{ lineHeight: '1.3' }}> We provide the best healthcare providers to our patients.</p>
        </div>
      </div>
    </div>
          </div>
        </section>


       
      </main>

      <footer className="w-full py-6 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <p className="text-xs text-slate-500">© 2024 DoctorWho. All rights reserved.</p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <Link className="text-xs text-slate-500 hover:text-blue-700 transition-colors" to="/terms">
                Terms of Service
              </Link>
              <Link className="text-xs text-slate-500 hover:text-blue-700 transition-colors" to="/privacy">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}