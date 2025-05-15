import React from "react";
import HeroImg from '../assets/google.png';
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const navigate = useNavigate();

    const handleLoginSuccess = async (credentialResponse) => {
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/auth/google/", {
          token: credentialResponse.credential,
        });
        
        navigate("/user", { state: { user: res.data.user } });
  
        localStorage.setItem("accessToken", res.data.access);
        localStorage.setItem("refreshToken", res.data.refresh);
  
  
      } catch (err) {
        console.error("Login failed:", err.response?.data || err.message);
      }
    };

  return (
    <div className="relative py-16 bg-gradient-to-br from-sky-50 to-gray-200">  
      <div className="relative container m-auto px-6 text-gray-500 md:px-12 xl:px-40">
        <div className="m-auto md:w-8/12 lg:w-6/12 xl:w-6/12">
          <div className="rounded-xl bg-white shadow-xl">
            <div className="p-6 sm:p-16">
              <div className="space-y-4">
              <div className="flex-1 flex flex-col items-center md:items-start">
                <h1 className="text-6xl md:text-4xl font-extrabold leading-tight text-black mb-4 text-center md:text-left drop-shadow-md">
                Uvindu<br />Food<br />Cabin
                </h1>
                </div>
                <h2 className="mb-8 text-2xl text-cyan-900 font-bold">
                  Sign in to Place <br /> Your Delicious Order
                </h2>
              </div>

              <div className="mt-16 grid space-y-4">
                {/* Google Button */}
                <div style={{ padding: "2rem" }}>
                      <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={() => console.log("Login Failed")}
                      />
                    </div>
              </div>

              <div className="mt-32 space-y-4 text-gray-600 text-center sm:-mb-8">
                <p className="text-xs">
                  By proceeding, you agree to our{" "}
                  <a href="#" className="underline">
                    Terms of Use
                  </a>{" "}
                  and confirm you have read our{" "}
                  <a href="#" className="underline">
                    Privacy and Cookie Statement
                  </a>
                  .
                </p>
                <p className="text-xs">
                  This site is protected by reCAPTCHA and the{" "}
                  <a href="#" className="underline">
                    Google Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline">
                    Terms of Service
                  </a>{" "}
                  apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
