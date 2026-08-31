import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard1() {
  const [user, setUser] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= USER =================

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Invalid user data");
      localStorage.removeItem("user");
    }
  }, []);

  // ================= FETCH PREDICTIONS =================

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("access_token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:8000/predictions/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return;
          }

          throw new Error("Failed to fetch predictions");
        }

        const data = await response.json();

        // ================= SORT LATEST FIRST =================
        const sortedPredictions = Array.isArray(data)
          ? [...data].sort((a, b) => {
              if (!a.id || !b.id) return 0;

              return b.id.localeCompare(a.id);
            })
          : [];

        setPredictions(sortedPredictions);
      } catch (err) {
        console.error("Prediction fetch error:", err);
        setError("Unable to load prediction data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // ================= CALCULATIONS =================

  const totalPredictions = predictions.length;

  const successfulPredictions = predictions.filter(
    (prediction) =>
      prediction.predicted_status === "low_risk"
  ).length;

  const successRate =
    totalPredictions > 0
      ? (
          (successfulPredictions / totalPredictions) *
          100
        ).toFixed(1)
      : "0.0";

  const averageResponse =
    totalPredictions > 0
      ? Math.round(
          predictions.reduce(
            (sum, prediction) =>
              sum +
              Number(prediction.response_time || 0),
            0
          ) / totalPredictions
        )
      : 0;

  // ================= LATEST PREDICTION =================

  const latestPrediction =
    predictions.length > 0
      ? predictions[0]
      : null;

  const latestFailureProbability =
    latestPrediction
      ? Math.round(
          Number(
            latestPrediction.failure_probability || 0
          ) * 100
        )
      : 0;

  const latestRisk =
    latestPrediction?.risk_level || "low";

  const isCritical =
    latestRisk === "critical" ||
    latestRisk === "high";

  // ================= CHART DATA =================

  const chartPredictions = predictions.slice(0, 7);

  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">

          <div className="logo-icon">
            P
          </div>

          <div>
            <h2>PredictOpsAI</h2>
            <span>AI Operations</span>
          </div>

        </div>

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

      {/* ================= MAIN ================= */}

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

            <div className="profile">

              <div className="profile-avatar">
                {user?.name
                  ? user.name
                      .charAt(0)
                      .toUpperCase()
                  : "U"}
              </div>

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

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="dashboard-loading">
            Loading dashboard data...
          </div>
        )}

        {/* ================= ERROR ================= */}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* ================= STATISTICS ================= */}

        <section className="stats-grid">

          {/* TOTAL OPERATIONS */}

          <div className="stat-card">

            <div className="stat-icon">
              ⚡
            </div>

            <div className="stat-content">

              <span>
                Total Operations
              </span>

              <h2>
                {loading
                  ? "..."
                  : totalPredictions}
              </h2>

              <small className="positive">
                Live
              </small>

            </div>

          </div>

          {/* PREDICTIONS */}

          <div className="stat-card">

            <div className="stat-icon">
              ◉
            </div>

            <div className="stat-content">

              <span>
                Predictions
              </span>

              <h2>
                {loading
                  ? "..."
                  : totalPredictions}
              </h2>

              <small className="positive">
                AI Generated
              </small>

            </div>

          </div>

          {/* SUCCESS RATE */}

          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div className="stat-content">

              <span>
                Success Rate
              </span>

              <h2>
                {loading
                  ? "..."
                  : `${successRate}%`}
              </h2>

              <small className="positive">
                Based on predictions
              </small>

            </div>

          </div>

          {/* AVG RESPONSE */}

          <div className="stat-card">

            <div className="stat-icon">
              ±
            </div>

            <div className="stat-content">

              <span>
                Avg. Response
              </span>

              <h2>
                {loading
                  ? "..."
                  : `${averageResponse}ms`}
              </h2>

              <small className="positive">
                Live Metrics
              </small>

            </div>

          </div>

        </section>

        {/* ================= CHART + AI ================= */}

        <section className="dashboard-grid">

          {/* ================= OPERATIONS ================= */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Operations Overview
                </h2>

                <p>
                  Recent prediction activity
                </p>

              </div>

              <select>

                <option>
                  Latest
                </option>

                <option>
                  Last 7 Days
                </option>

                <option>
                  Last 30 Days
                </option>

              </select>

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

                {chartPredictions.length > 0 ? (

                  chartPredictions.map(
                    (prediction, index) => {

                      const probability =
                        Number(
                          prediction.failure_probability ||
                            0
                        ) * 100;

                      return (
                        <div
                          key={
                            prediction.id || index
                          }
                          className="chart-bar"
                          style={{
                            height: `${Math.max(
                              probability,
                              5
                            )}%`,
                          }}
                          title={`${Math.round(
                            probability
                          )}% failure risk`}
                        ></div>
                      );
                    }
                  )

                ) : (

                  !loading && (
                    <p>
                      No prediction data available.
                    </p>
                  )

                )}

              </div>

              {/* DYNAMIC LABELS */}

              <div className="chart-labels">

                {chartPredictions.map(
                  (_, index) => (
                    <span key={index}>
                      {index + 1}
                    </span>
                  )
                )}

              </div>

            </div>

          </div>

          {/* ================= AI PREDICTION ================= */}

          <div className="dashboard-panel prediction-panel">

            <div className="panel-header">

              <div>

                <h2>
                  AI Prediction
                </h2>

                <p>
                  Latest system prediction
                </p>

              </div>

              <span className="status-dot">
                ●
              </span>

            </div>

            <div className="prediction-score">

              <div className="score-circle">

                <strong>
                  {loading
                    ? "..."
                    : `${latestFailureProbability}%`}
                </strong>

                <span>
                  Failure Risk
                </span>

              </div>

            </div>

            <div className="prediction-message">

              <strong>

                {loading
                  ? "Loading..."
                  : latestPrediction
                  ? isCritical
                    ? "⚠️ High Risk Detected"
                    : "✅ System Stable"
                  : "No Prediction"}

              </strong>

              <p>

                {loading
                  ? "Fetching latest AI prediction..."
                  : latestPrediction
                  ? latestPrediction.explanation
                  : "No prediction data available."}

              </p>

            </div>

          </div>

        </section>

        {/* ================= ACTIVITY + STATUS ================= */}

        <section className="dashboard-grid bottom-grid">

          {/* ================= RECENT ACTIVITY ================= */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Recent Activity
                </h2>

                <p>
                  Latest AI predictions
                </p>

              </div>

              <Link
                to="/dashboard3"
                className="view-button"
              >
                View All
              </Link>

            </div>

            <div className="activity-list">

              {predictions
                .slice(0, 3)
                .map(
                  (prediction, index) => {

                    const warning =
                      prediction.risk_level ===
                        "critical" ||
                      prediction.risk_level ===
                        "high";

                    return (

                      <div
                        className="activity-item"
                        key={
                          prediction.id || index
                        }
                      >

                        <div
                          className={`activity-icon ${
                            warning
                              ? "warning"
                              : "success"
                          }`}
                        >

                          {warning
                            ? "!"
                            : "✓"}

                        </div>

                        <div>

                          <strong>
                            {
                              prediction.predicted_status
                            }
                          </strong>

                          <span>
                            {
                              prediction.service
                            }{" "}
                            —{" "}
                            {
                              prediction.risk_level
                            }{" "}
                            risk
                          </span>

                        </div>

                        <small>
                          AI
                        </small>

                      </div>

                    );
                  }
                )}

              {!loading &&
                predictions.length === 0 && (

                  <p>
                    No recent predictions found.
                  </p>

                )}

            </div>

          </div>

          {/* ================= SYSTEM STATUS ================= */}

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
                  Monitoring
                </span>

                <strong className="online">
                  ● Active
                </strong>

              </div>

            </div>

          </div>

        </section>

        {/* ================= NEXT ================= */}

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