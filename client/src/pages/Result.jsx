import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;

  const listText = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return "None";
    return arr.join(", ");
  };

  const downloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    let y = 20;

    const addText = (text, size = 12, bold = false) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", bold ? "bold" : "normal");

      const lines = doc.splitTextToSize(String(text), 180);

      lines.forEach((line) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }

        doc.text(line, 15, y);
        y += 8;
      });

      y += 3;
    };

    addText("Resume Analysis Report", 20, true);
    addText(`File Name: ${result.fileName || "N/A"}`);
    addText(`Score: ${result.score || "N/A"}/100`, 16, true);
    addText(`Feedback: ${result.feedback || "No feedback available."}`);

    addText("Summary", 15, true);
    addText(`Word Count: ${result.wordCount || 0}`);
    addText(`Found Sections: ${listText(result.foundSections)}`);
    addText(`Missing Sections: ${listText(result.missingSections)}`);
    addText(`Detected Skills: ${listText(result.foundSkills)}`);

    addText("Suggestions", 15, true);

    if (Array.isArray(result.suggestions)) {
      result.suggestions.forEach((item, index) => {
        addText(`${index + 1}. ${item}`);
      });
    } else {
      addText(result.suggestions || "No suggestions available.");
    }

    const fileName = result.fileName
      ? result.fileName.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_")
      : "resume";

    doc.save(`${fileName}_analysis_report.pdf`);
  };

  return (
    <div className="page-bg">
      <div className="result-card">
        <h1 className="page-title">Resume Analysis Result</h1>

        {!result ? (
          <p>No result found. Please upload your resume first.</p>
        ) : (
          <>
            <div className="score-box">
              <h2>Score</h2>
              <p>{result.score || "N/A"}</p>
            </div>

            <div className="result-section">
              <h3>Feedback</h3>
              <p>{result.feedback}</p>
            </div>

            <div className="result-grid">
              <div className="info-box">
                <h3>Word Count</h3>
                <p>{result.wordCount || 0}</p>
              </div>

              <div className="info-box">
                <h3>Sections Found</h3>
                <p>{result.foundSections?.length || 0}</p>
              </div>

              <div className="info-box">
                <h3>Skills Found</h3>
                <p>{result.foundSkills?.length || 0}</p>
              </div>
            </div>

            <div className="result-section">
              <h3>Found Sections</h3>
              <p>
                {result.foundSections?.length
                  ? result.foundSections.join(", ")
                  : "No major sections found"}
              </p>
            </div>

            <div className="result-section">
              <h3>Missing Sections</h3>
              <p>
                {result.missingSections?.length
                  ? result.missingSections.join(", ")
                  : "No important sections missing"}
              </p>
            </div>

            <div className="result-section">
              <h3>Detected Skills</h3>
              <p>
                {result.foundSkills?.length
                  ? result.foundSkills.join(", ")
                  : "No common technical skills detected"}
              </p>
            </div>

            <div className="result-section">
              <h3>Suggestions</h3>
              <ul>
                {result.suggestions?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="action-row">
          {result && (
            <button onClick={downloadPDF} className="primary-btn">
              Download Result
            </button>
          )}

          <button onClick={() => navigate("/upload")} className="primary-btn">
            Upload Another Resume
          </button>

          <button onClick={() => navigate("/dashboard")} className="dark-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;