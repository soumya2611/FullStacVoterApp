import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    party: "",
    age: "",
  });

  const [user, setUser] = useState(null); // To hold user info
  const token = localStorage.getItem("authToken");
  const BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const res = await axios.get(`${BASE_URL}/user/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(res.data);

          if (res.data.role === "admin") {
            // Fetch candidates only if user is admin
            const candidatesRes = await axios.get(`${BASE_URL}/candidate`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setCandidates(candidatesRes.data);
          } else if (res.data.role === "voter") {
            navigate("/");
          }
        } catch (err) {
          console.error(err);
          setUser(null);
          localStorage.removeItem("authToken");
          navigate("/login"); // Optional: redirect to login on error
        }
      }
    };

    fetchData();
  }, [token, BASE_URL, navigate]);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/candidate`, newCandidate, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCandidates([...candidates, response.data.candidate]);
      setNewCandidate({ name: "", party: "", age: "" });
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to add candidate");
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    console.log("delete", candidateId);
    try {
      await axios.delete(`${BASE_URL}/candidate/${candidateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCandidates(candidates.filter((c) => c._id !== candidateId));
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to delete candidate");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken"); // Remove token from localStorage
    setUser(null); // Reset user state to null
    navigate("/"); // Navigate to homepage or login page
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Admin Dashboard
      </h1>

      {/* Logout Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm sm:text-base"
        >
          Logout
        </button>
      </div>

      {/* Add Candidate Form */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
          Add New Candidate
        </h2>
        <form onSubmit={handleAddCandidate} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={newCandidate.name}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, name: e.target.value })
            }
            required
            className="w-full border border-gray-300 px-4 py-2 rounded text-sm sm:text-base"
          />
          <input
            type="text"
            placeholder="Party"
            value={newCandidate.party}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, party: e.target.value })
            }
            required
            className="w-full border border-gray-300 px-4 py-2 rounded text-sm sm:text-base"
          />
          <input
            type="number"
            placeholder="Age"
            value={newCandidate.age}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, age: e.target.value })
            }
            required
            className="w-full border border-gray-300 px-4 py-2 rounded text-sm sm:text-base"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            Add Candidate
          </button>
        </form>
      </div>

      {/* Candidate List */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
          Candidates List
        </h2>
        {errorMessage && (
          <p className="text-red-600 text-sm mb-4 text-center sm:text-left">
            {errorMessage}
          </p>
        )}
        <ul className="space-y-4">
          {candidates.map((candidate) => (
            <li
              key={candidate._id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-medium">
                    {candidate.name} ({candidate.party})
                  </h3>
                  <p className="text-sm text-gray-600">Age: {candidate.age}</p>
                  <p className="text-sm text-gray-600">
                    Votes: {candidate.voteCount || 0}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteCandidate(candidate._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
