import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [error, setError] = useState("");

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const userId = user?.id || user?._id;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchReports = async () => {
    if (!userId) return;

    setLoadingReports(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/resume/reports/${userId}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch reports");
      }

      setReports(data.reports || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, navigate]);

  const openReport = (report) => {
    navigate("/result", {
      state: {
        result: report,
      },
    });
  };

  return (
    <div className="dashboard">
      <div className="navbar">
        <h2>Resume Analyzer</h2>

        <button onClick={handleLogout} className="danger-btn">
          Logout
        </button>
      </div>

      <section className="hero-section">
        <span className="hero-pill">Resume Analyzer Dashboard</span>

        <h1>Welcome {user?.name || "User"} 👋</h1>

        <p>
          Upload your resume and get instant analysis, improvement suggestions,
          score, downloadable report, and previous analysis history.
        </p>

        <button
          onClick={() => navigate("/upload")}
          className="primary-btn dashboard-upload-btn"
        >
          Upload Resume
        </button>
      </section>

      <section className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>Resume Score</h3>
          <p>Check how strong your resume is with a clear 100-point score.</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">💡</div>
          <h3>Smart Suggestions</h3>
          <p>
            Get improvement tips for skills, sections, achievements, and
            formatting.
          </p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🎯</div>
          <h3>Job Readiness</h3>
          <p>Understand how ready your resume is before applying to jobs.</p>
        </div>
      </section>

      <section className="reports-section">
        <div className="reports-header">
          <h2>Previous Resume Reports</h2>

          <button onClick={fetchReports} className="dark-btn refresh-btn">
            Refresh
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {loadingReports ? (
          <p className="reports-message">Loading reports...</p>
        ) : reports.length === 0 ? (
          <div className="empty-reports">
            <h3>No reports found</h3>
            <p>Upload your first resume to see analysis history here.</p>
          </div>
        ) : (
          <div className="reports-list">
            {reports.map((report) => (
              <div className="report-card" key={report._id}>
                <div>
                  <h3>{report.fileName}</h3>

                  <p>
                    Score: <strong>{report.score}/100</strong>
                  </p>

                  <p>
                    Word Count: <strong>{report.wordCount || 0}</strong>
                  </p>

                  <p>
                    Date:{" "}
                    <strong>
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleDateString()
                        : "N/A"}
                    </strong>
                  </p>
                </div>

                <button
                  onClick={() => openReport(report)}
                  className="primary-btn view-report-btn"
                >
                  View Report
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;