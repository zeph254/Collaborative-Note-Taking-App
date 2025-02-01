import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';




const HomePage = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <div className={`home-container ${isAnimated ? 'animate' : ''}`}> 
      <div className="background-animation"> 
        {/* Use a CSS animation for the background */}
      </div>
      <div className="content-container">
        <h1>Welcome to CONTA</h1>
        <p>Your Collaborative Note-Taking Solution</p>
        <p>Effortlessly create, share, and edit notes with your team.</p>
        <Link to="/signup" className="get-started-button">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default HomePage;