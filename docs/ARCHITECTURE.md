# Resume Screening AI - Architecture & Workflow

## Overview

Production-grade full-stack AI application using Hugging Face Inference APIs for resume screening, technical interview generation, and recruiter summaries.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Resume Upload Form                                 │   │
│  │ • PII Alert & Confirmation System                    │   │
│  │ • Real-time Validation                               │   │
│  │ • Results Display (JSON + Interview Q's + Summary)   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/CORS
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ LAYER 1: INPUT VALIDATION                            │   │
│  │ • Validate resume format & length                    │   │
│  │ • Check job description (optional)                   │   │
│  │                                                      │   │
│  │ LAYER 2: PII PROTECTION (CRITICAL)                   │   │
│  │ • Detect PII (email, phone, name, SSN, DOB)         │   │
│  │ • Alert user before processing                       │   │
│  │ • Redact all PII from resume                         │   │
│  │ • Verify redaction success                           │   │
│  │                                                      │   │
│  │ LAYER 3: WORKFLOW ORCHESTRATION                      │   │
│  │ ┌──────────────────────────────────────────────┐    │   │
│  │ │ LLM Call 1: Extract (Llama-3.1-8B)           │    │   │
│  │ │ Input: Redacted resume                       │    │   │
│  │ │ Output: JSON                                 │    │   │
│  │ │   - skills: string[]                         │    │   │
│  │ │   - experience_years: number                 │    │   │
│  │ │   - strengths: string[]                      │    │   │
│  │ │   - missing_skills: string[]                 │    │   │
│  │ │   - match_score: 0-100                       │    │   │
│  │ └──────────────────────────────────────────────┘    │   │
│  │                     ↓                                │   │
│  │ ┌──────────────────────────────────────────────┐    │   │
│  │ │ DECISION: if/else Logic                      │    │   │
│  │ │ IF match_score >= 70% → INTERVIEW_PATH       │    │   │
│  │ │ ELSE → REJECTION_PATH                        │    │   │
│  │ └──────────────────────────────────────────────┘    │   │
│  │                     ↓                                │   │
│  │ ┌──────────────────────────────────────────────┐    │   │
│  │ │ LLM Call 2: Generate Response                │    │   │
│  │ │                                              │    │   │
│  │ │ PATH A (Matched): DeepSeek-V4-Pro            │    │   │
│  │ │   Input: skills, match_reason                │    │   │
│  │ │   Output: Technical interview questions      │    │   │
│  │ │                                              │    │   │
│  │ │ PATH B (Not Matched): OpenHermes-2.5         │    │   │
│  │ │   Input: missing_skills, strengths           │    │   │
│  │ │   Output: Rejection guidance + suggestions   │    │   │
│  │ └──────────────────────────────────────────────┘    │   │
│  │                     ↓                                │   │
│  │ ┌──────────────────────────────────────────────┐    │   │
│  │ │ LLM Call 3: Summary (Llama-3.1-8B)           │    │   │
│  │ │ Input: Candidate profile + path results      │    │   │
│  │ │ Output: Executive recruiter summary          │    │   │
│  │ │   - 100-150 word summary                     │    │   │
│  │ │   - Recommendation (PROCEED / REQUEST_IMPROVE)   │   │
│  │ │   - Next steps                               │    │   │
│  │ └──────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │ LAYER 4: ERROR HANDLING & LOGGING                    │   │
│  │ • Try-catch at each LLM call                         │   │
│  │ • Descriptive error messages                         │   │
│  │ • Step tracking for debugging                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         Hugging Face Inference APIs (via Novita)            │
│  • Real-time inference                                      │
│  • No local model hosting                                   │
│  • Scalable & production-ready                              │
│  • Three optimized models:                                  │
│    - Llama-3.1-8B-Instruct (extraction & summary)            │
│    - DeepSeek-V4-Pro (interview questions)                   │
│    - OpenHermes-2.5-Mistral-7B (rejection guidance)          │
└─────────────────────────────────────────────────────────────┘
```

## Detailed Workflow Flow

### Phase 1: Upload & Validation
```
User Input (Resume Text)
    ↓
validateResumeInput Middleware
├─ Check: resume is string
├─ Check: 100 chars < length < 5000 chars
├─ Check: jobDescription is valid (if provided)
    ↓ ✓ Passes
[Proceed to PII Check]
```

### Phase 2: PII Detection & Protection
```
Resume Text
    ↓
checkPII Middleware
├─ Patterns: email, phone, SSN, DOB, address, etc.
├─ detectPII() returns array of found PII
    ↓ PII Found?
    YES → Return to Frontend
           ↓
           Frontend shows PIIAlert Component
           ├─ Lists detected PII types with samples
           ├─ Provides clear instructions to remove
           ├─ Shows warning: "Will NOT be sent to AI"
           └─ User removes PII & resubmits
           
    NO → Continue to Redaction
           ↓
           applyRedaction Middleware
           ├─ redactPII() replaces all PII with [REDACTED]
           ├─ Verify: redacted text has NO PII
           └─ Proceed to workflow
```

### Phase 3: Resume Screening Workflow (3 LLM Calls)

#### LLM Call 1: Extract & Analyze (Llama-3.1-8B)
```
Input:
  - Resume (PII-redacted)
  - Job Description (default: Senior SDE)

Prompt Template:
  "You are an expert resume analyst.
   Extract from resume: skills, experience_years, 
   strengths (3 key), missing_skills, match_score (0-100).
   Return ONLY JSON (no markdown)."

Output (JSON):
{
  "skills": ["Node.js", "React", "TypeScript", "AWS"],
  "experience_years": 8,
  "strengths": ["System Design", "Team Leadership", "Backend Dev"],
  "missing_skills": ["Machine Learning", "Mobile Dev"],
  "match_score": 82,
  "match_reasons": "Strong full-stack experience..."
}

Error Handling:
├─ JSON parsing fails → Code: INVALID_EXTRACTION
├─ match_score is null → Code: INVALID_EXTRACTION
├─ API timeout → Retry with backoff
└─ Propagate error to client with step=1
```

#### Decision Logic (if/else)
```
IF match_score >= 70:
  ├─ Path: INTERVIEW
  ├─ Action: Generate technical interview questions
  └─ Reasoning: Candidate meets requirements
  
ELSE (score < 70):
  ├─ Path: REJECTION
  ├─ Action: Generate improvement suggestions
  └─ Reasoning: Candidate needs development
```

#### LLM Call 2A: Interview Path (match_score ≥ 70%)
```
Model: DeepSeek-V4-Pro
Input:
  - skills: ["Node.js", "React", "TypeScript", "AWS"]
  - match_reason: "Strong full-stack experience..."

Prompt Template:
  "Generate 5 advanced technical interview questions
   for candidate with these skills: ...
   Return ONLY JSON with 'questions' array."

Output (JSON):
{
  "questions": [
    "Design a real-time chat system with 1M users...",
    "Explain SQL vs NoSQL trade-offs...",
    "How would you optimize this API for latency?",
    "Walk through your most complex project...",
    "Describe your approach to system design..."
  ],
  "difficulty": "advanced"
}
```

#### LLM Call 2B: Rejection Path (match_score < 70%)
```
Model: OpenHermes-2.5-Mistral-7B
Input:
  - missing_skills: ["Cloud Architecture", "DevOps"]
  - strengths: ["Frontend Dev", "JavaScript"]

Prompt Template:
  "Candidate did not meet requirements.
   Missing: Cloud Architecture, DevOps
   But has: Frontend Dev, JavaScript
   Provide constructive feedback and 3 improvement suggestions."

Output (JSON):
{
  "rejection_reason": "Missing critical DevOps experience...",
  "improvement_suggestions": [
    "1. Complete AWS Solutions Architect certification (3 months)",
    "2. Lead one DevOps-focused project (6 months)",
    "3. Study Kubernetes in depth (2 months)"
  ],
  "time_to_reapply": "6-8 months"
}
```

#### LLM Call 3: Executive Summary (Llama-3.1-8B)
```
Input:
  - Candidate profile:
    {
      match_score: 82,
      skills: ["Node.js", ...],
      experience_years: 8
    }
  - Matched: true
  - Details: Interview questions or rejection reasons

Prompt Template:
  "Write 100-150 word recruiter summary for [matched/not-matched]
   candidate. Focus on potential, strengths, next steps.
   No PII. Return ONLY JSON."

Output (JSON):
{
  "summary": "Candidate demonstrates strong full-stack capabilities
             with 8 years of experience. Key strengths include
             system design and team leadership. Recommend
             technical assessment covering advanced topics...",
  "recommendation": "PROCEED_TO_INTERVIEW",
  "next_steps": [
    "Schedule technical assessment (2 hours)",
    "Prepare system design questions from portfolio",
    "Review previous project architecture decisions"
  ]
}
```

### Phase 4: Response Assembly
```
{
  "success": true,
  "workflow": {
    "step1_extraction": { ... },
    "decision": {
      "match_score": 82,
      "threshold": 70,
      "matched": true,
      "path": "INTERVIEW"
    },
    "step2_generation": { ... },
    "step3_summary": { ... }
  },
  "summary": {
    "candidate_match_score": 82,
    "recommendation": "PROCEED_TO_INTERVIEW",
    "executive_summary": "...",
    "next_steps": [...]
  }
}
```

### Phase 5: Frontend Display
```
ResultsPanel Component
├─ Match Banner (82% | ✅ Strong Candidate)
├─ Step 1 Results
│  ├─ Skills (tags)
│  ├─ Experience (8 years)
│  ├─ Strengths (list)
│  └─ Missing Skills (red tags)
├─ Step 2 Results
│  └─ Interview Questions (5 numbered)
├─ Step 3 Results
│  ├─ Executive Summary (paragraph)
│  ├─ Recommendation (badge)
│  └─ Next Steps (ordered list)
└─ [Screen Another Resume] button
```

## Data Flow Diagram

```
Resume Upload Form
        ↓
   validateResumeInput
        ↓
   PII Detection
   ├─ No PII found → Continue
   └─ PII found → Show Alert → User removes PII
        ↓
   redactPII (Replace with [REDACTED])
        ↓
   screenResume() Workflow Engine
        ├─ LLM Call 1: Extract (Llama)
        │  └─ Returns: match_score + metadata
        ├─ Decision: if/else (match_score >= 70)
        ├─ LLM Call 2: Generate (DeepSeek or OpenHermes)
        │  └─ Returns: questions or suggestions
        └─ LLM Call 3: Summary (Llama)
           └─ Returns: executive summary + recommendation
        ↓
   JSON Response
        ↓
   Frontend ResultsPanel
        ├─ Match Banner
        ├─ Extraction Results
        ├─ Conditional Output (Interview or Rejection)
        ├─ Executive Summary
        └─ Next Steps
```

## Error Handling Strategy

```
Error Types:
├─ Input Errors (handled by middleware)
│  ├─ Empty resume → 400 Bad Request
│  ├─ Resume too short → 400 Bad Request
│  ├─ Invalid job description → 400 Bad Request
│  └─ PII detected → 400 Bad Request + Alert
│
├─ Extraction Errors (handled by try-catch in step 1)
│  ├─ LLM API timeout → Retry with exponential backoff
│  ├─ Invalid JSON response → Code: INVALID_EXTRACTION
│  ├─ Missing match_score → Code: INVALID_EXTRACTION
│  └─ Propagate: 500 + error details + step=1
│
├─ Generation Errors (handled by try-catch in step 2)
│  ├─ LLM API timeout → Retry
│  ├─ Invalid JSON → Code: INTERVIEW_GENERATION_FAILED
│  └─ Propagate: 500 + error details + step=2
│
├─ Summary Errors (handled by try-catch in step 3)
│  ├─ LLM API timeout → Retry
│  ├─ Invalid JSON → Code: SUMMARY_GENERATION_FAILED
│  └─ Propagate: 500 + error details + step=3
│
└─ Configuration Errors (handled globally)
   ├─ HF_TOKEN not set → 500 CONFIGURATION_ERROR
   └─ Model not found → 500 INVALID_MODEL
```

## Security Considerations

1. **PII Protection (Primary)**
   - Detect before processing
   - Alert user to verify input
   - Redact before LLM API calls
   - Validate redaction success
   - Never log PII

2. **Prompt Injection Prevention**
   - Use structured output (JSON) format
   - Temperature: Lower (0.3-0.7) for consistency
   - Validate LLM output structure
   - Sanitize output before display

3. **API Security**
   - HF_TOKEN in .env (not hardcoded)
   - CORS configured to trusted origins
   - Input validation on all endpoints
   - Rate limiting (future: implement)
   - HTTPS in production

4. **Data Privacy**
   - No resume storage (stateless)
   - No logging of resume content
   - No logging of PII
   - GDPR-compliant design

## Performance Optimization

- **Model Selection**: Inference APIs handle scaling
- **Caching**: Frontend caches API responses
- **Async Processing**: All LLM calls are async
- **Error Retries**: Exponential backoff on failures
- **Validation**: Early return on input errors

## Scalability

- **Stateless Backend**: Can run multiple instances
- **Load Balancing**: Ready for horizontal scaling
- **API Endpoints**: Use Hugging Face Inference (auto-scaled)
- **Database**: Not required (stateless)
