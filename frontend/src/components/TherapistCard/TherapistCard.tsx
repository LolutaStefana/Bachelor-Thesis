import React from 'react';
import './therapistcard.css';
import { Tooltip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useNavigate } from 'react-router';

interface TherapistCardProps {
    id: number;
    name: string;
    email: string;
    country?: string;
    city?: string;
    gender?: string;
    description: string;
    profilePicture: string;
    domainOfInterest: string;
    yearsOfExperience: number;
    isVerified?: boolean;
}

const TherapistCard: React.FC<TherapistCardProps> = ({
    id,
    name,
    email,
    country,
    city,
    gender,
    description,
    profilePicture,
    domainOfInterest,
    yearsOfExperience,
    isVerified,
}) => {
    const navigate=useNavigate();
    const handleClick = () => {
        navigate(`/therapists/${id}`);
    };
   
    
    return (
        <div className="therapist-card" onClick={handleClick} key={id}>
                <img src={profilePicture} alt={`Profile of ${name}`} className="profile-picture" />
                <div className="therapist-info">
                   
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 className="therapist-name" style={{ marginRight: '10px' }}>{name}</h2>
                    {isVerified && <Tooltip title="Verified">
            <VerifiedIcon color="primary" className="verified-icon" />
        </Tooltip>}
                </div>
                        <p className="therapist-interest"><span>Specializes in:</span> {domainOfInterest}</p>
                        <p className="therapist-experience"><span>{yearsOfExperience}</span> years of experience</p>
                        <div className="therapist-contact">
                                <p>Email: {email}</p>
                                <p>Country: {country || 'Not provided'}</p>
                                <p>City: {city || 'Not provided'}</p>
                        </div>
                      
                        
                </div>
        </div>
    );
};

export default TherapistCard;
