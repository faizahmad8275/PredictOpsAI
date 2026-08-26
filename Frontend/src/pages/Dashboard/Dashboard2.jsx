import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard2() {
  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          <div className="logo-icon">P</div>

          <div>
            <h2>PredictOpsAI</h2>
            <span>AI Operations</span>
          </div>
        </div>

        <nav className="dashboard-nav">

          <Link to="/dashboard1" className="nav-item">
            <span>⌂</span>
            Overview
          </Link>

          <Link to="/dashboard2" className="nav-item active">
            <span>▦</span>
            Analytics
          </Link>

          <Link to="/dashboard3" className="nav-item">
            <span>◈</span>
            Predictions
          </Link>

          <Link to="/dashboard4" className="nav-item">
            <span>▤</span>
            Reports
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <Link to="/login" className="logout-link">
            <span>↪</span>
            Logout
          </Link>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="dashboard-main">

        {/* TOP BAR */}

        <div className="dashboard-topbar">

          <div>
            <h1>Analytics</h1>

            <p>
              Monitor and analyze your AI operations
            </p>
          </div>

          <div className="topbar-right">

            <button className="notification-button">
              ♧
            </button>

            <div className="profile">

              <div className="profile-avatar">
                H
              </div>

              <div className="profile-info">
                <strong>Harshit Kumar</strong>
                <span>Administrator</span>
              </div>

            </div>

          </div>

        </div>


        {/* ================= FILTER ================= */}

        <div className="analytics-filter">

          <div>
            <h2>Performance Analytics</h2>

            <p>
              AI system performance over time
            </p>
          </div>

          <select>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
          </select>

        </div>


        {/* ================= STAT CARDS ================= */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              ◉
            </div>

            <div className="stat-content">

              <span>Total Predictions</span>

              <h2>12,845</h2>

              <small className="positive">
                ↑ 18.4% this week
              </small>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              %
            </div>

            <div className="stat-content">

              <span>Accuracy</span>

              <h2>94.8%</h2>

              <small className="positive">
                ↑ 2.1% improvement
              </small>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ⚡
            </div>

            <div className="stat-content">

              <span>Avg. Response</span>

              <h2>128ms</h2>

              <small className="positive">
                ↓ 12ms faster
              </small>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div className="stat-content">

              <span>Success Rate</span>

              <h2>98.6%</h2>

              <small className="positive">
                ↑ 1.8% this week
              </small>

            </div>

          </div>

        </div>


        {/* ================= ANALYTICS GRID ================= */}

        <div className="dashboard-grid">

          {/* CHART */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>
                <h2>Prediction Activity</h2>

                <p>
                  Number of predictions processed
                </p>
              </div>

              <span className="analytics-badge">
                Live
              </span>

            </div>


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


          {/* MODEL PERFORMANCE */}

          <div className="dashboard-panel model-panel">

            <div className="panel-header">

              <div>
                <h2>Model Performance</h2>

                <p>
                  Current AI model status
                </p>
              </div>

            </div>


            <div className="model-score">

              <div className="score-circle">

                <strong>94.8%</strong>

                <span>Accuracy</span>

              </div>

            </div>


            <div className="performance-info">

              <div>
                <span>Precision</span>
                <strong>93.2%</strong>
              </div>

              <div>
                <span>Recall</span>
                <strong>95.6%</strong>
              </div>

              <div>
                <span>F1 Score</span>
                <strong>94.4%</strong>
              </div>

            </div>

          </div>

        </div>


        {/* ================= LOWER SECTION ================= */}

        <div className="dashboard-grid bottom-grid">

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>
                <h2>Prediction Categories</h2>

                <p>
                  Distribution of predictions
                </p>
              </div>

            </div>


            <div className="category-list">

              <div className="category-item">

                <div>
                  <strong>Normal</strong>
                  <span>6,842 predictions</span>
                </div>

                <b>53%</b>

              </div>


              <div className="category-item">

                <div>
                  <strong>Warning</strong>
                  <span>3,921 predictions</span>
                </div>

                <b>31%</b>

              </div>


              <div className="category-item">

                <div>
                  <strong>Critical</strong>
                  <span>2,082 predictions</span>
                </div>

                <b>16%</b>

              </div>

            </div>

          </div>


          <div className="dashboard-panel">

            <div className="panel-header">

              <div>
                <h2>System Health</h2>

                <p>
                  Current infrastructure
                </p>
              </div>

            </div>


            <div className="system-status">

              <div className="status-row">
                <span>AI Engine</span>
                <strong className="online">
                  ● Online
                </strong>
              </div>

              <div className="status-row">
                <span>Database</span>
                <strong className="online">
                  ● Online
                </strong>
              </div>

              <div className="status-row">
                <span>API Server</span>
                <strong className="online">
                  ● Online
                </strong>
              </div>

              <div className="status-row">
                <span>Model Server</span>
                <strong className="online">
                  ● Online
                </strong>
              </div>

            </div>

          </div>

        </div>


        {/* ================= NEXT DASHBOARD ================= */}

        <div className="dashboard-navigation">

          <Link
            to="/dashboard3"
            className="next-dashboard"
          >
            Go to Dashboard 3 →
          </Link>

        </div>

      </main>

    </div>
  );
}

export default Dashboard2;