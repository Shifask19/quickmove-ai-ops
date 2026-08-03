import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Route, Building2, Truck, Zap, MapPin,
  CheckSquare, Bell, BarChart3, Activity, Settings, X, TrendingUp
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';

const navItems = [
  { label: 'Dashboard',       path: '/',                icon: LayoutDashboard },
  { label: 'Customers',       path: '/customers',       icon: Users },
  { label: 'Relocations',     path: '/relocations',     icon: Route },
  { label: 'Properties',      path: '/properties',      icon: Building2 },
  { label: 'Vendors & Movers',path: '/vendors',         icon: Truck },
  { label: 'Utility Setup',   path: '/utilities',       icon: Zap },
  { label: 'Address Change',  path: '/address-change',  icon: MapPin },
  { label: 'Tasks',           path: '/tasks',           icon: CheckSquare },
  { label: 'Notifications',   path: '/notifications',   icon: Bell },
  { label: 'Reports',         path: '/reports',         icon: BarChart3 },
  { label: 'Analytics',       path: '/analytics',       icon: TrendingUp },
  { label: 'Activity',        path: '/activity',        icon: Activity },
  { label: 'Settings',        path: '/settings',        icon: Settings },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, unreadCount } = useStore();
  const unread = unreadCount();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-full z-40 flex flex-col bg-slate-900 transition-transform duration-300 ease-in-out',
        'w-64',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:flex'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Truck size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">QuickMove</p>
              <p className="text-slate-400 text-xs">AI Ops Hub</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(path);

            return (
              <NavLink
                key={path}
                to={path}
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative',
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                )}
              >
                <Icon size={17} className="shrink-0" />
                <span className="flex-1">{label}</span>
                {label === 'Notifications' && unread > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">PS</div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-xs font-medium truncate">Priya Sharma</p>
              <p className="text-slate-500 text-xs">Operations Manager</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
