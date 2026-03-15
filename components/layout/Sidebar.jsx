import Link from 'next/link';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Assistant', href: '/assistant', icon: '🤖' },
    { name: 'Conversations', href: '/conversations', icon: '💬' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
    { name: 'Business', href: '/business', icon: '🏢' },
    { name: 'Languages', href: '/languages', icon: '🌐' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col">
      <div className="text-2xl font-bold mb-10 flex items-center gap-2">
        <span className="text-blue-400">🎙️</span> Voxy
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
            <span>{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="pt-6 border-t border-slate-800 mt-auto">
        <div className="flex items-center gap-3 px-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">S</div>
          <div>
            <div className="text-sm font-medium">SAMKIEL</div>
            <div className="text-xs text-slate-400">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}
