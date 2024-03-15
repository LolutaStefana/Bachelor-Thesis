import React, { SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Snackbar, SnackbarContent } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import * as psihoSvg from '../../psiho.svg';
import './login.css';

const Login = (props: { setName: (name: string) => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                email,
                password
            })
        });

        const content = await response.json();

        console.log('Login response:', response);
        console.log('Login content:', content);

        if (response.ok) {
            props.setName(content.name);
            navigate('/homepage');
        } else {
            setOpenSnackbar(true);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div className="login-container">
           
           
            <div className="photo-container">
                <psihoSvg.ReactComponent />
            </div>
            
            <div className="form-container">
            <div className="title-container">  <h1 className="h3 mb-3 fw-normal">Login to PeacePlan</h1></div>
                <form onSubmit={submit}>
                  
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
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        variant="outlined"
                        fullWidth
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <div> 
                                    <IconButton onClick={togglePasswordVisibility} size="small"> 
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </div>
                            ),
                        }}
                    />
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <a href="/register" style={{ color: '#515665' }}>Don't have an account? Register here</a>
                    </div>
                    <Button variant="contained" className='gradient' type="submit" fullWidth>
                        Login
                    </Button>
                    
                </form>
            </div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <SnackbarContent
                    style={{ backgroundColor: '#525765' }}
                    message={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <ErrorIcon style={{ marginRight: '8px' }} />
                            Invalid email or password
                        </span>
                    }
                />
            </Snackbar>
        </div>
    );
};

export default Login;
