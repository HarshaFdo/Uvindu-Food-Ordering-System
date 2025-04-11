import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function LoginPage() {
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://127.0.0.1:8001/api/auth/google/", {
        token: credentialResponse.credential,
      });
      console.log("User logged in:", res.data.user); // Contains name, email
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
