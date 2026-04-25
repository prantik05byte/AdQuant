import { useState } from 'react'
import { getAIExplanation, isClaudeConfigured } from '../lib/claude.js'

export function AIExplainer({ result }) {
  const [explanation, setExplanation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleExplain = async () => {
    setLoading(true)
    setError(null)
    try {
      const text = await getAIExplanation(result, result.inputs, result.niche)
      setExplanation(text)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isClaudeConfigured) {
    return (
      <div className="card border-dashed border-gray-700 animate-fade-in">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="text-base font-bold text-white mb-1">AI Risk Analyst</h3>
            <p className="text-sm text-gray-500">
              Add your <code className="text-brand-400 bg-gray-800 px-1 rounded">VITE_ANTHROPIC_API_KEY</code> to <code className="text-brand-400 bg-gray-800 px-1 rounded">.env.local</code> to unlock AI-powered risk explanations.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card animate-fade-in">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">🤖</span>
        <div>
          <h3 className="text-base font-bold text-white">AI Risk Analyst</h3>
          <p className="text-sm text-gray-500">Powered by Claude — plain English risk breakdown</p>
        </div>
      </div>

      {!explanation && !loading && (
        <button onClick={handleExplain} className="btn-primary w-full text-sm">
          ✨ Explain My Risk Score
        </button>
      )}

      {loading && (
        <div className="flex items-center gap-3 py-4 text-gray-400">
          <svg className="animate-spin h-5 w-5 text-brand-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          <span className="text-sm">Analyzing your risk score…</span>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-sm text-red-400">
          <strong>Error:</strong> {error}
        </div>
      )}

      {explanation && (
        <div className="animate-fade-in">
          <div className="prose prose-invert prose-sm max-w-none">
            {explanation.split('\n').map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <h4 key={i} className="text-white font-bold mt-3 mb-1">{line.replace(/\*\*/g, '')}</h4>
              }
              if (line.match(/^\d+\./)) {
                return <p key={i} className="text-gray-300 text-sm ml-2 mb-1">{line}</p>
              }
              if (line.trim() === '') return <br key={i} />
              return <p key={i} className="text-gray-300 text-sm mb-1">{line.replace(/\*\*/g, '')}</p>
            })}
          </div>
          <button
            onClick={() => { setExplanation(null) }}
            className="mt-4 text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Re-generate explanation
          </button>
        </div>
      )}
    </div>
  )
}
