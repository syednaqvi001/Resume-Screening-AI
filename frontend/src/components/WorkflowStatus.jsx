// Workflow Status Component
// Shows progress of the 3-step AI workflow

export default function WorkflowStatus() {
  return (
    <div className="workflow-status">
      <h3>Processing Resume...</h3>

      <div className="workflow-steps">
        <div className="step active">
          <div className="step-number">1</div>
          <div className="step-content">
            <p className="step-title">Extracting Information</p>
            <p className="step-desc">Analyzing skills, experience, and strengths</p>
          </div>
          <div className="spinner"></div>
        </div>

        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <p className="step-title">Evaluating Match</p>
            <p className="step-desc">Comparing against job requirements</p>
          </div>
        </div>

        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <p className="step-title">Generating Summary</p>
            <p className="step-desc">Creating recruiter insights</p>
          </div>
        </div>
      </div>

      <p className="info">This typically takes 10-30 seconds...</p>

      <style jsx>{`
        .workflow-status {
          background: #e3f2fd;
          border: 2px solid #1976d2;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          text-align: center;
        }

        h3 {
          margin-top: 0;
          color: #1976d2;
        }

        .workflow-steps {
          margin: 20px 0;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px;
          margin: 10px 0;
          border-radius: 4px;
          background: white;
          border-left: 4px solid #ccc;
        }

        .step.active {
          border-left-color: #1976d2;
          background: #f5f5f5;
        }

        .step-number {
          min-width: 40px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #1976d2;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .step:not(.active) .step-number {
          background: #ddd;
          color: #999;
        }

        .step-content {
          flex: 1;
          text-align: left;
        }

        .step-title {
          margin: 0;
          font-weight: 600;
          color: #333;
        }

        .step-desc {
          margin: 4px 0 0;
          color: #666;
          font-size: 14px;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid #1976d2;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .step:not(.active) .spinner {
          display: none;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .info {
          color: #666;
          font-size: 14px;
          margin: 15px 0 0;
        }
      `}</style>
    </div>
  );
}
