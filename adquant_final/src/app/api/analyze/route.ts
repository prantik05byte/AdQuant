import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { simulationResult, inputs } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Fast-fail local mock response if no API key is set
    if (!apiKey || apiKey === 'mock') {
        const mockResponse = `### AI Actionable Optimization Plan
Based on a **Deterministic Risk Score of ${simulationResult.totalRiskScore}/100**, the mathematical constraints indicate a **${simulationResult.riskCategory} Probability of Failure**.

#### Primary Bottleneck: CPM Pressure
Your input CPM ($${inputs.inputCpm}) is exceeding the average baseline by a threshold that will suppress margin stability. By negotiating creative costs or exploring broader audiences, dropping CPM to $${inputs.nicheAvgCpm} will alleviate ${simulationResult.pillars.cpmScore}% of your risk.

#### Secondary Issue: Margins
Your expected break-even ROAS is ${simulationResult.breakEvenRoas}x. If you cannot reliably attribute at this level, consider increasing your Selling Price to inject padding against the volatility penalty calculated in your market constraints.

*This is a generic placeholder. Setup an Anthropic API Key in your environment to run live Claude analysis.*`;

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        return NextResponse.json({ analysis: mockResponse });
    }

    const anthropic = new Anthropic({ apiKey });

    const prompt = `You are a CTO-level Media Buyer evaluating an Ad Campaign. Read these simulated metrics:
Inputs: ${JSON.stringify(inputs, null, 2)}
Computed Failure Prob: ${simulationResult.failureProbabilityPct}% (Risk: ${simulationResult.riskCategory})
Pillar Breakdown: ${JSON.stringify(simulationResult.pillars, null, 2)}

Provide a concise, 3-paragraph "Actionable Optimization Plan" telling the user exactly what to change in their inputs to survive. Start directly with the analysis. Format with Markdown.`;

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }]
    });

    const output = (msg.content[0] as any).text;
    return NextResponse.json({ analysis: output });
    
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ analysis: "Could not generate AI report. Please try again later." }, { status: 500 });
  }
}
