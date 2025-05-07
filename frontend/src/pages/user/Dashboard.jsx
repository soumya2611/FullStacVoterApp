import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect if not logged in
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, [token, navigate]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${BASE_URL}/user/profile/password`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage(response.data.message);
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Password change failed"
      );
      setSuccessMessage(""); // Clear any previous success messages
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken"); // Remove token from localStorage
    setUser(null); // Reset user state to null
    navigate("/"); // Navigate to homepage or login page
  };

  const vote = () => {
    navigate("/"); // Navigate to the voting page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg sm:max-w-md bg-white shadow-md rounded-lg p-6 sm:p-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm sm:text-base"
          >
            Logout
          </button>
          {/* Conditionally render the "Vote Your Candidate" button */}
          {user && !user.isVoted && (
            <button
              onClick={vote}
              className="bg-green-500 text-white ml-4 px-4 py-2 rounded hover:bg-green-600 text-sm sm:text-base"
            >
              Vote Your Candidate
            </button>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          User Dashboard
        </h2>

        {/* User Profile Details */}
        {user && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Profile Details</h3>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Age:</strong> {user.age}
            </p>
            <p>
              <strong>Mobile:</strong> {user.mobile}
            </p>
            <p>
              <strong>Address:</strong> {user.address}
            </p>
          </div>
        )}

        {/* Change Password Section */}
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          {/* Current Password */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">
              Current Password
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg mt-2 text-base"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">New Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg mt-2 text-base"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="text-green-500 text-sm mb-4">{successMessage}</div>
          )}

          {/* Update Password Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-base"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserDashboard;
