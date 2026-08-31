import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard4() {

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  // ================= FETCH REPORTS =================

  const fetchReports = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/reports/",
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

        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();

      setReports(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error("Report fetch error:", err);

      setError(
        "Unable to load reports."
      );

    } finally {

      setLoading(false);

    }
  };


  // ================= INITIAL LOAD =================

  useEffect(() => {

    fetchReports();

  }, []);


  // ================= LOGOUT =================

  const handleLogout = () => {

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href = "/login";

  };


  // ================= GENERATE REPORT =================

  const handleGenerateReport = async () => {

    try {

      setGenerating(true);
      setError("");

      const token =
        localStorage.getItem(
          "access_token"
        );

      if (!token) {

        window.location.href = "/login";
        return;

      }

      const response = await fetch(
        "http://127.0.0.1:8000/reports/",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            report_name:
              "Monthly Performance",

            report_type:
              "Analytics",

            description:
              "AI Analytics Report",
          }),
        }
      );

      if (!response.ok) {

        if (response.status === 401) {

          localStorage.removeItem(
            "access_token"
          );

          localStorage.removeItem(
            "user"
          );

          window.location.href =
            "/login";

          return;
        }

        throw new Error(
          "Failed to generate report"
        );
      }

      // Refresh reports
      await fetchReports();

    } catch (err) {

      console.error(
        "Generate report error:",
        err
      );

      setError(
        "Unable to generate report."
      );

    } finally {

      setGenerating(false);

    }
  };


  // ================= DOWNLOAD REPORT =================

  const handleDownload = async (
    reportId,
    reportName
  ) => {

    try {

      const token =
        localStorage.getItem(
          "access_token"
        );

      if (!token) {

        window.location.href = "/login";
        return;

      }

      const response = await fetch(
        `http://127.0.0.1:8000/reports/${reportId}/download`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {

        if (response.status === 401) {

          localStorage.removeItem(
            "access_token"
          );

          localStorage.removeItem(
            "user"
          );

          window.location.href =
            "/login";

          return;
        }

        throw new Error(
          "Failed to download report"
        );
      }

      // Get PDF as Blob
      const blob =
        await response.blob();

      // Create temporary URL
      const url =
        window.URL.createObjectURL(
          blob
        );

      // Create temporary link
      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `${reportName.replace(
          /\s+/g,
          "_"
        )}.pdf`;

      document.body.appendChild(
        link
      );

      link.click();

      // Cleanup
      link.remove();

      window.URL.revokeObjectURL(
        url
      );

      // Refresh download count
      await fetchReports();

    } catch (err) {

      console.error(
        "Download error:",
        err
      );

      setError(
        "Unable to download report."
      );

    }
  };


  // ================= DELETE REPORT =================

  const handleDeleteReport = async (reportId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmed) {
      return;
    }

    try {

      setError("");

      const token =
        localStorage.getItem(
          "access_token"
        );

      if (!token) {

        window.location.href = "/login";
        return;

      }

      const response = await fetch(
        `http://127.0.0.1:8000/reports/${reportId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {

        if (response.status === 401) {

          localStorage.removeItem(
            "access_token"
          );

          localStorage.removeItem(
            "user"
          );

          window.location.href =
            "/login";

          return;
        }

        throw new Error(
          "Failed to delete report"
        );
      }

      // Refresh reports after deletion
      await fetchReports();

    } catch (err) {

      console.error(
        "Delete report error:",
        err
      );

      setError(
        "Unable to delete report."
      );

    }
  };


  // ================= STATISTICS =================

  const totalReports =
    reports.length;

  const completedReports =
    reports.filter(
      (report) =>
        report.status ===
        "completed"
    ).length;

  const pendingReports =
    reports.filter(
      (report) =>
        report.status !==
        "completed"
    ).length;

  const totalDownloads =
    reports.reduce(
      (sum, report) =>
        sum +
        Number(
          report.downloads || 0
        ),
      0
    );


  const completionRate =
    totalReports > 0
      ? (
          (completedReports /
            totalReports) *
          100
        ).toFixed(1)
      : "0.0";


  // ================= DATE + TIME FORMAT =================
  const formatDateTime = (date) => {

  if (!date) return "-";

  let dateString = String(date);

  // Old database records may not contain timezone information.
  // Treat them as UTC.
  if (
    !dateString.endsWith("Z") &&
    !/[+-]\d{2}:\d{2}$/.test(dateString)
  ) {
    dateString += "Z";
  }

  const d = new Date(dateString);

  if (isNaN(d.getTime())) {
    return "-";
  }

  return d.toLocaleString(
    "en-IN",
    {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
  };


  return (
    <div className="dashboard4-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="dashboard4-sidebar">

        <div className="dashboard4-logo">

          <div className="dashboard4-logo-icon">
            P
          </div>

          <div>

            <h2>
              PredictOpsAI
            </h2>

            <span>
              AI Operations
            </span>

          </div>

        </div>


        <nav className="dashboard4-nav">

          <Link
            to="/dashboard1"
            className="dashboard4-nav-item"
          >
            <span>⌂</span>
            Overview
          </Link>


          <Link
            to="/dashboard2"
            className="dashboard4-nav-item"
          >
            <span>▣</span>
            Analytics
          </Link>


          <Link
            to="/dashboard3"
            className="dashboard4-nav-item"
          >
            <span>✦</span>
            Predictions
          </Link>


          <Link
            to="/dashboard4"
            className="dashboard4-nav-item active"
          >
            <span>▤</span>
            Reports
          </Link>

        </nav>


        <div className="dashboard4-sidebar-bottom">

          <button
            onClick={handleLogout}
            className="dashboard4-logout"
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="dashboard4-main">


        {/* ================= TOPBAR ================= */}

        <header className="dashboard4-topbar">

          <div>

            <h1>
              Reports
            </h1>

            <p>
              View and manage your
              PredictOpsAI reports
            </p>

          </div>


          <div className="dashboard4-profile">

            <button className="dashboard4-notification">
              🔔
            </button>

            <div className="dashboard4-avatar">

              {JSON.parse(
                localStorage.getItem(
                  "user"
                ) || "{}"
              )?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}

            </div>


            <div className="dashboard4-profile-info">

              <strong>

                {JSON.parse(
                  localStorage.getItem(
                    "user"
                  ) || "{}"
                )?.name || "User"}

              </strong>

              <span>

                {JSON.parse(
                  localStorage.getItem(
                    "user"
                  ) || "{}"
                )?.email || ""}

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


        {/* ================= SUMMARY ================= */}

        <section className="reports4-summary">


          {/* TOTAL */}

          <div className="report4-stat">

            <div className="report4-icon">
              ▤
            </div>

            <div>

              <span>
                Total Reports
              </span>

              <h2>
                {loading
                  ? "..."
                  : totalReports}
              </h2>

              <small>
                Generated reports
              </small>

            </div>

          </div>


          {/* COMPLETED */}

          <div className="report4-stat">

            <div className="report4-icon">
              ✓
            </div>

            <div>

              <span>
                Completed
              </span>

              <h2>
                {loading
                  ? "..."
                  : completedReports}
              </h2>

              <small className="report4-positive">
                {completionRate}%
                completed
              </small>

            </div>

          </div>


          {/* PENDING */}

          <div className="report4-stat">

            <div className="report4-icon">
              ◷
            </div>

            <div>

              <span>
                Pending
              </span>

              <h2>
                {loading
                  ? "..."
                  : pendingReports}
              </h2>

              <small>
                Needs attention
              </small>

            </div>

          </div>


          {/* DOWNLOADS */}

          <div className="report4-stat">

            <div className="report4-icon">
              ↓
            </div>

            <div>

              <span>
                Downloads
              </span>

              <h2>
                {loading
                  ? "..."
                  : totalDownloads}
              </h2>

              <small className="report4-positive">
                Total downloads
              </small>

            </div>

          </div>

        </section>


        {/* ================= REPORT PANEL ================= */}

        <section className="reports4-panel">


          <div className="reports4-panel-header">

            <div>

              <h2>
                Recent Reports
              </h2>

              <p>
                Your latest generated AI
                reports
              </p>

            </div>


            <button
              className="generate4-button"
              onClick={
                handleGenerateReport
              }
              disabled={generating}
            >

              {generating
                ? "Generating..."
                : "+ Generate Report"}

            </button>

          </div>


          {/* ================= TABLE ================= */}

          <div className="reports4-table">


            <div className="report4-row report4-heading">

              <span>
                Report Name
              </span>

              <span>
                Type
              </span>

              <span>
                Date & Time
              </span>

              <span>
                Status
              </span>

              <span>
                Action
              </span>

            </div>


            {/* LOADING */}

            {loading && (

              <div className="report4-row">

                <span>
                  Loading reports...
                </span>

              </div>

            )}


            {/* REPORTS */}

            {!loading &&
              reports.map(
                (report) => (

                  <div
                    className="report4-row"
                    key={report.id}
                  >


                    <div className="report4-name">

                      <div className="report4-file-icon">
                        PDF
                      </div>


                      <div>

                        <strong>
                          {report.report_name}
                        </strong>

                        <small>
                          {report.description}
                        </small>

                      </div>

                    </div>


                    <span>
                      {report.report_type}
                    </span>


                    <span>
                      {formatDateTime(
                        report.created_at
                      )}
                    </span>


                    <span
                      className={`report4-status ${
                        report.status ===
                        "completed"
                          ? "completed"
                          : "pending"
                      }`}
                    >

                      {report.status ===
                      "completed"
                        ? "Completed"
                        : "Processing"}

                    </span>


                    {/* ================= ACTIONS ================= */}

                    <div className="report4-actions">

                      {report.status ===
                      "completed" ? (

                        <button
                          className="download4-button"
                          onClick={() =>
                            handleDownload(
                              report.id,
                              report.report_name
                            )
                          }
                        >
                          ↓ Download
                        </button>

                      ) : (

                        <button
                          className="download4-button disabled"
                          disabled
                        >
                          Processing
                        </button>

                      )}


                      <button
                        className="delete4-button"
                        onClick={() =>
                          handleDeleteReport(
                            report.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                )
              )}


            {/* EMPTY */}

            {!loading &&
              reports.length === 0 && (

                <div className="report4-row">

                  <span>
                    No reports found.
                  </span>

                </div>

              )}

          </div>

        </section>


        {/* ================= INSIGHTS ================= */}

        <section className="reports4-bottom">


          <div className="reports4-insight">

            <div className="reports4-insight-icon">
              ✦
            </div>

            <div>

              <h3>
                AI Report Insights
              </h3>

              <p>

                {totalReports > 0
                  ? `Your system has generated ${totalReports} report${
                      totalReports !== 1
                        ? "s"
                        : ""
                    } so far.`
                  : "Generate your first report to see AI insights."}

              </p>

            </div>

          </div>


          <div className="reports4-insight">

            <div className="reports4-insight-icon">
              ✓
            </div>

            <div>

              <h3>
                System Status
              </h3>

              <p>
                Reporting services are
                running normally and ready
                to generate new reports.
              </p>

            </div>

          </div>

        </section>


        {/* ================= NAVIGATION ================= */}

        <div className="dashboard4-navigation">

          <Link
            to="/dashboard3"
            className="dashboard4-button"
          >
            ← Dashboard 3
          </Link>


          <button
            onClick={handleLogout}
            className="dashboard4-button logout4-button"
          >
            Logout
          </button>

        </div>

      </main>

    </div>
  );
}

export default Dashboard4;

