# Gemini AI Integration Guide

Complete guide to integrating Google Gemini AI for document generation and analysis in CareerForge.

## 🔑 Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new project or select existing
4. Copy the API key
5. Add to `.env`:

```bash
GEMINI_API_KEY=your_api_key_here
```

## 📊 Feature Overview

### AI-Powered Features

| Feature | Credits | Model | Response Time |
|---------|---------|-------|---------------|
| Generate Resume | 2 | Gemini Pro | ~8-12s |
| Tailor Resume | 2 | Gemini Pro | ~10-15s |
| Improve Resume | 1 | Gemini Pro | ~5-8s |
| Generate SOP | 2 | Gemini Pro | ~10-15s |
| Cover Letter | 1 | Gemini Pro | ~5-8s |
| LinkedIn Bio | 1 | Gemini Flash | ~3-5s |
| Interview Prep | 1 | Gemini Pro | ~8-12s |
| Communication Analysis | 1 | Gemini Flash | ~4-6s |
| ATS Analysis | Free | Gemini Flash | ~3-5s |
| Extract Keywords | Free | Gemini Flash | ~2-3s |

## 🎯 Prompt Engineering Strategy

All prompts are stored in `/src/services/ai/prompts.ts` following these principles:

### 1. Clear Role Definition
Every prompt starts with: "You are an expert [role]..."

### 2. Structured Output
All prompts specify JSON output format with exact schema

### 3. Context Injection
User data is injected into prompts using template literals

### 4. Examples & Guidelines
Prompts include specific instructions and quality criteria

### Example Prompt Structure:

```typescript
RESUME_GENERATE: (data) => `
You are an expert resume writer with 15+ years of experience.

USER INFORMATION:
- Name: ${data.name}
- Target Role: ${data.targetRole}
...

INSTRUCTIONS:
1. Create professional resume
2. Use action verbs
3. Include metrics
4. Optimize for ATS

OUTPUT FORMAT (JSON):
{
  "personalInfo": {...},
  "summary": "...",
  ...
}

Return ONLY valid JSON, no markdown.
`
```

## 💰 Cost Optimization

### Model Selection Strategy

- **Gemini Pro** (expensive): Complex generation tasks
  - Resume generation
  - SOP creation
  - Detailed analysis

- **Gemini Flash** (cheap): Quick tasks
  - Keyword extraction
  - ATS scoring
  - LinkedIn bios

### Cost Estimates (per 1K tokens)

- **Gemini Pro**: $0.00025 input, $0.0005 output
- **Gemini Flash**: $0.00005 input, $0.0001 output

### Typical API Costs per Feature

```
Generate Resume: ~$0.015-0.025
Tailor Resume: ~$0.020-0.030
Cover Letter: ~$0.008-0.012
ATS Analysis: ~$0.002-0.004
```

### Monthly Cost Projections

**Free User (10 credits):**
- Average cost: $0.10-0.15/month

**Pro User (200 credits):**
- Average cost: $2.00-3.50/month

**Premium User (unlimited):**
- Cap at ~500 credits/month
- Average cost: $5.00-8.00/month

### Cost Control Measures

1. **Credit System** - Hard limits per plan
2. **Caching** - Cache ATS scores for 24 hours
3. **Model Tiering** - Use Flash for simple tasks
4. **Rate Limiting** - 30 AI requests/minute per user
5. **Monitoring** - Track cost per user daily

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ├─► POST /api/ai/generate-resume
       │
┌──────▼──────┐
│ AI Routes   │
└──────┬──────┘
       │
┌──────▼──────┐
│AI Controller│  ← Check credits
└──────┬──────┘
       │
┌──────▼──────┐
│ AI Service  │  ← Load prompt template
└──────┬──────┘
       │
┌──────▼──────┐
│Gemini Config│  ← Make API call
└──────┬──────┘
       │
┌──────▼──────┐
│Google Gemini│
│     API     │
└──────┬──────┘
       │
       ├─► Parse JSON response
       ├─► Deduct credits
       └─► Return to client
