onClick = {() => setMobileMenuOpen(false)}
className = "lg:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-35"
  />
      )}

{/* Mobile Header */ }
<div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-gray-800/80 z-50 flex items-center justify-between px-4 bg-[#08182b]">
  <span className="font-black text-lg uppercase tracking-wider text-white" style={{ fontFamily: 'var(--font-display)' }}>
    INFOGRAM<span className="text-[#00d4ff]">&apos;26</span>
  </span>
  <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white">
    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
  </button>
</div>

{/* Sidebar */ }
<aside className={`
        fixed top-0 left-0 h-full w-64 z-40 flex flex-col transition-transform duration-200 border-r border-gray-800/80 bg-[#08182b]
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
  <div className="p-5 border-b border-gray-800/80 flex flex-col items-center">
    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00d4ff]/50 bg-black flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(0,212,255,0.3)]">
      <img src="/logo-circle.png" alt="INFOGRAM Logo" className="w-full h-full object-cover" />
    </div>
    <h1 className="text-lg font-black tracking-wider text-center text-white" style={{ fontFamily: 'var(--font-display)' }}>
      INFOGRAM<span className="text-[#00d4ff]">&apos;26</span>
    </h1>
    <div className="mt-2 text-center text-[10px] font-black uppercase tracking-wider text-[#00d4ff] bg-[#00d4ff]/10 py-1 px-3 rounded-full border border-[#00d4ff]/30 flex items-center justify-center gap-1">
      <ShieldAlert className="w-3 h-3 text-[#00d4ff]" /> SUPER ADMIN
    </div>
  </div>

  {user && (
    <div className="p-4 border-b border-gray-800/60 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full overflow-hidden bg-purple-900/50 border border-purple-500/40 flex items-center justify-center shrink-0">
        {user.photoURL ? (
          <Image src={user.photoURL} alt="Avatar" width={36} height={36} />
        ) : (
          <span className="font-black text-purple-300 text-sm">{user.displayName?.charAt(0) || 'M'}</span>
        )}
      </div>
      <div className="overflow-hidden text-xs">
        <p className="font-black truncate text-white">{user.displayName || 'Maithreyan (Admin)'}</p>
        <p className="text-gray-400 text-[11px] truncate">{user.email}</p>
      </div>
    </div>
  )}

  <nav className="flex-1 overflow-y-auto py-3">
    <ul className="space-y-1 px-3">
      {NAV_LINKS.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.path;
        return (
          <li key={link.path}>
            <Link
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-colors ${isActive
                  ? 'bg-[#00d4ff] text-slate-950 font-black shadow-md shadow-[#00d4ff]/30'
                  : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {link.name}
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>

  <div className="p-3 border-t border-gray-800/60 space-y-1.5">
    <Link
      href="/"
      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
    >
      <Home className="w-3.5 h-3.5" />
      Public Website
    </Link>
    <button
      onClick={handleSignOut}
      className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-red-400 hover:bg-red-950/40 transition-colors text-xs font-black uppercase tracking-wider"
    >
      <LogOut className="w-3.5 h-3.5" />
      Sign Out
    </button>
  </div>
</aside>

{/* Main Content */ }
<main className="flex-1 lg:ml-64 min-h-screen pt-20 lg:pt-6 pb-12 px-4 md:px-8 bg-[#040d1a]">
  <div className="max-w-7xl mx-auto">
    {children}
  </div>
</main>
    </div >
  );
}
