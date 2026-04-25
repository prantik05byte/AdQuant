'use client';

import { useState, useEffect } from 'react';
import { calculateSimulation, SimulationInput, SimulationResult } from '@/lib/scoring';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, DollarSign, ShieldAlert, Zap, Box, TrendingUp, RefreshCw, AlertTriangle, Cpu } from 'lucide-react';

const DEFAULTS: SimulationInput = {
  productCost: 25,
  sellingPrice: 80,
  shippingCost: 8,
  processingFeePct: 3,
  refundRatePct: 5,
  inputCpm: 20,
  nicheAvgCpm: 18,
  marketVolatilityPenalty: 5,
  marketSaturationLevel: 50,
  deliveryDays: 7,
  websiteTrust: 'good',
  productDiff: 'some',
  domainAgeYears: 2,
  instagramFollowers: 3000,
  ugcPresence: 'some',
  influencerValidation: 'none',
  targetCpa: 25,
  expectedCpc: 1.2,
  nicheMultiplier: 1.1
};

export default function SimulationEngine() {
  const [formData, setFormData] = useState<SimulationInput>(DEFAULTS);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  useEffect(() => {
    // Real-time calculation effect
    const res = calculateSimulation(formData);
    setResult(res);
    setAiReport(null); // Wipe custom report on variable change
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleGenerateReport = async () => {
    if (!result) return;
    setIsSimulating(true);
    setAiReport(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulationResult: result, inputs: formData })
      });
      const data = await res.json();
      setAiReport(data.analysis);
    } catch (e) {
      console.error(e);
      setAiReport("Failed to generate AI report. Network error.");
    } finally {
      setIsSimulating(false);
    }
  };

  const getRiskColor = (category?: string) => {
    switch(category) {
      case 'Low': return 'text-success border-success';
      case 'Medium': return 'text-warning border-warning';
      case 'High': return 'text-danger border-danger';
      case 'Extreme': return 'text-red-700 border-red-700';
      default: return 'text-primary border-primary';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Input Form */}
        <div className="w-full md:w-2/3 glass-panel p-8 rounded-2xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-300">
              Simulation Parameters
            </h2>
            <p className="text-gray-400 mt-2">Adjust the 15 core deterministic variables below.</p>
          </div>

          <form className="space-y-8">
            
            {/* Pillar 1 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2">
                <DollarSign className="text-primary w-5 h-5"/> Margin Strength
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputGroup label="Selling Price ($)" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} />
                <InputGroup label="Product Cost ($)" name="productCost" value={formData.productCost} onChange={handleChange} />
                <InputGroup label="Shipping Cost ($)" name="shippingCost" value={formData.shippingCost} onChange={handleChange} />
                <InputGroup label="Processing Fee (%)" name="processingFeePct" value={formData.processingFeePct} onChange={handleChange} />
                <InputGroup label="Estimated Refunds (%)" name="refundRatePct" value={formData.refundRatePct} onChange={handleChange} />
              </div>
            </div>

            {/* Pillar 2 & 3 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2 mt-8">
                <TrendingUp className="text-warning w-5 h-5"/> Market & CPM Dynamics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputGroup label="Your CPM ($)" name="inputCpm" value={formData.inputCpm} onChange={handleChange} />
                <InputGroup label="Niche Avg CPM ($)" name="nicheAvgCpm" value={formData.nicheAvgCpm} onChange={handleChange} />
                <InputGroup label="Saturation Level (0-100)" name="marketSaturationLevel" value={formData.marketSaturationLevel} onChange={handleChange} />
                <InputGroup label="Target CPA ($)" name="targetCpa" value={formData.targetCpa} onChange={handleChange} />
                <InputGroup label="Expected CPC ($)" name="expectedCpc" value={formData.expectedCpc} onChange={handleChange} />
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2 mt-8">
                <Box className="text-success w-5 h-5"/> Conversion Friction
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputGroup label="Delivery Days" name="deliveryDays" value={formData.deliveryDays} onChange={handleChange} />
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Website Trust</label>
                  <select name="websiteTrust" value={formData.websiteTrust} onChange={handleChange} className="bg-[#0f1115] border border-border rounded-lg p-2.5 text-white focus:ring-2 focus:ring-primary outline-none transition-all">
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="average">Average</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Product Differentiation</label>
                  <select name="productDiff" value={formData.productDiff} onChange={handleChange} className="bg-[#0f1115] border border-border rounded-lg p-2.5 text-white focus:ring-2 focus:ring-primary outline-none transition-all">
                    <option value="unique">Unique</option>
                    <option value="some">Some</option>
                    <option value="low">Low</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2 mt-8">
                <ShieldAlert className="text-indigo-400 w-5 h-5"/> Brand Trust
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputGroup label="Domain Age (Years)" name="domainAgeYears" value={formData.domainAgeYears} onChange={handleChange} />
                <InputGroup label="Instagram Followers" name="instagramFollowers" value={formData.instagramFollowers} onChange={handleChange} />
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">UGC Presence</label>
                  <select name="ugcPresence" value={formData.ugcPresence} onChange={handleChange} className="bg-[#0f1115] border border-border rounded-lg p-2.5 text-white focus:ring-2 focus:ring-primary outline-none transition-all">
                    <option value="strong">Strong</option>
                    <option value="some">Some</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Influencer Validation</label>
                  <select name="influencerValidation" value={formData.influencerValidation} onChange={handleChange} className="bg-[#0f1115] border border-border rounded-lg p-2.5 text-white focus:ring-2 focus:ring-primary outline-none transition-all">
                    <option value="macro">Macro</option>
                    <option value="micro">Micro</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Right Column - Results Dashboard */}
        <div className="w-full md:w-1/3">
          <div className="sticky top-24 space-y-6">
            
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel p-8 rounded-2xl border-t-4 shadow-lg flex flex-col relative overflow-hidden"
                style={{ borderTopColor: result.riskCategory === 'Low' ? 'var(--success)' : result.riskCategory === 'Medium' ? 'var(--warning)' : 'var(--danger)' }}
              >
                {/* Background blur decorative */}
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary opacity-10 rounded-full blur-3xl pointer-events-none"></div>

                <h3 className="text-gray-400 font-medium tracking-wide uppercase text-sm mb-2">Live Analysis</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className={`text-6xl font-black ${getRiskColor(result.riskCategory)}`}>{result.totalRiskScore}</span>
                  <span className="text-gray-500 font-bold">/100</span>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-3 bg-[#0f1115] rounded-xl border border-border">
                    <span className="text-gray-400">Risk Assessment</span>
                    <span className={`font-bold px-3 py-1 rounded-full bg-opacity-10 text-sm ${getRiskColor(result.riskCategory)} bg-[currentColor]`}>
                      {result.riskCategory} Risk
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-[#0f1115] rounded-xl border border-border">
                    <span className="text-gray-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-warning" /> Failure Prob.</span>
                    <span className="font-bold text-white">{result.failureProbabilityPct}%</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-[#0f1115] rounded-xl border border-border">
                    <span className="text-gray-400">Break-even ROAS</span>
                    <span className="font-bold text-white">{result.breakEvenRoas}x</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gradient-to-br from-primary/20 to-indigo-900/40 rounded-xl border border-primary/30">
                    <div>
                      <span className="text-primary-100 text-sm block mb-1">Target Budget</span>
                      <span className="font-black text-2xl text-white">${result.recommendedBudget}</span>
                    </div>
                    <Zap className="w-8 h-8 text-primary/80" />
                  </div>
                </div>

                <AnimatePresence>
                  {aiReport && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-8 p-5 bg-[#0f1115] rounded-xl border border-indigo-500/30 text-sm text-gray-300 leading-relaxed overflow-hidden"
                    >
                      <div className="flex items-center gap-2 mb-3 text-indigo-400 font-semibold border-b border-indigo-500/20 pb-2">
                        <Cpu className="w-4 h-4" /> AI Diagnostics
                      </div>
                      <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: aiReport }} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  onClick={handleGenerateReport}
                  disabled={isSimulating}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                >
                  {isSimulating ? <RefreshCw className="animate-spin w-5 h-5"/> : <Activity className="w-5 h-5"/>}
                  {isSimulating ? 'Connecting to AI...' : 'Generate AI Report'}
                </button>
                <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed bg-[#181b21]">
                  Calculations are deterministic based on provided variables. <br/> "Probability of failure" is an estimate and not guaranteed.
                </p>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component
function InputGroup({ label, name, value, onChange }: { label: string, name: string, value: number, onChange: any }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        step="any"
        required
        className="bg-[#0f1115] border border-border rounded-lg p-2.5 text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-600 font-mono"
      />
    </div>
  );
}
