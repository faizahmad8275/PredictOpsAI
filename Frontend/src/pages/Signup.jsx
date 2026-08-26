import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="login-page signup-page">

      {/* Background decoration */}
      <div className="circuit circuit-one"></div>
      <div className="circuit circuit-two"></div>
      <div className="circuit circuit-three"></div>

      {/* Homepage Button */}
      <button className="home-button">Go to Homepage</button>

      {/* Signup Card */}
      <div className="login-card">

        <div className="login-header">
          <h1>Create Account</h1>
          <p>Please create your account to get started</p>
        </div>

        <form>

          {/* Name */}
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>

            <div className="password-box">
              <input
                type="password"
                placeholder="Create your password"
              />

              <span className="password-arrow">→</span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label>Confirm Password</label>

            <div className="password-box">
              <input
                type="password"
                placeholder="Confirm your password"
              />

              <span className="password-arrow">→</span>
            </div>
          </div>

          {/* Signup */}
          <button type="submit" className="login-button">
            Create Account
          </button>

        </form>

        {/* Divider */}
        <div className="divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        {/* Social Signup */}
        <button className="social-button">
          <FcGoogle className="social-icon" />
          Sign Up With Google
        </button>

        <button className="social-button">
          <FaFacebookF className="social-icon facebook-icon" />
          Sign Up With Facebook
        </button>

        <button className="social-button">
          <FaApple className="social-icon apple-icon" />
          Sign Up With Apple ID
        </button>

        {/* Login */}
        <p className="signup-text">
          Already have an Account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;