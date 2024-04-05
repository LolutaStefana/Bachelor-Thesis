import React from 'react';
import { Card, CardActionArea, CardContent, Typography, CardMedia, Box } from '@mui/material';
import TestIcon from '../../test.jpg';

const TestMatchTherapistCard = () => {
    return (
        <Card sx={{ Width: 345, backgroundColor: 'rgb(239,233,244)', "&:hover": { backgroundColor: 'rgba(255, 255, 255, 0.9)', } }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={TestIcon} 
                    alt="Match with a Therapist"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Find Your Match
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Take our test to match with a therapist who fits your needs.
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
                    opacity: 0,
                    transition: 'opacity 0.5s ease-in-out, backgroundColor 0.5s ease-in-out',
                    "&:hover": {
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        opacity: 1,
                    },
                }}>
                   
                </Box>
            </CardActionArea>
        </Card>
    );
};

export default TestMatchTherapistCard;
