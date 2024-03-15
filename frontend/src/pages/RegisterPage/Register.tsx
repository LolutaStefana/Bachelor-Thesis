import React, { SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';
import './register.css'; // Import the CSS file

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        return passwordRegex.test(password);
    };

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setErrorMessage('Invalid email format');
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage('Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character');
            return;
        }

        setErrorMessage('');

        await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        navigate('/login');
    }

    return (
        <div className="register-container"> {/* Add the container class */}
            <form onSubmit={submit}>
                <Typography variant="h5" gutterBottom>Please register</Typography>

                {errorMessage && <Typography color="error">{errorMessage}</Typography>}

                <TextField
                    type="text"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <TextField
                    type="email"
                    label="Email address"
                    variant="outlined"
                    fullWidth
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <TextField
                    type="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <Button variant="contained" className='gradient' type="submit" fullWidth>Submit</Button>
            </form>
        </div>
    );
};

export default Register;
