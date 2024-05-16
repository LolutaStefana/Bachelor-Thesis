import React from 'react';
import { Card, CardActionArea, CardContent, Typography, CardMedia, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import AppointmentsImage from '../../assets/appointments.jpg'; 

const AppointmentsCard = () => {
    return (
        <Card sx={{ 
            width: 400, 
            height: 279, 
            backgroundColor: 'rgb(239,233,244)', 
            transition: 'transform 0.3s ease', 
            "&:hover": { 
                transform: 'scale(1.1)', 
                borderColor: '#ddd', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' 
            } 
        }}>
            <CardActionArea component={Link} to="/view-appointments">
                <CardMedia
                    component="img"
                    height="160"
                    image={AppointmentsImage} 
                    loading="lazy"
                    alt="View Appointments"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        View Appointments
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Check your upcoming appointments with clients.
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
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'primary.main',
                    },
                }}>
                </Box>
            </CardActionArea>
        </Card>
    );
};

export default AppointmentsCard;
