import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { isSupabaseConfigured } from '../lib/supabase.js'
import toast from 'react-hot-toast'

export function Auth({ setPage }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isSupabaseConfigured) {
      toast.error('Supabase is not configured. Add your credentials to .env.local')
      return
    }
    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) throw error
        toast.success('Welcome back!')
        setPage('simulator')
      } else {
        const { error } = await signUp(email, password)
        if (error) throw error
        toast.success('Account created! Check your email to confirm.')
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="bg-brand-600 text-white rounded-xl w-12 h-12 flex items-center justify-center text-lg font-black mx-auto mb-4">AQ</div>
          <h1 className="text-2xl font-black text-white">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {mode === 'signin' ? 'Sign in to access your simulations' : 'Start saving your risk simulations'}
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-4 mb-6 text-sm text-yellow-400">
            ⚠️ Supabase is not configured. Add <code className="bg-gray-800 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-gray-800 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to your <code className="bg-gray-800 px-1 rounded">.env.local</code> file.
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                required
                minLength={6}
                placeholder="Min 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="btn-primary w-full"
            >
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setMode(m => m === 'signin' ? 'signup' : 'signin')}
              className="text-sm text-brand-400 hover:text-brand-300"
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        <button
          onClick={() => setPage('simulator')}
          className="mt-4 w-full text-center text-sm text-gray-600 hover:text-gray-400"
        >
          Continue without signing in →
        </button>
      </div>
    </div>
  )
}
