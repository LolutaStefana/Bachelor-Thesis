import React from 'react';
import { Card, CardActionArea, CardContent, Typography, CardMedia, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import TherapistImage from '../../therapists-card.jpg';

const FindTherapistCard = () => {
    return (
        <Card sx={{ Width: 345, backgroundColor: 'rgb(239,233,244)', "&:hover": { backgroundColor: 'rgba(255, 255, 255, 0.9)', } }}>
            <CardActionArea component={Link} to="/list-therapists">
                <CardMedia
                    component="img"
                    height="140"
                    image={TherapistImage} // Replace with your image path
                    alt="Find a Therapist"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Find a Therapist
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Connect with certified professionals and take a step towards better mental health.
                    </Typography>
                </CardContent>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    color: 'transparent',
                    transition: 'background-color 0.3s, color 0.3s',
                    "&:hover": {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        color: 'primary.main',
                    },
                }}>
                   
                </Box>
            </CardActionArea>
        </Card>
    );
};

export default FindTherapistCard;