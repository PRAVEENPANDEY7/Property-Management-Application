import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  LayoutDashboard,
  Building,
  PlusCircle,
  ExternalLink,
  LogOut,
  Shield,
  Menu,
  X,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../hooks';
import { ToastContainer } from '../molecules';
import { Badge } from '../atoms';

export const AdminLayout = ({ children, title = 'Administration' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    {
      to: '/admin',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      to: '/admin/properties',
      label: 'Manage Properties',
      icon: Building,
      exact: false,
    },
    {
      to: '/admin/properties/new',
      label: 'Create Property',
      icon: PlusCircle,
      exact: true,
    },
    {
      to: '/admin/inquiries',
      label: 'Customer Leads',
      icon: MessageSquare,
      exact: true,
    },
  ];

  const isLinkActive = (item) => {
    if (item.exact) {
      return location.pathname === item.to;
    }
    return location.pathname.startsWith(item.to) && location.pathname !== '/admin/properties/new';
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col md:flex-row selection:bg-purple-600 selection:text-white">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-surface-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-purple-700 text-white flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base text-surface-900">
            Haven<span className="text-purple-700">Admin</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-surface-600 hover:text-surface-900 hover:bg-surface-100"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-soft">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-lg text-white tracking-tight">HavenEstate</div>
              <div className="text-[10px] text-purple-400 font-bold tracking-widest uppercase">
                Admin Console
              </div>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item);

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-purple-600 text-white shadow-soft'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link
              to="/properties"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" /> View Public Site
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </nav>

        {/* Current Admin Capsule & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/60 font-bold flex items-center justify-center text-xs flex-shrink-0">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{user?.fullName}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
              </div>
            </div>
            <Badge variant="admin" size="xs">
              ADMIN
            </Badge>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Bar */}
        <header className="hidden md:flex h-16 bg-white border-b border-surface-200 px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm text-surface-500">
            <span className="font-semibold text-surface-900">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="admin" size="sm">
              Role: {user?.role || 'ROLE_ADMIN'}
            </Badge>
            <div className="text-xs text-surface-400">Production Mode: Active</div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
