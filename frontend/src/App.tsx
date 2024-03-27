import React, { useState } from 'react';
import './App.css';
import Nav from './components/NavBar/Nav';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';
import StartPage from './pages/StartPage/StartPage';
import HomePage from './pages/Homepage/HomePage';
import RegisterTherapist from './pages/RegisterTherapistPage/RegisterTherapist';
import Footer from './components/Footer/Footer';
import GetHelpPage from './pages/GetHelpPage/GetHelpPage';
import ListTherapists from './components/ListTherapistsComponent/ListTherapists';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
            <AuthProvider>
                <Nav />
                <main>
                    <Routes>
                        <Route path="/" element={<StartPage />} />
                        <Route path="/homepage" element={<HomePage/>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/register-therapist" element={<RegisterTherapist />} />
                        <Route path="/gethelp" element={<GetHelpPage />} />
                        <Route path="/list-therapists" element={<ListTherapists />} />
                        
                    </Routes>
                </main>
                <Footer /> 
                </AuthProvider>
            </BrowserRouter>
            
        </div>
    );
}

export default App;
