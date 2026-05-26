// Main App Component

import ResumeUpload from "./components/ResumeUpload";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🤖 Resume Screening AI</h1>
          <p className="tagline">
            AI-powered resume analysis, interview generation, and recruiter insights
          </p>
        </div>
      </header>

      <main className="app-main">
        <ResumeUpload />
      </main>

      <footer className="app-footer">
        <p>
          Powered by Hugging Face Inference APIs • Llama 3.1 + DeepSeek + OpenHermes •{" "}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            View Source
          </a>
        </p>
      </footer>
    </div>
  );
}
