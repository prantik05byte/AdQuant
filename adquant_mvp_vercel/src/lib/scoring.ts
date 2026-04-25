export interface SimulationInput {
  // Pillar 1: Margin
  productCost: number;
  sellingPrice: number;
  shippingCost: number;
  processingFeePct: number;
  refundRatePct: number;

  // Pillar 2: CPM
  inputCpm: number;
  nicheAvgCpm: number;
  marketVolatilityPenalty: number;

  // Pillar 3: Saturation
  marketSaturationLevel: number; // 0 to 100

  // Pillar 4: Conversion Friction
  deliveryDays: number;
  websiteTrust: 'excellent' | 'good' | 'average' | 'poor';
  productDiff: 'unique' | 'some' | 'low' | 'none';

  // Pillar 5: Brand Trust
  domainAgeYears: number;
  instagramFollowers: number;
  ugcPresence: 'none' | 'some' | 'strong';
  influencerValidation: 'none' | 'micro' | 'macro';

  // Budget Calc Specifics
  targetCpa: number;
  expectedCpc: number;
  nicheMultiplier: number;
}

export interface PillarScores {
  marginScore: number;
  cpmScore: number;
  saturationScore: number;
  conversionScore: number;
  brandTrustScore: number;
}

export interface SimulationResult {
  totalRiskScore: number;
  riskCategory: 'Low' | 'Medium' | 'High' | 'Extreme';
  failureProbabilityPct: number;
  breakEvenRoas: number;
  recommendedBudget: number;
  pillars: PillarScores;
}

