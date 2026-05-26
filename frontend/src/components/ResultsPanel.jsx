// Results Panel Component
// Displays the complete screening results

export default function ResultsPanel({ results, onReset }) {
  const { workflow, summary } = results;
  const { step1_extraction, decision, step2_generation } = workflow;
  const isMatched = decision.matched;

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Screening Results</h2>
        <button onClick={onReset} className="btn-reset">
          Screen Another Resume
        </button>
      </div>

      {/* Match Score Banner */}
      <div className={`match-banner ${isMatched ? "matched" : "not-matched"}`}>
        <div className="score-display">
          <span className="score">{summary.candidate_match_score}%</span>
          <span className="label">Match Score</span>
        </div>
        <div className="status-info">
          <p className="status">{isMatched ? "✅ Strong Candidate" : "❌ Does Not Meet Requirements"}</p>
          <p className="threshold">
            Threshold: {decision.threshold}% • Path: {decision.path}
          </p>
        </div>
      </div>

      {/* Step 1: Extraction Results */}
      <div className="result-section">
        <h3>📊 Extracted Information (Step 1)</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>Skills</h4>
            <div className="tags">
              {step1_extraction.skills.map((skill, idx) => (
                <span key={idx} className="tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="info-card">
            <h4>Experience</h4>
            <p className="metric">{step1_extraction.experience_years} years</p>
          </div>

          <div className="info-card">
            <h4>Key Strengths</h4>
            <ul className="list">
              {step1_extraction.strengths.map((strength, idx) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="info-card">
            <h4>Missing Skills</h4>
            <div className="tags gap-red">
              {step1_extraction.missing_skills.map((skill, idx) => (
                <span key={idx} className="tag red">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="reason">{step1_extraction.match_reasons}</p>
      </div>

      {/* Step 2: Conditional Output */}
      <div className="result-section">
        {isMatched ? (
          <>
            <h3>🎯 Interview Questions (Step 2 - Matched Path)</h3>
            <div className="questions-list">
              {step2_generation.questions.map((question, idx) => (
                <div key={idx} className="question-item">
                  <span className="q-number">Q{idx + 1}</span>
                  <p>{question}</p>
                </div>
              ))}
            </div>
            <p className="difficulty">Difficulty Level: {step2_generation.difficulty}</p>
          </>
        ) : (
          <>
            <h3>📝 Improvement Path (Step 2 - Not Matched)</h3>
            <div className="rejection-content">
              <p className="rejection-reason">
                <strong>Why Not Matched:</strong> {step2_generation.rejection_reason}
              </p>
              <div className="suggestions">
                <h4>Improvement Suggestions:</h4>
                <ol>
                  {step2_generation.improvement_suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ol>
              </div>
              <p className="reapply">
                <strong>Time to Reapply:</strong> {step2_generation.time_to_reapply}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Step 3: Summary */}
      <div className="result-section">
        <h3>📋 Recruiter Summary (Step 3)</h3>
        <div className="summary-box">
          <p>{summary.executive_summary}</p>
        </div>
        <div className="summary-meta">
          <p>
            <strong>Recommendation:</strong>{" "}
            <span className={`rec-badge ${summary.recommendation.toLowerCase()}`}>
              {summary.recommendation.replace(/_/g, " ")}
            </span>
          </p>
          <div className="next-steps">
            <h4>Next Steps:</h4>
            <ol>
              {summary.next_steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <style jsx>{`
        .results-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .results-header h2 {
          margin: 0;
          color: #1976d2;
        }

        .btn-reset {
          padding: 10px 20px;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-reset:hover {
          background: #45a049;
        }

        .match-banner {
          display: flex;
          align-items: center;
          gap: 30px;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          color: white;
        }

        .match-banner.matched {
          background: linear-gradient(135deg, #4caf50, #388e3c);
        }

        .match-banner.not-matched {
          background: linear-gradient(135deg, #f44336, #d32f2f);
        }

        .score-display {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .score {
          font-size: 48px;
          font-weight: bold;
        }

        .label {
          font-size: 14px;
          opacity: 0.9;
        }

        .status-info {
          flex: 1;
        }

        .status {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .threshold {
          margin: 5px 0 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .result-section {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .result-section h3 {
          margin-top: 0;
          color: #1976d2;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin: 15px 0;
        }

        .info-card {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 4px;
        }

        .info-card h4 {
          margin-top: 0;
          color: #333;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tags.gap-red {
          gap: 8px;
        }

        .tag {
          background: #2196f3;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
        }

        .tag.red {
          background: #f44336;
        }

        .list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .list li {
          padding: 6px 0;
          color: #555;
        }

        .list li:before {
          content: "✓ ";
          color: #4caf50;
          font-weight: bold;
        }

        .metric {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
          color: #1976d2;
        }

        .reason {
          color: #666;
          font-size: 14px;
          margin-top: 10px;
        }

        .questions-list {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          margin: 15px 0;
        }

        .question-item {
          display: flex;
          gap: 15px;
          padding: 12px;
          margin: 8px 0;
          background: white;
          border-radius: 4px;
          border-left: 4px solid #2196f3;
        }

        .q-number {
          min-width: 40px;
          font-weight: bold;
          color: #2196f3;
        }

        .question-item p {
          margin: 0;
          color: #333;
        }

        .difficulty {
          color: #666;
          font-size: 14px;
          margin-top: 10px;
        }

        .rejection-content {
          background: #fff3cd;
          padding: 15px;
          border-radius: 4px;
          margin: 15px 0;
        }

        .rejection-reason {
          margin-top: 0;
          color: #856404;
        }

        .suggestions {
          background: white;
          padding: 12px;
          border-radius: 4px;
          margin: 12px 0;
        }

        .suggestions h4 {
          margin-top: 0;
          color: #333;
        }

        .suggestions ol {
          margin: 10px 0;
          color: #555;
        }

        .suggestions li {
          margin: 8px 0;
        }

        .reapply {
          color: #856404;
          margin-bottom: 0;
        }

        .summary-box {
          background: #f0f7ff;
          padding: 15px;
          border-radius: 4px;
          border-left: 4px solid #1976d2;
          line-height: 1.6;
          margin: 15px 0;
        }

        .summary-meta {
          margin-top: 15px;
        }

        .rec-badge {
          padding: 6px 12px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 12px;
        }

        .rec-badge.proceed_to_interview {
          background: #c8e6c9;
          color: #2e7d32;
        }

        .rec-badge.request_improvements {
          background: #ffccbc;
          color: #d84315;
        }

        .next-steps {
          background: #f5f5f5;
          padding: 12px;
          border-radius: 4px;
          margin-top: 12px;
        }

        .next-steps h4 {
          margin-top: 0;
        }

        .next-steps ol {
          margin: 10px 0;
          color: #555;
        }
      `}</style>
    </div>
  );
}
