import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'

const categoryColors = {
  LOW:      'text-green-400 bg-green-900/40 border-green-800',
  MODERATE: 'text-yellow-400 bg-yellow-900/40 border-yellow-800',
  HIGH:     'text-orange-400 bg-orange-900/40 border-orange-800',
  CRITICAL: 'text-red-400 bg-red-900/40 border-red-800',
}

export function SimHistory({ user, onReload }) {
  const [sims, setSims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      setLoading(false)
      return
    }
    fetchHistory()
  }, [user])

  const fetchHistory = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) setError(error.message)
    else setSims(data || [])
    setLoading(false)
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="card border-dashed border-gray-700 text-center py-8">
        <p className="text-gray-500 text-sm">Connect Supabase to save and view your simulation history.</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="card border-dashed border-gray-700 text-center py-8">
        <p className="text-gray-500 text-sm">Sign in to save and access your simulation history.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="card text-center py-8">
        <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          Loading history…
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card border-red-800 text-center py-6">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  if (sims.length === 0) {
    return (
      <div className="card border-dashed border-gray-700 text-center py-8">
        <p className="text-2xl mb-2">📭</p>
        <p className="text-gray-500 text-sm">No simulations yet. Run your first one above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {sims.map((sim) => {
        const colors = categoryColors[sim.risk_category] || categoryColors.MODERATE
        const date = new Date(sim.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        return (
          <div key={sim.id} className="card hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-white text-sm">{sim.niche}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colors}`}>
                    {sim.risk_category}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-gray-500 flex-wrap">
                  <span>Score: <strong className="text-gray-300">{sim.risk_score}</strong></span>
                  <span>Margin: <strong className="text-gray-300">{sim.net_profit_margin?.toFixed(1)}%</strong></span>
                  <span>BE ROAS: <strong className="text-gray-300">{sim.break_even_roas >= 999 ? 'Unviable' : `${sim.break_even_roas}×`}</strong></span>
                  <span>Budget: <strong className="text-gray-300">${sim.recommended_budget_min}–${sim.recommended_budget_max}</strong></span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl font-black" style={{ color: sim.risk_score <= 30 ? '#4ade80' : sim.risk_score <= 55 ? '#facc15' : sim.risk_score <= 75 ? '#fb923c' : '#f87171' }}>
                  {sim.risk_score}
                </div>
                <div className="text-xs text-gray-600">{date}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
