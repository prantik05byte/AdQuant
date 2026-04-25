import { useState } from 'react'
import { SimForm } from '../components/SimForm.jsx'
import { ScoreCard } from '../components/ScoreCard.jsx'
import { PillarBreakdown } from '../components/PillarBreakdown.jsx'
import { AIExplainer } from '../components/AIExplainer.jsx'
import { MetaAdLibrary } from '../components/MetaAdLibrary.jsx'
import { useSimulation } from '../hooks/useSimulation.js'

export function Simulator({ user }) {
  const { result, loading, runSimulation } = useSimulation(user)
  const [showForm, setShowForm] = useState(true)

  const handleSubmit = async (inputs) => {
    await runSimulation(inputs)
    setShowForm(false)
    setTimeout(() => {
      document.getElementById('results-anchor')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
          Instagram Ad Risk Simulator
        </h1>
        <p className="text-gray-400">
          Fill in your product details below to get your risk score across all 5 pillars.
          {!user && <span className="text-brand-400"> Sign in to save your results.</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Form column */}
        <div>
          {!showForm && result && (
            <button
              className="mb-4 text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1"
              onClick={() => setShowForm(true)}
            >
              ← Edit inputs
            </button>
          )}
          {(showForm || !result) && (
            <SimForm onSubmit={handleSubmit} loading={loading} />
          )}
        </div>

        {/* Results column */}
        <div id="results-anchor" className="space-y-4 lg:sticky lg:top-20">
          {!result && !loading && (
            <div className="card border-dashed border-gray-700 text-center py-16">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-gray-500 text-sm">Fill in your product details and run the simulation to see your risk score here.</p>
            </div>
          )}

          {loading && (
            <div className="card text-center py-16">
              <svg className="animate-spin h-8 w-8 text-brand-400 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              <p className="text-gray-400">Calculating your risk score…</p>
            </div>
          )}

          {result && !loading && (
            <>
              <ScoreCard result={result} />
              <PillarBreakdown pillars={result.pillars} />
              <AIExplainer result={result} />
              <MetaAdLibrary nicheId={result.inputs.nicheId} niche={result.niche} />

              {!user && (
                <div className="card bg-brand-900/20 border-brand-800 text-center py-5">
                  <p className="text-sm text-gray-300 mb-3">Sign in to save this simulation and track changes over time.</p>
                  <button
                    onClick={() => {/* set page handled in parent */}}
                    className="btn-primary text-sm px-5 py-2"
                  >
                    Save Results →
                  </button>
                </div>
              )}

              <div className="card text-center py-4">
                <button
                  className="btn-secondary text-sm px-5 py-2"
                  onClick={() => { setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                >
                  ↩ Run Another Simulation
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
