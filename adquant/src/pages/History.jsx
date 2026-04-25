import { SimHistory } from '../components/SimHistory.jsx'

export function History({ user, setPage }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white mb-1">Simulation History</h1>
        <p className="text-gray-400 text-sm">Your saved risk simulations — most recent first.</p>
      </div>

      {!user ? (
        <div className="card border-dashed border-gray-700 text-center py-16">
          <div className="text-4xl mb-3">🔒</div>
          <p className="text-gray-400 mb-4 text-sm">Sign in to view and save your simulation history.</p>
          <button onClick={() => setPage('auth')} className="btn-primary text-sm px-6 py-2">Sign In</button>
        </div>
      ) : (
        <SimHistory user={user} />
      )}
    </div>
  )
}
