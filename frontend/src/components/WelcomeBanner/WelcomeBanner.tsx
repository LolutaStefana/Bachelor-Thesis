import React from 'react';
import { Typography, Box, useTheme } from '@mui/material';

interface WelcomeBannerProps {
    name: string;
    description?: string; // Optional description prop
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ name, description }) => {
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
            {description && (
                <Typography variant="subtitle1" style={{color:'rgb(31,59,79)'}}>
                    {description}
                </Typography>
            )}
        </Box>
    );
};

export default WelcomeBanner;
