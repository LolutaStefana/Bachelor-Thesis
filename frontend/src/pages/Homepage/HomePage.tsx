import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Typography, Grid, Box, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import WelcomeBanner from '../../components/WelcomeBanner/WelcomeBanner';
import FindTherapistCard from '../../components/FindTherapistCard/FindTherapistCard';
import ChatBotCard from '../../components/ChatBotCard/ChatBotCard';
import TestMatchTherapistCard from '../../components/TestMatchTherapistCard/TestMatchTherapistCard';

const HomePage = () => {
    const { name, loading } = useAuth();


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    let content;

    if (name === '') {
        // The user is not logged in
        content = (
            <Container maxWidth="sm" style={{ textAlign: 'center', padding: '2rem' }}>
                <Typography variant="h4" gutterBottom>
                    You are not logged in
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Please <Link to="/login" style={{ textDecoration: 'none' }}>login</Link> to access your homepage.
                </Typography>
            </Container>
        );
    } else {
        // The user is logged in
        content = (
            <Container maxWidth="lg">
                <WelcomeBanner name={name} />
                <Grid container spacing={5} style={{ marginTop: '20px' }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <FindTherapistCard />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <ChatBotCard />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TestMatchTherapistCard />
                    </Grid>
                </Grid>
            </Container>
        );
    }

    return (
        <Box className='home-container' sx={{ flexGrow: 1 }}>
            {content}
        </Box>
    );
};

export default HomePage;
