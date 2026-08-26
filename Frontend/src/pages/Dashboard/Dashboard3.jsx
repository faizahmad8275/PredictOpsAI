import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard3() {
  return (
    <div className="dashboard3-page">

      {/* SIDEBAR */}
      <aside className="dashboard3-sidebar">

        <div className="dashboard3-logo">
          <div className="dashboard3-logo-icon">P</div>

          <div>
            <h2>PredictOpsAI</h2>
            <span>AI Operations</span>
          </div>
        </div>

        <nav className="dashboard3-nav">

          <Link to="/dashboard1" className="dashboard3-nav-item">
            <span>⌂</span>
            Overview
          </Link>

          <Link to="/dashboard2" className="dashboard3-nav-item">
            <span>▣</span>
            Analytics
          </Link>

          <Link to="/dashboard3" className="dashboard3-nav-item active">
            <span>✦</span>
            Predictions
          </Link>

          <Link to="/dashboard4" className="dashboard3-nav-item">
            <span>▤</span>
            Reports
          </Link>

        </nav>

        <div className="dashboard3-sidebar-bottom">

          <Link to="/login" className="dashboard3-logout">
            <span>↪</span>
            Logout
          </Link>

        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="dashboard3-main">

        {/* TOP BAR */}
        <header className="dashboard3-topbar">

          <div>
            <h1>AI Predictions</h1>
            <p>Smart predictions powered by PredictOpsAI</p>
          </div>

          <div className="dashboard3-profile">

            <button className="dashboard3-notification">
              🔔
            </button>

            <div className="dashboard3-avatar">
              H
            </div>

            <div className="dashboard3-profile-info">
              <strong>Harshit Kumar</strong>
              <span>Administrator</span>
            </div>

          </div>

        </header>


        {/* PREDICTION OVERVIEW */}
        <section className="prediction3-overview">

          {/* Prediction Score */}
          <div className="prediction3-card main-prediction">

            <div className="prediction3-card-header">

              <div>
                <h2>Prediction Score</h2>
                <p>Current AI model confidence</p>
              </div>

              <span className="prediction3-status">
                ● Active
              </span>

            </div>

            <div className="prediction3-score">

              <div className="prediction3-circle">
                <strong>94%</strong>
                <span>Accuracy</span>
              </div>

            </div>

            <div className="prediction3-message">

              <strong>Excellent Prediction</strong>

              <p>
                The AI model is currently performing above
                the expected accuracy level.
              </p>

            </div>

          </div>


          {/* Model Performance */}
          <div className="prediction3-card">

            <div className="prediction3-card-header">

              <div>
                <h2>Model Performance</h2>
                <p>Latest model statistics</p>
              </div>

            </div>

            <div className="model3-stat">
              <span>Accuracy</span>
              <strong>94.2%</strong>
            </div>

            <div className="model3-stat">
              <span>Precision</span>
              <strong>91.8%</strong>
            </div>

            <div className="model3-stat">
              <span>Recall</span>
              <strong>93.5%</strong>
            </div>

            <div className="model3-stat">
              <span>F1 Score</span>
              <strong>92.6%</strong>
            </div>

          </div>

        </section>


        {/* STAT CARDS */}
        <section className="prediction3-grid">

          <div className="prediction3-small-card">

            <div className="prediction3-small-icon">
              ✦
            </div>

            <div>
              <span>Total Predictions</span>
              <h2>12,584</h2>
              <small className="prediction3-positive">
                +18.4% this month
              </small>
            </div>

          </div>


          <div className="prediction3-small-card">

            <div className="prediction3-small-icon">
              ✓
            </div>

            <div>
              <span>Successful</span>
              <h2>11,920</h2>
              <small className="prediction3-positive">
                94.7% success rate
              </small>
            </div>

          </div>


          <div className="prediction3-small-card">

            <div className="prediction3-small-icon">
              ⚡
            </div>

            <div>
              <span>Processing Time</span>
              <h2>1.8s</h2>
              <small className="prediction3-positive">
                12% faster
              </small>
            </div>

          </div>


          <div className="prediction3-small-card">

            <div className="prediction3-small-icon">
              ◉
            </div>

            <div>
              <span>Model Version</span>
              <h2>v2.4</h2>
              <small>Updated today</small>
            </div>

          </div>

        </section>


        {/* CHART */}
        <section className="prediction3-panel">

          <div className="prediction3-panel-header">

            <div>
              <h2>Prediction Analysis</h2>
              <p>AI prediction performance over the last 7 days</p>
            </div>

            <select>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>

          </div>


          <div className="prediction3-chart">

            <div className="prediction3-lines">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="prediction3-bars">

              <div className="prediction3-bar bar3-1"></div>
              <div className="prediction3-bar bar3-2"></div>
              <div className="prediction3-bar bar3-3"></div>
              <div className="prediction3-bar bar3-4"></div>
              <div className="prediction3-bar bar3-5"></div>
              <div className="prediction3-bar bar3-6"></div>
              <div className="prediction3-bar bar3-7"></div>

            </div>

            <div className="prediction3-labels">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

          </div>

        </section>


        {/* NAVIGATION */}
        <div className="dashboard3-navigation">

          <Link to="/dashboard2" className="dashboard3-button">
            ← Dashboard 2
          </Link>

          <Link to="/dashboard4" className="dashboard3-button">
            Dashboard 4 →
          </Link>

        </div>

      </main>

    </div>
  );
}

export default Dashboard3;