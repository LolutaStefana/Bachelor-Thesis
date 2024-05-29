import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, IconButton, Tooltip, Snackbar, SnackbarContent } from '@mui/material';
import { CheckCircleOutline, CancelOutlined } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal/Modal';  
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<{appointmentId: string, status: string, message: string} | null>(null);
    const [snackbarContent, setSnackbarContent] = useState<{message: string, severity: 'success' | 'error'} | null>(null);
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
                    credentials: 'include', 
                });
                if (!response.ok) throw new Error('Network response was not ok.');
                const data = await response.json();

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

    const handleOpenModal = (appointmentId: string, status: string, message: string) => {
        setModalContent({appointmentId, status, message});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

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
            setSnackbarContent({ message: `Appointment ${status === 'accepted' ? 'accepted' : 'canceled'} successfully!`, severity: 'success' });
        } catch (error) {
            console.error('There was an error!', error);
            setSnackbarContent({ message: `Failed to ${status === 'accepted' ? 'accept' : 'cancel'} appointment.`, severity: 'error' });
        } finally {
            handleCloseModal();
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarContent(null);
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
                                    <h2 style={{marginRight:'100px'}}>Appointment with {appointment.user_details.name}</h2>
                                    <p>Date: {new Date(appointment.scheduled_time).toLocaleString()}</p>
                                    <p>Status: {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</p>
                                </div>
                                {appointment.status === 'pending' && (
                                    <div className="appointment-actions">
                                        <Tooltip title="Accept">
                                            <IconButton
                                                aria-label="accept"
                                                style={{ color: '#94AAF1' }} 
                                                onClick={() => handleOpenModal(appointment.id, 'accepted', 'Are you sure you want to accept this appointment?')}
                                            >
                                                <CheckCircleOutline />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Decline">
                                            <IconButton
                                                aria-label="decline"
                                                style={{ color: '#555965' }} 
                                                onClick={() => handleOpenModal(appointment.id, 'canceled', 'Are you sure you want to decline this appointment?')}
                                            >
                                                <CancelOutlined />
                                            </IconButton>
                                        </Tooltip>
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
            {modalContent && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <div >
                    <h3 style={{textAlign: 'center',marginBottom:'40px', color:'#555965'}}>{modalContent.message}</h3>
                    <div className="modal-buttons">
                        <button className="confirm-button" onClick={() => updateAppointmentStatus(modalContent.appointmentId, modalContent.status)}>Confirm</button>
                        <button className="cancel-button" onClick={handleCloseModal}>Cancel</button>
                    </div>
                    </div>
                </Modal>
            )}
            {snackbarContent && (
                <Snackbar
                    open={Boolean(snackbarContent)}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <SnackbarContent
                        style={{ backgroundColor: snackbarContent.severity === 'success' ? 'rgb(85,89,101)' : '#f44336' }}
                        message={
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                {snackbarContent.severity === 'success' ? <CheckCircleOutline style={{ marginRight: '8px' }} /> : <CancelOutlined style={{ marginRight: '8px' }} />}
                                {snackbarContent.message}
                            </span>
                        }
                    />
                </Snackbar>
            )}
        </div>
    );
};

export default TherapistAppointmentsPage;
