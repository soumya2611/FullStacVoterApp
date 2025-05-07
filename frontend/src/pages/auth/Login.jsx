import { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; 
 import { toast } from "react-toastify"; 
function Login() {
  const [aadharCardNumber, setAadharCardNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;



 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     const response = await axios.post(`${BASE_URL}/user/login`, {
       aadharCardNumber,
       password,
     });

     const { token } = response.data;

     if (token) {
       localStorage.setItem("authToken", token);

       const decoded = jwtDecode(token);
       const userRole = decoded.role;

       if (userRole === "admin") {
         toast.error("Admins can't vote.");
         // Do not redirect admins anywhere
       } else if (userRole === "voter") {
         navigate("/");
       } else {
         setErrorMessage("Unrecognized role. Please contact support.");
       }
     }
   } catch (error) {
     setErrorMessage(error.response?.data?.message || "Login failed");
   }
 };


return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-sm sm:max-w-md bg-white shadow-md rounded-lg p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Aadhar Card Number
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{12}"
            maxLength={12}
            minLength={12}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={aadharCardNumber}
            placeholder="Enter 12-digit Aadhar Number"
            onChange={(e) => {
              // Allow only digits
              const value = e.target.value.replace(/\D/g, "");
              setAadharCardNumber(value);
            }}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        <button
          type="submit"
          className="w-full mb-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
        >
          Login
        </button>
        <span className="text-gray-800/50">
          New Voter?
          <Link to="/sign-up" className="text-blue-600 ml-2 hover:text-blue-800">
            Signup 
          </Link>
          
        </span>
      </form>
    </div>
  </div>
);

}

export default Login;
