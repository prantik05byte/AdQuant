import { useEffect, useState } from 'react'

const PILLARS = [
  { key: 'margin',     label: 'Margin Strength',      weight: '30%', icon: '💰', description: 'Net profit margin & break-even ROAS' },
  { key: 'cpm',        label: 'CPM Pressure',          weight: '20%', icon: '📊', description: 'Ad cost vs niche benchmark + volatility' },
  { key: 'saturation', label: 'Market Saturation',     weight: '20%', icon: '🏆', description: 'Competitor density & creative type' },
  { key: 'friction',   label: 'Conversion Friction',   weight: '20%', icon: '🚀', description: 'Shipping, trust & differentiation' },
  { key: 'brand',      label: 'Brand Trust',           weight: '10%', icon: '⭐', description: 'Domain age, followers & social proof' },
]

function scoreColor(score) {
  if (score <= 30) return { bar: 'bg-green-500',  text: 'text-green-400' }
  if (score <= 55) return { bar: 'bg-yellow-500', text: 'text-yellow-400' }
  if (score <= 75) return { bar: 'bg-orange-500', text: 'text-orange-400' }
  return { bar: 'bg-red-500', text: 'text-red-400' }
}

export function PillarBreakdown({ pillars }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { setTimeout(() => setAnimated(true), 200) }, [])

  return (
    <div className="card animate-fade-in">
      <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
        <span className="text-lg">🧩</span> Risk Pillar Breakdown
      </h3>
      <div className="space-y-4">
        {PILLARS.map(({ key, label, weight, icon, description }) => {
          const data = pillars[key]
          const colors = scoreColor(data.score)
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span>{icon}</span>
                  <span className="text-sm font-semibold text-white">{label}</span>
                  <span className="text-xs text-gray-500 hidden sm:inline">— {description}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-500">{weight}</span>
                  <span className={`text-sm font-bold ${colors.text}`}>{data.score}</span>
                </div>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${colors.bar}`}
                  style={{ width: animated ? `${data.score}%` : '0%' }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-gray-600 mt-4">Lower score = lower risk. Each pillar weighted by importance.</p>
    </div>
  )
}
