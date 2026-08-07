import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173',
    'X-Title': 'PRobe',
  },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function analyzeCode(prData) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: 'openrouter/auto',
        messages: [
          {
            role: 'system',
            content: `You are an expert senior software engineer conducting a thorough code review. Respond ONLY with a valid JSON object — no markdown, no backticks, no extra text.
JSON format:
{
  "summary": "2-3 sentence overall assessment",
  "overallScore": <1-10>,
  "issues": [
    {
      "id": "unique string",
      "severity": "critical|warning|suggestion",
      "category": "bug|security|performance|style|logic|documentation",
      "file": "filename",
      "line": <number or null>,
      "title": "short title",
      "description": "detailed explanation",
      "suggestion": "how to fix"
    }
  ],
  "positives": ["positive 1", "positive 2"],
  "metrics": { "bugCount": 0, "securityCount": 0, "performanceCount": 0, "styleCount": 0 }
}`
          },
          {
            role: 'user',
            content: `Review this Pull Request:
Title: ${prData.title}
Description: ${prData.body || 'No description provided'}
Author: ${prData.user}
Files Changed: ${prData.changedFiles}
Additions: +${prData.additions} | Deletions: -${prData.deletions}
--- DIFF ---
${prData.diff}
--- END DIFF ---
Respond ONLY with the JSON object.`
          }
        ],
        max_tokens: 4096,
        temperature: 0.2,
      });

      const text = response.choices[0].message.content;
      const cleaned = text.replace(/```json|```/g, '').trim();

      try {
        return JSON.parse(cleaned);
      } catch (err) {
        throw new Error('Failed to parse AI response as JSON: ' + text);
      }

    } catch (err) {
      lastError = err;
      if (err.status === 429 && attempt < 3) {
        console.log(`Rate limited, retrying in 30s... (attempt ${attempt}/3)`);
        await sleep(30000);
      } else {
        throw err;
      }
    }
  }

  throw lastError;
}
