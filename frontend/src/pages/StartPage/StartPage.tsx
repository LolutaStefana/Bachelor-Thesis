import React from 'react';
import { useNavigate } from 'react-router-dom';
import './startpage.css'; 

const StartPage = () => {
    const navigate = useNavigate();
  
    return (
      <div className="start-page">
        <div className="content">
          <h1>Welcome to PeacePlan</h1>
          <p>Your journey to self-improvement starts here.</p>
          <button onClick={() => navigate('/login')} className="start-button">
            Get Started
          </button>
        </div>
        {/* Adding the transition div */}
        <div className="footer-transition"></div>
      </div>
    );
  };
  
  export default StartPage;
