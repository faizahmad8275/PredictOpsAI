import { useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    // Check password
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/users/",
        {
          name,
          email,
          password
        }
      );

      console.log("Signup successful:", response.data);

      // Signup successful
      alert("Account created successfully!");

      // Go to login
      navigate("/login");

    } catch (err) {

      console.error("Signup error:", err);

      if (err.response) {
        setError(
          err.response.data.detail || "Signup failed"
        );
      } else {
        setError("Backend server is not reachable");
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page signup-page">

      {/* Background decoration */}
      <div className="circuit circuit-one"></div>
      <div className="circuit circuit-two"></div>
      <div className="circuit circuit-three"></div>

      {/* Homepage Button */}
      <button className="home-button">
        Go to Homepage
      </button>


      {/* Signup Card */}
      <div className="login-card">

        <div className="login-header">
          <h1>Create Account</h1>
          <p>Please create your account to get started</p>
        </div>


        {/* Signup Form */}
        <form onSubmit={handleSignup}>

          {/* Name */}
          <div className="input-group">

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

          </div>


          {/* Email */}
          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>


          {/* Password */}
          <div className="input-group">

            <label>Password</label>

            <div className="password-box">

              <input
                type="password"
                placeholder="Create your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span className="password-arrow">
                →
              </span>

            </div>

          </div>


          {/* Confirm Password */}
          <div className="input-group">

            <label>Confirm Password</label>

            <div className="password-box">

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

              <span className="password-arrow">
                →
              </span>

            </div>

          </div>


          {/* Error */}
          {error && (
            <p
              style={{
                color: "red",
                marginBottom: "10px",
                textAlign: "center"
              }}
            >
              {error}
            </p>
          )}


          {/* Signup Button */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        {/* Divider */}
        <div className="divider">

          <span></span>

          <p>or</p>

          <span></span>

        </div>


        {/* Social Signup */}
        <button
          type="button"
          className="social-button"
        >
          <FcGoogle className="social-icon" />
          Sign Up With Google
        </button>


        <button
          type="button"
          className="social-button"
        >
          <FaFacebookF className="social-icon facebook-icon" />
          Sign Up With Facebook
        </button>


        <button
          type="button"
          className="social-button"
        >
          <FaApple className="social-icon apple-icon" />
          Sign Up With Apple ID
        </button>


        {/* Login */}
        <p className="signup-text">

          Already have an Account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Signup;