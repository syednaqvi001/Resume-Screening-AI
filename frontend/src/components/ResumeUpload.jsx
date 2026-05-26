// Resume Upload Form Component

import { useState } from "react";
import { screenResume } from "../api/client";
import PIIAlert from "./PIIAlert";
import WorkflowStatus from "./WorkflowStatus";
import ResultsPanel from "./ResultsPanel";

export default function ResumeUpload() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [piiAlert, setPIIAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResume(event.target.result);
        setError(null);
        setResults(null);
      };
      reader.readAsText(file);
    }
  };

  const handleTextChange = (e) => {
    setResume(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume.trim()) {
      setError("Please provide a resume");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const result = await screenResume(resume, jobDescription);

    if (result.success) {
      setResults(result);
    } else if (result.error === "PII_DETECTED") {
      setPIIAlert({
        detectedPII: result.detectedPII,
        instruction: result.instruction,
      });
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  if (piiAlert) {
    return (
      <PIIAlert
        detectedPII={piiAlert.detectedPII}
        instruction={piiAlert.instruction}
        onDismiss={() => setPIIAlert(null)}
      />
    );
  }

  if (results) {
    return (
      <ResultsPanel
        results={results}
        onReset={() => {
          setResults(null);
          setResume("");
          setJobDescription("");
        }}
      />
    );
  }

  return (
    <div className="upload-container">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Resume Screening AI</h2>
          <p className="subtitle">
            Upload your resume for AI-powered analysis and interview preparation
          </p>
        </div>

        <div className="form-group">
          <label>Resume Text *</label>
          <textarea
            value={resume}
            onChange={handleTextChange}
            placeholder="Paste your resume here or upload a file..."
            rows="10"
            required
          />
          <small>Min 100 characters • Max 5000 characters</small>
        </div>

        <div className="form-group">
          <label htmlFor="file-upload">Or upload a file:</label>
          <input
            id="file-upload"
            type="file"
            accept=".txt,.pdf"
            onChange={handleFileUpload}
          />
        </div>

        <div className="form-group">
          <label>Job Description (Optional)</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description for better matching..."
            rows="6"
          />
          <small>If not provided, defaults to Senior SDE role</small>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "Analyzing..." : "Screen Resume"}
        </button>
      </form>

      {loading && <WorkflowStatus />}

      <style jsx="true">{`
        .upload-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .form-section {
          text-align: center;
          margin-bottom: 30px;
        }

        .form-section h2 {
          margin: 0 0 10px;
          color: #1976d2;
        }

        .subtitle {
          color: #666;
          margin: 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: monospace;
          font-size: 14px;
          resize: vertical;
        }

        textarea:focus {
          outline: none;
          border-color: #1976d2;
          box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
        }

        input[type="file"] {
          padding: 8px;
        }

        small {
          display: block;
          color: #999;
          margin-top: 4px;
          font-size: 12px;
        }

        .btn-submit {
          width: 100%;
          padding: 12px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-submit:hover:not(:disabled) {
          background: #1565c0;
        }

        .btn-submit:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 12px;
          border-radius: 4px;
          margin: 15px 0;
          border-left: 4px solid #c62828;
        }
      `}</style>
    </div>
  );
}