export function calculateSimulation(input: SimulationInput): SimulationResult {
  // === Pillar 1: Margin Strength (30% weight) ===
  const processingFeesAbs = input.sellingPrice * (input.processingFeePct / 100);
  const refundCostAbs = input.sellingPrice * (input.refundRatePct / 100);
  const totalCost = input.productCost + input.shippingCost + processingFeesAbs + refundCostAbs;
  
  // Break-even ROAS Formula: Revenue / (Revenue - Total Cost)
  // Revenue = Selling Price
  const marginAbs = input.sellingPrice - totalCost;
  // Fallback to 99 to prevent divide by zero if unprofitable
  const breakEvenRoas = marginAbs > 0 ? input.sellingPrice / marginAbs : 99; 

  // Map BE ROAS to 0-100 Risk Score. 
  // Lower BE ROAS = lower risk. 
  // Standard scale: 1.5 is perfect (0), >4.0 is terrible (100)
  let marginRiskScore = 0;
  if (breakEvenRoas > 1.5) {
      marginRiskScore = Math.min(100, Math.max(0, ((breakEvenRoas - 1.5) / 2.5) * 100));
  }
  if (breakEvenRoas >= 99) marginRiskScore = 100;

  // === Pillar 2: CPM Pressure (20% weight) ===
  // CPM Score is calculated by comparing user-input CPM against niche average, then adding a volatility penalty
  // If CPM is lower than avg, score is lower (better). If higher, score is higher.
  let cpmRiskScore = ((input.inputCpm / input.nicheAvgCpm) * 50) + input.marketVolatilityPenalty;
  // Normalize around 100
  cpmRiskScore = Math.min(100, Math.max(0, cpmRiskScore));

  // === Pillar 3: Market Saturation (20% weight) ===
  const saturationRiskScore = Math.min(100, Math.max(0, input.marketSaturationLevel));

  // === Pillar 4: Conversion Friction (20% weight) ===
  let shippingScore = 85;
  if (input.deliveryDays <= 5) shippingScore = 5;
  else if (input.deliveryDays <= 10) shippingScore = 25;
  else if (input.deliveryDays <= 15) shippingScore = 45;
  else if (input.deliveryDays <= 21) shippingScore = 65;

  let trustScore = 60;
  if (input.websiteTrust === 'excellent') trustScore = 0;
  else if (input.websiteTrust === 'good') trustScore = 15;
  else if (input.websiteTrust === 'average') trustScore = 35;

  let diffScore = 70;
  if (input.productDiff === 'unique') diffScore = 0;
  else if (input.productDiff === 'some') diffScore = 20;
  else if (input.productDiff === 'low') diffScore = 45;

  // Combining based on stated weights: Shipping(raw) + Trust(x0.5) + Diff(x0.3)
  const conversionRiskRaw = shippingScore + (trustScore * 0.5) + (diffScore * 0.3);
  // Max possible is 85 + 30 + 21 = 136. Normalize to 100.
  const conversionRiskScore = Math.min(100, (conversionRiskRaw / 136) * 100);

  // === Pillar 5: Brand Trust (10% weight) ===
  let domainScore = 5;
  if (input.domainAgeYears < 1) domainScore = 70;
  else if (input.domainAgeYears <= 2) domainScore = 45;
  else if (input.domainAgeYears <= 5) domainScore = 20;

  let instaScore = 5;
  if (input.instagramFollowers < 500) instaScore = 60;
  else if (input.instagramFollowers <= 2000) instaScore = 40;
  else if (input.instagramFollowers <= 10000) instaScore = 20;

  let ugcScore = 30;
  if (input.ugcPresence === 'strong') ugcScore = 0;
  else if (input.ugcPresence === 'some') ugcScore = 15;

  let influencerScore = 20;
  if (input.influencerValidation === 'macro') influencerScore = 0;
  else if (input.influencerValidation === 'micro') influencerScore = 10;

  const brandRiskRaw = domainScore + instaScore + ugcScore + influencerScore;
  // Max possible sum is 70+60+30+20 = 180. Normalize:
  const brandTrustRiskScore = Math.min(100, (brandRiskRaw / 180) * 100);

  // === Final Formula Computation ===
  const totalRiskScore = 
    (marginRiskScore * 0.30) + 
    (cpmRiskScore * 0.20) + 
    (saturationRiskScore * 0.20) + 
    (conversionRiskScore * 0.20) + 
    (brandTrustRiskScore * 0.10);

  // Map to Categories (matching PRD Failure Probability Mapping concepts)
  let riskCategory: 'Low' | 'Medium' | 'High' | 'Extreme' = 'Low';
  if (totalRiskScore >= 71) riskCategory = 'Extreme';
  else if (totalRiskScore >= 51) riskCategory = 'High';
  else if (totalRiskScore >= 31) riskCategory = 'Medium';

  // Failure Probability Mapping (usually tracks closely to risk score)
  // PRD implies they correlate strongly. We map 0-100 score directly to a scaled probability
  const failureProbabilityPct = Math.min(99, Math.round(totalRiskScore * 1.1));

  // Minimum required volume for statistical validation (Budget Engine)
  // The formula: ((CPA * 50) + (Traffic * CPC)) * Niche Multiplier
  const TrafficBaseline = 500; // Need at least 500 clicks to gauge baseline conversion rate
  const recommendedBudgetRaw = ((input.targetCpa * 50) + (TrafficBaseline * input.expectedCpc)) * input.nicheMultiplier;
  
  // Ensure $50-$5000 output range as strictly defined in PRD
  const finalBudget = Math.max(50, Math.min(5000, Math.round(recommendedBudgetRaw)));

  return {
    totalRiskScore: Math.round(totalRiskScore),
    riskCategory,
    failureProbabilityPct,
    breakEvenRoas: Number(breakEvenRoas.toFixed(2)),
    recommendedBudget: finalBudget,
    pillars: {
        marginScore: Math.round(marginRiskScore),
        cpmScore: Math.round(cpmRiskScore),
        saturationScore: Math.round(saturationRiskScore),
        conversionScore: Math.round(conversionRiskScore),
        brandTrustScore: Math.round(brandTrustRiskScore)
    }
  };
}
