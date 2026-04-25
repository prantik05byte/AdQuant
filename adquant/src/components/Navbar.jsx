import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import toast from 'react-hot-toast'

export function Navbar({ page, setPage }) {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out')
    setPage('simulator')
  }

  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <button onClick={() => setPage('home')} className="flex items-center gap-2 font-black text-xl">
          <span className="bg-brand-600 text-white rounded-lg w-8 h-8 flex items-center justify-center text-sm font-black">AQ</span>
          <span className="text-white">Ad<span className="text-brand-400">Quant</span></span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavBtn active={page === 'simulator'} onClick={() => setPage('simulator')}>Simulator</NavBtn>
          <NavBtn active={page === 'history'} onClick={() => setPage('history')}>History</NavBtn>
          {user ? (
            <>
              <span className="text-xs text-gray-600 ml-2 mr-1 truncate max-w-[140px]">{user.email}</span>
              <button onClick={handleSignOut} className="btn-secondary text-sm px-3 py-1.5">Sign Out</button>
            </>
          ) : (
            <button onClick={() => setPage('auth')} className="btn-primary text-sm px-4 py-2">Sign In</button>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-gray-400 hover:text-white p-1" onClick={() => setMenuOpen(o => !o)}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-3 space-y-2">
          <button className="w-full text-left text-sm text-gray-300 py-2" onClick={() => { setPage('simulator'); setMenuOpen(false) }}>Simulator</button>
          <button className="w-full text-left text-sm text-gray-300 py-2" onClick={() => { setPage('history'); setMenuOpen(false) }}>History</button>
          {user ? (
            <button className="w-full text-left text-sm text-red-400 py-2" onClick={() => { handleSignOut(); setMenuOpen(false) }}>Sign Out ({user.email})</button>
          ) : (
            <button className="btn-primary w-full text-sm" onClick={() => { setPage('auth'); setMenuOpen(false) }}>Sign In</button>
          )}
        </div>
      )}
    </header>
  )
}

function NavBtn({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
    >
      {children}
    </button>
  )
}
