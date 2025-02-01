import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { currentUser, logoutUser } = useUserContext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user details
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setLoading(false);
    }
  }, [currentUser]);

  // Handle delete user
  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const response = await axios.delete(`http://127.0.0.1:5000/users/${currentUser.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          toast.success("Account deleted successfully");
          logoutUser();
          navigate("/login");
        }
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to delete account");
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center mt-5">User not found</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">User Profile</h2>
              <div className="mb-3">
                <label className="form-label fw-bold">Username:</label>
                <p className="form-control-static">{user.username}</p>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Email:</label>
                <p className="form-control-static">{user.email}</p>
              </div>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteUser}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;