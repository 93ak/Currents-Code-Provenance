import React from 'react';
import { User, Event, Project, Announcement } from '../types';
import {
  Calendar, FolderGit2, Award, ArrowUpRight, Megaphone,
  CheckCircle2, Sparkles, Clock, Briefcase, BookOpen,
  ShieldCheck, Phone, MapPinIcon, Heart
} from 'lucide-react';

interface DashboardViewProps {
  user: User;
  events: Event[];
  projects: Project[];
  announcements: Announcement[];
  setActiveTab: (tab: string) => void;
  onRegisterEvent: (eventId: string) => void;
  onLikeProject: (projectId: string) => void;
  darkMode?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  events,
  projects,
  announcements,
  setActiveTab,
  onRegisterEvent,
  onLikeProject,
  darkMode = false,
}) => {
  const registeredEvents = events.filter(e => e.registeredUserIds.includes(user.id));
  const userProjects = projects.filter(p => p.authorId === user.id);
  const upcomingEvents = events.filter(e => (e.timeline || 'future') !== 'past').slice(0, 4);
  const featuredProjects = projects.slice(0, 4);

  // Dark mode helpers
  const card = darkMode
    ? 'bg-[#1e1e2e] border-slate-700 text-slate-100'
    : 'bg-white border-slate-200/80 text-slate-900';
  const subtext = darkMode ? 'text-slate-400' : 'text-slate-500';
  const innerCard = darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-100';

  const statCards = [
    {
      label: 'Registered Events',
      value: registeredEvents.length,
      icon: Calendar,
      color: 'text-purple-400',
      bg: darkMode ? 'bg-purple-900/20' : 'bg-purple-50',
    },
    {
      label: 'Projects Published',
      value: userProjects.length,
      icon: FolderGit2,
      color: 'text-blue-400',
      bg: darkMode ? 'bg-blue-900/20' : 'bg-blue-50',
    },
    {
      label: 'Chapter Points',
      value: `${user.points || 100} pts`,
      icon: Award,
      color: 'text-amber-400',
      bg: darkMode ? 'bg-amber-900/20' : 'bg-amber-50',
    },
    {
      label: 'Membership Role',
      value: user.role,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">

      {/* Welcome Banner */}
      <div className={`relative overflow-hidden rounded-3xl p-8 shadow-md border ${
        darkMode
          ? 'bg-gradient-to-br from-[#2d1040] via-[#3b1560] to-[#622569] border-purple-800/40'
          : 'bg-gradient-to-br from-[#622569] via-[#7a2f80] to-[#9b51e0] border-purple-200/40'
      }`}>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt={user.username}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-purple-200 text-xs font-medium">Welcome back</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-['Poppins'] truncate">
              {user.username}
            </h1>
            <p className="text-purple-200 text-xs mt-1 truncate">{user.institution}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setActiveTab('events')}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all backdrop-blur-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              Explore Events
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#622569] text-xs font-bold rounded-xl shadow hover:shadow-md transition-all"
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              Member Projects
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`rounded-2xl border p-5 shadow-sm flex items-center gap-4 ${card}`}>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-medium truncate ${subtext}`}>{stat.label}</p>
                <p className={`text-lg font-bold capitalize ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Nav Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'opportunities', label: 'Opportunities', icon: Briefcase, color: 'text-blue-500' },
          { id: 'resources', label: 'Learning Hub', icon: BookOpen, color: 'text-emerald-500' },
          { id: 'members', label: 'Member Directory', icon: Award, color: 'text-amber-500' },
          { id: 'announcements', label: 'Announcements', icon: Megaphone, color: 'text-rose-500' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border shadow-sm text-center hover:scale-[1.02] transition-all ${card}`}
            >
              <Icon className={`w-5 h-5 ${item.color}`} />
              <span className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Upcoming Events */}
        <div className={`lg:col-span-2 rounded-3xl border shadow-sm p-6 space-y-4 ${card}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold font-['Poppins'] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Upcoming Events
            </h3>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs font-semibold text-[#622569] hover:text-[#9b51e0] flex items-center gap-1 transition-colors"
            >
              View All ({events.length})
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {upcomingEvents.map((evt) => {
              const isReg = evt.registeredUserIds.includes(user.id);
              return (
                <div key={evt.id} className={`rounded-2xl border overflow-hidden flex flex-col ${innerCard}`}>
                  <div className="h-28 relative overflow-hidden bg-slate-900">
                    <img src={evt.bannerUrl} alt={evt.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-2 left-2 bg-[#622569]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {evt.category}
                    </span>
                  </div>
                  <div className="p-3 flex flex-col gap-2 flex-1 justify-between">
                    <div>
                      <h4 className={`text-xs font-bold truncate ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{evt.title}</h4>
                      <p className={`text-[10px] flex items-center gap-1 mt-1 ${subtext}`}>
                        <Clock className="w-3 h-3" />
                        {evt.date} · {evt.time}
                      </p>
                    </div>
                    <button
                      onClick={() => onRegisterEvent(evt.id)}
                      className={`w-full py-1.5 text-[11px] font-bold rounded-xl transition-all ${
                        isReg
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-[#622569] hover:bg-[#9b51e0] text-white'
                      }`}
                    >
                      {isReg ? (
                        <span className="flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3" /> Registered</span>
                      ) : 'Register'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Announcements Card */}
          <div className={`rounded-3xl border shadow-sm p-5 space-y-4 ${card}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-bold font-['Poppins'] flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                <Megaphone className="w-4 h-4 text-[#622569]" />
                Notices
              </h3>
              <button
                onClick={() => setActiveTab('announcements')}
                className="text-[11px] font-semibold text-[#622569] hover:text-[#9b51e0] flex items-center gap-0.5"
              >
                All <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {announcements.slice(0, 3).map(ann => (
                <div key={ann.id} className={`p-3 rounded-xl border ${innerCard}`}>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full mr-2 ${
                    ann.category === 'Important' ? 'bg-rose-100 text-rose-700' : 'bg-purple-100 text-[#622569]'
                  }`}>
                    {ann.category}
                  </span>
                  <p className={`text-xs font-semibold mt-1.5 line-clamp-2 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{ann.title}</p>
                  <p className={`text-[10px] mt-0.5 ${subtext}`}>{ann.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Member Quick Card */}
          <div className={`rounded-3xl border shadow-sm p-5 space-y-4 ${card}`}>
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={user.username}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <p className={`text-sm font-bold truncate ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{user.username}</p>
                <p className={`text-[10px] truncate ${subtext}`}>{user.email}</p>
              </div>
            </div>
            <div className={`space-y-1.5 text-[11px] p-3 rounded-xl border ${innerCard}`}>
              <p className={`flex items-center gap-1.5 ${subtext}`}>
                <MapPinIcon className="w-3 h-3 text-purple-500 shrink-0" />
                <span className="truncate">{user.city || 'City not set'}</span>
              </p>
              <p className={`flex items-center gap-1.5 ${subtext}`}>
                <Phone className="w-3 h-3 text-purple-500 shrink-0" />
                <span className="truncate">{user.phone || 'Phone not set'}</span>
              </p>
            </div>
            <button
              onClick={() => setActiveTab('profile')}
              className="w-full py-2 bg-[#622569] hover:bg-[#9b51e0] text-white text-xs font-bold rounded-xl transition-all"
            >
              Manage Profile
            </button>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className={`rounded-3xl border shadow-sm p-6 space-y-4 ${card}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-base font-bold font-['Poppins'] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Member Innovation Showcase
          </h3>
          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs font-semibold text-[#622569] hover:text-[#9b51e0] flex items-center gap-1 transition-colors"
          >
            View All ({projects.length})
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProjects.map((proj) => {
            const isLiked = proj.likedByUserIds.includes(user.id);
            return (
              <div key={proj.id} className={`rounded-2xl border overflow-hidden flex flex-col ${innerCard}`}>
                <div className="h-24 relative overflow-hidden bg-slate-900">
                  <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    darkMode ? 'bg-slate-700 text-slate-200' : 'bg-white/90 text-slate-700'
                  }`}>
                    {proj.domain}
                  </span>
                </div>
                <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <h4 className={`text-xs font-bold line-clamp-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{proj.title}</h4>
                    <p className={`text-[10px] mt-0.5 ${subtext}`}>by {proj.authorName}</p>
                  </div>
                  <button
                    onClick={() => onLikeProject(proj.id)}
                    className={`w-full py-1.5 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all border ${
                      isLiked
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : darkMode
                          ? 'bg-slate-700 text-slate-300 border-slate-600 hover:border-rose-500'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    {proj.likes}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
