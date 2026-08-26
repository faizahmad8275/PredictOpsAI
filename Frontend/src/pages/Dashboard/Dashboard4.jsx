import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard4() {
  return (
    <div className="dashboard4-page">

      {/* SIDEBAR */}
      <aside className="dashboard4-sidebar">

        <div className="dashboard4-logo">
          <div className="dashboard4-logo-icon">P</div>

          <div>
            <h2>PredictOpsAI</h2>
            <span>AI Operations</span>
          </div>
        </div>

        <nav className="dashboard4-nav">

          <Link to="/dashboard1" className="dashboard4-nav-item">
            <span>⌂</span>
            Overview
          </Link>

          <Link to="/dashboard2" className="dashboard4-nav-item">
            <span>▣</span>
            Analytics
          </Link>

          <Link to="/dashboard3" className="dashboard4-nav-item">
            <span>✦</span>
            Predictions
          </Link>

          <Link to="/dashboard4" className="dashboard4-nav-item active">
            <span>▤</span>
            Reports
          </Link>

        </nav>

        <div className="dashboard4-sidebar-bottom">

          <Link to="/login" className="dashboard4-logout">
            <span>↪</span>
            Logout
          </Link>

        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="dashboard4-main">

        {/* TOPBAR */}
        <header className="dashboard4-topbar">

          <div>
            <h1>Reports</h1>
            <p>View and manage your PredictOpsAI reports</p>
          </div>

          <div className="dashboard4-profile">

            <button className="dashboard4-notification">
              🔔
            </button>

            <div className="dashboard4-avatar">
              H
            </div>

            <div className="dashboard4-profile-info">
              <strong>Harshit Kumar</strong>
              <span>Administrator</span>
            </div>

          </div>

        </header>


        {/* REPORT SUMMARY */}
        <section className="reports4-summary">

          <div className="report4-stat">
            <div className="report4-icon">▤</div>

            <div>
              <span>Total Reports</span>
              <h2>248</h2>
              <small>+12 this month</small>
            </div>
          </div>


          <div className="report4-stat">
            <div className="report4-icon">✓</div>

            <div>
              <span>Completed</span>
              <h2>231</h2>
              <small className="report4-positive">
                93.1% completed
              </small>
            </div>
          </div>


          <div className="report4-stat">
            <div className="report4-icon">◷</div>

            <div>
              <span>Pending</span>
              <h2>17</h2>
              <small>Needs attention</small>
            </div>
          </div>


          <div className="report4-stat">
            <div className="report4-icon">↓</div>

            <div>
              <span>Downloads</span>
              <h2>1,842</h2>
              <small className="report4-positive">
                +24.6% this month
              </small>
            </div>
          </div>

        </section>


        {/* REPORT PANEL */}
        <section className="reports4-panel">

          <div className="reports4-panel-header">

            <div>
              <h2>Recent Reports</h2>
              <p>Your latest generated AI reports</p>
            </div>

            <button className="generate4-button">
              + Generate Report
            </button>

          </div>


          {/* TABLE */}
          <div className="reports4-table">

            <div className="report4-row report4-heading">

              <span>Report Name</span>
              <span>Type</span>
              <span>Date</span>
              <span>Status</span>
              <span>Action</span>

            </div>


            <div className="report4-row">

              <div className="report4-name">
                <div className="report4-file-icon">PDF</div>

                <div>
                  <strong>Monthly Performance</strong>
                  <small>AI Analytics Report</small>
                </div>
              </div>

              <span>Analytics</span>

              <span>26 Aug 2026</span>

              <span className="report4-status completed">
                Completed
              </span>

              <button className="download4-button">
                ↓ Download
              </button>

            </div>


            <div className="report4-row">

              <div className="report4-name">
                <div className="report4-file-icon">PDF</div>

                <div>
                  <strong>Prediction Analysis</strong>
                  <small>AI Prediction Report</small>
                </div>
              </div>

              <span>Prediction</span>

              <span>25 Aug 2026</span>

              <span className="report4-status completed">
                Completed
              </span>

              <button className="download4-button">
                ↓ Download
              </button>

            </div>


            <div className="report4-row">

              <div className="report4-name">
                <div className="report4-file-icon">PDF</div>

                <div>
                  <strong>System Performance</strong>
                  <small>System Health Report</small>
                </div>
              </div>

              <span>System</span>

              <span>24 Aug 2026</span>

              <span className="report4-status completed">
                Completed
              </span>

              <button className="download4-button">
                ↓ Download
              </button>

            </div>


            <div className="report4-row">

              <div className="report4-name">
                <div className="report4-file-icon">PDF</div>

                <div>
                  <strong>AI Model Evaluation</strong>
                  <small>Model Performance Report</small>
                </div>
              </div>

              <span>AI Model</span>

              <span>23 Aug 2026</span>

              <span className="report4-status pending">
                Processing
              </span>

              <button className="download4-button disabled">
                Processing
              </button>

            </div>

          </div>

        </section>


        {/* REPORT INSIGHTS */}
        <section className="reports4-bottom">

          <div className="reports4-insight">

            <div className="reports4-insight-icon">
              ✦
            </div>

            <div>
              <h3>AI Report Insights</h3>

              <p>
                Your system generated 18% more reports this
                month compared to the previous month.
              </p>
            </div>

          </div>


          <div className="reports4-insight">

            <div className="reports4-insight-icon">
              ✓
            </div>

            <div>
              <h3>System Status</h3>

              <p>
                All reporting services are running normally
                and ready to generate new reports.
              </p>
            </div>

          </div>

        </section>


        {/* NAVIGATION */}
        <div className="dashboard4-navigation">

          <Link to="/dashboard3" className="dashboard4-button">
            ← Dashboard 3
          </Link>

          <Link to="/login" className="dashboard4-button logout4-button">
            Logout
          </Link>

        </div>

      </main>

    </div>
  );
}

export default Dashboard4;