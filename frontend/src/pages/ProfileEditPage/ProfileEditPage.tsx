import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button, TextField, Typography, Box, Avatar, SelectChangeEvent } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import './profileedit.css';
import { useNavigate } from 'react-router';

interface ProfileData {
    name: string;
    country: string;
    city: string;
    gender: string;
    description: string;
    profilePicture: string;
    date_of_birth: string;
}

const ProfileEditPage: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileData>({
        name: '',
        country: '',
        city: '',
        gender: '',
        description: '',
        profilePicture: '',
        date_of_birth: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
                    country: data.country,
                    city: data.city,
                    gender: data.gender,
                    description: data.description,
                    profilePicture: `http://localhost:8000${data.profile_picture}` || 'http://localhost:8000/media/profile_pictures/blank.jpg',
                    date_of_birth: data.date_of_birth ? data.date_of_birth : '',
                }));
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
    ) => {
        const name = e.target.name;
        let value: string;

        // Check if the event is from Material-UI Select
        if ((e as SelectChangeEvent).target) {
            value = (e as SelectChangeEvent<string>).target.value;
        } else {
            value = (e as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>).target.value;
        }

        setProfileData({ ...profileData, [name]: value });
    };
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setProfileData({
                ...profileData,
                profilePicture: URL.createObjectURL(e.target.files[0]),
            });
           
        }
    };
    const navigate = useNavigate();
    const redirectToViewProfile = () => {
        navigate('/view-profile');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
    
        const formData = new FormData();
        // Append all profileData fields except for 'profilePicture'
        Object.entries(profileData).forEach(([key, value]) => {
            
                formData.append(key, value);
            
        });
    
        if (selectedFile) {
            formData.append('profile_picture', selectedFile); 
            console.log(selectedFile);
        }
    
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/user/profile/update', {
                method: 'PUT',
                credentials: 'include',
                body: formData
            });
    
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
            console.log(formData.get('profilePicture'));
            alert('Profile updated successfully!');
            redirectToViewProfile(); 
        } catch (error) {
            console.error("Failed to update profile", error);
            alert('Failed to update profile.');
        } finally {
            setIsLoading(false);
        }
    };
    


    if (isLoading) return  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '200px', height: '200px' }}>
        <CircularProgress  size={150} thickness={2} />
    </Box>
</div>;

    return (
        <Box className="profile-edit-page-wrapper">

            <Box className="profile-edit-container-wrapper">
                <Box className="left-section-wrapper">
                    <Box className="profile-picture-container-edit-wrapper">
                        <Avatar
                            src={profileData.profilePicture}
                            alt="Profile"
                            className="profile-picture-edit-avatar"
                            sx={{ width: 150, height: 150 }}
                        />
                        <input
                            type="file"
                            id="profilePictureUpload"
                            name="profilePicture"
                            onChange={handleFileChange}
                            className="profile-picture-edit-input"
                        />
                        <label htmlFor="profilePictureUpload" className="profile-picture-overlay-wrapper">Change photo</label>
                        <Typography variant="h6" className="profile-name-label-wrapper">{profileData.name}</Typography>
                    </Box>

                </Box>
                <Box className="right-section-wrapper">
                    <Typography className="title-container" variant="h4" component="h2" gutterBottom>
                        Edit Profile
                    </Typography>
                    <form onSubmit={handleSubmit} className="profile-form-wrapper">
                        <TextField
                            label="Country"
                            variant="outlined"
                            name="country"
                            value={profileData.country}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="City"
                            variant="outlined"
                            name="city"
                            value={profileData.city}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Date of birth"
                            variant="outlined"
                            type='date'
                            name="date_of_birth"
                            value={profileData.date_of_birth}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            name="description"
                            value={profileData.description}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={2}
                        />

                        <div className="edit-buttons-container">
                            <Button
                                variant="contained"
                                className="profile-update-button-wrapper-cancel"
                                onClick={redirectToViewProfile}
                            >
                                Cancel
                            </Button>
                            <Button variant="contained" type="submit" className="profile-update-button-wrapper">
                                Save
                            </Button>
                        </div>
                    </form>

                </Box>

            </Box>

        </Box>
    );
};

export default ProfileEditPage