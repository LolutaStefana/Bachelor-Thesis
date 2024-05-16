import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import lotusSvg from '../../assets/lotus.svg';
import './nav.css';
import { useAuth } from '../../context/AuthContext'; 
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LogoutIcon from '@mui/icons-material/Logout';

const Nav = () => {
    const { name,isTherapist, loading, photoUrl, setName } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null); 
    const navigate = useNavigate();

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

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
        setDropdownOpen((prevState) => !prevState);
    };

    const logout = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
    
            if (!response.ok) {
                throw new Error('Failed to log out');
            }
    
            setName('');
            setDropdownOpen(false);
            navigate('/login');
    
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    
    let homeLink = "/";
  
    let menu;
    if (!loading) {
        if (isTherapist && name!=='' ) {
            homeLink = "/homepage";
            menu = (
                <ul className="navbar-nav me-auto mb-2 mb-md-0">
                    <li className="nav-item active">
                        <Link to="/chat" className="nav-link">Appointments</Link>
                    </li>
                    <li className="nav-item dropdown active">
                        <button
                            className="nav-link dropdown-toggle"
                            onClick={toggleDropdown}
                            style={{ background: 'transparent', border: 'none', outline: 'none' }}
                        >
                            {photoUrl && (
                                <img
                                    src={photoUrl}
                                    alt="Profile"
                                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                />
                            )}
                        </button>
                        <ul ref={dropdownRef} className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} style={{ top: '110%', left: '-120%', minWidth: '8rem', backgroundColor: 'rgb(85,89,101,0.9)', padding: '0.5rem' }}>
                            <li>
                                <Link to="/view-profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                    <IconButton size="small">
                                        <VisibilityIcon />
                                    </IconButton>
                                    View Profile
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
        } else if (name!=='' ){
            homeLink = "/homepage";
            menu = (
                <ul className="navbar-nav me-auto mb-2 mb-md-0">
                    <li className="nav-item active">
                        <Link to="/chat" className="nav-link">PeaceBot</Link>
                    </li>
                    <li className="nav-item active">
                        <Link to="/list-therapists" className="nav-link">See Therapists</Link>
                    </li>
                    <li className="nav-item active">
                        <Link to="/questionnaire-page" className="nav-link">Take Test</Link>
                    </li>
                    <li className="nav-item dropdown active">
                        <button
                            className="nav-link dropdown-toggle"
                            onClick={toggleDropdown}
                            style={{ background: 'transparent', border: 'none', outline: 'none' }}
                        >
                            {photoUrl && (
                                <img
                                    src={photoUrl}
                                    alt="Profile"
                                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                />
                            )}
                        </button>
                        <ul ref={dropdownRef} className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} style={{ top: '110%', left: '-170%', minWidth: '8rem', backgroundColor: 'rgb(85,89,101,0.9)', padding: '0.5rem' }}>
                            <li>
                                <Link to="/view-profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                    <IconButton size="small">
                                        <VisibilityIcon />
                                    </IconButton>
                                    View Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/user-appointments" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                    <IconButton size="small">
                                        <EventAvailableIcon />
                                    </IconButton>
                                    My Appointments
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
        }else
        {
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
        }
    } else {
        menu = null;
    }

    return (
        <nav className="navbar navbar-custom navbar-expand-md navbar-dark bg-dark mb-4" style={{ position: 'fixed', top: '0', width: '100%', zIndex: '1000' }}>
            <div className="container-fluid">
                <Link to={homeLink} className="navbar-brand">
                    <img src={lotusSvg} alt="Lotus" style={{ width: '50px', height: '50px' }} />
                    <span style={{ fontFamily: 'Brush Script MT, Brush Script Std, cursive', fontSize: '20px', color: 'gradient', marginLeft: '10px' }}>PeacePlan</span>
                </Link>

                <div>
                    {menu}
                </div>
            </div>
        </nav>
    );
};

export default Nav;
