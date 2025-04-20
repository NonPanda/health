import { useState, useEffect } from 'react';
import { 
    X, Plus, Bell, Calendar, Edit, Trash2, AlertCircle, Clock, ChevronRight, 
    Activity, Pill, RefreshCw, Search, CheckCircle, XCircle, Moon, Sun, MoreHorizontal 
} from 'lucide-react';

export default function MedicationsDashboard() {
    // State for medications list
    const [medications, setMedications] = useState([
        {
            id: 1,
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            time: "8:00 AM",
            instructions: "Take with food",
            refillDate: "May 15, 2025",
            doctor: "Dr. Sarah Johnson",
            purpose: "Blood pressure management",
            color: "#4F46E5",
            adherence: 95,
            taken: true,
            category: "Heart"
        },
        {
            id: 2,
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            time: "9:00 AM, 9:00 PM",
            instructions: "Take with meals",
            refillDate: "May 3, 2025",
            doctor: "Dr. Michael Chen",
            purpose: "Blood sugar control",
            color: "#10B981",
            adherence: 88,
            taken: false,
            category: "Diabetes"
        },
        {
            id: 3,
            name: "Atorvastatin",
            dosage: "20mg",
            frequency: "Once daily",
            time: "8:00 PM",
            instructions: "Take in the evening",
            refillDate: "June 10, 2025",
            doctor: "Dr. Sarah",
            adherence: 90,
            taken: false,
            category: "Heart"
        },
        {
            id: 4,
            name: "Sertraline",
            dosage: "50mg",
            frequency: "Once daily",
            time: "10:00 AM",
            instructions: "Take in the morning",
            refillDate: "May 28, 2025",
            doctor: "Dr. Jessica Williams",
            purpose: "Mood stabilizer",
            color: "#8B5CF6",
            adherence: 97,
            taken: true,
            category: "Mental Health"
        }
    ]);

    // State for theme
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    // State for view mode
    const [viewMode, setViewMode] = useState("grid");
    
    // State for active tab
    const [activeTab, setActiveTab] = useState("all");
    
    // State for new medication form
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMed, setNewMed] = useState({
        name: "",
        dosage: "",
        frequency: "",
        time: "",
        instructions: "",
        refillDate: "",
        doctor: "",
        purpose: "",
        color: "#4F46E5",
        category: "Heart"
    });

    // State for medication detail view
    const [selectedMed, setSelectedMed] = useState(null);
    
    // State for animation effects
    const [animateCard, setAnimateCard] = useState(null);

    // Search state
    const [searchTerm, setSearchTerm] = useState("");

    // Filter medications based on active tab and search
    const filteredMedications = medications.filter(med => {
        const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                    (med.purpose && med.purpose.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (activeTab === "all") return matchesSearch;
        if (activeTab === "morning") return matchesSearch && med.time.includes("AM");
        if (activeTab === "evening") return matchesSearch && med.time.includes("PM");
        if (activeTab === "taken") return matchesSearch && med.taken;
        if (activeTab === "pending") return matchesSearch && !med.taken;
        
        return matchesSearch;
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMed(prev => ({ ...prev, [name]: value }));
    };

    // Add new medication
    const handleAddMedication = () => {
        if (newMed.name && newMed.dosage) {
            const newMedication = {
                id: medications.length + 1,
                ...newMed,
                adherence: 100,
                taken: false
            };
            
            setMedications([...medications, newMedication]);
            
            // Reset form
            setNewMed({
                name: "",
                dosage: "",
                frequency: "",
                time: "",
                instructions: "",
                refillDate: "",
                doctor: "",
                purpose: "",
                color: "#4F46E5",
                category: "Heart"
            });
            setShowAddForm(false);
        }
    };

    // Delete medication
    const handleDeleteMedication = (id) => {
        setAnimateCard(id);
        setTimeout(() => {
            setMedications(medications.filter(med => med.id !== id));
            if (selectedMed && selectedMed.id === id) {
                setSelectedMed(null);
            }
            setAnimateCard(null);
        }, 300);
    };

    // View medication details
    const handleViewDetails = (med) => {
        setSelectedMed(med);
    };

    // Close detail view
    const handleCloseDetails = () => {
        setSelectedMed(null);
    };

    // Toggle medication taken status
    const handleToggleTaken = (id) => {
        setMedications(medications.map(med => 
            med.id === id ? { ...med, taken: !med.taken } : med
        ));
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Background gradient classes based on theme
    const bgGradient = isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" 
        : "bg-gradient-to-br from-blue-50 via-white to-blue-100";

    // Card background based on theme
    const cardBg = isDarkMode ? "bg-gray-800" : "bg-white";
    const textColor = isDarkMode ? "text-white" : "text-gray-800";
    const textMuted = isDarkMode ? "text-gray-400" : "text-gray-500";
    const borderColor = isDarkMode ? "border-gray-700" : "border-blue-100";

    return (
        <div className={`min-h-screen ${bgGradient} transition-all duration-300`}>
            {/* Header */}
            <header className={`sticky top-0 z-10 backdrop-blur-md ${isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'} border-b ${borderColor} shadow-sm`}>
                <div className="container mx-auto p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                                <Pill size={24} className={`${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                            </div>
                            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-800'}`}>MediTrack</h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={toggleDarkMode}
                                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'} transition-colors`}
                            >
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            
                            <button 
                                onClick={() => setShowAddForm(true)}
                                className={`flex items-center px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
                                    isDarkMode 
                                        ? 'bg-blue-600 text-white hover:bg-blue-500' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                <Plus size={18} className="mr-1" />
                                Add Medication
                            </button>
                        </div>
                    </div>
                    
                    {/* Search and filters */}
                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
                        <div className={`relative w-full sm:w-64 mb-3 sm:mb-0 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            <input
                                type="text"
                                placeholder="Search medications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`pl-10 pr-4 py-2 w-full rounded-full outline-none border focus:ring-2 ${
                                    isDarkMode 
                                        ? 'bg-gray-800 border-gray-700 focus:ring-blue-600 text-white' 
                                        : 'bg-white border-gray-200 focus:ring-blue-400 text-gray-800'
                                } transition-all`}
                            />
                            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        </div>
                        
                        <div className="flex space-x-1 overflow-x-auto w-full sm:w-auto pb-1">
                            <button 
                                onClick={() => setActiveTab("all")}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                    activeTab === "all" 
                                    ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') 
                                    : (isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100')
                                }`}
                            >
                                All Meds
                            </button>
                            <button 
                                onClick={() => setActiveTab("morning")}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                    activeTab === "morning" 
                                    ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') 
                                    : (isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100')
                                }`}
                            >
                                <Sun size={14} className="inline mr-1" />
                                Morning
                            </button>
                            <button 
                                onClick={() => setActiveTab("evening")}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                    activeTab === "evening" 
                                    ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') 
                                    : (isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100')
                                }`}
                            >
                                <Moon size={14} className="inline mr-1" />
                                Evening
                            </button>
                            <button 
                                onClick={() => setActiveTab("taken")}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                    activeTab === "taken" 
                                    ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') 
                                    : (isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100')
                                }`}
                            >
                                <CheckCircle size={14} className="inline mr-1" />
                                Taken
                            </button>
                            <button 
                                onClick={() => setActiveTab("pending")}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                    activeTab === "pending" 
                                    ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') 
                                    : (isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100')
                                }`}
                            >
                                <XCircle size={14} className="inline mr-1" />
                                Pending
                            </button>
                        </div>
                        
                        <div className="hidden sm:flex space-x-1 ml-2">
                            <button 
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-md ${
                                    viewMode === "grid" 
                                        ? (isDarkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-800') 
                                        : (isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100')
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                </svg>
                            </button>
                            <button 
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-md ${
                                    viewMode === "list" 
                                        ? (isDarkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-800') 
                                        : (isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100')
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="8" y1="6" x2="21" y2="6"></line>
                                    <line x1="8" y1="12" x2="21" y2="12"></line>
                                    <line x1="8" y1="18" x2="21" y2="18"></line>
                                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-4 pb-24">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-4 transform transition-all hover:scale-105 cursor-pointer`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${textMuted} font-medium`}>Total Medications</p>
                                <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{medications.length}</h3>
                            </div>
                            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
                                <Pill size={24} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                            </div>
                        </div>
                    </div>
                    
                    <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-4 transform transition-all hover:scale-105 cursor-pointer`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${textMuted} font-medium`}>Taken Today</p>
                                <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                    {medications.filter(med => med.taken).length}
                                </h3>
                            </div>
                            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-green-100'}`}>
                                <CheckCircle size={24} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
                            </div>
                        </div>
                    </div>
                    
                    <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-4 transform transition-all hover:scale-105 cursor-pointer`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${textMuted} font-medium`}>Pending</p>
                                <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                                    {medications.filter(med => !med.taken).length}
                                </h3>
                            </div>
                            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-amber-100'}`}>
                                <Clock size={24} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
                            </div>
                        </div>
                    </div>
                    
                    <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-4 transform transition-all hover:scale-105 cursor-pointer`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${textMuted} font-medium`}>Need Refill</p>
                                <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>2</h3>
                            </div>
                            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-red-100'}`}>
                                <RefreshCw size={24} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly Adherence Chart */}
                <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-6 mb-6`}>
                    <h2 className={`text-xl font-bold ${textColor} mb-4`}>Weekly Adherence</h2>
                    <div className="flex items-end space-x-4 h-32">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                            const randomHeight = 40 + Math.floor(Math.random() * 60);
                            const today = index === 3; // Thursday as example
                            
                            return (
                                <div key={day} className="flex flex-col items-center flex-1">
                                    <div 
                                        className={`w-full rounded-t-md transition-all hover:opacity-80 ${
                                            today 
                                                ? (isDarkMode ? 'bg-blue-500' : 'bg-blue-600') 
                                                : (isDarkMode ? 'bg-blue-800/60' : 'bg-blue-400/70')
                                        }`}
                                        style={{ height: `${randomHeight}%` }}
                                    ></div>
                                    <p className={`mt-2 text-xs font-medium ${today ? (isDarkMode ? 'text-blue-400' : 'text-blue-700') : textMuted}`}>{day}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Medications Grid/List */}
                <div className="mb-4 flex justify-between items-center">
                    <h2 className={`text-xl font-bold ${textColor}`}>Your Medications</h2>
                    <span className={`text-sm ${textMuted}`}>{filteredMedications.length} medication{filteredMedications.length !== 1 ? 's' : ''}</span>
                </div>

                {filteredMedications.length === 0 ? (
                    <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-8 text-center`}>
                        <div className="inline-flex justify-center items-center p-4 mx-auto mb-4 rounded-full bg-blue-100">
                            <Pill size={32} className="text-blue-600" />
                        </div>
                        <h3 className={`text-xl font-medium ${textColor} mb-2`}>No medications found</h3>
                        <p className={textMuted}>
                            {searchTerm ? "Try a different search term" : "Add your first medication to get started"}
                        </p>
                        <button 
                            onClick={() => setShowAddForm(true)}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={18} className="inline mr-1" /> Add Medication
                        </button>
                    </div>
                ) : (
                    <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
                        {filteredMedications.map(med => (
                            <div 
                                key={med.id}
                                onClick={() => handleViewDetails(med)}
                                className={`
                                    ${cardBg} rounded-2xl shadow-lg border ${borderColor} overflow-hidden
                                    ${animateCard === med.id ? 'animate-wobble opacity-50' : ''} 
                                    transition-all duration-300 transform hover:scale-102 hover:shadow-xl cursor-pointer
                                `}
                            >
                                {viewMode === "grid" ? (
                                    // Grid view
                                    <div>
                                        <div 
                                            className="h-3" 
                                            style={{ backgroundColor: med.color }}
                                        ></div>
                                        <div className="p-5">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center">
                                                        <span 
                                                            className="inline-block w-3 h-3 rounded-full mr-2" 
                                                            style={{ backgroundColor: med.color }}
                                                        ></span>
                                                        <span className={`text-xs font-medium ${textMuted}`}>{med.category}</span>
                                                    </div>
                                                    <h3 className={`text-xl font-bold ${textColor} mt-1`}>{med.name}</h3>
                                                    <p className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>{med.dosage}</p>
                                                </div>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleTaken(med.id);
                                                    }}
                                                    className={`p-2 rounded-full transition-colors ${
                                                        med.taken 
                                                            ? (isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600') 
                                                            : (isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')
                                                    }`}
                                                >
                                                    {med.taken ? <CheckCircle size={18} /> : <Clock size={18} />}
                                                </button>
                                            </div>
                                            
                                            <div className="mt-4 flex items-center">
                                                <Clock size={16} className={textMuted} />
                                                <span className={`ml-1.5 text-sm ${textMuted}`}>{med.time}</span>
                                            </div>
                                            
                                            <div className="mt-1 flex items-center">
                                                <Bell size={16} className={textMuted} />
                                                <span className={`ml-1.5 text-sm ${textMuted}`}>{med.frequency}</span>
                                            </div>
                                            
                                            <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                                                <div className={`text-sm font-medium ${textColor}`}>
                                                    {med.adherence}% Adherence
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteMedication(med.id);
                                                    }}
                                                    className={`p-1.5 rounded-full text-gray-400 transition-colors hover:${isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}`}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // List view
                                    <div className="flex p-0">
                                        <div 
                                            className="w-2" 
                                            style={{ backgroundColor: med.color }}
                                        ></div>
                                        <div className="flex-1 p-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleToggleTaken(med.id);
                                                        }}
                                                        className={`p-2 mr-3 rounded-full transition-colors ${
                                                            med.taken 
                                                                ? (isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600') 
                                                                : (isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')
                                                        }`}
                                                    >
                                                        {med.taken ? <CheckCircle size={18} /> : <Clock size={18} />}
                                                    </button>
                                                    <div>
                                                        <h3 className={`text-lg font-bold ${textColor}`}>{med.name}</h3>
                                                        <div className="flex items-center">
                                                            <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} mr-2`}>{med.dosage}</span>
                                                            <span
                                                                className="inline-block px-2 py-0.5 text-xs font-medium rounded-full"
                                                                style={{ 
                                                                    backgroundColor: `${isDarkMode ? med.color + '30' : med.color + '20'}`,
                                                                    color: med.color
                                                                }}
                                                            >
                                                                {med.category}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <span className={`hidden md:inline-block text-sm ${textMuted}`}>{med.time}</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteMedication(med.id);
                                                        }}
                                                        className={`p-1.5 rounded-full text-gray-400 transition-colors hover:${isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}`}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <ChevronRight size={16} className={textMuted} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Medication Detail Modal */}
            {selectedMed && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div 
                        className={`${cardBg} rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transition-all transform duration-300 animate-scaleIn`}
                    >
                        <div 
                            className="h-2" 
                            style={{ backgroundColor: selectedMed.color }}
                        ></div>
                        
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    <div 
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4"
                                        style={{ backgroundColor: `${isDarkMode ? selectedMed.color + '30' : selectedMed.color + '20'}` }}
                                    >
                                        <Pill size={24} style={{ color: selectedMed.color }} />
                                    </div>
                                    <div>
                                        <h2 className={`text-2xl font-bold ${textColor}`}>{selectedMed.name}</h2>
                                        <p className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{selectedMed.dosage}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleCloseDetails}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div>
                                {selectedMed.instructions && (
                                    <p className={`text-sm ${textMuted} mb-4`}>{selectedMed.instructions}</p>
                                )}
                                <div className="flex flex-col space-y-2">
                                    <div>
                                        <span className={`font-medium ${textColor}`}>Time: </span>
                                        <span className={textMuted}>{selectedMed.time}</span>
                                    </div>
                                    <div>
                                        <span className={`font-medium ${textColor}`}>Frequency: </span>
                                        <span className={textMuted}>{selectedMed.frequency}</span>
                                    </div>
                                    <div>
                                        <span className={`font-medium ${textColor}`}>Refill Date: </span>
                                        <span className={textMuted}>{selectedMed.refillDate}</span>
                                    </div>
                                    <div>
                                        <span className={`font-medium ${textColor}`}>Doctor: </span>
                                        <span className={textMuted}>{selectedMed.doctor}</span>
                                    </div>
                                    {selectedMed.purpose && (
                                        <div>
                                            <span className={`font-medium ${textColor}`}>Purpose: </span>
                                            <span className={textMuted}>{selectedMed.purpose}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Medication Form Modal (optional) */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className={`${cardBg} rounded-xl shadow-xl w-full max-w-md p-6 transition-all transform duration-300`}>
                        <h2 className={`text-2xl font-bold ${textColor} mb-4`}>Add Medication</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                value={newMed.name}
                                onChange={handleInputChange}
                                placeholder="Medication Name"
                                className={`w-full p-2 rounded border outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-600' : 'bg-white border-gray-200 text-gray-800 focus:ring-blue-400'}`}
                            />
                            <input
                                type="text"
                                name="dosage"
                                value={newMed.dosage}
                                onChange={handleInputChange}
                                placeholder="Dosage (e.g., 10mg)"
                                className={`w-full p-2 rounded border outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-600' : 'bg-white border-gray-200 text-gray-800 focus:ring-blue-400'}`}
                            />
                            <input
                                type="text"
                                name="frequency"
                                value={newMed.frequency}
                                onChange={handleInputChange}
                                placeholder="Frequency (e.g., Once daily)"
                                className={`w-full p-2 rounded border outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-600' : 'bg-white border-gray-200 text-gray-800 focus:ring-blue-400'}`}
                            />
                            <input
                                type="text"
                                name="time"
                                value={newMed.time}
                                onChange={handleInputChange}
                                placeholder="Time (e.g., 8:00 AM)"
                                className={`w-full p-2 rounded border outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-600' : 'bg-white border-gray-200 text-gray-800 focus:ring-blue-400'}`}
                            />
                            <input
                                type="text"
                                name="instructions"
                                value={newMed.instructions}
                                onChange={handleInputChange}
                                placeholder="Instructions"
                                className={`w-full p-2 rounded border outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-600' : 'bg-white border-gray-200 text-gray-800 focus:ring-blue-400'}`}
                            />
                            <input
                                type="text"
                                name="refillDate"
                                value={newMed.refillDate}
                                onChange={handleInputChange}
                                placeholder="Refill Date"
                                className={`w-full p-2 rounded border outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-600' : 'bg-white border-gray-200 text-gray-800 focus:ring-blue-400'}`}
                            />
                            <input
                                type="text"
                                name="doctor"
                                value={newMed.doctor}
                                onChange={handleInputChange}
                                placeholder="Doctor"
                                className={`w-full p-2 rounded border outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-600' : 'bg-white border-gray-200 text-gray-800 focus:ring-blue-400'}`}
                            />
                            <input
                                type="text"
                                name="purpose"
                                value={newMed.purpose}
                                onChange={handleInputChange}
                                placeholder="Purpose (optional)"
                                className={`w-full p-2 rounded border outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-600' : 'bg-white border-gray-200 text-gray-800 focus:ring-blue-400'}`}
                            />
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button 
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 border rounded text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddMedication}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}