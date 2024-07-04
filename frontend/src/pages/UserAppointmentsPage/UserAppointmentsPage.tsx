import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './userappointments.css'; 
import { Box, CircularProgress } from '@mui/material';
import NoData from '../../assets/no_data.png'

const UserAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useAuth();

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!userId) return; 
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/api/appointments/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', 
                });
                if (!response.ok) throw new Error('Network response was not ok.');
                const data = await response.json();
                data.forEach((appointment: { therapist_details: { profile_picture: string; }; }) => {
                    appointment.therapist_details.profile_picture = appointment.therapist_details.profile_picture
                        ? `http://localhost:8000${appointment.therapist_details.profile_picture}`
                        : `http://localhost:8000/media/profile_pictures/blank.jpg`;
                });
                setAppointments(data);
            } catch (error) {
                console.error('There was an error!', error);
            }
            setLoading(false);
        };

        fetchAppointments();
    }, [userId]);
    if (loading) return  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
</Box>;

    return (
        <div className="user-appointments-container">
           
            {appointments.length > 0 ? (
                <div> <h2 style={{textAlign:'center',color:'rgb(85,89,101)',fontWeight:'bolder'}}>Your Appointments</h2>
                <div className="appointment-cards">
                    {appointments.map((appointment: { id: string, therapist_details: { profile_picture: string, name: string }, scheduled_time: string, status: string }) => (
                        <div key={appointment.id} className={`appointment-card ${appointment.status}`}>
                            <img src={appointment.therapist_details.profile_picture} alt={appointment.therapist_details.name} className="therapist-photo" />
                            <div className="appointment-info">
                                <h2>Appointment with {appointment.therapist_details.name}</h2>
                                <p>Date: {new Date(appointment.scheduled_time).toLocaleString()}</p>
                                <p>Status: {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</p>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            ) : (
                <div className="no-appointments">
                    <img src={NoData} alt="No therapists found" className="not-data-found-image" />
                    You have no appointments. 
                   
                    <p>Click <a href="/list-therapists"> here </a> to view therapists and schedule an appointment</p>
                    
                </div>
            )}
        </div>
    );
};

export default UserAppointmentsPage;
