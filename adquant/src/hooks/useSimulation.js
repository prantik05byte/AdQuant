import { useState } from 'react'
import { computeRiskScore } from '../engine/scoring.js'
import { calcBudgetRecommendation } from '../engine/budget.js'
import { getNicheById } from '../engine/benchmarks.js'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'

export function useSimulation(user) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const runSimulation = async (formInputs) => {
    setLoading(true)
    try {
      const scoreResult = computeRiskScore(formInputs)
      const niche = getNicheById(formInputs.nicheId)
      const budget = calcBudgetRecommendation({
        nicheId: formInputs.nicheId,
        userCpm: formInputs.userCpm,
        breakEvenRoas: scoreResult.breakEvenRoas,
      })

      const fullResult = {
        ...scoreResult,
        budget,
        niche,
        inputs: formInputs,
        timestamp: new Date().toISOString(),
      }

      setResult(fullResult)

      // Save to Supabase if user is logged in
      if (user && isSupabaseConfigured) {
        await supabase.from('simulations').insert({
          user_id: user.id,
          niche: niche.label,
          cost_price: formInputs.costPrice,
          selling_price: formInputs.sellingPrice,
          risk_score: scoreResult.riskScore,
          failure_probability: scoreResult.failureProbability,
          break_even_roas: scoreResult.breakEvenRoas,
          net_profit_margin: scoreResult.netProfitMarginPct,
          recommended_budget_min: budget.min,
          recommended_budget_max: budget.max,
          risk_category: scoreResult.category.label,
          inputs: formInputs,
        })
      }

      return fullResult
    } finally {
      setLoading(false)
    }
  }

  return { result, loading, runSimulation }
}
