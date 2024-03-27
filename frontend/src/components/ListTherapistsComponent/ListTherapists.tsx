import React, { useEffect, useState } from 'react';
import './listtherapists.css';

interface Therapist {
  id: number;
  name: string;
  email: string;
  country?: string;
  city?: string;
  gender?: string;
  description?: string;
}

const ListTherapists: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users/therapists', {
          method: 'GET',
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setTherapists(data);
      } catch (error) {
        console.error('There was an error fetching the therapists:', error);
      }
    };

    fetchTherapists();
  }, []);

  return (
    <div className="therapist-list">
      {therapists.map((therapist) => (
        <div key={therapist.id} className="therapist-card">
          <h2>{therapist.name}</h2>
          <p>Email: {therapist.email}</p>
          <p>Country: {therapist.country || 'Not provided'}</p>
          <p>City: {therapist.city || 'Not provided'}</p>
          <p>Gender: {therapist.gender || 'Not provided'}</p>
          <p>Description: {therapist.description || 'No description'}</p>
        </div>
      ))}
    </div>
  );
};

export default ListTherapists;
