import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
  import { toast } from "react-toastify";
function Signup() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [aadharCardNumber, setAadharCardNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("voter"); // Default role is user
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;



const handleSubmit = async (e) => {
  e.preventDefault();
  try {
   
    const response = await axios.post(`${BASE_URL}/user/signup`, {
      name,
      age,
      email,
      mobile,
      address,
      aadharCardNumber,
      password,
      role,
    });

    const { token } = response.data;
    localStorage.setItem("authToken", token);

    toast.success("Signup successful!");

    // Redirect to dashboard based on role
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  } catch (error) {
    const msg = error.response?.data?.message || "Signup failed";
    setErrorMessage(msg);
    toast.error(msg);
  }
};


return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Signup
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg mt-2 text-base"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Age */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Age</label>
          <input
            type="number"
            min="18"
            className="w-full p-2 border rounded-lg mt-2 text-base"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded-lg mt-2 text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Mobile with 10-digit validation */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Mobile</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{10}"
            maxLength={10}
            minLength={10}
            className="w-full p-2 border rounded-lg mt-2 text-base"
            value={mobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setMobile(value);
            }}
            required
          />
          {mobile.length > 0 && mobile.length !== 10 && (
            <p className="text-red-500 text-sm mt-1">
              Mobile number must be 10 digits.
            </p>
          )}
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Address</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg mt-2 text-base"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        {/* Aadhar Card Number with 12-digit validation */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">
            Aadhar Card Number
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{12}"
            maxLength={12}
            minLength={12}
            className="w-full p-2 border rounded-lg mt-2 text-base"
            value={aadharCardNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setAadharCardNumber(value);
            }}
            required
          />
          {aadharCardNumber.length > 0 && aadharCardNumber.length !== 12 && (
            <p className="text-red-500 text-sm mt-1">
              Aadhar must be exactly 12 digits.
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded-lg mt-2 text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Role</label>
          <select
            className="w-full p-2 border rounded-lg mt-2 text-base"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">Voter</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-base"
        >
          Signup
        </button>
      </form>
    </div>
  </div>
);

}

export default Signup;
