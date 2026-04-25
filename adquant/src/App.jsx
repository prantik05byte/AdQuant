import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth.js'
import { Navbar } from './components/Navbar.jsx'
import { Home } from './pages/Home.jsx'
import { Simulator } from './pages/Simulator.jsx'
import { History } from './pages/History.jsx'
import { Auth } from './pages/Auth.jsx'

export default function App() {
  const [page, setPage] = useState('home')
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-brand-600 text-white rounded-xl w-10 h-10 flex items-center justify-center text-base font-black">AQ</div>
          <svg className="animate-spin h-5 w-5 text-brand-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' },
          success: { iconTheme: { primary: '#4ade80', secondary: '#1f2937' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#1f2937' } },
        }}
      />

      {page !== 'home' && <Navbar page={page} setPage={setPage} />}

      {page === 'home' && (
        <>
          <Navbar page={page} setPage={setPage} />
          <Home setPage={setPage} />
        </>
      )}
      {page === 'simulator' && <Simulator user={user} setPage={setPage} />}
      {page === 'history'   && <History user={user} setPage={setPage} />}
      {page === 'auth'      && <Auth setPage={setPage} />}
    </div>
  )
}
