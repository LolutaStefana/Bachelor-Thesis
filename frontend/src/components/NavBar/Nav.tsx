import React from 'react';
import { Link } from "react-router-dom";
import lotusSvg from '../../lotus.svg';
import './nav.css';
const Nav = (props: { name: string, setName: (name: string) => void }) => {
    const logout = async () => {
        await fetch('http://localhost:8000/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        props.setName('');
    }

    let menu;

    if (props.name === '') {
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
        )
    } else {
        menu = (
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="nav-item active">
                    <Link to="/login" className="nav-link" onClick={logout}>Logout</Link>
                </li>
            </ul>
        )
    }

    return (
        <nav className="navbar navbar-custom navbar-expand-md navbar-dark bg-dark mb-4" style={{  position: 'fixed', top: '0', width: '100%', zIndex: '1000' }}>
            <div className="container-fluid">
                {props.name === '' ? (
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