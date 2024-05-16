import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, IconButton} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import './therapistappointmentspage.css'; 
import NoData from '../../assets/no_data.png';

interface UserDetails {
    id: string;
    name: string;
    profile_picture: string;
}

interface Appointment {
    id: string;
    user_details: UserDetails;
    scheduled_time: string;
    status: string;
}

const TherapistAppointmentsPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useAuth();

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!userId) return;
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/api/therapist/appointments/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // If you're using cookies for auth
                });
                if (!response.ok) throw new Error('Network response was not ok.');
                const data = await response.json();

                // Type checking and data validation
                const validatedData = data.map((appointment: any) => {
                    if (typeof appointment === 'object' && appointment.user_details && typeof appointment.user_details === 'object') {
                        return {
                            ...appointment,
                            user_details: {
                                ...appointment.user_details,
                                profile_picture: appointment.user_details.profile_picture
                                    ? `http://localhost:8000${appointment.user_details.profile_picture}`
                                    : `http://localhost:8000/media/profile_pictures/blank.jpg`
                            }
                        };
                    }
                    return appointment;
                });

                setAppointments(validatedData);
            } catch (error) {
                console.error('There was an error!', error);
            }
            setLoading(false);
        };

        fetchAppointments();
    }, [userId]);

    const updateAppointmentStatus = async (appointmentId: string, status: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/therapist/appointment/status/${appointmentId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ status }),
            });
            if (!response.ok) throw new Error('Network response was not ok.');
            const updatedAppointment = await response.json();

            setAppointments((prevAppointments) =>
                prevAppointments.map((appointment) =>
                    appointment.id === appointmentId ? { ...appointment, status: updatedAppointment.status } : appointment
                )
            );
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
    );

    return (
        <div className="therapist-appointments-container">
            {appointments.length > 0 ? (
                <div>
                    <h2 style={{ textAlign: 'center', color: 'rgb(85,89,101)', fontWeight: 'bolder' }}>Appointments with You</h2>
                    <div className="appointment-cards">
                        {appointments.map((appointment) => (
                            <div key={appointment.id} className={`appointment-card ${appointment.status}`}>
                                <img src={appointment.user_details.profile_picture} alt={appointment.user_details.name} className="therapist-photo" />
                                <div className="appointment-info">
                                    <h2>Appointment with {appointment.user_details.name}</h2>
                                    <p>Date: {new Date(appointment.scheduled_time).toLocaleString()}</p>
                                    <p>Status: {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</p>
                                </div>
                                {appointment.status === 'pending' && (
                                    <div className="appointment-actions">
                                        <IconButton
                                            aria-label="accept"
                                            color="primary"
                                            onClick={() => updateAppointmentStatus(appointment.id, 'accepted')}
                                        >
                                            <CheckCircle />
                                        </IconButton>
                                        <IconButton
                                            aria-label="decline"
                                            color="secondary"
                                            onClick={() => updateAppointmentStatus(appointment.id, 'canceled')}
                                        >
                                            <Cancel />
                                        </IconButton>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="no-appointments">
                    <img src={NoData} alt="No appointments found" className="not-data-found-image" />
                    You have no appointments.
                </div>
            )}
        </div>
    );
};

export default TherapistAppointmentsPage;
