import { useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/users/login",
        {
          email,
          password,
        }
      );

      console.log("Login successful:", response.data);

      // Save JWT token
      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Go to dashboard
      navigate("/dashboard1");

    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        setError(
          err.response.data.detail || "Login failed"
        );
      } else {
        setError("Backend server is not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Background decoration */}
      <div className="circuit circuit-one"></div>
      <div className="circuit circuit-two"></div>
      <div className="circuit circuit-three"></div>

      {/* Homepage Button */}
      <button className="home-button">
        Go to Homepage
      </button>

      {/* Login Card */}
      <div className="login-card">

        {/* Header */}
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Please login to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>

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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span className="password-arrow">
                →
              </span>

            </div>
          </div>

          {/* Remember + Forgot Password */}
          <div className="login-options">

            <label className="remember">
              <input
                type="checkbox"
                defaultChecked
              />

              <span>Remember me</span>
            </label>

            <a href="#">
              Forgot Password
            </a>

          </div>

          {/* Error Message */}
          {error && (
            <p
              style={{
                color: "red",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Divider */}
        <div className="divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        {/* Google Login */}
        <button
          type="button"
          className="social-button"
        >
          <FcGoogle className="social-icon" />
          Login With Google
        </button>

        {/* Facebook Login */}
        <button
          type="button"
          className="social-button"
        >
          <FaFacebookF className="social-icon facebook-icon" />
          Login With Facebook
        </button>

        {/* Apple Login */}
        <button
          type="button"
          className="social-button"
        >
          <FaApple className="social-icon apple-icon" />
          Login With Apple ID
        </button>

        {/* Sign Up */}
        <p className="signup-text">
          Don't have an Account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;