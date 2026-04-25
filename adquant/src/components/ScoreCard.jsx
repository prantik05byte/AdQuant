import { useEffect, useState } from 'react'

const categoryColors = {
  LOW:      { ring: 'stroke-green-500',  bg: 'from-green-900/30',  text: 'text-green-400',  badge: 'bg-green-900 text-green-300 border-green-700' },
  MODERATE: { ring: 'stroke-yellow-500', bg: 'from-yellow-900/30', text: 'text-yellow-400', badge: 'bg-yellow-900 text-yellow-300 border-yellow-700' },
  HIGH:     { ring: 'stroke-orange-500', bg: 'from-orange-900/30', text: 'text-orange-400', badge: 'bg-orange-900 text-orange-300 border-orange-700' },
  CRITICAL: { ring: 'stroke-red-500',    bg: 'from-red-900/30',    text: 'text-red-400',    badge: 'bg-red-900 text-red-300 border-red-700' },
}

export function ScoreCard({ result }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { setTimeout(() => setAnimated(true), 100) }, [])

  const { riskScore, category, failureProbability, breakEvenRoas, netProfitMarginPct, budget } = result
  const colors = categoryColors[category.label] || categoryColors.MODERATE

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (riskScore / 100) * circumference

  return (
    <div className={`card bg-gradient-to-b ${colors.bg} to-gray-900 animate-fade-in`}>
      <div className="flex flex-col items-center mb-6">
        {/* Circular score gauge */}
        <div className="relative w-40 h-40 mb-4">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#1f2937" strokeWidth="10" />
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={animated ? offset : circumference}
              className={`${colors.ring} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-white">{riskScore}</span>
            <span className="text-xs text-gray-400 font-medium">/ 100</span>
          </div>
        </div>

        <div className={`px-4 py-1.5 rounded-full border text-sm font-bold mb-1 ${colors.badge}`}>
          {category.emoji} {category.label} RISK
        </div>
        <p className="text-gray-400 text-sm text-center">{category.tagline}</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <MetricBox label="Failure Probability" value={failureProbability} color={colors.text} />
        <MetricBox label="Break-Even ROAS" value={breakEvenRoas >= 999 ? 'Unviable' : `${breakEvenRoas}×`} color={breakEvenRoas > 4 ? 'text-red-400' : breakEvenRoas > 3 ? 'text-yellow-400' : 'text-green-400'} />
        <MetricBox label="Net Profit Margin" value={`${netProfitMarginPct}%`} color={netProfitMarginPct < 10 ? 'text-red-400' : netProfitMarginPct < 20 ? 'text-yellow-400' : 'text-green-400'} />
        <MetricBox label="Test Budget Range" value={`$${budget.min} – $${budget.max}`} color="text-blue-400" />
      </div>

      {/* Action */}
      <div className={`rounded-xl p-4 border ${colors.badge}`}>
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">Recommended Action</p>
        <p className="text-sm font-medium">{category.action}</p>
      </div>
    </div>
  )
}

function MetricBox({ label, value, color }) {
  return (
    <div className="bg-gray-800/60 rounded-xl p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  )
}
