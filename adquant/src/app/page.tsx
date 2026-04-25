import SimulationEngine from '@/components/SimulationEngine';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none z-0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      {/* Navigation / Header */}
      <header className="w-full border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              AQ
            </div>
            <span className="font-bold text-xl tracking-tight text-white">AdQuant</span>
          </div>
          <nav className="flex items-center gap-6">
            <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Documentation</button>
            <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Pricing</button>
            <button className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors shadow-sm">
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-10 text-center px-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Engine v1.0 Live
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
          Predict Ad Failure <br className="hidden md:block"/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-purple-400">
            Before You Spend.
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 font-medium">
          The deterministic math engine for direct-to-consumer brands. Simulate your gross margins, CPM pressure, and conversion friction to get a statistically validated testing budget.
        </p>
      </section>

      {/* Main App Container */}
      <section className="relative z-10 pb-24">
        <SimulationEngine />
      </section>

    </main>
  );
}
