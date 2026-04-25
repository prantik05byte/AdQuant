// AdQuant — Claude AI Risk Analyst Integration

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export const isClaudeConfigured = !!ANTHROPIC_API_KEY

export function buildRiskPrompt(result, inputs, niche) {
  return `You are AdQuant's AI Risk Analyst. A user has run an Instagram ad risk simulation. Analyze the results and explain the risk in plain, actionable English.

PRODUCT DETAILS:
- Niche: ${niche?.label || inputs.nicheId}
- Selling Price: $${inputs.sellingPrice}
- Cost Price: $${inputs.costPrice}
- Shipping Cost: $${inputs.shippingCost || 0}
- Net Profit Margin: ${result.netProfitMarginPct}%
- Break-Even ROAS: ${result.breakEvenRoas}×

RISK SCORE: ${result.riskScore}/100 — ${result.category.label} RISK
Failure Probability: ${result.failureProbability}

PILLAR BREAKDOWN:
1. Margin Strength (30% weight): ${result.pillars.margin.score}/100
2. CPM Pressure (20% weight): ${result.pillars.cpm.score}/100
3. Market Saturation (20% weight): ${result.pillars.saturation.score}/100
4. Conversion Friction (20% weight): ${result.pillars.friction.score}/100
5. Brand Trust (10% weight): ${result.pillars.brand.score}/100

BUDGET RANGE: $${inputs.budgetMin}–$${inputs.budgetMax}

Provide a concise risk analysis in 3 sections:
1. **Why this score** — 2-3 sentences explaining the main risk drivers
2. **Top 3 actions** — specific, numbered steps to reduce the risk score
3. **Launch verdict** — one clear sentence: should they launch, test cautiously, or hold off?

Keep the total response under 200 words. Use plain English, no jargon. Be direct and honest.

IMPORTANT: Always include this disclaimer at the end: "AdQuant provides probabilistic estimates based on historical benchmarks. Actual ad performance may vary. This is not financial advice."`
}

export async function getAIExplanation(result, inputs, niche) {
  if (!isClaudeConfigured) {
    throw new Error('Anthropic API key not configured. Add VITE_ANTHROPIC_API_KEY to your .env file.')
  }

  const prompt = buildRiskPrompt(result, inputs, niche)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text || 'No explanation returned.'
}
