# Resume Screening AI 🤖

Production-grade full-stack AI application for automated resume screening, technical interview generation, and recruiter insights using Hugging Face Inference APIs.

## Features

✨ **AI-Powered Resume Analysis**
- Extract skills, experience, strengths using Llama-3.1-8B
- Calculate match score against job requirements
- Identify gaps and missing skills

🎯 **Intelligent Workflow**
- **If match score ≥ 70%**: Generate technical interview questions (DeepSeek-V4-Pro)
- **If match score < 70%**: Generate improvement suggestions (OpenHermes-2.5)
- Generate recruiter summary & recommendations (Llama-3.1-8B)

🔒 **Privacy-First Design**
- Automatic PII detection (email, phone, SSN, address, DOB)
- User alert system with clear warnings
- Complete redaction before LLM processing
- Zero-knowledge architecture (no data storage)

🚀 **Production Ready**
- Full-stack application (React + Express.js)
- Comprehensive error handling
- Security review document
- Test suite (unit + integration)
- Complete documentation

## Tech Stack

**Backend:**
- Node.js + Express.js
- Hugging Face Inference APIs
- PII Detection & Redaction

**Frontend:**
- React 18
- Vite
- Responsive UI with Tailwind CSS

**AI Models:**
- `meta-llama/Llama-3.1-8B-Instruct` - Extraction & Summarization
- `deepseek-ai/DeepSeek-V4-Pro` - Interview Generation
- `teknium/OpenHermes-2.5-Mistral-7B` - Rejection Guidance

Working Page:
<img width="1919" height="1133" alt="image" src="https://github.com/user-attachments/assets/322ea7ef-c9fd-4d7a-8e6c-6ad703ace52e" />

<img width="1919" height="1133" alt="image" src="https://github.com/user-attachments/assets/0713289f-1bc0-400c-ab48-6e511cbe7134" />

<img width="1919" height="1125" alt="image" src="https://github.com/user-attachments/assets/c27356da-9ff2-4355-8149-e17c82f7637a" />

Screening Result:
<img width="1919" height="1124" alt="image" src="https://github.com/user-attachments/assets/b32d3a3d-2702-4dee-8841-bb5dca092030" />

<img width="1919" height="1124" alt="image" src="https://github.com/user-attachments/assets/7ed09b82-7a4c-489e-b8c2-921c034b1eeb" />



## Quick Start

### Prerequisites
- Node.js >= 16.0.0
- Hugging Face Account (free)
- Git

### Installation

1. **Clone & Setup**
```bash
git clone <your-github-url>
cd resume-screening-ai
```

2. **Backend Setup**
```bash
cd backend

# Copy environment template
cp .env.example .env

# Add your HF token to .env
# HF_TOKEN=hf_xxxxxxxxxxxxx

npm install
npm run dev
```

3. **Frontend Setup (New Terminal)**
```bash
cd frontend
npm install
npm run dev
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Usage

### Via Web UI
1. Open http://localhost:3000
2. Paste your resume (or upload .txt file)
3. (Optional) Provide job description
4. Click "Screen Resume"
5. View results: skills, match score, interview questions/suggestions, recruiter summary

### Via API (cURL)
```bash
curl -X POST http://localhost:5000/api/screen \
  -H "Content-Type: application/json" \
  -d '{
    "resume": "Senior Software Engineer with 8 years...",
    "jobDescription": "Looking for SDE with cloud architecture experience"
  }'
```

### Response Example (Matched)
```json
{
  "success": true,
  "workflow": {
    "step1_extraction": {
      "skills": ["Node.js", "React", "AWS"],
      "experience_years": 8,
      "strengths": ["System Design", "Leadership"],
      "missing_skills": ["ML/AI"],
      "match_score": 82,
      "match_reasons": "Strong full-stack experience..."
    },
    "decision": {
      "match_score": 82,
      "threshold": 70,
      "matched": true,
      "path": "INTERVIEW"
    },
    "step2_generation": {
      "questions": [
        "Design a real-time chat system with 1M users...",
        "Explain SQL vs NoSQL trade-offs...",
        // ... 5 total questions
      ],
      "difficulty": "advanced"
    },
    "step3_summary": {
      "summary": "Candidate demonstrates strong full-stack capabilities...",
      "recommendation": "PROCEED_TO_INTERVIEW",
      "next_steps": [
        "Schedule technical assessment",
        "Review portfolio projects",
        "Prepare system design questions"
      ]
    }
  },
  "summary": {
    "candidate_match_score": 82,
    "recommendation": "PROCEED_TO_INTERVIEW",
    "executive_summary": "...",
    "next_steps": [...]
  }
}
```

## Project Structure

```
resume-screening-ai/
├── backend/
│   ├── config/hf-models.js          # Model configuration
│   ├── middleware/                  # PII, validation, errors
│   ├── services/                    # LLM & workflow logic
│   ├── routes/api/screen.js         # API endpoint
│   ├── utils/                       # Prompts, PII patterns
│   ├── server.js                    # Express app
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── api/client.js           # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── tests/
│   ├── unit/                        # Unit tests
│   ├── integration/                 # Integration tests
│   └── fixtures/                    # Sample resumes
│
├── docs/
│   ├── ARCHITECTURE.md              # Detailed architecture
│   ├── SETUP.md                     # Installation guide
│   ├── SECURITY_REVIEW.md           # Security analysis
│   ├── API.md                       # API documentation
│   └── PROMPT_TEMPLATES.md          # LLM prompts
│
└── README.md
```

## Documentation

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design, data flow, error handling
- **[SETUP.md](docs/SETUP.md)** - Installation, configuration, troubleshooting
- **[SECURITY_REVIEW.md](docs/SECURITY_REVIEW.md)** - PII protection, vulnerabilities, mitigations
- **[API.md](docs/API.md)** - API endpoints and response formats

## AI Workflow

```
┌─────────────────┐
│ Resume Upload   │
└────────┬────────┘
         ↓
