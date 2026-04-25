// AdQuant Budget Recommendation Engine
// Formula: Min Budget = (50 clicks ÷ CTR%) × (CPM ÷ 1000)
// Max Budget = Min × 2.5
// ROAS adjustment: if break-even ROAS > 3.5, multiply by 1.3

import { getNicheById } from './benchmarks.js'

export function calcBudgetRecommendation(inputs) {
  const { nicheId, userCpm, breakEvenRoas } = inputs
  const niche = getNicheById(nicheId)

  const effectiveCpm = userCpm > 0 ? Number(userCpm) : niche.avgCpm
  const ctr = niche.avgCtr / 100 // convert percent to decimal
  const targetClicks = 50

  // Min budget = (target clicks / CTR) × (CPM / 1000)
  let minBudget = (targetClicks / ctr) * (effectiveCpm / 1000)

  // ROAS adjustment
  if (breakEvenRoas > 3.5) {
    minBudget *= 1.3
  }

  const maxBudget = minBudget * 2.5

  return {
    min: Math.round(minBudget),
    max: Math.round(maxBudget),
    ctr: niche.avgCtr,
    cvr: niche.avgCvr,
    effectiveCpm,
  }
}
