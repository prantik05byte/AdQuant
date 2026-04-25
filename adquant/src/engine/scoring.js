// AdQuant Risk Scoring Engine — Core IP
// Formula: Risk Score = (0.30 × Margin) + (0.20 × CPM) + (0.20 × Saturation) + (0.20 × Friction) + (0.10 × BrandTrust)

import { getNicheById } from './benchmarks.js'

// ─── Pillar 1: Margin Strength (30%) ────────────────────────────────────────

export function calcMarginScore(netProfitMarginPct) {
  const m = Number(netProfitMarginPct)
  if (m >= 40) return 10
  if (m >= 30) return 25
  if (m >= 20) return 45
  if (m >= 10) return 65
  if (m >= 5)  return 80
  return 95
}

export function calcBreakEvenRoas(sellingPrice, costPrice, shippingCost, processingFeesPct, refundRatePct) {
  const sp = Number(sellingPrice)
  const cp = Number(costPrice)
  const sh = Number(shippingCost) || 0
  const pf = (Number(processingFeesPct) || 0) / 100
  const rr = (Number(refundRatePct) || 0) / 100

  const totalCost = cp + sh + (sp * pf) + (sp * rr)
  const netRevenue = sp - totalCost
  if (netRevenue <= 0) return 999 // unviable
  return parseFloat((sp / netRevenue).toFixed(2))
}

export function calcNetProfitMargin(sellingPrice, costPrice, shippingCost, processingFeesPct, refundRatePct) {
  const sp = Number(sellingPrice)
  const cp = Number(costPrice)
  const sh = Number(shippingCost) || 0
  const pf = (Number(processingFeesPct) || 0) / 100
  const rr = (Number(refundRatePct) || 0) / 100

  const totalCost = cp + sh + (sp * pf) + (sp * rr)
  const margin = ((sp - totalCost) / sp) * 100
  return parseFloat(Math.max(0, margin).toFixed(2))
}

// ─── Pillar 2: CPM Pressure (20%) ───────────────────────────────────────────

export function calcCpmScore(userCpm, nicheId) {
  const niche = getNicheById(nicheId)
  const effectiveCpm = userCpm > 0 ? Number(userCpm) : niche.avgCpm
  const ratio = effectiveCpm / niche.avgCpm
  const volatilityPenalty = niche.volatility * 10

  let baseScore
  if (ratio <= 0.7)       baseScore = 15
  else if (ratio <= 0.9)  baseScore = 30
  else if (ratio <= 1.1)  baseScore = 50
  else if (ratio <= 1.3)  baseScore = 65
  else if (ratio <= 1.6)  baseScore = 80
  else                    baseScore = 92

  return Math.min(100, Math.round(baseScore + volatilityPenalty * 0.5))
}

// ─── Pillar 3: Market Saturation (20%) ──────────────────────────────────────

export function calcSaturationScore(competitorDensity, adCreativeType) {
  const densityScores = { low: 20, medium: 50, high: 75, extreme: 92 }
  const creativeModifiers = {
    ugc:    { low: -15, medium: 0,  high: -10, extreme: -5 },
    video:  { low: -10, medium: -5, high: -5,  extreme: -3 },
    carousel:{ low: -5, medium: -5, high: 0,   extreme: 0  },
    static: { low: 0,  medium: 0,  high: 0,   extreme: 0  },
  }

  const density = competitorDensity || 'medium'
  const creative = adCreativeType || 'static'
  const base = densityScores[density] ?? 50
  const mod = creativeModifiers[creative]?.[density] ?? 0
  return Math.max(0, Math.min(100, Math.round(base + mod)))
}

// ─── Pillar 4: Conversion Friction (20%) ─────────────────────────────────────

export function calcFrictionScore(shippingDays, websiteTrust, productDifferentiation) {
  // Shipping time (weight: 0.5)
  let shippingScore
  const days = Number(shippingDays)
  if (days <= 5)       shippingScore = 5
  else if (days <= 10) shippingScore = 25
  else if (days <= 15) shippingScore = 45
  else if (days <= 21) shippingScore = 65
  else                 shippingScore = 85

  // Website trust (weight: 0.5)
  const trustScores = { excellent: 0, good: 15, average: 35, poor: 60 }
  const trustScore = trustScores[websiteTrust] ?? 35

  // Product differentiation (weight: 0.3)
  const diffScores = { unique: 0, some: 20, low: 45, none: 70 }
  const diffScore = diffScores[productDifferentiation] ?? 20

  const combined = (shippingScore * 0.5) + (trustScore * 0.5) + (diffScore * 0.3)
  return Math.min(100, Math.round(combined / 1.3)) // normalize to 0–100
}