┌─────────────────┐
│ PII Detection   │ → Alert user if found
└────────┬────────┘
         ↓
┌─────────────────────────────────────────┐
│ LLM Call 1: Extract                     │
│ → skills, experience, strengths,        │
│   missing_skills, match_score           │
└────────┬────────────────────────────────┘
         ↓
    ┌────┴─────┐
    ↓          ↓
MATCHED    NOT MATCHED
(>= 70%)    (< 70%)
    │          │
    ↓          ↓
┌──────────┐  ┌────────────┐
│ LLM Call │  │ LLM Call 2 │
│ 2A:      │  │ 2B:        │
│Interview │  │Improvement │
│Questions │  │Suggestions │
└────┬─────┘  └─────┬──────┘
     │              │
     └──────┬───────┘
            ↓
   ┌──────────────────┐
   │ LLM Call 3:      │
   │ Recruiter Summary│
   └────────┬─────────┘
            ↓
    ┌──────────────────┐
    │ Display Results  │
    └──────────────────┘
```

## Testing

### Run Tests
```bash
cd backend
npm test                    # All tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
```

### Test Coverage
- ✅ PII detection unit tests
- ✅ Workflow logic unit tests
- ✅ Input validation tests
- ✅ Sample resumes (strong & weak candidates)

### Manual Testing
Use sample resumes in `tests/fixtures/sample-resumes/`:
- `resume-strong.txt` - 8 years experience (should match ~80%)
- `resume-weak.txt` - 1 year experience (should match ~30%)

## Security Features

🔐 **PII Protection**
- Automatic detection of emails, phones, SSN, addresses, DOB
- User-friendly alert system
- Complete redaction before LLM API calls
- Verification of successful redaction

🔒 **Data Privacy**
- Stateless backend (no storage)
- No resume caching
- No third-party tracking
- GDPR-compliant design

🛡️ **Input Validation**
- Length constraints (100-5000 chars)
- Type validation
- Prompt injection prevention
- Strict JSON output validation

📋 **Security Review**: See [SECURITY_REVIEW.md](docs/SECURITY_REVIEW.md)

## API Endpoints

### POST /api/screen
Screens a resume and returns AI analysis.

**Request:**
```json
{
  "resume": "Senior Software Engineer with...",
  "jobDescription": "Optional job description"
}
```

**Response:** See [API.md](docs/API.md)

**Error Responses:**
- `400 Bad Request` - Invalid input or PII detected
- `500 Internal Server Error` - LLM processing failed

## Environment Variables

```env
# Hugging Face Token (required)
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS (frontend origin)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

Get your HF token: https://huggingface.co/settings/tokens

## Performance

- **Resume Processing**: 10-30 seconds (3 LLM calls)
- **API Response Time**: ~20 seconds average
- **Scalability**: Stateless backend, auto-scales with instances

## Deployment

### To GitHub
```bash
git add .
git commit -m "Initial commit: Resume Screening AI"
git push origin main
```

### To Production
- **Backend**: Deploy Express.js app (Vercel, Render, AWS)
- **Frontend**: Build and deploy (Vercel, Netlify, S3)
- **Requirements**:
  - Node.js 16+
  - HF_TOKEN environment variable
  - HTTPS enabled
  - API authentication (recommended)

See [SETUP.md](docs/SETUP.md) for detailed deployment guide.

## Future Enhancements

- [ ] OpenRouter integration for model failover
- [ ] Alternate model routing for comparison
- [ ] Response comparison across models
- [ ] Database storage with resume history
- [ ] Admin dashboard for analytics
- [ ] Custom prompt templates
- [ ] Bulk resume screening
- [ ] Integration with ATS systems

## Contribution

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Push and create a pull request

## License

MIT License - see LICENSE file

## Support

For issues, questions, or suggestions:
1. Check [SETUP.md](docs/SETUP.md) troubleshooting section
2. Review [ARCHITECTURE.md](docs/ARCHITECTURE.md) for design details
3. Open an GitHub issue
4. Check Hugging Face status: https://huggingface.co/status

## Acknowledgments

- Hugging Face for Inference APIs
- Meta Llama for instruction-tuned models
- DeepSeek and OpenHermes communities

---

**Built with ❤️ using AI-assisted development**

⭐ If you find this useful, please star the repository!
