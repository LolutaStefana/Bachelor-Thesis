import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import lotusSvg from '../../lotus.svg';
import './nav.css';
import { useAuth } from '../../context/AuthContext';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LogoutIcon from '@mui/icons-material/Logout';

const Nav = () => {
    const { name, setName, loading, photoUrl } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null); // Ref for dropdown

    const navigate = useNavigate();

    useEffect(() => {
        // Add event listener when component mounts
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up event listener when component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState);
    };


    const logout = async () => {
        await fetch('http://localhost:8000/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        setName('');
        setDropdownOpen(false);
        navigate('/login');
    };

    let menu;
    if (!loading) {
        if (name === '') {
            menu = (
                <ul className="navbar-nav me-auto mb-2 mb-md-0">
                    <li className="nav-item active">
                        <Link to="/register-therapist" className="nav-link">Join as a Therapist</Link>
                    </li>
                    <li className="nav-item active">
                        <Link to="/register" className="nav-link">Register</Link>
                    </li>
                    <li className="nav-item active">
                        <Link to="/login" className="nav-link">Login</Link>
                    </li>
                </ul>
            );
        } else {
            menu = (
                <ul className="navbar-nav me-auto mb-2 mb-md-0">
                    <li className="nav-item active">
                        <Link to="/list-therapists" className="nav-link">See therapists</Link>
                    </li>
                    <li className="nav-item dropdown active">
                        <button
                            className="nav-link dropdown-toggle"
                            onClick={toggleDropdown}
                            style={{ background: 'transparent', border: 'none', outline: 'none' }}
                        >
                            {photoUrl && <img src={photoUrl} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />}
                        </button>
                        <ul ref={dropdownRef} className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} style={{ top: '110%', left: '-120%', minWidth: '8rem', backgroundColor: 'rgb(85,89,101,0.9)', padding: '0.5rem' }}>
                            <li>
                                <Link to="/view-profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>

                                    <IconButton size="small">
                                        <VisibilityIcon />
                                    </IconButton>

                                    ViewProfile
                                </Link>
                            </li>
                            <li className="dropdown-item" onClick={logout}>
                                <IconButton size="small">
                                    <LogoutIcon />
                                </IconButton>
                                Logout
                            </li>
                        </ul>
                    </li>
                </ul>
            );
        }
    } else {
        menu = null;
    }

    return (
        <nav className="navbar navbar-custom navbar-expand-md navbar-dark bg-dark mb-4" style={{ position: 'fixed', top: '0', width: '100%', zIndex: '1000' }}>
            <div className="container-fluid">
                {name === '' ? (
                    <Link to="/" className="navbar-brand">
                        <img src={lotusSvg} alt="Lotus" style={{ width: '50px', height: '50px' }} />
                        <span style={{ fontFamily: 'Brush Script MT, Brush Script Std, cursive', fontSize: '20px', color: 'gradient', marginLeft: '10px' }}>PeacePlan</span>
                    </Link>
                ) : (
                    <Link to="/homepage" className="navbar-brand">
                        <img src={lotusSvg} alt="Lotus" style={{ width: '50px', height: '50px' }} />
                        <span style={{ fontFamily: 'Brush Script MT, Brush Script Std, cursive', fontSize: '20px', color: 'gradient', marginLeft: '10px' }}>PeacePlan</span>
                    </Link>
                )}

                <div>
                    {menu}
                </div>
            </div>
        </nav>
    );
};

export default Nav;
