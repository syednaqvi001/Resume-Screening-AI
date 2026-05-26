// PII Alert Component
// Warns user about detected personal information

export default function PIIAlert({ detectedPII, instruction, onDismiss }) {
  return (
    <div className="pii-alert">
      <div className="alert-header">
        <span className="alert-icon">⚠️</span>
        <h3>Personal Information Detected</h3>
      </div>

      <div className="alert-content">
        <p className="alert-message">
          Your resume contains personal information that will <strong>NOT</strong> be sent to
          the AI model for privacy and security reasons.
        </p>

        <div className="detected-pii">
          <h4>Detected Information:</h4>
          <ul>
            {detectedPII.map((item, idx) => (
              <li key={idx}>
                <strong>{item.type}</strong> ({item.count} found)
                {item.samples && (
                  <div className="samples">
                    Example: <code>{item.samples[0]}</code>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="instruction">
          <h4>Action Required:</h4>
          <p>{instruction}</p>
        </div>

        <p className="info-text">
          You can safely proceed once you remove the personal details above and resubmit your resume.
        </p>
      </div>

      <button onClick={onDismiss} className="btn-primary">
        OK, I understand
      </button>

      <style jsx>{`
        .pii-alert {
          background: #fff3cd;
          border: 2px solid #ffc107;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .alert-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
        }

        .alert-icon {
          font-size: 24px;
        }

        .alert-header h3 {
          margin: 0;
          color: #856404;
        }

        .alert-content {
          margin: 15px 0;
        }

        .alert-message {
          color: #856404;
          margin: 10px 0;
          line-height: 1.6;
        }

        .detected-pii {
          background: white;
          padding: 12px;
          border-radius: 4px;
          margin: 15px 0;
        }

        .detected-pii h4 {
          margin-top: 0;
          color: #d32f2f;
        }

        .detected-pii ul {
          list-style: none;
          padding: 0;
          margin: 10px 0;
        }

        .detected-pii li {
          padding: 8px;
          background: #f5f5f5;
          margin: 6px 0;
          border-left: 3px solid #d32f2f;
          border-radius: 2px;
        }

        .samples {
          font-size: 12px;
          margin-top: 6px;
          color: #666;
        }

        .samples code {
          background: #f0f0f0;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: monospace;
        }

        .instruction {
          background: #e3f2fd;
          padding: 12px;
          border-radius: 4px;
          margin: 15px 0;
        }

        .instruction h4 {
          margin-top: 0;
          color: #1976d2;
        }

        .instruction p {
          margin: 10px 0;
          color: #0d47a1;
        }

        .info-text {
          font-size: 14px;
          color: #666;
          margin: 15px 0;
        }

        .btn-primary {
          background: #ffc107;
          color: #000;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-primary:hover {
          background: #ffb300;
        }
      `}</style>
    </div>
  );
}
