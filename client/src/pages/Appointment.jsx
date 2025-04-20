import React, { useEffect, useState } from 'react';

const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterDate, setFilterDate] = useState('');

    // Get the role and logged-in user id from localStorage
    const role = localStorage.getItem('userType'); // "doctor" or "user"
    const loggedInUserId = localStorage.getItem('userId');

    // console.log('Role:', role);
    // console.log('Logged-in User ID:', loggedInUserId);

    const fetchAppointments = async () => {
        try {
            const endpoint =
                role === 'doctor'
                    ? 'http://localhost:5000/api/appointment/doctor'
                    : 'http://localhost:5000/api/appointment';
            const response = await fetch(endpoint, { credentials: 'include' });
            if (!response.ok) {
                throw new Error('Failed to fetch appointments.');
            }
            const data = await response.json();
            // console.log('Fetched appointments:', data);
            setAppointments(data.appointments);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
        // eslint-disable-next-line
    }, [role]);

    const formatDate = (isoDate) => {
        return new Date(isoDate).toLocaleDateString();
    };

    // Filter appointments by date (formatted as "YYYY-MM-DD")
    const filteredAppointments = filterDate
        ? appointments.filter((appointment) => {
              const appointmentDate = new Date(appointment.appointmentDate);
              const yyyy = appointmentDate.getFullYear();
              const mm = String(appointmentDate.getMonth() + 1).padStart(2, '0');
              const dd = String(appointmentDate.getDate()).padStart(2, '0');
              const formattedDate = `${yyyy}-${mm}-${dd}`;
              return formattedDate === filterDate;
          })
        : appointments;

    // Approve appointment (for doctors)
    const approveAppointment = async (appointmentId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/appointment/${appointmentId}/approve`, {
                method: 'PUT',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to update appointment.');
            }
            const updated = await response.json();
            setAppointments((prev) =>
                prev.map((appt) =>
                    appt._id === appointmentId ? { ...appt, status: updated.appointment.status } : appt
                )
            );
        } catch (err) {
            alert(err.message);
        }
    };

    // Cancel appointment (for doctors)
    const cancelAppointment = async (appointmentId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/appointment/${appointmentId}/cancel`, {
                method: 'PUT',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to cancel appointment.');
            }
            const updated = await response.json();
            setAppointments((prev) =>
                prev.map((appt) =>
                    appt._id === appointmentId ? { ...appt, status: updated.appointment.status } : appt
                )
            );
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading)
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 100%)',
                    fontFamily: '"Poppins", sans-serif'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem'
                    }}
                >
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            border: '4px solid rgba(0, 123, 255, 0.1)',
                            borderRadius: '50%',
                            borderTopColor: '#0d6efd',
                            animation: 'spin 1s linear infinite'
                        }}
                    />
                    <p
                        style={{
                            fontSize: '1.25rem',
                            color: '#0d6efd',
                            fontWeight: '500'
                        }}
                    >
                        Loading appointments...
                    </p>
                </div>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );

    if (error)
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 100%)',
                    fontFamily: '"Poppins", sans-serif',
                    color: '#dc3545',
                    padding: '2rem'
                }}
            >
                <div
                    style={{
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '2rem',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
                        textAlign: 'center',
                        maxWidth: '500px'
                    }}
                >
                    <svg
                        style={{ width: '64px', height: '64px', color: '#dc3545', margin: '0 auto 1rem' }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Error Loading Appointments</h2>
                    <p>{error}</p>
                </div>
            </div>
        );

    return (
        <div
            style={{
                padding: '2rem',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 100%)',
                minHeight: '100vh',
                fontFamily: '"Poppins", sans-serif'
            }}
        >
            <div
                style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    background: '#fff',
                    padding: '2.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.05)'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '2rem'
                    }}
                >
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#ebf4ff',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '1rem'
                        }}
                    >
                        <svg
                            style={{ width: '28px', height: '28px', color: '#0d6efd' }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h1
                        style={{
                            margin: 0,
                            color: '#2d3748',
                            fontSize: '2.2rem',
                            fontWeight: '700',
                            background: 'linear-gradient(90deg, #0d6efd, #4dabf7)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        My Appointments
                    </h1>
                </div>

                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label htmlFor="dateFilter" style={{ fontWeight: '600' }}>
                        Filter by Date:
                    </label>
                    <input
                        type="date"
                        id="dateFilter"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #dee2e6'
                        }}
                    />
                    {filterDate && (
                        <button
                            onClick={() => setFilterDate('')}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#dc3545',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>

                {filteredAppointments.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            color: '#6c757d',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '12px',
                            border: '1px dashed #dee2e6'
                        }}
                    >
                        <svg
                            style={{ width: '80px', height: '80px', marginBottom: '1.5rem', color: '#0d6efd' }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <h2
                            style={{
                                fontSize: '1.75rem',
                                fontWeight: '600',
                                color: '#2d3748',
                                marginBottom: '1rem'
                            }}
                        >
                            No appointments to display
                        </h2>
                        <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                            Your schedule is clear. Ready to book your next appointment?
                        </p>
                        <button
                            style={{
                                padding: '0.8rem 2rem',
                                backgroundColor: '#0d6efd',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.08)'
                            }}
                            onClick={() => (window.location.href = '/find-doctors')}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = '#0b5ed7')}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = '#0d6efd')}
                        >
                            Schedule Appointment
                        </button>
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gap: '1.5rem',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
                        }}
                    >
                        {filteredAppointments.map((appointment) => {
                            const isUserAppointment =
                                role === 'user' && appointment.user && appointment.user._id === loggedInUserId;
                            const isDoctorAppointment =
                                role === 'doctor' && appointment.doctor && appointment.doctor._id === loggedInUserId;

                            const statusConfig = {
                                pending: {
                                    bg: '#fff8e6',
                                    text: '#ff9800',
                                    border: '#ffe0b2',
                                    icon: (
                                        <svg style={{ width: '16px', height: '16px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )
                                },
                                approved: {
                                    bg: '#e6f7ed',
                                    text: '#10b981',
                                    border: '#b7e1cd',
                                    icon: (
                                        <svg style={{ width: '16px', height: '16px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )
                                },
                                cancelled: {
                                    bg: '#ffebee',
                                    text: '#ef4444',
                                    border: '#f5c2c7',
                                    icon: (
                                        <svg style={{ width: '16px', height: '16px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )
                                }
                            };

                            const statusStyle =
                                statusConfig[appointment.status.toLowerCase()] || {
                                    bg: '#e6f2ff',
                                    text: '#0d6efd',
                                    border: '#b6d4fe'
                                };

                            return (
                                <div
                                    key={appointment._id}
                                    style={{
                                        padding: '1.8rem',
                                        borderRadius: '14px',
                                        backgroundColor: 'white',
                                        boxShadow: '0 4px 20px rgba(50,50,93,0.05), 0 2px 6px rgba(0,0,0,0.04)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        border: '1px solid #f0f5ff'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-6px)';
                                        e.currentTarget.style.boxShadow =
                                            '0 10px 30px rgba(13,110,253,0.12), 0 4px 8px rgba(0,0,0,0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(50,50,93,0.05), 0 2px 6px rgba(0,0,0,0.04)';
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(90deg, #0d6efd, #4dabf7)'
                                        }}
                                    ></div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '1.25rem'
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                backgroundColor: statusStyle.bg,
                                                color: statusStyle.text,
                                                padding: '0.4rem 0.9rem',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                border: `1px solid ${statusStyle.border}`
                                            }}
                                        >
                                            {statusStyle.icon}
                                            {appointment.status.toUpperCase()}
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: '#6c757d',
                                                fontSize: '0.9rem',
                                                fontWeight: '500'
                                            }}
                                        >
                                            <svg
                                                style={{ width: '16px', height: '16px', marginRight: '0.25rem', color: '#0d6efd' }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <span style={{ marginRight: '5px' }}>
                                                {formatDate(appointment.appointmentDate)}
                                            </span>
                                            <span style={{ fontWeight: '600' }}>• {appointment.appointmentTime}</span>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            marginBottom: '1.2rem',
                                            padding: '1rem',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        {role === 'doctor' ? (
                                            <div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        marginBottom: '0.5rem'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#e6f2ff',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginRight: '0.75rem'
                                                        }}
                                                    >
                                                        <svg
                                                            style={{ width: '20px', height: '20px', color: '#0d6efd' }}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <h3
                                                        style={{
                                                            color: '#2d3748',
                                                            fontSize: '1.1rem',
                                                            fontWeight: '600',
                                                            margin: 0
                                                        }}
                                                    >
                                                        Patient: {appointment.user && appointment.user.name ? appointment.user.name : 'N/A'}
                                                    </h3>
                                                </div>
                                                {appointment.user && appointment.user.email && (
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            marginLeft: '3.5rem',
                                                            color: '#6c757d',
                                                            fontSize: '0.95rem'
                                                        }}
                                                    >
                                                        <svg
                                                            style={{ width: '14px', height: '14px', marginRight: '0.25rem', color: '#0d6efd' }}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        {appointment.user.email}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        marginBottom: '0.5rem'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#e6f2ff',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginRight: '0.75rem'
                                                        }}
                                                    >
                                                        <svg
                                                            style={{ width: '20px', height: '20px', color: '#0d6efd' }}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <h3
                                                        style={{
                                                            color: '#2d3748',
                                                            fontSize: '1.1rem',
                                                            fontWeight: '600',
                                                            margin: 0
                                                        }}
                                                    >
                                                        Dr. {appointment.doctor && appointment.doctor.name ? appointment.doctor.name : 'N/A'}
                                                    </h3>
                                                </div>
                                                {appointment.doctor && appointment.doctor.email && (
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            marginLeft: '3.5rem',
                                                            color: '#6c757d',
                                                            fontSize: '0.95rem'
                                                        }}
                                                    >
                                                        <svg
                                                            style={{ width: '14px', height: '14px', marginRight: '0.25rem', color: '#0d6efd' }}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        {appointment.doctor.email}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {(isUserAppointment || isDoctorAppointment) && (
                                        <div
                                            style={{
                                                marginTop: '0.5rem',
                                                padding: '0.5rem 0.75rem',
                                                backgroundColor: '#e6f2ff',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: '#0d6efd',
                                                fontSize: '0.9rem',
                                                fontWeight: '500'
                                            }}
                                        >
                                            <svg style={{ width: '16px', height: '16px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            You are part of this appointment
                                        </div>
                                    )}

                                    {role === 'doctor' && appointment.status.toLowerCase() === 'pending' && (
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
                                            <button
                                                style={{
                                                    padding: '0.8rem 1.5rem',
                                                    backgroundColor: '#0d6efd',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    transition: 'all 0.2s',
                                                    flex: '1',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    boxShadow: '0 4px 6px rgba(13,110,253,0.1)'
                                                }}
                                                onClick={() => approveAppointment(appointment._id)}
                                                onMouseEnter={(e) => (e.target.style.backgroundColor = '#0b5ed7')}
                                                onMouseLeave={(e) => (e.target.style.backgroundColor = '#0d6efd')}
                                            >
                                                <svg style={{ width: '18px', height: '18px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Approve Appointment
                                            </button>
                                            <button
                                                style={{
                                                    padding: '0.8rem 1.5rem',
                                                    backgroundColor: '#ef4444',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    transition: 'all 0.2s',
                                                    flex: '1',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    boxShadow: '0 4px 6px rgba(239,68,68,0.1)'
                                                }}
                                                onClick={() => cancelAppointment(appointment._id)}
                                                onMouseEnter={(e) => (e.target.style.backgroundColor = '#dc2626')}
                                                onMouseLeave={(e) => (e.target.style.backgroundColor = '#ef4444')}
                                            >
                                                <svg style={{ width: '18px', height: '18px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Cancel Appointment
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointment;