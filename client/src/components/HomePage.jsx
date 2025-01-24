import { Link } from 'react-router-dom';
import { Stethoscope, Search, Star, Calendar, Heart } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-blue-900">
                  Find the Right Doctor, Right Now
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-700 md:text-xl">
                  Instantly connect with top-rated doctors in your area. Quality healthcare is just a search away.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Search for doctors or specialties"
                    type="text"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-700 text-white hover:bg-blue-800 h-10 py-2 px-4"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </button>
                </form>
              </div>
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
