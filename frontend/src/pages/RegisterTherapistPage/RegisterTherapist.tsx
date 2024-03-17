import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, MenuItem, Grid } from '@mui/material';
import '../RegisterPage/register.css';

interface TherapistData {
  name: string;
  email: string;
  password: string;
  country: string;
  city: string;
  gender: string;
  date_of_birth: string; 
  description: string;
  domain_of_interest: string;
  years_of_experience: string;
  [key: string]: string;
}

interface ErrorMessages {
  [key: string]: string;
}

const RegisterTherapist = () => {
  const navigate = useNavigate();
  const [therapistData, setTherapistData] = useState<TherapistData>({
    name: '',
    email: '',
    password: '',
    country: '',
    city: '',
    gender: '',
    date_of_birth: '', 
    description: '',
    domain_of_interest: '',
    years_of_experience: '',
  });
  const [errors, setErrors] = useState<TherapistData>({
    name: '',
    email: '',
    password: '',
    country: '',
    city: '',
    gender: '',
    date_of_birth: '', 
    description: '',
    domain_of_interest: '',
    years_of_experience: '',
  });

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
    setTherapistData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailValid = validateField('email', therapistData.email);
        const passwordValid = validateField('password', therapistData.password);
        if (!emailValid || !passwordValid) return; 
    try {
        const formData = {
          ...therapistData,
          is_therapist: true 
        };
  
        const response = await fetch('http://localhost:8000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          navigate('/login');
        } else {
          console.error('Registration failed');
        }
      } catch (error) {
        console.error('Error occurred during registration:', error);
      }
  };

  return (
    <div className="register-container">
      <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>Register as a Therapist</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {Object.keys(therapistData).slice(0, 5).map((key) => (
              <TextField
                key={key}
                id={key}
                name={key}
                label={key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                type={key === 'password' ? 'password' : key === 'date_of_birth' ? 'date' : 'text'}
                variant="outlined"
                fullWidth
                required
                value={therapistData[key]}
                onChange={handleChange}
                margin="normal"
                error={!!errors[key]}
                helperText={errors[key]}
                InputLabelProps={key === 'date_of_birth' ? { shrink: true } : {}}
              />
            ))}
          </Grid>
          <Grid item xs={6}>
            {Object.keys(therapistData).slice(5).map((key) => (
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
                value={therapistData[key]}
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

export default RegisterTherapist;
