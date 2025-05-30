import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/auth/google/", {
      token: credentialResponse.credential,
    });

    const user = res.data.user;
    const accessToken = res.data.access;
    const refreshToken = res.data.refresh;

    // Log to debug
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    // Save tokens
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Redirect
    if (user.is_staff) {
      navigate("/admin", { state: { user } });
    } else {
      navigate("/user", { state: { user } });
    }

  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
  }
};


  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login with Google</h2>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
}

export default LoginPage;
