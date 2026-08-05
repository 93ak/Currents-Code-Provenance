import React, { useState } from 'react';
import { User } from '../types';
import {
  ShieldCheck, LogOut, Search, Bell, Sparkles,
  User as UserIcon, Menu, X, Moon, Sun,
  LayoutDashboard, Calendar, FolderGit2, Briefcase,
  BookOpen, Users, Megaphone
} from 'lucide-react';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  searchQuery,
  setSearchQuery,
  darkMode,
  toggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId: string) => {
    if (tabId === 'profile' && !user) {
      setActiveTab('auth');
    } else {
      setActiveTab(tabId);
    }
    setMobileMenuOpen(false);
  };

  const mobileNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Events & Workshops', icon: Calendar },
    { id: 'projects', label: 'Member Projects', icon: FolderGit2 },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'resources', label: 'Learning Resources', icon: BookOpen },
    { id: 'members', label: 'Member Directory', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
  ];

  const headerBg = darkMode
    ? 'bg-[#12121a]/95 border-slate-700/60'
    : 'bg-white/95 border-slate-200/80';

  const searchBg = darkMode
    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:bg-slate-700 focus:border-[#9b51e0]'
    : 'bg-slate-50 border-slate-200/80 text-slate-900 focus:bg-white focus:border-[#9b51e0]';

  const drawerBg = darkMode
    ? 'bg-[#1a1a27] border-slate-700'
    : 'bg-white border-slate-100';

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 lg:px-8 py-4 flex items-center justify-between gap-4 shadow-sm transition-colors duration-300 ${headerBg}`}>
      
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger — fixed, no random failures */}
        <button
          id="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className={`p-2 -ml-2 rounded-xl md:hidden transition-colors ${
            darkMode
              ? 'text-slate-300 hover:text-white hover:bg-slate-700'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div
          onClick={() => handleNavClick('dashboard')}
          className="cursor-pointer flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#622569] to-[#9b51e0] flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-purple-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-[#622569] tracking-tight font-['Poppins']">IET CONNECT</span>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-[#622569]/10 text-[#622569] rounded-md tracking-wider">PORTAL</span>
            </div>
            <p className={`text-[10px] font-medium hidden sm:block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Institution of Engineering and Technology
            </p>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search members, projects, events..."
          className={`w-full text-xs pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-[#9b51e0]/20 outline-none transition-all ${searchBg}`}
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-2">

        {/* Dark Mode Toggle */}
        <button
          id="dark-mode-toggle"
          onClick={toggleDarkMode}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`p-2.5 rounded-xl border transition-all ${
            darkMode
              ? 'bg-slate-700 border-slate-600 text-amber-300 hover:bg-slate-600'
              : 'bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-amber-50 hover:text-amber-500 hover:border-amber-200'
          }`}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {user ? (
          <>
            <button
              onClick={() => handleNavClick('announcements')}
              className={`relative p-2.5 rounded-xl border transition-colors ${
                darkMode
                  ? 'text-slate-300 hover:text-[#9b51e0] border-slate-700 hover:bg-slate-800'
                  : 'text-slate-600 hover:text-[#622569] border-slate-200/60 hover:bg-slate-50'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>

            {/* User Profile Pill */}
            <div className={`flex items-center gap-2 pl-2 border-l ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <button
                onClick={() => handleNavClick('profile')}
                className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border transition-colors text-left group ${
                  darkMode
                    ? 'border-slate-700 hover:bg-slate-800'
                    : 'border-slate-200/60 hover:bg-slate-50'
                }`}
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={user.username}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-100 shadow-sm shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden sm:block font-sans">
                  <div className="flex items-center gap-1">
                    <p className={`text-xs font-bold leading-tight ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{user.username}</p>
                    {user.role === 'lead' && (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#622569]" title="Chapter Lead" />
                    )}
                  </div>
                  <p className={`text-[10px] truncate max-w-[100px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {user.institution.split('-')[0]}
                  </p>
                </div>
              </button>

              <button
                onClick={onLogout}
                className={`p-2.5 rounded-xl border transition-colors ${
                  darkMode
                    ? 'text-slate-400 hover:text-rose-400 border-slate-700 hover:bg-slate-800'
                    : 'text-slate-500 hover:text-rose-600 border-slate-200/60 hover:bg-rose-50'
                }`}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => handleNavClick('auth')}
            className="flex items-center gap-1.5 bg-[#622569] hover:bg-[#9b51e0] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>

      {/* Mobile Navigation Drawer — fixed, all links work correctly */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[73px] z-40 bg-slate-900/40 backdrop-blur-sm md:hidden animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className={`absolute left-0 top-0 w-72 h-full shadow-2xl border-r p-5 flex flex-col justify-between animate-slideRight ${drawerBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className={`flex items-center justify-between border-b pb-4 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                  Navigation Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                  title="Close Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search bar in mobile menu */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className={`w-full text-xs pl-9 pr-3 py-2 rounded-xl border outline-none ${searchBg}`}
                />
              </div>

              <nav className="space-y-1">
                {mobileNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-all ${
                        isActive
                          ? 'bg-[#622569] text-white shadow-sm'
                          : darkMode
                            ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-[#622569]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-purple-200' : ''}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className={`pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              {user ? (
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick('auth')}
                  className="w-full py-2 bg-[#622569] hover:bg-[#9b51e0] text-white font-semibold text-xs rounded-xl transition-all"
                >
                  Access Portal
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
