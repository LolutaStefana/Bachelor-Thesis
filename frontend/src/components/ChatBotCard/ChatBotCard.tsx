
import React from 'react';
import { Card, CardActionArea, CardContent, Typography, CardMedia, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import ChatIcon from '../../assets/chatbot.png';

const ChatBotCard = () => {
    return (
        <Card  sx={{ Width: 345, backgroundColor: 'rgb(239,233,244)',border: '1px solid rgb(85,89,101,0.1) transparent',
        transition:' transform 0.3s ease' , "&:hover": { transform: 'scale(1.1)',
        borderColor: '#ddd',boxShadow:' 0 4px 8px rgba(0, 0, 0, 0.1)'  } }}>
            <CardActionArea component={Link} to="/chat">
            <CardMedia
                    component="img"
                    height="140"
                    image={ChatIcon }
                    loading="lazy"
                    alt="Find a Therapist"
                />
                <CardContent >
                    <Typography gutterBottom variant="h5" component="div">
                        Talk to PeaceBot
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Our friendly bot is ready to help you 24/7 with your questions and guide you through our services.
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

export default ChatBotCard;
