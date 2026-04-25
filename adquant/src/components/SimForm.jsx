import { useState, useEffect } from 'react'
import { NICHES } from '../engine/benchmarks.js'
import { calcNetProfitMargin, calcBreakEvenRoas } from '../engine/scoring.js'

const defaultForm = {
  nicheId: 'fashion',
  sellingPrice: '',
  costPrice: '',
  shippingCost: '',
  processingFeesPct: '2.9',
  refundRatePct: '3',
  userCpm: '',
  competitorDensity: 'medium',
  adCreativeType: 'video',
  shippingDays: '7',
  websiteTrust: 'good',
  productDifferentiation: 'some',
  domainAgeYears: '1',
  instagramFollowers: '500',
  ugcPresence: 'some',
  influencerValidation: 'none',
}

export function SimForm({ onSubmit, loading }) {
  const [form, setForm] = useState(defaultForm)
  const [liveMargin, setLiveMargin] = useState(null)
  const [agreed, setAgreed] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  useEffect(() => {
    const { sellingPrice, costPrice, shippingCost, processingFeesPct, refundRatePct } = form
    if (sellingPrice && costPrice) {
      const m = calcNetProfitMargin(sellingPrice, costPrice, shippingCost, processingFeesPct, refundRatePct)
      const r = calcBreakEvenRoas(sellingPrice, costPrice, shippingCost, processingFeesPct, refundRatePct)
      setLiveMargin({ margin: m, roas: r })
    } else {
      setLiveMargin(null)
    }
  }, [form.sellingPrice, form.costPrice, form.shippingCost, form.processingFeesPct, form.refundRatePct])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!agreed) return
    onSubmit({
      ...form,
      sellingPrice: Number(form.sellingPrice),
      costPrice: Number(form.costPrice),
      shippingCost: Number(form.shippingCost) || 0,
      processingFeesPct: Number(form.processingFeesPct),
      refundRatePct: Number(form.refundRatePct),
      userCpm: Number(form.userCpm) || 0,
      shippingDays: Number(form.shippingDays),
      domainAgeYears: Number(form.domainAgeYears),
      instagramFollowers: Number(form.instagramFollowers),
    })
  }

  const selectedNiche = NICHES.find(n => n.id === form.nicheId)

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Section 1: Product & Margins */}
      <div className="card">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="bg-brand-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">1</span>
          Product & Margins
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Product Niche</label>
            <select className="select" value={form.nicheId} onChange={set('nicheId')}>
              {NICHES.map(n => (
                <option key={n.id} value={n.id}>{n.label} — Avg CPM ${n.avgCpm.toFixed(2)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Selling Price ($)</label>
            <input className="input" type="number" min="0.01" step="0.01" required placeholder="e.g. 49.99" value={form.sellingPrice} onChange={set('sellingPrice')} />
          </div>
          <div>
            <label className="label">Product Cost ($)</label>
            <input className="input" type="number" min="0" step="0.01" required placeholder="e.g. 12.00" value={form.costPrice} onChange={set('costPrice')} />
          </div>
          <div>
            <label className="label">Shipping Cost ($)</label>
            <input className="input" type="number" min="0" step="0.01" placeholder="e.g. 4.50" value={form.shippingCost} onChange={set('shippingCost')} />
          </div>
          <div>
            <label className="label">Processing Fees (%)</label>
            <input className="input" type="number" min="0" max="10" step="0.1" placeholder="2.9" value={form.processingFeesPct} onChange={set('processingFeesPct')} />
          </div>
          <div>
            <label className="label">Refund Rate (%)</label>
            <input className="input" type="number" min="0" max="100" step="0.5" placeholder="3" value={form.refundRatePct} onChange={set('refundRatePct')} />
          </div>
          {/* Live margin preview */}
          {liveMargin && (
            <div className={`md:col-span-2 rounded-xl p-4 flex gap-6 text-sm font-medium ${liveMargin.margin < 10 ? 'bg-red-900/30 border border-red-700' : liveMargin.margin < 20 ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-green-900/30 border border-green-700'}`}>
              <div>
                <div className="text-gray-400 text-xs mb-0.5">Net Margin</div>
                <div className={liveMargin.margin < 10 ? 'text-red-400' : liveMargin.margin < 20 ? 'text-yellow-400' : 'text-green-400'}>
                  {liveMargin.margin.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-0.5">Break-Even ROAS</div>
                <div className={liveMargin.roas > 4 ? 'text-red-400' : liveMargin.roas > 3 ? 'text-yellow-400' : 'text-green-400'}>
                  {liveMargin.roas >= 999 ? 'Unviable' : `${liveMargin.roas}×`}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Ad Spend */}
      <div className="card">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="bg-brand-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">2</span>
          Ad Spend & Creative
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Your CPM ($ — leave blank to use niche avg)</label>
            <input className="input" type="number" min="0" step="0.01" placeholder={`Niche avg: $${selectedNiche?.avgCpm.toFixed(2)}`} value={form.userCpm} onChange={set('userCpm')} />
          </div>
          <div>
            <label className="label">Ad Creative Type</label>
            <select className="select" value={form.adCreativeType} onChange={set('adCreativeType')}>
              <option value="ugc">UGC (User Generated Content)</option>
              <option value="video">Video Ad</option>
              <option value="carousel">Carousel</option>
              <option value="static">Static Image</option>
            </select>
          </div>
          <div>
            <label className="label">Competitor Density</label>
            <select className="select" value={form.competitorDensity} onChange={set('competitorDensity')}>
              <option value="low">Low — few competitors</option>
              <option value="medium">Medium — some competition</option>
              <option value="high">High — saturated market</option>
              <option value="extreme">Extreme — very overcrowded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: Conversion Friction */}
      <div className="card">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="bg-brand-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">3</span>
          Conversion Friction
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Shipping Time (days)</label>
            <input className="input" type="number" min="1" max="60" required placeholder="e.g. 7" value={form.shippingDays} onChange={set('shippingDays')} />
          </div>
          <div>
            <label className="label">Website Trust Level</label>
            <select className="select" value={form.websiteTrust} onChange={set('websiteTrust')}>
              <option value="excellent">Excellent — pro store, reviews, trust badges</option>
              <option value="good">Good — clean, functional</option>
              <option value="average">Average — basic store</option>
              <option value="poor">Poor — looks untrustworthy</option>
            </select>
          </div>
          <div>
            <label className="label">Product Differentiation</label>
            <select className="select" value={form.productDifferentiation} onChange={set('productDifferentiation')}>
              <option value="unique">Unique — patent, exclusive</option>
              <option value="some">Some — slight differentiation</option>
              <option value="low">Low — similar to competitors</option>
              <option value="none">None — pure commodity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 4: Brand Trust */}
      <div className="card">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="bg-brand-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">4</span>
          Brand Trust Signals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Domain Age (years)</label>
            <input className="input" type="number" min="0" step="0.5" required placeholder="e.g. 1.5" value={form.domainAgeYears} onChange={set('domainAgeYears')} />
          </div>
          <div>
            <label className="label">Instagram Followers</label>
            <input className="input" type="number" min="0" required placeholder="e.g. 2000" value={form.instagramFollowers} onChange={set('instagramFollowers')} />
          </div>
          <div>
            <label className="label">UGC Content Presence</label>
            <select className="select" value={form.ugcPresence} onChange={set('ugcPresence')}>
              <option value="strong">Strong — lots of customer content</option>
              <option value="some">Some — a few posts/videos</option>
              <option value="none">None — no UGC yet</option>
            </select>
          </div>
          <div>
            <label className="label">Influencer Validation</label>
            <select className="select" value={form.influencerValidation} onChange={set('influencerValidation')}>
              <option value="macro">Macro — 100K+ influencer</option>
              <option value="micro">Micro — 1K–100K influencer</option>
              <option value="none">None — no influencer backing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-3">
          AdQuant provides probabilistic estimates based on historical benchmarks. Actual ad performance may vary. This is not financial advice.
        </p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="mt-0.5 accent-brand-500"
          />
          <span className="text-sm text-gray-400">I understand this is a probabilistic estimate, not a guarantee of ad performance.</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !agreed || !form.sellingPrice || !form.costPrice}
        className="btn-primary w-full text-center text-base"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Calculating Risk Score...
          </span>
        ) : '🚀 Run Risk Simulation'}
      </button>
    </form>
  )
}
