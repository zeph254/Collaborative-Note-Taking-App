import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext"; // Ensure correct import

export default function Navbar() {
  const { currentUser, logoutUser } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser(); // Ensure the user is logged out before navigating
    navigate("/home"); // Redirect to the home page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm py-3">
      <img className="logo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4CZqX3ojXsuDI2t2mKFwo_yL1Mg8tHTSkzg&s" alt="Logo" />
      <div className="container">
        <a className="navbar-brand text-primary fw-bold" href="#">CONTA</a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNavDropdown" 
          aria-controls="navbarNavDropdown" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {!currentUser ? (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link active text-primary fw-semibold">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link active text-primary fw-semibold">Sign up</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/" className="nav-link active text-primary fw-semibold">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/notes/:id" className="nav-link active text-primary fw-semibold">Note Editor</Link>
                </li>
                <li className="nav-item">
                  <Link to="/history" className="nav-link active text-primary fw-semibold">Edit History</Link>
                </li>
                <li className="nav-item">
                  <Link to="/home" className="nav-link active text-primary fw-semibold">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile"className="nav-link active text-primary fw-semibold">UserProfile</Link>
                </li>
                {/* <li className="nav-item">
                  <Link to="/share"className="nav-link active text-primary fw-semibold">Share</Link>
                </li> */}
                <li className="nav-item">
                  <button 
                    onClick={handleLogout} 
                    className="nav-link btn btn-link text-danger fw-semibold"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
