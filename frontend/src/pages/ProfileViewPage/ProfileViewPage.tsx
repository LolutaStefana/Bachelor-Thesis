import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Avatar, Tooltip, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import '../ProfileEditPage/profileedit.css';

interface ProfileData {
    name: string;
    email:string;
    country: string;
    city: string;
    gender: string;
    description: string;
    profilePicture: string;
    date_of_birth: string;
}

const ProfileViewPage: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileData>({
        name: '',
        email:'',
        country: '',
        city: '',
        gender: '',
        description: '',
        profilePicture: '',
        date_of_birth: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    

    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8000/api/user', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setProfileData(prevState => ({
                    ...prevState,
                    name: data.name,
                    email: data.email,
                    country: data.country,
                    city: data.city,
                    gender: data.gender,
                    description: data.description,
                    profilePicture: `http://localhost:8000${data.profile_picture}` || 'default_profile_picture.png',
                    date_of_birth: data.date_of_birth,
                }));
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const navigate = useNavigate(); 
    const redirectToEditProfile = () => {
        navigate('/edit-profile'); 
    };

    
    if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '200px', height: '200px' }}>
        <CircularProgress size={150} thickness={2} />
    </Box>
</div>;

    return (
        <Box className="profile-edit-page-wrapper">
        <Box className="profile-edit-container-wrapper">
        <Box className="profile-card" sx={{  bgcolor: 'rgb(197,205,243,0)', p: 4, borderRadius: 2,width: 800 }}>
        <Box textAlign="right">
    <Tooltip title="Edit profile"> 
        <Button onClick={redirectToEditProfile} sx={{ mt: 1 }}>
            <EditIcon color="action" />
        
        </Button>
    </Tooltip>
</Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 4, borderBottom: '1px solid rgb(161,179,242)' }}>
                            
                            <Avatar src={profileData.profilePicture} alt="Profile" sx={{ width: 150, height: 150, mb: 2 }}  />
                            
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{profileData.name}</Typography>
                           
                        </Box>
                        <Box sx={{ pt: 4 }}>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}><strong>Email:</strong> {profileData.email}</Typography>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}><strong>Country:</strong> {profileData.country}</Typography>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}><strong>City:</strong> {profileData.city}</Typography>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}><strong>Gender:</strong> {profileData.gender}</Typography>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}><strong>Date of Birth:</strong> {profileData.date_of_birth}</Typography>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}><strong>Description:</strong> {profileData.description}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
    );
};

export default ProfileViewPage