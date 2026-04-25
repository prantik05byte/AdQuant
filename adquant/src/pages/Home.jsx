export function Home({ setPage }) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/20 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-900/50 border border-brand-700 text-brand-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
            Phase 1 — Instagram USA
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 leading-tight">
            Know Your Ad Risk<br />
            <span className="text-brand-400">Before You Spend</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
            AdQuant scores your Instagram campaign across 5 risk pillars — margins, CPM pressure, saturation, friction, and brand trust — and tells you exactly if you're ready to launch.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setPage('simulator')} className="btn-primary text-base px-8 py-3">
              🚀 Run Free Simulation
            </button>
            <button onClick={() => setPage('auth')} className="btn-secondary text-base px-8 py-3">
              Sign In to Save Results
            </button>
          </div>
        </div>
      </section>

      {/* 5 pillars overview */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">The 5-Pillar Risk Formula</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: '💰', label: 'Margin Strength', weight: '30%', desc: 'Net profit margin & break-even ROAS' },
              { icon: '📊', label: 'CPM Pressure',    weight: '20%', desc: 'Ad cost vs niche benchmarks' },
              { icon: '🏆', label: 'Market Saturation', weight: '20%', desc: 'Competition & creative type' },
              { icon: '🚀', label: 'Conv. Friction',  weight: '20%', desc: 'Shipping, trust & differentiation' },
              { icon: '⭐', label: 'Brand Trust',     weight: '10%', desc: 'Domain, followers & social proof' },
            ].map(p => (
              <div key={p.label} className="card text-center hover:border-brand-700 transition-colors">
                <div className="text-3xl mb-2">{p.icon}</div>
                <div className="text-xs text-brand-400 font-bold mb-1">{p.weight}</div>
                <div className="text-sm font-bold text-white mb-1">{p.label}</div>
                <div className="text-xs text-gray-500">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk categories */}
      <section className="py-12 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Risk Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '🟢', label: 'LOW',      score: '0–30',   prob: '< 25%',  action: 'Launch with confidence' },
              { emoji: '🟡', label: 'MODERATE', score: '31–55',  prob: '25–50%', action: 'Test with small budget' },
              { emoji: '🟠', label: 'HIGH',     score: '56–75',  prob: '50–75%', action: 'Fix issues first' },
              { emoji: '🔴', label: 'CRITICAL', score: '76–100', prob: '> 75%',  action: 'Do not launch' },
            ].map(r => (
              <div key={r.label} className="card text-center">
                <div className="text-2xl mb-1">{r.emoji}</div>
                <div className="text-sm font-black text-white mb-1">{r.label}</div>
                <div className="text-xs text-gray-500 mb-2">Score {r.score}</div>
                <div className="text-xs text-gray-400 font-medium">{r.prob} failure</div>
                <div className="text-xs text-gray-600 mt-1">{r.action}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-4">Ready to check your risk?</h2>
          <p className="text-gray-400 mb-6">Free simulation. No credit card required.</p>
          <button onClick={() => setPage('simulator')} className="btn-primary text-base px-10 py-4">
            Start Free Simulation →
          </button>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="border-t border-gray-800 py-6 px-4 text-center">
        <p className="text-xs text-gray-600 max-w-xl mx-auto">
          AdQuant provides probabilistic estimates based on historical benchmarks. Actual ad performance may vary. This is not financial advice. © 2026 AdQuant. CONFIDENTIAL.
        </p>
      </footer>
    </div>
  )
}
