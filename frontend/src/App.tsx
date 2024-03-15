import React, { useState } from 'react';
import './App.css';
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';
import StartPage from './pages/StartPage/StartPage';
import HomePage from './pages/Homepage/HomePage';

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
                    </Routes>
                </main>
            </BrowserRouter>
        </div>
    );
}

export default App;
