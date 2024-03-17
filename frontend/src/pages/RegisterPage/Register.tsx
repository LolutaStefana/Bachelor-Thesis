import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, MenuItem, Grid } from '@mui/material';
import './register.css'; 
interface UserData {
    name: string;
    email: string;
    password: string;
    country: string;
    city: string;
    gender: string;
    date_of_birth: string;
    description: string;
    [key: string]: string; 
  }

const Register = () => {
    const [userData, setUserData] = useState<UserData>({
        name: '',
        email: '',
        password: '',
        country: '',
        city: '',
        gender: '',
        date_of_birth: '',
        description: '',
    });
    const [errors, setErrors] = useState<UserData>({
        name: '',
        email: '',
        password: '',
        country: '',
        city: '',
        gender: '',
        date_of_birth: '',
        description: '',
    });
    const navigate = useNavigate();

    const validateField = (name: string, value: string) => {
        let errorMsg = '';
        switch (name) {
            case 'email':
                const emailValid = /^[^\s@]+@[^\s@]+\.com/.test(value);
                if (!emailValid) errorMsg = 'Invalid email format.';
                break;
            case 'password':
                const passwordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(value);
                if (!passwordValid) errorMsg = 'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.';
                break;
            default:
                break;
        }
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
        return errorMsg === '';
    };

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const emailValid = validateField('email', userData.email);
        const passwordValid = validateField('password', userData.password);
        if (!emailValid || !passwordValid) return; 

        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            navigate('/login');
        } else {
            console.error('Registration failed');
        }
    };

    return (
        <div className="register-container">
          <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>Register to PeacePlan</Typography>
          <Typography variant="body2" style={{ marginBottom: '1rem' }}>
            Are you a therapist? <Link to="/register-therapist">Register here</Link>
          </Typography>
    
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {Object.keys(userData).slice(0, 4).map((key) => (
                  <TextField
                    key={key}
                    id={key}
                   
                    label={key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                    type={key === 'password' ? 'password' : key === 'date_of_birth' ? 'date' : 'text'}
                    variant="outlined"
                    fullWidth
                    required
                    value={userData[key]}
                    onChange={handleChange}
                    margin="normal"
                    error={!!errors[key]}
                    helperText={errors[key]}
                    InputLabelProps={key === 'date_of_birth' ? { shrink: true } : {}}
                  />
                ))}
              </Grid>
              <Grid item xs={6}>
                {Object.keys(userData).slice(4).map((key) => (
                  <TextField
                    key={key}
                    id={key}
                    name={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                    type={key === 'gender' ? 'text' : key === 'date_of_birth' ? 'date' : 'text'}
                    variant="outlined"
                    fullWidth
                    required
                    InputLabelProps={key === 'date_of_birth' ? { shrink: true } : undefined}
                    value={userData[key]}
                    onChange={handleChange}
                    margin="normal"
                    select={key === 'gender'}
                    
                  >
                    {key === 'gender' && ["Male", "Female", "Other"].map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                ))}
              </Grid>
            </Grid>
            <div className="register-button-container">
              <Button variant="contained" className="gradient" type="submit">
                Register
              </Button>
            </div>
          </form>
        </div>
      );
    };
    
export default Register;

