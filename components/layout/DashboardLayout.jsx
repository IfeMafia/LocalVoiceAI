import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children, title }) {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title={title || 'Voxy'} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
