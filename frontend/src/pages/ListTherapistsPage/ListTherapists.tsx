import React, { useEffect, useState } from 'react';
import './listtherapists.css';
import TherapistCard from '../../components/TherapistCard/TherapistCard';
import NotFound from '../../assets/not_found.svg'
interface Therapist {
  id: number;
  name: string;
  email: string;
  country?: string;
  city?: string;
  gender?: string;
  description?: string;
  is_verified?: boolean;
  domain_of_interest?: string;
  years_of_experience?: number;
  profilePicture?: string;
}

const ListTherapists: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterDomain, setFilterDomain] = useState('');
  const [minYearsOfExperience, setMinYearsOfExperience] = useState(0);
  const [activeFilter, setActiveFilter] = useState('');

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
        let data = await response.json();
            const modifiedData = data.map((therapist: { profile_picture: any; }) => ({
                ...therapist,
                profilePicture: therapist.profile_picture ? `${therapist.profile_picture}` : `http://localhost:8000/media/profile_pictures/blank.jpg`,
            }));

            setTherapists(modifiedData);

       
      } catch (error) {
        console.error('There was an error fetching the therapists:', error);
      }
    };

    fetchTherapists();
  }, []);
 

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCity(e.target.value);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCountry(e.target.value);
  };
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDomain(e.target.value);
  };

  const handleYearsOfExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinYearsOfExperience(Number(e.target.value));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveFilter(e.target.value);
    setShowVerifiedOnly(e.target.value === 'verified');
  };

  const filteredTherapists = therapists.filter(therapist => {
    return (
      (!showVerifiedOnly || therapist.is_verified) &&
      therapist.name.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
      (filterCity === '' || therapist.city?.toLowerCase().startsWith(filterCity.toLowerCase())) &&
      (filterCountry === '' || therapist.country?.toLowerCase().startsWith(filterCountry.toLowerCase())) &&
      (filterDomain === '' || therapist.domain_of_interest?.toLowerCase().startsWith(filterDomain.toLowerCase())) &&
      (therapist.years_of_experience !== undefined && therapist.years_of_experience >= minYearsOfExperience)
    );
  });


  return (
    <div>
    <div className="filter-options">
    
        <select onChange={handleFilterChange} className="filter-select">
          <option value="">Select filter...</option>
          <option value="verified">Only verified</option>
          <option value="name">Name</option>
          <option value="city">City</option>
          <option value="country">Country</option>
          <option value="domain">Domain of interest</option>
          <option value="experience">Years of Experience</option>
        </select>
        
       

        {activeFilter === 'name' && (
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        )}
        
        {activeFilter === 'city' && (
          <input
            type="text"
            placeholder="Search by city..."
            value={filterCity}
            onChange={handleCityChange}
            className="search-input"
          />
        )}

        {activeFilter === 'country' && (
          <input
            type="text"
            placeholder="Search by country..."
            value={filterCountry}
            onChange={handleCountryChange}
            className="search-input"
          />
        )}
        {activeFilter === 'domain' && (
          <input
            style={{width: '300px'}}
            type="text"
            placeholder="Search by domain of interest..."
            value={filterDomain}
            onChange={handleDomainChange}
            className="search-input"
          />
        )}

        {activeFilter === 'experience' && (
          <div className="years-of-experience-slider">
            <label htmlFor="years-experience">Years of Experience: {minYearsOfExperience}+</label>
            <input
              type="range"
              id="years-experience"
              min="0"
              max="30" 
              value={minYearsOfExperience}
              onChange={handleYearsOfExperienceChange}
              className="slider-input"
            />
          </div>
        )}
      </div>
      
    <div className="therapist-list">
    {filteredTherapists.length > 0 ? (
        filteredTherapists.map(therapist => (
          <TherapistCard
        key={therapist.id}
        id={therapist.id}
        name={therapist.name}
        email={therapist.email}
        country={therapist.country || ''}
        city={therapist.city|| ''}
        gender={therapist.gender|| ''}
        description={therapist.description|| ''}
        profilePicture={therapist.profilePicture|| ''}
        domainOfInterest={therapist.domain_of_interest|| ''}
        yearsOfExperience={therapist.years_of_experience|| 0}
        isVerified={therapist.is_verified|| false}
      />
    ))
    ) : (
      <div className="no-therapists">
        <img src={NotFound} alt="No therapists found" className="not-found-image" />
        No therapists match your criteria.
        
      </div>
    )}
  </div>
</div>
);
    }
export default ListTherapists;
