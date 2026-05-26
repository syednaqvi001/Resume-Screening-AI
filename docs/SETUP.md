# Setup & Installation Guide

## Prerequisites

- Node.js >= 16.0.0
- npm or yarn
- Hugging Face Account (free)
- Git

## Step 1: Clone Repository

```bash
git clone <your-github-url>
cd resume-screening-ai
```

## Step 2: Hugging Face Token Setup

1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Create a new **access token** (type: `read`)
3. Copy the token (starts with `hf_`)

## Step 3: Backend Setup

### Install Dependencies
```bash
cd backend
npm install
```

### Create Environment File
```bash
cp .env.example .env
```

### Configure .env
```env
# Paste your HF token here
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Server port
PORT=5000

# Environment
NODE_ENV=development

# CORS origins (for frontend dev)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Install Additional Dependencies
```bash
npm install
```

### Start Backend
```bash
# Development mode (with hot reload)
npm run dev

# Or production mode
npm start
```

Expected output:
```
🚀 Resume Screening API running on http://localhost:5000
📝 POST http://localhost:5000/api/screen
✅ Health check: http://localhost:5000/health
```

## Step 4: Frontend Setup

### Open New Terminal, Install Dependencies
```bash
cd frontend
npm install
```

### Configure Frontend Environment (Optional)
```bash
cp .env.example .env
```

The frontend uses Vite environment variables (prefixed with `VITE_`):
```env
# Backend API URL (defaults to http://localhost:5000 if not set)
VITE_API_URL=http://localhost:5000
```

**Note**: For local development, you typically don't need to create `.env` - the default is already set to `http://localhost:5000`.

### Start Frontend
```bash
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000
  ➜  press h to show help
```

## Step 5: Test the Application

### Browser
1. Open http://localhost:3000
2. You should see the Resume Screening AI interface

### API Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-05-26T10:30:00.000Z"
}
```

## Step 6: Run Tests

### Backend Unit Tests
```bash
cd backend
npm test
npm run test:unit
npm run test:integration
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Testing with Sample Resume

### Using Frontend
1. Navigate to http://localhost:3000
2. Paste content from `tests/fixtures/sample-resumes/resume-strong.txt`
3. Click "Screen Resume"
4. View results

### Using cURL
```bash
curl -X POST http://localhost:5000/api/screen \
  -H "Content-Type: application/json" \
  -d '{
    "resume": "Senior Software Engineer with 8 years of experience in Node.js and React.",
    "jobDescription": "Looking for Senior SDE with cloud architecture experience"
  }'
```

## Troubleshooting

### Issue: "HF_TOKEN not set"
**Solution**: Check .env file has correct token
```bash
cat backend/.env | grep HF_TOKEN
```

### Issue: CORS Error in Browser
**Solution**: Verify ALLOWED_ORIGINS in .env matches your frontend URL
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Issue: LLM API Returns Invalid JSON
**Solution**: Check backend logs for error details
```bash
# If using nodemon, it should show error in terminal
# Or add DEBUG=* before npm run dev
DEBUG=* npm run dev
```

### Issue: Frontend Can't Connect to Backend
**Solution**: 
1. Verify backend is running on port 5000
2. Check proxy config in `frontend/vite.config.js`
3. Verify CORS is enabled on backend

### Issue: API Timeout (>60 seconds)
**Solution**: First LLM call can take 10-30 seconds
- This is normal for inference APIs
- Verify HF_TOKEN is valid
- Check internet connection
- Try with shorter resume

## Production Deployment

### Backend (Node.js)
```bash
cd backend
NODE_ENV=production npm start
```

### Frontend Build
```bash
cd frontend
npm run build
# Deploy dist/ folder to static hosting (Vercel, Netlify, S3, etc.)
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong HF_TOKEN (never expose in frontend)
- Update ALLOWED_ORIGINS to production domains
- Enable HTTPS

## Project Structure

```
resume-screening-ai/
├── backend/              # Express.js API server
│   ├── config/          # Model configs
│   ├── middleware/      # PII, validation, error handling
│   ├── services/        # LLM & workflow logic
│   ├── routes/          # API endpoints
│   ├── utils/           # Prompts, PII patterns
│   ├── server.js        # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/            # React app
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── api/        # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── tests/              # Test files
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── docs/               # Documentation
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   ├── SECURITY_REVIEW.md
│   ├── API.md
│   └── PROMPT_TEMPLATES.md
│
└── README.md
```

## Next Steps

1. ✅ Backend and frontend running locally
2. Try uploading a resume (use sample-resumes/)
3. Test PII detection by including your email
4. Review results in the UI
5. Check `/docs/SECURITY_REVIEW.md` for security details
6. Push to GitHub when ready