// ─── Pillar 5: Brand Trust (10%) ─────────────────────────────────────────────

export function calcBrandTrustScore(domainAgeYears, instagramFollowers, ugcPresence, influencerValidation) {
  // Domain age
  let domainScore
  const age = Number(domainAgeYears)
  if (age < 1)      domainScore = 70
  else if (age < 2) domainScore = 45
  else if (age < 5) domainScore = 20
  else              domainScore = 5

  // Instagram followers
  let followersScore
  const f = Number(instagramFollowers)
  if (f < 500)       followersScore = 60
  else if (f < 2000)  followersScore = 40
  else if (f < 10000) followersScore = 20
  else                followersScore = 5

  // UGC presence
  const ugcScores = { none: 30, some: 15, strong: 0 }
  const ugcScore = ugcScores[ugcPresence] ?? 15

  // Influencer validation
  const influencerScores = { none: 20, micro: 10, macro: 0 }
  const influencerScore = influencerScores[influencerValidation] ?? 10

  const raw = (domainScore * 0.35) + (followersScore * 0.35) + (ugcScore * 0.15) + (influencerScore * 0.15)
  return Math.min(100, Math.round(raw))
}

// ─── Master Scoring Function ─────────────────────────────────────────────────

export function computeRiskScore(inputs) {
  const {
    nicheId,
    sellingPrice, costPrice, shippingCost, processingFeesPct, refundRatePct,
    userCpm,
    competitorDensity, adCreativeType,
    shippingDays, websiteTrust, productDifferentiation,
    domainAgeYears, instagramFollowers, ugcPresence, influencerValidation,
  } = inputs

  const netProfitMarginPct = calcNetProfitMargin(sellingPrice, costPrice, shippingCost, processingFeesPct, refundRatePct)
  const breakEvenRoas = calcBreakEvenRoas(sellingPrice, costPrice, shippingCost, processingFeesPct, refundRatePct)

  const marginScore = calcMarginScore(netProfitMarginPct)
  const cpmScore = calcCpmScore(userCpm || 0, nicheId)
  const saturationScore = calcSaturationScore(competitorDensity, adCreativeType)
  const frictionScore = calcFrictionScore(shippingDays, websiteTrust, productDifferentiation)
  const brandScore = calcBrandTrustScore(domainAgeYears, instagramFollowers, ugcPresence, influencerValidation)

  const riskScore = Math.round(
    (0.30 * marginScore) +
    (0.20 * cpmScore) +
    (0.20 * saturationScore) +
    (0.20 * frictionScore) +
    (0.10 * brandScore)
  )

  const clampedScore = Math.max(0, Math.min(100, riskScore))
  const category = getRiskCategory(clampedScore)

  return {
    riskScore: clampedScore,
    category,
    failureProbability: category.failureProbability,
    pillars: {
      margin: { score: marginScore, weight: 0.30, contribution: Math.round(0.30 * marginScore) },
      cpm:    { score: cpmScore,    weight: 0.20, contribution: Math.round(0.20 * cpmScore) },
      saturation: { score: saturationScore, weight: 0.20, contribution: Math.round(0.20 * saturationScore) },
      friction: { score: frictionScore, weight: 0.20, contribution: Math.round(0.20 * frictionScore) },
      brand:  { score: brandScore,  weight: 0.10, contribution: Math.round(0.10 * brandScore) },
    },
    netProfitMarginPct,
    breakEvenRoas,
  }
}

export function getRiskCategory(score) {
  if (score <= 30) return {
    label: 'LOW',
    color: 'green',
    emoji: '🟢',
    failureProbability: '< 25%',
    action: 'Launch with confidence. Optimize creative.',
    tagline: 'Great conditions to launch.',
  }
  if (score <= 55) return {
    label: 'MODERATE',
    color: 'yellow',
    emoji: '🟡',
    failureProbability: '25–50%',
    action: 'Launch with caution. Start with $300–$500 test budget.',
    tagline: 'Viable, but manage risk carefully.',
  }
  if (score <= 75) return {
    label: 'HIGH',
    color: 'orange',
    emoji: '🟠',
    failureProbability: '50–75%',
    action: 'Reduce risk factors before launch. Recalculate.',
    tagline: 'Fix key risk factors before spending.',
  }
  return {
    label: 'CRITICAL',
    color: 'red',
    emoji: '🔴',
    failureProbability: '> 75%',
    action: 'Do not launch. Fix margins or choose a new product.',
    tagline: 'High probability of loss. Do not launch.',
  }
}
