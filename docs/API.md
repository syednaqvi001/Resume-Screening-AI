# API Documentation

## Base URL

```
http://localhost:5000
```

## Endpoints

### POST /api/screen

Screens a resume and returns AI-powered analysis with 3 LLM calls.

#### Request

**Method:** POST  
**Content-Type:** application/json

**Body Parameters:**

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `resume` | string | Yes | Resume text content | 100-5000 characters |
| `jobDescription` | string | No | Job description for matching | 50-2000 characters; defaults to "Senior SDE role" |

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/screen \
  -H "Content-Type: application/json" \
  -d '{
    "resume": "Senior Software Engineer with 8 years of experience in Node.js and React. Strong background in system design and team leadership.",
    "jobDescription": "We are looking for a Senior Software Engineer with experience in cloud architecture, microservices, and API design."
  }'
```

#### Response

**Success Response (200 OK):**

```json
{
  "success": true,
  "workflow": {
    "step1_extraction": {
      "skills": ["Node.js", "React", "TypeScript", "AWS"],
      "experience_years": 8,
      "strengths": ["System Design", "Team Leadership", "Backend Development"],
      "missing_skills": ["Machine Learning", "Mobile Development"],
      "match_score": 82,
      "match_reasons": "Strong full-stack experience with relevant cloud and system design skills. Missing specialized ML expertise but not critical for role."
    },
    "decision": {
      "match_score": 82,
      "threshold": 70,
      "matched": true,
      "path": "INTERVIEW"
    },
    "step2_generation": {
      "questions": [
        "Design a real-time chat system that needs to support 1 million concurrent users. How would you handle messaging, user connections, and state management?",
        "Explain the trade-offs between SQL and NoSQL databases. When would you choose each, and how would you migrate between them?",
        "Walk us through your most complex system architecture. What were the key design decisions and trade-offs?",
        "How do you approach API design for scalability and maintainability? What patterns do you follow?",
        "Describe a situation where you led a technical team through a major architectural change. What challenges did you face?"
      ],
      "difficulty": "advanced",
      "_path": "INTERVIEW"
    },
    "step3_summary": {
      "summary": "Candidate demonstrates strong full-stack capabilities with 8 years of experience. Key strengths include system design, team leadership, and backend development. Currently lacks specialized ML experience, but this is not critical for the SDE role. Recommend proceeding to technical assessment. Candidate appears well-suited for senior-level contribution and mentoring.",
      "recommendation": "PROCEED_TO_INTERVIEW",
      "next_steps": [
        "Schedule technical assessment covering system design and API architecture (2 hours)",
        "Prepare questions from candidate's portfolio and past projects",
        "Evaluate leadership style and team collaboration approach"
      ]
    }
  },
  "summary": {
    "candidate_match_score": 82,
    "recommendation": "PROCEED_TO_INTERVIEW",
    "executive_summary": "Candidate demonstrates strong full-stack capabilities with 8 years of experience. Key strengths include system design, team leadership, and backend development. Currently lacks specialized ML experience, but this is not critical for the SDE role. Recommend proceeding to technical assessment. Candidate appears well-suited for senior-level contribution and mentoring.",
    "next_steps": [
      "Schedule technical assessment covering system design and API architecture (2 hours)",
      "Prepare questions from candidate's portfolio and past projects",
      "Evaluate leadership style and team collaboration approach"
    ]
  }
}
```

#### Error Responses

**400 Bad Request - Invalid Input:**
```json
{
  "success": false,
  "error": "INVALID_INPUT",
  "message": "Resume must be at least 100 characters long"
}
```

**400 Bad Request - PII Detected:**
```json
{
  "success": false,
  "error": "PII_DETECTED",
  "message": "Your resume contains personal information that will NOT be sent to the AI model.",
  "detectedPII": [
    {
      "type": "Email Address",
      "count": 1,
      "samples": ["john.doe@example.com"]
    },
    {
      "type": "Phone Number",
      "count": 1,
      "samples": ["(123) 456-7890"]
    }
  ],
  "instruction": "Please remove the following information before proceeding: Email Address, Phone Number",
  "userAction": "Edit your resume text to remove personal details (name, email, phone, address, DOB, etc.) and resubmit."
}
```

**500 Internal Server Error - LLM Failed:**
```json
{
  "success": false,
  "error": "EXTRACTION_FAILED",
  "message": "Resume extraction failed: API timeout after 30 seconds",
  "failed_at_step": 1
}
```

**500 Internal Server Error - Configuration:**
```json
{
  "success": false,
  "error": "CONFIGURATION_ERROR",
  "message": "Hugging Face API token not configured. Contact administrator."
}
```

#### Response Fields

**workflow object:**
| Field | Type | Description |
|-------|------|-------------|
| `step1_extraction` | object | Results from extraction LLM call |
| `decision` | object | Match score evaluation and path selection |
| `step2_generation` | object | Results from conditional LLM call (interview or rejection) |
| `step3_summary` | object | Results from summary LLM call |

**step1_extraction object:**
| Field | Type | Description |
|-------|------|-------------|
| `skills` | string[] | Array of identified technical skills |
| `experience_years` | number | Years of experience extracted |
| `strengths` | string[] | 3 key strengths |
| `missing_skills` | string[] | Skills required but missing |
| `match_score` | number | 0-100 match percentage |
| `match_reasons` | string | Explanation of match assessment |

**decision object:**
| Field | Type | Description |
|-------|------|-------------|
| `match_score` | number | Same as step1 |
| `threshold` | number | Matching threshold (70) |
| `matched` | boolean | Whether score >= threshold |
| `path` | string | "INTERVIEW" or "REJECTION" |

**step2_generation object (INTERVIEW path):**
| Field | Type | Description |
|-------|------|-------------|
| `questions` | string[] | 5 technical interview questions |
| `difficulty` | string | "advanced" |
| `_path` | string | "INTERVIEW" |

**step2_generation object (REJECTION path):**
| Field | Type | Description |
|-------|------|-------------|
| `rejection_reason` | string | Why candidate doesn't match |
| `improvement_suggestions` | string[] | 3 actionable suggestions |
| `time_to_reapply` | string | Estimated time (e.g., "6-8 months") |
| `_path` | string | "REJECTION" |

**step3_summary object:**
| Field | Type | Description |
|-------|------|-------------|
| `summary` | string | 100-150 word executive summary |
| `recommendation` | string | "PROCEED_TO_INTERVIEW" or "REQUEST_IMPROVEMENTS" |
| `next_steps` | string[] | 3 recommended next actions |

---

### GET /health

Health check endpoint.

**Request:**
```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-05-26T10:30:00.000Z"
}
```

---

## Response Examples

### Example 1: Strong Candidate (Match)

**Request:**
```json
{
  "resume": "Senior Software Engineer with 8 years experience in Node.js, React, AWS. Led teams of 5+. Designed microservices handling 1M requests/day.",
  "jobDescription": "Senior SDE role requiring cloud architecture and system design experience"
}
```

**Response:**
```json
{
  "success": true,
  "workflow": {
    "step1_extraction": {
      "skills": ["Node.js", "React", "AWS", "Microservices"],
      "experience_years": 8,
      "strengths": ["System Design", "Leadership", "Scalability"],
      "missing_skills": [],
      "match_score": 88,
      "match_reasons": "Excellent match with all required skills and experience level"
    },
    "decision": {
      "match_score": 88,
      "threshold": 70,
      "matched": true,
      "path": "INTERVIEW"
    },
    "step2_generation": {
      "questions": [
        "Design a distributed payment system...",
        "How do you handle database scaling...",
        "Explain your approach to API versioning...",
        "Walk through a production incident...",
        "Design a real-time notification system..."
      ],
      "difficulty": "advanced"
    },
    "step3_summary": {
      "summary": "Outstanding candidate with strong technical foundation and proven leadership. Excellent fit for the senior SDE role.",
      "recommendation": "PROCEED_TO_INTERVIEW",
      "next_steps": [
        "Schedule technical assessment",
        "Review system design portfolio",
        "Discuss team leadership experiences"
      ]
    }
  },
  "summary": {
    "candidate_match_score": 88,
    "recommendation": "PROCEED_TO_INTERVIEW",
    "executive_summary": "Outstanding candidate...",
    "next_steps": [...]
  }
}
```

### Example 2: Weak Candidate (No Match)

**Request:**
```json
{
  "resume": "Junior Developer with 1 year React experience. Built simple web pages. Fixed CSS bugs."
}
```

**Response:**
```json
{
  "success": true,
  "workflow": {
    "step1_extraction": {
      "skills": ["React", "JavaScript", "CSS"],
      "experience_years": 1,
      "strengths": ["Frontend Development", "Problem Solving"],
      "missing_skills": ["Backend", "System Design", "Cloud Architecture", "Leadership"],
      "match_score": 32,
      "match_reasons": "Candidate has only 1 year experience but role requires 5+ years and senior-level system design skills"
    },
    "decision": {
      "match_score": 32,
      "threshold": 70,
      "matched": false,
      "path": "REJECTION"
    },
    "step2_generation": {
      "rejection_reason": "Experience level (1 year) significantly below requirement (5+ years). Missing critical backend and system design skills.",
      "improvement_suggestions": [
        "Gain 3-4 more years of production experience in a larger team environment",
        "Learn backend development (Node.js, databases, APIs)",
        "Study system design and architectural patterns"
      ],
      "time_to_reapply": "4-5 years"
    },
    "step3_summary": {
      "summary": "Junior developer showing potential but significantly under-qualified for senior role. Recommend revisiting in 4-5 years after gaining substantial backend and leadership experience.",
      "recommendation": "REQUEST_IMPROVEMENTS",
      "next_steps": [
        "Suggest junior or mid-level roles instead",
        "Provide learning resources for growth areas",
        "Consider mentorship opportunities"
      ]
    }
  },
  "summary": {
    "candidate_match_score": 32,
    "recommendation": "REQUEST_IMPROVEMENTS",
    "executive_summary": "Junior developer showing potential...",
    "next_steps": [...]
  }
}
```

### Example 3: PII Detection Alert

**Request:**
```json
{
  "resume": "John Doe, john@example.com, (555) 123-4567, 123-45-6789 Senior Engineer with..."
}
```

**Response:**
```json
{
  "success": false,
  "error": "PII_DETECTED",
  "message": "Your resume contains personal information that will NOT be sent to the AI model.",
  "detectedPII": [
    {
      "type": "Email Address",
      "count": 1,
      "samples": ["john@example.com"]
    },
    {
      "type": "Phone Number",
      "count": 1,
      "samples": ["(555) 123-4567"]
    },
    {
      "type": "Social Security Number",
      "count": 1,
      "samples": ["123-45-6789"]
    }
  ],
  "instruction": "Please remove the following information before proceeding: Email Address, Phone Number, Social Security Number",
  "userAction": "Edit your resume text to remove personal details (name, email, phone, address, DOB, etc.) and resubmit."
}
```

---

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_INPUT` | 400 | Resume format/length invalid |
| `PII_DETECTED` | 400 | Personal information found |
| `EXTRACTION_FAILED` | 500 | LLM extraction step failed |
| `INTERVIEW_GENERATION_FAILED` | 500 | Interview question generation failed |
| `REJECTION_GUIDANCE_FAILED` | 500 | Rejection guidance generation failed |
| `SUMMARY_GENERATION_FAILED` | 500 | Summary generation failed |
| `CONFIGURATION_ERROR` | 500 | API token not configured |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Rate Limiting

