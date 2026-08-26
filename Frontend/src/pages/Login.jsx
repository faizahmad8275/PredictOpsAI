import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="login-page">
      {/* Background decoration */}
      <div className="circuit circuit-one"></div>
      <div className="circuit circuit-two"></div>
      <div className="circuit circuit-three"></div>

      {/* Homepage Button */}
      <button className="home-button">Go to Homepage</button>

      {/* Login Card */}
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Please login to your account</p>
        </div>

        <form>
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
                placeholder="Enter your password"
              />

              <span className="password-arrow">→</span>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="login-options">
            <label className="remember">
              <input type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>

            <a href="#">Forgot Password</a>
          </div>

          {/* Login */}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        {/* Social Login */}
        <button className="social-button">
          <FcGoogle className="social-icon" />
          Login With Google
        </button>

        <button className="social-button">
          <FaFacebookF className="social-icon facebook-icon" />
          Login With Facebook
        </button>

        <button className="social-button">
          <FaApple className="social-icon apple-icon" />
          Login With Apple ID
        </button>

        {/* Sign Up */}
        <p className="signup-text">
          Don't have an Account?{" "}
          <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;