import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard1() {

  // Get logged-in user from localStorage
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Invalid user data in localStorage");
    localStorage.removeItem("user");
  }

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };


  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="dashboard-sidebar">

        {/* Logo */}
        <div className="dashboard-logo">

          <div className="logo-icon">
            P
          </div>

          <div>
            <h2>PredictOpsAI</h2>
            <span>AI Operations</span>
          </div>

        </div>


        {/* Navigation */}
        <nav className="dashboard-nav">

          <Link
            to="/dashboard1"
            className="nav-item active"
          >
            <span>▣</span>
            Dashboard
          </Link>

          <Link
            to="/dashboard2"
            className="nav-item"
          >
            <span>◈</span>
            Analytics
          </Link>

          <Link
            to="/dashboard3"
            className="nav-item"
          >
            <span>◆</span>
            Predictions
          </Link>

          <Link
            to="/dashboard4"
            className="nav-item"
          >
            <span>¤</span>
            Reports
          </Link>

        </nav>


        {/* Logout */}
        <div className="sidebar-bottom">

          <button
            onClick={handleLogout}
            className="logout-link"
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="dashboard-main">


        {/* ================= TOP BAR ================= */}

        <header className="dashboard-topbar">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back! Here's what's happening today.
            </p>

          </div>


          <div className="topbar-right">

            <button className="notification-button">
              🔔
            </button>


            {/* ================= USER PROFILE ================= */}

            <div className="profile">

              {/* User Avatar */}

              <div className="profile-avatar">

                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}

              </div>


              {/* User Information */}

              <div className="profile-info">

                <strong>
                  {user?.name || "User"}
                </strong>

                <span>
                  {user?.email || ""}
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* ================= STATISTICS ================= */}

        <section className="stats-grid">


          {/* Card 1 */}

          <div className="stat-card">

            <div className="stat-icon">
              ⚡
            </div>

            <div className="stat-content">

              <span>
                Total Operations
              </span>

              <h2>
                12,458
              </h2>

              <small className="positive">
                +12.5%
              </small>

            </div>

          </div>


          {/* Card 2 */}

          <div className="stat-card">

            <div className="stat-icon">
              ◉
            </div>

            <div className="stat-content">

              <span>
                Predictions
              </span>

              <h2>
                8,294
              </h2>

              <small className="positive">
                +18.2%
              </small>

            </div>

          </div>


          {/* Card 3 */}

          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div className="stat-content">

              <span>
                Success Rate
              </span>

              <h2>
                96.8%
              </h2>

              <small className="positive">
                +2.4%
              </small>

            </div>

          </div>


          {/* Card 4 */}

          <div className="stat-card">

            <div className="stat-icon">
              ±
            </div>

            <div className="stat-content">

              <span>
                Avg. Response
              </span>

              <h2>
                124ms
              </h2>

              <small className="positive">
                -8.6%
              </small>

            </div>

          </div>

        </section>


        {/* ================= CHART + AI ================= */}

        <section className="dashboard-grid">


          {/* Operations Chart */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Operations Overview
                </h2>

                <p>
                  System activity during the week
                </p>

              </div>


              <select>

                <option>
                  Last 7 Days
                </option>

                <option>
                  Last 30 Days
                </option>

                <option>
                  Last 90 Days
                </option>

              </select>

            </div>


            {/* Chart */}

            <div className="chart-area">

              <div className="chart-lines">

                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>

              </div>


              <div className="chart">

                <div className="chart-bar bar-1"></div>
                <div className="chart-bar bar-2"></div>
                <div className="chart-bar bar-3"></div>
                <div className="chart-bar bar-4"></div>
                <div className="chart-bar bar-5"></div>
                <div className="chart-bar bar-6"></div>
                <div className="chart-bar bar-7"></div>

              </div>


              <div className="chart-labels">

                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>

              </div>

            </div>

          </div>


          {/* AI Prediction */}

          <div className="dashboard-panel prediction-panel">

            <div className="panel-header">

              <div>

                <h2>
                  AI Prediction
                </h2>

                <p>
                  System prediction status
                </p>

              </div>

              <span className="status-dot">
                ●
              </span>

            </div>


            <div className="prediction-score">

              <div className="score-circle">

                <strong>
                  94%
                </strong>

                <span>
                  Confidence
                </span>

              </div>

            </div>


            <div className="prediction-message">

              <strong>
                System Stable
              </strong>

              <p>
                AI models predict normal system
                performance for the next 24 hours.
              </p>

            </div>

          </div>

        </section>


        {/* ================= ACTIVITY + STATUS ================= */}

        <section className="dashboard-grid bottom-grid">


          {/* Recent Activity */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Recent Activity
                </h2>

                <p>
                  Latest system events
                </p>

              </div>

              <button className="view-button">
                View All
              </button>

            </div>


            <div className="activity-list">


              <div className="activity-item">

                <div className="activity-icon success">
                  ✓
                </div>

                <div>

                  <strong>
                    Prediction completed
                  </strong>

                  <span>
                    AI model completed successfully
                  </span>

                </div>

                <small>
                  2 min ago
                </small>

              </div>


              <div className="activity-item">

                <div className="activity-icon success">
                  ✓
                </div>

                <div>

                  <strong>
                    System health check
                  </strong>

                  <span>
                    All services are running normally
                  </span>

                </div>

                <small>
                  15 min ago
                </small>

              </div>


              <div className="activity-item">

                <div className="activity-icon warning">
                  !
                </div>

                <div>

                  <strong>
                    High CPU usage
                  </strong>

                  <span>
                    CPU usage reached 78%
                  </span>

                </div>

                <small>
                  32 min ago
                </small>

              </div>


            </div>

          </div>


          {/* System Status */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>

                <h2>
                  System Status
                </h2>

                <p>
                  Current service status
                </p>

              </div>

            </div>


            <div className="system-status">


              <div className="status-row">

                <span>
                  API Server
                </span>

                <strong className="online">
                  ● Online
                </strong>

              </div>


              <div className="status-row">

                <span>
                  Database
                </span>

                <strong className="online">
                  ● Online
                </strong>

              </div>


              <div className="status-row">

                <span>
                  AI Engine
                </span>

                <strong className="online">
                  ● Online
                </strong>

              </div>


              <div className="status-row">

                <span>
                  Cloud Storage
                </span>

                <strong className="online">
                  ● Online
                </strong>

              </div>


            </div>

          </div>

        </section>


        {/* ================= NEXT DASHBOARD ================= */}

        <div className="dashboard-navigation">

          <Link
            to="/dashboard2"
            className="next-dashboard"
          >
            Dashboard 2 →
          </Link>

        </div>


      </main>

    </div>
  );
}

export default Dashboard1;