Currently not implemented. Will be added before production deployment.

**Recommended limits:**
- 10 requests per 15 minutes per IP
- 100 requests per day per API key

---

## Timeout

- **Default**: 60 seconds per request
- **LLM Processing**: 10-30 seconds typical
- **Max**: 60 seconds (respects HF API limits)

---

## Best Practices

1. **Resume Format**: Plain text works best (no special formatting)
2. **Length**: 500-3000 characters optimal
3. **Job Description**: Include for better matching
4. **PII**: Remove emails, phone numbers before submission
5. **Error Handling**: Implement retry logic with exponential backoff
6. **Caching**: Don't cache API responses with sensitive data

---

## Code Examples

### JavaScript/Node.js
```javascript
const response = await fetch('http://localhost:5000/api/screen', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resume: "Senior Engineer with 8 years...",
    jobDescription: "Optional job description"
  })
});

const data = await response.json();

if (data.success) {
  console.log('Match Score:', data.summary.candidate_match_score);
  console.log('Recommendation:', data.summary.recommendation);
} else if (data.error === 'PII_DETECTED') {
  console.log('Detected PII:', data.detectedPII);
} else {
  console.error('Error:', data.message);
}
```

### Python
```python
import requests

response = requests.post('http://localhost:5000/api/screen', json={
    'resume': 'Senior Engineer with 8 years...',
    'jobDescription': 'Optional job description'
})

data = response.json()

if data['success']:
    print(f"Match Score: {data['summary']['candidate_match_score']}")
else:
    print(f"Error: {data['message']}")
```

### cURL
```bash
curl -X POST http://localhost:5000/api/screen \
  -H "Content-Type: application/json" \
  -d '{
    "resume": "Senior Engineer...",
    "jobDescription": "Senior SDE role"
  }' | jq '.summary'
```

---

## Support

For API issues:
1. Check [SETUP.md](SETUP.md) troubleshooting section
2. Verify HF_TOKEN is set correctly
3. Check backend logs for detailed error messages
4. Ensure resume meets length constraints
