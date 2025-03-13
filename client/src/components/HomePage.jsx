import { Link } from 'react-router-dom';
import { Stethoscope, Search, Star, Calendar, Heart } from 'lucide-react';
import doc from '../assets/doc.png';
import React from 'react';


export default function HomePage() {
  const changingtext=["Perfect", "Ideal", "Personalized", "Ultimate", "Optimal", "Trusted"];
  const [index, setIndex] = React.useState(0);
  const [currentText, setCurrentText] = React.useState(changingtext[0]);
  const [animationClass, setAnimationClass] = React.useState('animate-slide-in');
  
  React.useEffect(() => {
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
        `}
      </style>
      
      <main className="flex-1">
        <section className="w-full py-12">
          <div className="container mx-auto px-4 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="px-24 space-y-4">
                <h1 className="flex flex-col text-4xl sm:text-6xl font-bold tracking-tighter text-blue-900 mb-12 gap-6">
                  Discover Your 
                    <span className={`text-blue-500 inline-block ${animationClass}`}>
                      {currentText}
                    </span>
               
                  Healthcare Match
                </h1>
                <div className="flex gap-4 flex-col">
                <p className="text-lg text-sky-800">
                  Connect with the best healthcare professionals in your area and book an appointment in minutes.
                </p>
                <Link to="/signup" className="w-44 bg-blue-500 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-600 shadow-sm shadow-blue-500/40 text-xl transition-all duration-300 ease-in-out">
                  Join Now
                </Link>
                </div>
              </div>
              <img src={doc} alt="Doctor" className="w-full h-full scale- object-cover rounded-lg" />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-blue-900">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Top-Rated Doctors", icon: Star, color: "text-yellow-500", description: "Access to a network of highly qualified and vetted healthcare professionals." },
                { title: "Easy Scheduling", icon: Calendar, color: "text-blue-500", description: "Book appointments quickly and easily, 24/7, at your convenience." },
                { title: "Patient-Centered Care", icon: Heart, color: "text-red-500", description: "We prioritize your health and well-being with personalized care options." },
              ].map((feature, index) => (
                <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg shadow-sm p-6">
                  <h3 className="flex items-center text-lg font-semibold text-blue-700 mb-2">
                    <feature.icon className={`h-6 w-6 mr-2 ${feature.color}`} />
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-blue-900">Popular Specialties</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                'Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics',
                'Neurology', 'Oncology', 'Gynecology', 'Psychiatry'
              ].map((specialty, index) => (
                <button key={index} className="h-20 text-lg font-medium bg-white text-blue-700 border border-slate-200 rounded-md hover:bg-blue-50 hover:text-blue-800 transition-colors">
                  {specialty}
                </button>
              ))}
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