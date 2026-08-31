
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";

function Dashboard3() {
  const [user, setUser] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("Latest");

  // ================= USER =================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid user data");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // ================= FETCH PREDICTIONS =================

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        setLoading(true);
        setError("");

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

        if (Array.isArray(data)) {
          setPredictions(data);
        } else {
          setPredictions([]);
        }
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

  // ================= FILTER =================

  const filteredPredictions = useMemo(() => {
    return predictions;
  }, [predictions, filter]);

  // ================= BASIC STATS =================

  const totalPredictions = filteredPredictions.length;

  const successfulPredictions = filteredPredictions.filter(
    (prediction) =>
      prediction.predicted_status === "low_risk" ||
      prediction.risk_level === "low"
  ).length;

  const successRate =
    totalPredictions > 0
      ? ((successfulPredictions / totalPredictions) * 100).toFixed(1)
      : "0.0";

  // ================= FAILURE PROBABILITY =================

  const averageFailureProbability =
    totalPredictions > 0
      ? filteredPredictions.reduce(
          (sum, prediction) =>
            sum + Number(prediction.failure_probability || 0),
          0
        ) / totalPredictions
      : 0;

  const modelConfidence = Math.max(
    0,
    Math.min(
      100,
      Math.round((1 - averageFailureProbability) * 100)
    )
  );

  // ================= RESPONSE TIME =================

  const averageResponseTime =
    totalPredictions > 0
      ? filteredPredictions.reduce(
          (sum, prediction) =>
            sum + Number(prediction.response_time || 0),
          0
        ) / totalPredictions
      : 0;

  // ================= RISK COUNTS =================

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

  // ================= CHART =================

  const chartPredictions = filteredPredictions.slice(0, 7);

  // ================= MODEL MESSAGE =================

  let predictionMessage = "No Data";
  let predictionDescription =
    "No prediction data is currently available.";

  if (totalPredictions > 0) {
    if (modelConfidence >= 90) {
      predictionMessage = "Excellent Prediction";
      predictionDescription =
        "The AI model is currently showing a strong confidence level.";
    } else if (modelConfidence >= 75) {
      predictionMessage = "Good Prediction";
      predictionDescription =
        "The AI model is performing within a healthy confidence range.";
    } else if (modelConfidence >= 50) {
      predictionMessage = "Moderate Prediction";
      predictionDescription =
        "The AI model is showing moderate confidence based on current data.";
    } else {
      predictionMessage = "High Risk Detected";
      predictionDescription =
        "Current prediction data indicates a higher level of failure risk.";
    }
  }

  return (
    <div className="dashboard3-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="dashboard3-sidebar">

        <div className="dashboard3-logo">

          <div className="dashboard3-logo-icon">
            P
          </div>

          <div>
            <h2>PredictOpsAI</h2>
            <span>AI Operations</span>
          </div>

        </div>

        <nav className="dashboard3-nav">

          <Link
            to="/dashboard1"
            className="dashboard3-nav-item"
          >
            <span>⌂</span>
            Overview
          </Link>

          <Link
            to="/dashboard2"
            className="dashboard3-nav-item"
          >
            <span>▣</span>
            Analytics
          </Link>

          <Link
            to="/dashboard3"
            className="dashboard3-nav-item active"
          >
            <span>✦</span>
            Predictions
          </Link>

          <Link
            to="/dashboard4"
            className="dashboard3-nav-item"
          >
            <span>▤</span>
            Reports
          </Link>

        </nav>

        <div className="dashboard3-sidebar-bottom">

          <button
            onClick={handleLogout}
            className="dashboard3-logout"
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="dashboard3-main">

        {/* ================= TOP BAR ================= */}

        <header className="dashboard3-topbar">

          <div>

            <h1>
              AI Predictions
            </h1>

            <p>
              Smart predictions powered by PredictOpsAI
            </p>

          </div>

          <div className="dashboard3-profile">

            <button className="dashboard3-notification">
              🔔
            </button>

            <div className="dashboard3-avatar">

              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}

            </div>

            <div className="dashboard3-profile-info">

              <strong>
                {user?.name || "User"}
              </strong>

              <span>
                {user?.email || "Administrator"}
              </span>

            </div>

          </div>

        </header>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* ================= FILTER ================= */}

        <div className="prediction3-filter">

          <div>

            <h2>
              Prediction Overview
            </h2>

            <p>
              Live AI prediction data from the backend
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

        {/* ================= PREDICTION OVERVIEW ================= */}

        <section className="prediction3-overview">

          {/* Prediction Score */}

          <div className="prediction3-card main-prediction">

            <div className="prediction3-card-header">

              <div>

                <h2>
                  Prediction Score
                </h2>

                <p>
                  Current AI confidence
                </p>

              </div>

              <span className="prediction3-status">
                ● Active
              </span>

            </div>

            <div className="prediction3-score">

              <div className="prediction3-circle">

                <strong>
                  {loading
                    ? "..."
                    : modelConfidence + "%"}
                </strong>

                <span>
                  Confidence
                </span>

              </div>

            </div>

            <div className="prediction3-message">

              <strong>
                {loading
                  ? "Loading..."
                  : predictionMessage}
              </strong>

              <p>
                {loading
                  ? "Fetching current prediction data."
                  : predictionDescription}
              </p>

            </div>

          </div>

          {/* Model Performance */}

          <div className="prediction3-card">

            <div className="prediction3-card-header">

              <div>

                <h2>
                  Model Performance
                </h2>

                <p>
                  Calculated from current predictions
                </p>

              </div>

            </div>

            <div className="model3-stat">

              <span>
                Confidence
              </span>

              <strong>
                {loading
                  ? "..."
                  : modelConfidence + "%"}
              </strong>

            </div>

            <div className="model3-stat">

              <span>
                Success Rate
              </span>

              <strong>
                {loading
                  ? "..."
                  : successRate + "%"}
              </strong>

            </div>

            <div className="model3-stat">

              <span>
                Low Risk
              </span>

              <strong>
                {loading
                  ? "..."
                  : lowRiskCount}
              </strong>

            </div>

            <div className="model3-stat">

              <span>
                Critical
              </span>

              <strong>
                {loading
                  ? "..."
                  : criticalCount}
              </strong>

            </div>

          </div>

        </section>

        {/* ================= STAT CARDS ================= */}

        <section className="prediction3-grid">

          <div className="prediction3-small-card">

            <div className="prediction3-small-icon">
              ✦
            </div>

            <div>

              <span>
                Total Predictions
              </span>

              <h2>
                {loading
                  ? "..."
                  : totalPredictions}
              </h2>

              <small className="prediction3-positive">
                Live API Data
              </small>

            </div>

          </div>

          <div className="prediction3-small-card">

            <div className="prediction3-small-icon">
              ✓
            </div>

            <div>

              <span>
                Successful
              </span>

              <h2>
                {loading
                  ? "..."
                  : successfulPredictions}
              </h2>

              <small className="prediction3-positive">
                {loading
                  ? "..."
                  : successRate + "% success rate"}
              </small>

            </div>

          </div>

          <div className="prediction3-small-card">

            <div className="prediction3-small-icon">
              ⚡
            </div>

            <div>

              <span>
                Avg. Response
              </span>

              <h2>
                {loading
                  ? "..."
                  : Math.round(averageResponseTime) + "ms"}
              </h2>

              <small className="prediction3-positive">
                From prediction API
              </small>

            </div>

          </div>

          <div className="prediction3-small-card">

            <div className="prediction3-small-icon">
              ◉
            </div>

            <div>

              <span>
                Critical Risk
              </span>

              <h2>
                {loading
                  ? "..."
                  : criticalCount}
              </h2>

              <small>
                {loading
                  ? "..."
                  : warningCount + " warning predictions"}
              </small>

            </div>

          </div>

        </section>

        {/* ================= CHART ================= */}

        <section className="prediction3-panel">

          <div className="prediction3-panel-header">

            <div>

              <h2>
                Prediction Analysis
              </h2>

              <p>
                Failure probability of recent predictions
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

          <div className="prediction3-chart">

            <div className="prediction3-lines">

              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>

            </div>

            <div className="prediction3-bars">

              {chartPredictions.length > 0 ? (

                chartPredictions.map(
                  (prediction, index) => {

                    const probability =
                      Number(
                        prediction.failure_probability || 0
                      ) * 100;

                    return (
                      <div
                        key={prediction.id || index}
                        className="prediction3-bar"
                        style={{
                          height:
                            Math.max(
                              probability,
                              5
                            ) + "%",
                        }}
                        title={
                          "Failure Probability: " +
                          Math.round(probability) +
                          "%"
                        }
                      />
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

            <div className="prediction3-labels">

              {chartPredictions.map(
                (prediction, index) => (
                  <span
                    key={prediction.id || index}
                  >
                    #{index + 1}
                  </span>
                )
              )}

            </div>

          </div>

        </section>

        {/* ================= NAVIGATION ================= */}

        <div className="dashboard3-navigation">

          <Link
            to="/dashboard2"
            className="dashboard3-button"
          >
            ← Dashboard 2
          </Link>

          <Link
            to="/dashboard4"
            className="dashboard3-button"
          >
            Dashboard 4 →
          </Link>

        </div>

      </main>

    </div>
  );
}

export default Dashboard3;

