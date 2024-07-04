import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, LinearProgress, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Snackbar, SnackbarContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TwoFAInput from '../../components/TwoFAComponent/TwoFAInput';
import '../RegisterPage/register.css';

interface TherrapistData {
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
}


const RegisterTherapist = () => {
    const [stepIndex, setStepIndex] = useState(0);
    const [is2FASent, setIs2FASent] = useState(false);
    const [twoFACode, setTwoFACode] = useState('');
    const [is2FAVerified, setIs2FAVerified] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [userData, setUserData] = useState<TherapistFormData>({
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
        confirm_password: '',
    });
    const [errors, setErrors] = useState<Partial<TherapistFormData>>({});

    const navigate = useNavigate();

    const fieldsOrder = [
        'name', 'country', 'city', 'gender', 'date_of_birth', 'description', 'domain_of_interest', 'years_of_experience', 'credentials', 'twoFA'
    ];

    const validateField = (name: string, value: string) => {
        let errorMsg = '';
        if (name === 'email') {
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            if (!emailValid) errorMsg = 'Invalid email format.';
        } else if (name === 'password') {
            const passwordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(value);
            if (!passwordValid) errorMsg = 'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.';
        } else if (name === 'confirm_password') {
            if (value !== userData.password) errorMsg = 'Passwords do not match.';
        }
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
        return errorMsg === '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleBack = () => {
        if (stepIndex > 0) setStepIndex(stepIndex - 1);
    };

    interface TherapistFormData extends TherrapistData {
        confirm_password: string;
        [key: string]: string;
    }

    const handleNext = () => {
        const currentFieldName = fieldsOrder[stepIndex];
        const isCurrentFieldValid = validateField(currentFieldName, userData[currentFieldName as keyof TherapistFormData]);

        if (stepIndex < fieldsOrder.length - 1 && isCurrentFieldValid) {
            setStepIndex(stepIndex + 1);
        }
    };
    const openSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const closeSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let allFieldsValid = true;
        fieldsOrder.forEach(field => {
            if (!validateField(field, userData[field as keyof TherapistFormData])) {
                allFieldsValid = false;
            }
        });

        if (!allFieldsValid) {
            console.error('Some fields are invalid.');
            return;
        }
        if (is2FASent && !is2FAVerified) {
            const verificationResponse = await fetch('http://localhost:8000/api/send-2fa-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userData.email, twoFACode }),
            });

            if (verificationResponse.ok) {
                setIs2FAVerified(true);
                const { confirm_password, ...dataToSubmit } = userData;
                const formData = {
                    ...dataToSubmit,
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

            } else {
                console.error('2FA verification failed');
                openSnackbar('Incorrect 2FA code. Please try again.');
            }
        } else if (!is2FASent) {
            const send2FAResponse = await fetch('http://localhost:8000/api/send-2fa-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userData.email }),
            });

            if (send2FAResponse.ok) {
                setIs2FASent(true);
                handleNext();
            } else {
                console.error('Failed to send 2FA code');
            }
        }
    };
    const progress = (stepIndex / fieldsOrder.length) * 100;

    const renderCurrentField = () => {

        const currentField = fieldsOrder[stepIndex];
        let question = '';
        let example = '';

        switch (currentField) {
            case 'name':
                question = 'Tell us your full name';
                example = 'e.g. Ana Smith';
                break;
            case 'country':
                question = 'Where are you from?';
                example = 'e.g. United States';
                break;
            case 'city':
                question = 'Which city are you in?';
                example = 'e.g. New York';
                break;
            case 'gender':
                question = 'What is your gender?';
                example = 'e.g. Male, Female, Non-binary';
                break;
            case 'date_of_birth':
                question = 'When is your birthday?';
                example = 'e.g. 1990-01-01';
                break;
            case 'description':
                question = 'Tell us a little about yourself';
                example = 'e.g. I enjoy hiking and reading books.';
                break;
            case 'domain_of_interest':
                question = 'What is your domain of interest?';
                example = 'e.g. Anxiety, Depression, Relationships, etc.';
                break;
            case 'years_of_experience':
                question = 'How many years of experience do you have?';
                example = 'e.g. 5, 10, 15, etc';
                break;
            case 'credentials':
                return (
                    <>
                        <Typography variant="h6" className='set-accoutn-text' gutterBottom>You've completed the questionnaire! Now let's set up your account.</Typography>
                        <TextField
                            id="email"
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            value={userData.email}
                            onChange={handleChange}
                            name="email"
                            error={!!errors.email}
                            helperText={errors.email}
                            margin="normal"
                        />
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            value={userData.password}
                            onChange={handleChange}
                            name="password"
                            error={!!errors.password}
                            helperText={errors.password}
                            margin="normal"
                        />
                        <TextField
                            id="confirm_password"
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            required
                            value={userData.confirm_password}
                            onChange={handleChange}
                            name="confirm_password"
                            error={!!errors.confirm_password}
                            helperText={errors.confirm_password}
                            margin="normal"
                        />
                    </>
                );
            default:
                break;
            case 'twoFA':
                return (
                    <>
                        <Typography variant="h6" className='set-accoutn-text' gutterBottom>Enter the code sent to your email</Typography>
                        <TwoFAInput value={twoFACode} onChange={setTwoFACode} />
                    </>
                );
        }
        return (
            <>
                <Typography variant="h6" className='question' gutterBottom>{question}</Typography>
                <TextField
                    id={currentField}

                    type={currentField === 'date_of_birth' ? 'date' : 'text'}
                    fullWidth
                    required
                    value={userData[currentField as keyof TherapistFormData]}
                    onChange={handleChange}
                    name={currentField}
                    error={!!errors[currentField as keyof TherapistFormData]}
                    helperText={errors[currentField as keyof TherapistFormData]}
                    margin="normal"
                    placeholder={example}
                />
            </>
        );
    };

    return (

        <div style={{ maxWidth: '700px', margin: '0 auto', marginTop: '60px' }}>
            <LinearProgress variant="determinate" value={progress} style={{ margin: '20px 0' }} />
            <Typography variant="h4" gutterBottom className='centered-text'>Help us set up your account as a therapist</Typography>
            <Typography variant="body1" gutterBottom className="centered-text">
                Begin your journey as a therapist by setting up your account. We're excited to have you join our community! To create the best experience for you and your clients, we need to gather some information. Please fill in the following details.
            </Typography>

            <div className="register-container">
                <form onSubmit={handleSubmit}>
                    {renderCurrentField()}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
                        <IconButton
                            onClick={handleBack}
                            aria-label="back"
                            className={stepIndex === 0 ? 'disabled-icon' : ''}
                            disabled={stepIndex === 0}
                        >
                            <ArrowBackIosIcon />
                        </IconButton>
                        <IconButton
                            onClick={handleNext}
                            aria-label="next"
                            disabled={
                                stepIndex >= fieldsOrder.length - 2 ||
                                userData[fieldsOrder[stepIndex] as keyof TherapistFormData] === ''
                            }
                            className={
                                stepIndex >= fieldsOrder.length - 2 ||
                                    userData[fieldsOrder[stepIndex] as keyof TherapistFormData] === ''
                                    ? 'disabled-icon'
                                    : ''
                            }
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </div>
                    {stepIndex >= fieldsOrder.length - 2 ? (
                        <Button variant="contained" className='gradient' type="submit" fullWidth>
                            Register
                        </Button>
                    ) : null}
                </form>
            </div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={closeSnackbar}
            >


                <SnackbarContent
                    message={snackbarMessage}
                    action={
                        <IconButton size="small" aria-label="close" color="inherit" onClick={closeSnackbar}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                />
            </Snackbar>
        </div>
    );
};

export default RegisterTherapist;

