import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:8080/api/register", {
        username,
        password,
      });

      setSuccess("User registered successfully! Redirecting to Login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-teal-500 flex justify-center items-center px-4 sm:px-0">
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-xs sm:max-w-md">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-700 mb-4 sm:mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-base sm:text-lg font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-base sm:text-lg font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-center mb-4 text-sm sm:text-base">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-600 text-center mb-4 text-sm sm:text-base">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="w-full p-2 sm:p-3 bg-green-600 text-white font-medium text-base sm:text-lg rounded-lg hover:bg-green-700 transition duration-300"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleLoginRedirect}
            className="w-full p-2 sm:p-3 bg-teal-600 text-white font-medium text-base sm:text-lg rounded-lg hover:bg-teal-700 transition duration-300"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
