import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";

function Dashboard2() {
  const [user, setUser] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("Latest");

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
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch predictions");
        }

        const data = await response.json();

        const sortedData = Array.isArray(data)
          ? [...data].sort((a, b) =>
              String(b.id || "").localeCompare(
                String(a.id || "")
              )
            )
          : [];

        setPredictions(sortedData);
      } catch (err) {
        console.error("Prediction fetch error:", err);
        setError("Unable to load analytics data.");
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

  // ================= FILTER =================

  const filteredPredictions = useMemo(() => {
    if (filter === "Latest") {
      return predictions;
    }

    // Backend currently does not provide a reliable created_at field.
    // Therefore we keep the available API data.
    return predictions;
  }, [predictions, filter]);

  // ================= CALCULATIONS =================

  const totalPredictions = filteredPredictions.length;

  const lowRiskCount = filteredPredictions.filter(
    (prediction) =>
      prediction.predicted_status === "low_risk" ||
      prediction.risk_level === "low"
  ).length;

  const warningCount = filteredPredictions.filter(
    (prediction) =>
      prediction.risk_level === "medium" ||
      prediction.risk_level === "warning"
  ).length;

  const criticalCount = filteredPredictions.filter(
    (prediction) =>
      prediction.risk_level === "high" ||
      prediction.risk_level === "critical"
  ).length;

  const successRate =
    totalPredictions > 0
      ? ((lowRiskCount / totalPredictions) * 100).toFixed(1)
      : "0.0";

  const averageResponse =
    totalPredictions > 0
      ? Math.round(
          filteredPredictions.reduce(
            (sum, prediction) =>
              sum + Number(prediction.response_time || 0),
            0
          ) / totalPredictions
        )
      : 0;

  const criticalPercentage =
    totalPredictions > 0
      ? ((criticalCount / totalPredictions) * 100).toFixed(1)
      : "0.0";

  const warningPercentage =
    totalPredictions > 0
      ? ((warningCount / totalPredictions) * 100).toFixed(1)
      : "0.0";

  const normalPercentage =
    totalPredictions > 0
      ? ((lowRiskCount / totalPredictions) * 100).toFixed(1)
      : "0.0";

  // ================= LATEST PREDICTION =================

  const latestPrediction =
    filteredPredictions.length > 0
      ? filteredPredictions[0]
      : null;

  const latestProbability = latestPrediction
    ? Math.round(
        Number(latestPrediction.failure_probability || 0) * 100
      )
    : 0;

  // ================= CHART =================

  const chartPredictions = filteredPredictions.slice(0, 7);

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
            className="nav-item"
          >
            <span>⌂</span>
            Overview
          </Link>

          <Link
            to="/dashboard2"
            className="nav-item active"
          >
            <span>▦</span>
            Analytics
          </Link>

          <Link
            to="/dashboard3"
            className="nav-item"
          >
            <span>◈</span>
            Predictions
          </Link>

          <Link
            to="/dashboard4"
            className="nav-item"
          >
            <span>▤</span>
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

        <div className="dashboard-topbar">

          <div>

            <h1>
              Analytics
            </h1>

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

                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}

              </div>

              <div className="profile-info">

                <strong>
                  {user?.name || "User"}
                </strong>

                <span>
                  {user?.email || "Administrator"}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="dashboard-loading">
            Loading analytics data...
          </div>
        )}

        {/* ================= ERROR ================= */}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* ================= FILTER ================= */}

        <div className="analytics-filter">

          <div>

            <h2>
              Performance Analytics
            </h2>

            <p>
              AI system performance from prediction data
            </p>

          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >

            <option value="Latest">
              Latest
            </option>

            <option value="Last 7 Days">
              Last 7 Days
            </option>

            <option value="Last 30 Days">
              Last 30 Days
            </option>

          </select>

        </div>

        {/* ================= STAT CARDS ================= */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              ◉
            </div>

            <div className="stat-content">

              <span>
                Total Predictions
              </span>

              <h2>
                {loading ? "..." : totalPredictions}
              </h2>

              <small className="positive">
                Live API Data
              </small>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              %
            </div>

            <div className="stat-content">

              <span>
                Success Rate
              </span>

              <h2>
                {loading ? "..." : `${successRate}%`}
              </h2>

              <small className="positive">
                Low Risk Predictions
              </small>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ⚡
            </div>

            <div className="stat-content">

              <span>
                Avg. Response
              </span>

              <h2>
                {loading ? "..." : `${averageResponse}ms`}
              </h2>

              <small className="positive">
                From prediction metrics
              </small>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              !
            </div>

            <div className="stat-content">

              <span>
                Critical Risk
              </span>

              <h2>
                {loading ? "..." : `${criticalPercentage}%`}
              </h2>

              <small>
                {criticalCount} critical/high predictions
              </small>

            </div>

          </div>

        </div>

        {/* ================= ANALYTICS GRID ================= */}

        <div className="dashboard-grid">

          {/* ================= PREDICTION ACTIVITY ================= */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Prediction Activity
                </h2>

                <p>
                  Failure probability of recent predictions
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

                {chartPredictions.length > 0 ? (
                  chartPredictions.map((prediction, index) => {

                    const probability =
                      Number(
                        prediction.failure_probability || 0
                      ) * 100;

                    return (
                      <div
                        key={prediction.id || index}
                        className="chart-bar"
                        style={{
                          height: `${Math.max(
                            probability,
                            5
                          )}%`,
                        }}
                        title={`Failure Probability: ${Math.round(
                          probability
                        )}%`}
                      />
                    );

                  })
                ) : (
                  !loading && (
                    <p>
                      No prediction data available.
                    </p>
                  )
                )}

              </div>

              <div className="chart-labels">

                {chartPredictions.map((_, index) => (
                  <span key={index}>
                    #{index + 1}
                  </span>
                ))}

              </div>

            </div>

          </div>

          {/* ================= LATEST PREDICTION ================= */}

          <div className="dashboard-panel model-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Latest Prediction
                </h2>

                <p>
                  Current AI risk assessment
                </p>

              </div>

            </div>

            <div className="model-score">

              <div className="score-circle">

                <strong>
                  {loading
                    ? "..."
                    : `${latestProbability}%`}
                </strong>

                <span>
                  Failure Risk
                </span>

              </div>

            </div>

            <div className="performance-info">

              <div>

                <span>
                  Service
                </span>

                <strong>
                  {latestPrediction?.service || "N/A"}
                </strong>

              </div>

              <div>

                <span>
                  Severity
                </span>

                <strong>
                  {latestPrediction?.severity || "N/A"}
                </strong>

              </div>

              <div>

                <span>
                  Risk
                </span>

                <strong>
                  {latestPrediction?.risk_level || "N/A"}
                </strong>

              </div>

            </div>

          </div>

        </div>

        {/* ================= LOWER SECTION ================= */}

        <div className="dashboard-grid bottom-grid">

          {/* ================= CATEGORIES ================= */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Prediction Categories
                </h2>

                <p>
                  Distribution of current predictions
                </p>

              </div>

            </div>

            <div className="category-list">

              <div className="category-item">

                <div>

                  <strong>
                    Normal
                  </strong>

                  <span>
                    {lowRiskCount} predictions
                  </span>

                </div>

                <b>
                  {normalPercentage}%
                </b>

              </div>

              <div className="category-item">

                <div>

                  <strong>
                    Warning
                  </strong>

                  <span>
                    {warningCount} predictions
                  </span>

                </div>

                <b>
                  {warningPercentage}%
                </b>

              </div>

              <div className="category-item">

                <div>

                  <strong>
                    Critical
                  </strong>

                  <span>
                    {criticalCount} predictions
                  </span>

                </div>

                <b>
                  {criticalPercentage}%
                </b>

              </div>

            </div>

          </div>

          {/* ================= SYSTEM HEALTH ================= */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>

                <h2>
                  System Health
                </h2>

                <p>
                  Current application status
                </p>

              </div>

            </div>

            <div className="system-status">

              <div className="status-row">

                <span>
                  API Server
                </span>

                <strong
                  className={error ? "offline" : "online"}
                >
                  {error ? "● Offline" : "● Online"}
                </strong>

              </div>

              <div className="status-row">

                <span>
                  Prediction API
                </span>

                <strong
                  className={loading ? "" : "online"}
                >
                  {loading
                    ? "● Checking"
                    : "● Connected"}
                </strong>

              </div>

              <div className="status-row">

                <span>
                  AI Engine
                </span>

                <strong className="online">
                  ● Active
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

        </div>

        {/* ================= NEXT ================= */}

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
