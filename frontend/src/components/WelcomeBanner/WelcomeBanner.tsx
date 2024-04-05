import React from 'react';
import { Typography, Box, useTheme } from '@mui/material';

const WelcomeBanner = ({ name }: { name: string }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                bgcolor: 'rgb(166,182,242,0.2)',
                color: theme.palette.primary.contrastText,
               
                p: theme.spacing(3),
                mb: theme.spacing(3),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            
            }}
        >
            <Typography variant="h3" component="h1" gutterBottom style={{color:'rgb(31,59,79)'}}>
                Welcome, {name}!
            </Typography>
            <Typography variant="subtitle1" style={{color:'rgb(31,59,79)'}}>
                Discover your path to happiness.
            </Typography>
        </Box>
    );
};

export default WelcomeBanner;
