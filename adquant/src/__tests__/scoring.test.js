import { describe, it, expect } from 'vitest'
import {
  calcMarginScore,
  calcBreakEvenRoas,
  calcNetProfitMargin,
  calcCpmScore,
  calcSaturationScore,
  calcFrictionScore,
  calcBrandTrustScore,
  computeRiskScore,
  getRiskCategory,
} from '../engine/scoring.js'

// ─── Test 1: Perfect product — low risk ──────────────────────────────────────
describe('Test 1 — Perfect product (low risk)', () => {
  it('should score < 30 and be LOW category', () => {
    const result = computeRiskScore({
      nicheId: 'pets',
      sellingPrice: 50,
      costPrice: 10,
      shippingCost: 5,
      processingFeesPct: 2.9,
      refundRatePct: 2,
      userCpm: 0,
      competitorDensity: 'low',
      adCreativeType: 'ugc',
      shippingDays: 5,
      websiteTrust: 'excellent',
      productDifferentiation: 'unique',
      domainAgeYears: 6,
      instagramFollowers: 15000,
      ugcPresence: 'strong',
      influencerValidation: 'macro',
    })
    expect(result.riskScore).toBeLessThan(30)
    expect(result.category.label).toBe('LOW')
  })
})

// ─── Test 2: Zero margin product ─────────────────────────────────────────────
describe('Test 2 — Zero margin product', () => {
  it('should score > 85 and be CRITICAL', () => {
    const result = computeRiskScore({
      nicheId: 'fashion',
      sellingPrice: 30,
      costPrice: 30,
      shippingCost: 0,
      processingFeesPct: 0,
      refundRatePct: 0,
      userCpm: 0,
      competitorDensity: 'medium',
      adCreativeType: 'static',
      shippingDays: 7,
      websiteTrust: 'average',
      productDifferentiation: 'low',
      domainAgeYears: 1,
      instagramFollowers: 500,
      ugcPresence: 'none',
      influencerValidation: 'none',
    })
    expect(result.riskScore).toBeGreaterThan(85)
    expect(result.category.label).toBe('CRITICAL')
  })
})

// ─── Test 3: High CPM, extreme saturation ────────────────────────────────────
describe('Test 3 — Jewelry, extreme saturation', () => {
  it('should score > 70', () => {
    const result = computeRiskScore({
      nicheId: 'jewelry',
      sellingPrice: 80,
      costPrice: 40,
      shippingCost: 5,
      processingFeesPct: 2.9,
      refundRatePct: 5,
      userCpm: 25,
      competitorDensity: 'extreme',
      adCreativeType: 'static',
      shippingDays: 14,
      websiteTrust: 'average',
      productDifferentiation: 'low',
      domainAgeYears: 0.5,
      instagramFollowers: 200,
      ugcPresence: 'none',
      influencerValidation: 'none',
    })
    expect(result.riskScore).toBeGreaterThan(70)
  })
})

// ─── Test 4: Fast shipping, great trust ──────────────────────────────────────
describe('Test 4 — Fast shipping, great trust', () => {
  it('friction score should be < 20', () => {
    const friction = calcFrictionScore(3, 'excellent', 'unique')
    expect(friction).toBeLessThan(20)
  })
})

// ─── Test 5: Slow shipping, poor trust ───────────────────────────────────────
describe('Test 5 — Slow shipping, poor trust', () => {
  it('friction score should be > 55', () => {
    const friction = calcFrictionScore(30, 'poor', 'none')
    expect(friction).toBeGreaterThan(55)
  })
})

// ─── Test 6: Strong brand signals ────────────────────────────────────────────
describe('Test 6 — Strong brand signals', () => {
  it('brand trust score should be < 15', () => {
    const brand = calcBrandTrustScore(6, 15000, 'strong', 'macro')
    expect(brand).toBeLessThan(15)
  })
})

// ─── Test 7: New brand, no proof ─────────────────────────────────────────────
describe('Test 7 — New brand, no proof', () => {
  it('brand trust score should be > 65', () => {
    const brand = calcBrandTrustScore(0.2, 50, 'none', 'none')
    expect(brand).toBeGreaterThan(65)
  })
})

// ─── Test 8: Break-even ROAS calculation ─────────────────────────────────────
describe('Test 8 — ROAS calculation', () => {
  it('$50 product, $25 cost, $5 ship → ROAS ≈ 2.5×', () => {
    // Revenue = 50, Cost = 25+5 = 30, Net = 20, ROAS = 50/20 = 2.5
    const roas = calcBreakEvenRoas(50, 25, 5, 0, 0)
    expect(roas).toBeCloseTo(2.5, 1)
  })
})

// ─── Test 9: Budget engine min calculation ───────────────────────────────────
describe('Test 9 — Budget recommendation (Pet niche)', () => {
  it('budget range should be approximately $210–$530', async () => {
    const { calcBudgetRecommendation } = await import('../engine/budget.js')
    const budget = calcBudgetRecommendation({ nicheId: 'pets', userCpm: 0, breakEvenRoas: 2.1 })
    expect(budget.min).toBeGreaterThan(160)
    expect(budget.min).toBeLessThan(280)
    expect(budget.max).toBeGreaterThan(400)
    expect(budget.max).toBeLessThan(650)
  })
})

// ─── Test 10: Score normalization bounds ─────────────────────────────────────
describe('Test 10 — Score normalization', () => {
  it('risk score should always be between 0 and 100', () => {
    const extremeInputs = [
      { sellingPrice: 1,   costPrice: 100, shippingCost: 50 },
      { sellingPrice: 500, costPrice: 1,   shippingCost: 0  },
    ]
    extremeInputs.forEach(override => {
      const result = computeRiskScore({
        nicheId: 'jewelry',
        processingFeesPct: 2.9,
        refundRatePct: 50,
        userCpm: 50,
        competitorDensity: 'extreme',
        adCreativeType: 'static',
        shippingDays: 60,
        websiteTrust: 'poor',
        productDifferentiation: 'none',
        domainAgeYears: 0,
        instagramFollowers: 0,
        ugcPresence: 'none',
        influencerValidation: 'none',
        ...override,
      })
      expect(result.riskScore).toBeGreaterThanOrEqual(0)
      expect(result.riskScore).toBeLessThanOrEqual(100)
    })
  })
})
