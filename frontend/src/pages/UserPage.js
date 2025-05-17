import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function UserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user; // Get user data from navigation state

  const handleLogout = () => {
    // Clear any user data (you'll implement proper auth later)
    navigate("/");
  };

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
        Logout
      </button>
    </div>
  );
}

export default UserPage;