```

## 🔧 Implementation Details

### Service Layer (`aiService.ts`)

```typescript
export const generateResume = async (input, userId) => {
  // 1. Build prompt from template
  const prompt = PROMPTS.RESUME_GENERATE(input);
  
  // 2. Call Gemini with structured output
  const result = await generateStructuredContent(prompt, MODELS.PRO);
  
  // 3. Log credit usage
  await logCreditUsage(userId, 'resume_generate', 2);
  
  return result;
};
```

### Error Handling

```typescript
try {
  const result = await aiService.generateResume(input, userId);
  return result;
} catch (error) {
  if (error.message.includes('quota')) {
    // API quota exceeded
    throw new ApiError(429, 'AI service temporarily unavailable');
  }
  throw new ApiError(500, 'AI generation failed');
}
```

### Credit Checking

```typescript
// Before any paid operation
const hasCredits = await aiService.checkCredits(userId, requiredCredits);
if (!hasCredits) {
  throw new ApiError(403, 'Insufficient AI credits');
}
```

## 📈 Monitoring & Analytics

### Track These Metrics

1. **API Success Rate** - % of successful AI calls
2. **Average Response Time** - By feature
3. **Cost Per User** - Daily/monthly breakdown
4. **Credit Usage** - By plan tier
5. **Error Rates** - By error type

### Logging

```typescript
// Log all AI operations
await prisma.creditUsage.create({
  data: {
    userId,
    action: 'resume_generate',
    credits: 2,
    metadata: { tokens, cost, duration }
  }
});
```

## 🚨 Error Scenarios

### 1. Invalid API Key
```bash
Error: GEMINI_API_KEY not found in environment variables
Solution: Add API key to .env file
```

### 2. Rate Limit Exceeded
```json
{
  "success": false,
  "message": "Too many AI requests. Please try again in 60 seconds."
}
```

### 3. Insufficient Credits
```json
{
  "success": false,
  "message": "Insufficient AI credits",
  "required": 2,
  "available": 0
}
```

### 4. Malformed Response
```typescript
// Gemini returns non-JSON
try {
  return JSON.parse(cleanedText);
} catch (error) {
  throw new Error('Invalid AI response format');
}
```

## 🧪 Testing AI Features

### Manual Testing

```bash
# 1. Generate resume
curl -X POST http://localhost:5000/api/ai/generate-resume \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "targetRole": "Software Engineer"
  }'

# 2. Check credits
curl http://localhost:5000/api/ai/credits \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Testing Checklist

- [ ] API key configured correctly
- [ ] Credits deducted properly
- [ ] JSON parsing works
- [ ] Error handling works
- [ ] Rate limiting active
- [ ] Response times acceptable

## 🎓 Best Practices

1. **Always validate input** before calling AI
2. **Check credits first** to avoid wasted API calls
3. **Cache common queries** (e.g., keyword extraction)
4. **Use Flash for simple tasks** to save costs
5. **Monitor costs daily** to catch issues early
6. **Set hard limits** on credits per user per day
7. **Implement retry logic** for transient failures
8. **Log all AI operations** for debugging

## 🔄 Upgrade Path

### Current: Gemini Only

```typescript
const result = await generateContent(prompt, MODELS.PRO);
```

### Future: Multi-Provider

```typescript
// Try Gemini first, fallback to Claude
try {
  return await geminiService.generate(prompt);
} catch {
  return await claudeService.generate(prompt);
}
```

## 📚 Resources

- [Gemini API Docs](https://ai.google.dev/docs)
- [Prompt Engineering Guide](https://ai.google.dev/docs/prompt_best_practices)
- [Pricing Calculator](https://ai.google.dev/pricing)
- [API Limits](https://ai.google.dev/docs/rate_limits)

---

**Need Help?** Check `/docs/API.md` for endpoint documentation or `/src/services/ai/prompts.ts` for prompt examples.
