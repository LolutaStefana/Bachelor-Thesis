import React from 'react';
import { useLocation } from 'react-router-dom';
import TherapistCard from '../../components/TherapistCard/TherapistCard'; // Ensure this component is correctly imported
import NotFoundImage from '../../not_found.svg'; // Update path as needed
import { Typography} from '@mui/material';

const ResultsPage = () => {
  const location = useLocation();
  const therapists = location.state?.therapists || [];

  return (
    <div className='results-page-container'>
      <Typography variant="h4" align="center" gutterBottom style={{ marginTop: '20px',marginBottom: '20px',fontWeight: 'bold',color:'rgb(85,89,101)' }}>
        Here Are Your Results
      </Typography>
      <Typography variant="subtitle1" align="center" style={{ marginBottom: '40px',color:'rgb(85,89,101)' }}>
        Browse through the list of therapists below. Click on any therapist to view more details and to schedule an appointment.
      </Typography>
      <div className="therapist-list">
      {therapists.length > 0 ? (
        therapists.map((therapist: { id: React.Key | null | undefined; name: string; email: string; country: string | undefined; city: string | undefined; gender: string | undefined; description: string; profilePicture: string; domain_of_interest: string; years_of_experience: number; is_verified: boolean | undefined; }) => (
          <TherapistCard
            key={therapist.id}
            id={therapist.id as number}
            name={therapist.name}
            email={therapist.email}
            country={therapist.country}
            city={therapist.city}
            gender={therapist.gender}
            description={therapist.description}
            profilePicture={therapist.profilePicture ? therapist.profilePicture : `http://localhost:8000/media/profile_pictures/blank.jpg`}
            domainOfInterest={therapist.domain_of_interest} 
            yearsOfExperience={therapist.years_of_experience}
            isVerified={therapist.is_verified}
          />
        ))
      ) : (
        <div style={{ textAlign: 'center' }}>
          <img src={NotFoundImage} alt="No therapists found" style={{ width: '50%', marginTop: '20px' }} />
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            No therapists match your criteria.
          </Typography>
        </div>
      )}
         </div>
  
    </div>
  );
};

export default ResultsPage;
