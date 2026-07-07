import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadResume() {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF or DOCX files are allowed");
      setResume(null);
      return;
    }

    setError("");
    setResume(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!resume) {
      setError("Please select a resume file");
      return;
    }

    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const userId = user?.id || user?._id;

    if (!userId) {
      setError("Please login first");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("userId", userId);

      const res = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Resume upload failed");
      }

      navigate("/result", { state: { result: data } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg">
      <div className="upload-card">
        <h1>Upload Resume</h1>

        <p className="subtitle">Upload your resume in PDF or DOCX format.</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleUpload} className="upload-form">
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="file-input"
          />

          {resume && (
            <p className="selected-file">
              Selected file: <strong>{resume.name}</strong>
            </p>
          )}

          <button
            type="submit"
            className="primary-btn full-btn"
            disabled={loading || !resume}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="dark-btn back-dashboard-btn"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default UploadResume;