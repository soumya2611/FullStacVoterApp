import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // 👈 Import toast

const BASE_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [results, setResults] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  // Fetch candidates and vote counts on component mount
  useEffect(() => {
    axios
      .get(`${BASE_URL}/candidate/`)
      .then((res) => setResults(res.data))
      .catch((err) => console.error("Error fetching results", err));

    axios
      .get(`${BASE_URL}/candidate`)
      .then((res) => setCandidates(res.data))
      .catch((err) => console.error("Error fetching candidates", err));

    if (token) {
      axios
        .get(`${BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          setUser(null);
        });
    }
  }, [token]);

  // Handle voting action
  const handleVote = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.isVoted) {
      toast.info("You have already voted.");
      return;
    }

    if (!selectedCandidate) {
      toast.error("Please select a candidate.");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/candidate/vote/${selectedCandidate}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Your vote has been counted!");
      setSelectedCandidate(null);

      // ✅ Refetch user data to update `isVoted`
      const userRes = await axios.get(`${BASE_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      // Optionally: refetch results
      const resultRes = await axios.get(`${BASE_URL}/candidate/`);
      setResults(resultRes.data);
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("There was an error voting.");
    }
  };

  const handleLogin = () => {
    if (!token) {
      navigate("/login");
    }
  };

  const handleAdminLogin = () => {
    if (!token) {
      navigate("/login");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-6 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        🗳️ Live Voting Results
      </h1>

      {/* Results */}
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4 mb-6">
        {results.length > 0 ? (
          results.map((result) => (
            <div
              key={result._id}
              className="flex justify-between items-center border-b py-2 text-sm sm:text-base"
            >
              <div>
                <span className="font-semibold">{result.name}</span>{" "}
                <span className="text-gray-500">({result.party})</span>
              </div>
              <div className="text-blue-600">{result.voteCount || 0} votes</div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No data available</p>
        )}
      </div>

      {/* Voting Section */}
      {token && user?.role === "voter" && !user.isVoted && (
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
            Vote for Your Candidate
          </h2>
          <div className="space-y-2">
            {candidates.map((candidate) => (
              <div key={candidate._id} className="flex items-center">
                <input
                  type="radio"
                  id={candidate._id}
                  name="candidate"
                  value={candidate._id}
                  checked={selectedCandidate === candidate._id}
                  onChange={(e) => setSelectedCandidate(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor={candidate._id} className="text-sm sm:text-base">
                  {candidate.name} ({candidate.party})
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={handleVote}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Submit Vote
          </button>
        </div>
      )}

      {/* Dashboard Button */}
      {token && user?.role === "voter" && (
        <button
          onClick={() => navigate("/user/dashboard")}
          className="w-full max-w-md bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg mb-4"
        >
          Go to Dashboard
        </button>
      )}

      {/* Admin Message */}
      {token && user?.role === "admin" && (
        <p className="text-gray-600 text-sm text-center mb-4">
          Admins are not allowed to vote.
        </p>
      )}

      {/* Login/Signup Buttons */}
      {!token && (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 w-full max-w-md">
          <button
            onClick={handleLogin}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Login to Vote
          </button>
          <button
            onClick={() => navigate("/sign-up")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Sign Up
          </button>
          <button
            onClick={handleAdminLogin}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Admin Login
          </button>
        </div>
      )}

      {/* Logout Button */}
      {token && (
        <button
          onClick={logout}
          className="w-full max-w-md bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg mt-4"
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default Home;
