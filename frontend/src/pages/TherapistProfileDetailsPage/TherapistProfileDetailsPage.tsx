import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './therapistprofilepage.css';
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
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
    const [therapist, setTherapist] = useState<Therapist | null>(null);
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

    return (
        <div className="therapist-profile-details-page">
            <Tooltip title="Go back">
            <IconButton 
                onClick={handleBackClick} 
                className="back-button"
                style={{ position: 'relative', left: 0, transform: 'scale(1.8)'}} 
            >
                <ArrowLeftIcon />
            </IconButton>
        </Tooltip>
            
          
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
        </div>
    );
};

export default TherapistProfileDetailsPage;
