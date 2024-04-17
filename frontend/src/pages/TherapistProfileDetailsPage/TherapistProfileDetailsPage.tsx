import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './therapistprofilepage.css';
import Modal from '../../components/Modal/Modal';
import scheduleIcon from '../../schedulle.png';
import { useAuth } from '../../context/AuthContext';
import { Box, Button, CircularProgress, IconButton, Snackbar, SnackbarContent, Tooltip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/Error';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

type Therapist = {
    id: number;
    name: string;
    email: string;
    country?: string;
    city?: string;
    gender?: string;
    description: string;
    profilePicture: string;
    domain_of_interest: string;
    years_of_experience: number;
    is_verified?: boolean;
};

const TherapistProfileDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { userId } = useAuth();
    const [therapist, setTherapist] = useState<Therapist | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [scheduledTime, setScheduledTime] = useState('');
    const navigate=useNavigate();
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    useEffect(() => {
        const fetchTherapistDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/therapists/${id}`);
                if (!response.ok) {
                    throw new Error('Therapist data could not be loaded.');
                }
                let data = await response.json();
                data.profilePicture= data.profile_picture ? `http://localhost:8000/${data.profile_picture}` : `http://localhost:8000/media/profile_pictures/blank.jpg`;
                setTherapist(data); 
            } catch (error) {
                console.error('Fetching therapist details failed:', error);
            }
        };

        fetchTherapistDetails();
    }, [id]);
    const handleBackClick = () => {
        navigate(-1); // navigate back to the previous page
    };

    if (!therapist) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }
    const handleScheduleAppointment = async () => {
        if (!userId) {
            alert('You must be logged in to schedule an appointment.');
            return;
        }
    
        try {
            const body = {
                user: userId,
                therapist: parseInt(id ?? ''),
                scheduled_time: scheduledTime
            };
            const response = await fetch('http://localhost:8000/api/appointments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (response.ok) {
                setModalOpen(false); // Close the modal on success
                setOpenSnackbar(true);
            } else {
                throw new Error('Failed to schedule appointment');
            }
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            setOpenErrorSnackbar(true);
        }
    };
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    const handleCloseErrorSnackbar = () => {
        setOpenErrorSnackbar(false);
    };

    return (
        <div className="therapist-profile-details-page">
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
  <div className="modal-body">
    <h2>Schedule Your Appointment</h2>
    <p> Please take a moment to select a date and time that works best for you.</p>
    <hr className="modal-divider" /> 
  </div>
  <div className="modal-body">
    <label htmlFor="appointment-time" className="modal-label">Appointment Time:</label>
    <input 
      type="datetime-local" 
      id="appointment-time"
      value={scheduledTime} 
      onChange={e => setScheduledTime(e.target.value)} 
      className="modal-input"
    />
    <Button variant='contained'
      onClick={handleScheduleAppointment}
      className="modal-confirm-button"
    >
      Confirm Appointment
    </Button>
  </div>
</Modal>

           
            <Tooltip title="Go back">
            <IconButton 
                onClick={handleBackClick} 
                className="back-button"
                style={{ position: 'relative', left: 0, transform: 'scale(1.8)'}} 
            >
                <ArrowLeftIcon />
            </IconButton>
        </Tooltip>
         
        <button onClick={() => setModalOpen(true)} className="schedule-button" >
        <img src={scheduleIcon} alt="Schedule Appointment" className="schedule-icon" />
        
  <span>Book Appointment</span>
  
</button>

            <div className="therapist-profile-header-details-page">
          
                <img src={therapist.profilePicture} alt={`Profile of ${therapist.name}`} className="profile-picture-details-page" />
                
                <div className="therapist-info-details-page">
                    
                    <div className="therapist-name-details-page">
                        <h1>{therapist.name}</h1>
                        {therapist.is_verified && (
                            <Tooltip title="Verified" className="verified-badge-details-page">
                                <VerifiedIcon color="primary" />
                            </Tooltip>
                        )}
                    </div>
                    
                    <div className="therapist-description-details-page">
            <p>{therapist.description}</p>
        </div>
                </div>
            </div>
            <div className="details-flex-container-details-page">
            <div className="detail-section-details-page">
                <h2 style={{ textAlign: 'center'}}>Contact Information</h2>
                <div style={{ textAlign: 'left', marginLeft:'85px'}}>
                <p>Email: {therapist.email}</p>
                <p>Country: {therapist.country || 'Not provided'}</p>
                <p>City: {therapist.city || 'Not provided'}</p>
                </div>
            </div>

            <div className="detail-section-details-page">
                <h2 style={{ textAlign: 'center'}}>Professional Information</h2>
                <div style={{ textAlign: 'left', marginLeft:'50px'}}>
                <p>Specializes in: {therapist.domain_of_interest}</p>
                <p>Years of Experience: {therapist.years_of_experience}</p>
                <p>Gender: {therapist.gender || 'Not specified'}</p>
                </div>
            </div>
           
            
        </div>
        <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <SnackbarContent
                    style={{ backgroundColor: '#108575' }}
                    message={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <CheckCircleOutlineIcon style={{ marginRight: '8px' }} />
                            Your appointment has been scheduled successfully!
                        </span>
                    }
                />
            </Snackbar>
            <Snackbar
                open={openErrorSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseErrorSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <SnackbarContent
                    style={{ backgroundColor: '#525765' }}
                    message={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <ErrorIcon style={{ marginRight: '8px' }} />
                           You cannot schedule an appointment in the past! Try again
                        </span>
                    }
                />
            </Snackbar>
        </div>
      
        
    );
};

export default TherapistProfileDetailsPage;
