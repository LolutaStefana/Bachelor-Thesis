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

function App() {
    const [name, setName] = useState('');

    return (
        <div className="App">
            <BrowserRouter>
                <Nav name={name} setName={setName} />
                <main>
                    <Routes>
                        <Route path="/" element={<StartPage />} />
                        <Route path="/homepage" element={<HomePage/>} />
                        <Route path="/login" element={<Login setName={setName} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/register-therapist" element={<RegisterTherapist />} />
                        <Route path="/gethelp" element={<GetHelpPage />} />
                        
                    </Routes>
                </main>
           
            </BrowserRouter>
            <Footer /> 
        </div>
    );
}

export default App;
