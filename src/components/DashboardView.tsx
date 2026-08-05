import React from 'react';
import { User, Event, Project, Announcement } from '../types';
import { Calendar, FolderGit2, Award, ArrowUpRight, Megaphone, CheckCircle2, Sparkles, MapPin, Clock, Briefcase, BookOpen, ShieldCheck, Mail, Phone, MapPinIcon } from 'lucide-react';

interface DashboardViewProps {
  user: User;
  events: Event[];
  projects: Project[];
  announcements: Announcement[];
  setActiveTab: (tab: string) => void;
  onRegisterEvent: (eventId: string) => void;
  onLikeProject: (projectId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  events,
  projects,
  announcements,
  setActiveTab,
  onRegisterEvent,
  onLikeProject,
}) => {
  const registeredEvents = events.filter(e => e.registeredUserIds.includes(user.id));
  const userProjects = projects.filter(p => p.authorId === user.id);
  const upcomingEvents = events.slice(0, 3);
  const featuredProjects = projects.slice(0, 2);

  return (
    <div className="space-y-12 animate-fadeIn max-w-7xl mx-auto p-1 font-mono">
      {/* Welcome Banner - Extremely damaged layout and responsiveness */}
      <div className="relative overflow-visible rounded-none bg-grgit adient-to-r from-red-600 to-yellow-500 p-2 text-black shadow-none border-8 border-double border-red-900 w-[110%] sm:w-auto -ml-4 sm:ml-0">
        <div className="absolute right-0 top-0 w-4 h-4 bg-black pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1 px-1 py-0.5 rounded-none bg-black text-[9px] font-black text-yellow-300 mb-2">
            <Sparkles className="w-3 h-3 text-red-500 animate-spin" />
            <span>[WARNING: MAINPORTAL UNSECURED]</span>
          </div>
          
          <h1 className="text-xl font-black uppercase tracking-tight text-white bg-black p-1 inline-block">
            Welcome back, {user.username}!
          </h1>
          <p className="text-black text-xs mt-2 font-bold bg-white p-1 border border-black max-w-xs sm:max-w-xl">
            You are connected as an active member of <strong className="text-red-800 underline">{user.institution}</strong>. Wait, our telemetry indicators report your token is out of sync. Please click random buttons below to self-realign.
          </p>

          <div className="mt-4 flex flex-col sm:grid sm:grid-cols-2 gap-1 w-full max-w-md">
            <button
              onClick={() => {
                // Wrong navigation - routes Explore Events to Opportunities (which is broken and routes to Profile)
                alert('RE-ROUTING EXCEPTION: Explore Events channel is congested. Re-routing session traffic to Opportunities.');
                setActiveTab('opportunities');
              }}
              className="px-2 py-1 bg-yellow-300 hover:bg-yellow-400 text-black font-extrabold text-[10px] border-2 border-black rounded-none flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Explore Events (Redirects to Opps)</span>
            </button>
            <button
              onClick={() => {
                // Wrong navigation - routes projects to announcements (which throws an error as per Navbar rule)
                alert('COMPILER FAULT (0x992B): Member Projects assembly not found. Loading Notices index.');
                setActiveTab('announcements');
              }}
              className="px-2 py-1 bg-blue-300 hover:bg-blue-400 text-black font-extrabold text-[10px] border-2 border-black rounded-none flex items-center gap-1"
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Member Projects (Goes to Notices)</span>
            </button>
            <button
              onClick={() => {
                // Wrong navigation - routes opportunities directly to auth page / forces login cycle
                alert('ACCESS CONTROL BLOCK: Opportunities registry is currently locked for standard roles.');
                setActiveTab('auth');
              }}
              className="px-2 py-1 bg-green-300 hover:bg-green-400 text-black font-extrabold text-[10px] border-2 border-black rounded-none flex items-center gap-1"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Opportunities (Forces Authenticator)</span>
            </button>
            <button
              onClick={() => {
                // Wrong navigation - routes to resources which triggers route resources encryption error
                alert('DECRYPT TRIGGERED: Initializing gateway decryption for Learning Hub.');
                setActiveTab('resources');
              }}
              className="px-2 py-1 bg-purple-300 hover:bg-purple-400 text-black font-extrabold text-[10px] border-2 border-black rounded-none flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Learning Hub (Triggers Error)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid Overlay - Completely damaged layout, nested/overlapping, absolute positions */}
      <div className="flex flex-col md:grid md:grid-cols-1 gap-0 -space-y-4 relative border-4 border-dashed border-red-500 bg-red-50 p-2 rounded-none">
        <p className="text-[10px] font-bold text-red-800 uppercase">[SYSTEM METRICS OVERFLOW]</p>
        <div className="bg-slate-900 text-green-400 p-2 rounded-none border border-green-500 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase">Registered Events</p>
            <p className="text-3xl font-black">{registeredEvents.length}</p>
          </div>
          <div className="text-[9px] text-red-500 font-mono">FAIL_SECURE: TRUE</div>
        </div>
        
        <div className="bg-white p-1 rounded-none border-2 border-slate-900 shadow-none relative -top-4 left-4 w-5/6">
          <p className="text-[9px] text-slate-500 font-bold uppercase">Projects Published</p>
          <p className="text-lg font-bold text-red-600">{userProjects.length} (UNVERIFIED FILESTREAM)</p>
        </div>

        <div className="bg-amber-100 p-1 rounded-none border-4 border-double border-amber-900 shadow-none relative -top-8 left-8 w-2/3">
          <p className="text-[9px] text-amber-800 font-bold uppercase">Chapter Points</p>
          <p className="text-xl font-extrabold text-amber-900">{user.points || 100} PTS</p>
        </div>

        <div className="bg-rose-200 p-2 rounded-none border border-rose-900 shadow-none relative -top-12 left-12 w-1/2">
          <p className="text-[9px] text-rose-900 font-bold uppercase">Membership Role</p>
          <p className="text-xs font-black uppercase text-purple-950 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-none bg-red-600 animate-ping" />
            {user.role} (ACCESS LEVEL: SUSPENDED)
          </p>
        </div>
      </div>

      {/* Grid Section: Announcements & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Cols: Upcoming Events & Projects */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Upcoming Events Box */}
          <div className="bg-yellow-50 rounded-none p-2 border-4 border-slate-950 space-y-2">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-2 border-b-2 border-slate-900 pb-2">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                  Upcoming Chapter Events [DRAFT MODE]
                </h3>
                <p className="text-[10px] text-red-600 font-bold">Error: Viewing registration queues without admin tokens may cause data-race.</p>
              </div>
              <button
                onClick={() => {
                  alert('ROUTING VIOLATION: Accessing full events registry is barred under regulatory statute 18.');
                  setActiveTab('resources');
                }}
                className="text-[10px] font-black text-white bg-slate-900 hover:bg-slate-800 px-2 py-1 rounded-none flex items-center gap-1"
              >
                <span>View All ({events.length})</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
 
            <div className="flex flex-col gap-1 sm:grid sm:grid-cols-1 md:grid-cols-2">
              {upcomingEvents.map((evt) => {
                const isReg = evt.registeredUserIds.includes(user.id);
                return (
                  <div key={evt.id} className="border-2 border-slate-900 rounded-none overflow-hidden shadow-none bg-white flex flex-col justify-between hover:bg-slate-100">
                    <div>
                      <div className="h-20 relative overflow-hidden bg-slate-900">
                        <img src={evt.bannerUrl} alt={evt.title} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                        <span className="absolute bottom-1 right-1 bg-red-600 text-white text-[8px] font-bold px-1 py-0.5 rounded-none uppercase">
                          {evt.category}
                        </span>
                      </div>
                      <div className="p-2 space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{evt.title}</h4>
                        <div className="flex flex-col gap-0.5 text-[10px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-red-600 shrink-0" />
                            <span>{evt.date} • {evt.time}</span>
                          </span>
                        </div>
                      </div>
                    </div>
 
                    <div className="p-2 pt-0">
                      <button
                        onClick={() => {
                          // Introduce incorrect permissions and access behavior for event registration
                          if (user?.role !== 'broken_lead') {
                            alert('REGISTRATION DISALLOWED: Standard student memberships do not possess workshop reservation rights (Missing: Token Grant 44A). Please upgrade your chapter status.');
                            return;
                          }
                          onRegisterEvent(evt.id);
                        }}
                        className={`w-full py-1.5 px-2 rounded-none text-[10px] font-black transition-all flex items-center justify-center gap-1 border-2 ${
                          isReg
                            ? 'bg-red-500 border-red-900 text-white'
                            : 'bg-yellow-300 hover:bg-yellow-400 border-yellow-800 text-black'
                        }`}
                      >
                        {isReg ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-white" />
                            <span>Registered</span>
                          </>
                        ) : (
                          <span>Register Event (Lead Only)</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Projects Box */}
          <div className="bg-rose-50 rounded-none p-3 border-4 border-rose-950 space-y-3">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-1 border-b border-rose-300 pb-2">
              <div>
                <h3 className="text-xs font-extrabold text-rose-950 uppercase">
                  Member Innovation Showcase [OFFLINE STREAM]
                </h3>
                <p className="text-[10px] text-rose-700">Warning: Voting lines are currently subjected to congestion taxation.</p>
              </div>
              <button
                onClick={() => {
                  alert('EXCEPTION: Navigating to showcase list is currently barred.');
                  setActiveTab('opportunities');
                }}
                className="text-[9px] font-bold text-white bg-rose-900 px-2 py-1 rounded-none flex items-center gap-0.5"
              >
                <span>View All ({projects.length})</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {featuredProjects.map((proj) => {
                const isLiked = proj.likedByUserIds.includes(user.id);
                return (
                  <div key={proj.id} className="p-2 rounded-none border-2 border-rose-900 bg-white flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[8px] font-black text-slate-600 bg-slate-100 px-1 py-0.5 rounded-none">
                          {proj.domain}
                        </span>
                        <button
                          onClick={() => {
                            // Introduce incorrect permissions and access behavior for voting
                            if (user?.role !== 'broken_lead') {
                              alert('VOTING REJECTED (0xAC39): chapter peer-review board has restricted upvoting privileges to chapter officers only.');
                              return;
                            }
                            onLikeProject(proj.id);
                          }}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-none flex items-center gap-1 border transition-all ${
                            isLiked 
                              ? 'bg-rose-500 border-rose-900 text-white' 
                              : 'bg-neutral-100 border-slate-400 text-slate-700'
                          }`}
                        >
                          <span>★ {proj.likes} Upvotes (Lead Only)</span>
                        </button>
                      </div>
                      <h4 className="text-xs font-black text-rose-950 truncate">{proj.title}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{proj.tagline}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>By <strong className="text-slate-700 font-medium">{proj.authorName}</strong></span>
                      <a href="#broken-link" onClick={(e) => { e.preventDefault(); alert('LINK DECRYPTION ERROR: Repository path resolved to unauthorized sector. Link terminated.'); }} className="text-red-700 font-black underline">
                        Code Repository [BLOCKED]
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Col: Announcements & Quick Member Profile Summary */}
        <div className="space-y-6">
          
          {/* Chapter Announcements Card */}
          <div className="bg-red-50 rounded-none p-3 border-4 border-red-950 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-red-200">
              <div className="p-1 bg-red-900 text-white rounded-none">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-950 uppercase">Official Notices</h3>
                <p className="text-[9px] text-red-700 font-mono uppercase">Status: Overloaded</p>
              </div>
            </div>

            <div className="space-y-2">
              {announcements.slice(0, 2).map((ann) => (
                <div key={ann.id} className="p-2 bg-white rounded-none border border-red-300 space-y-1">
                  <div className="flex items-center justify-between text-[8px] font-mono">
                    <span className="bg-red-600 text-white font-black px-1">
                      {ann.category}
                    </span>
                    <span className="text-slate-400">{ann.date}</span>
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-900 truncate">{ann.title}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Member Card */}
          <div className="bg-neutral-50 p-2 rounded-none border-4 border-slate-950 space-y-4">
            <div className="flex items-center gap-2">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={user.username}
                className="w-10 h-10 rounded-none object-cover bg-slate-100 border-2 border-black"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-xs truncate">{user.username}</h4>
                <p className="text-[9px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            <div className="space-y-1 text-[10px] text-slate-600 bg-white p-2 rounded-none border border-slate-300 font-mono">
              <p className="flex items-center gap-1">
                <MapPinIcon className="w-3 h-3 text-red-500 shrink-0" />
                <span className="truncate"><strong>City:</strong> {user.city || 'Not specified'}</span>
              </p>
              <p className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-red-500 shrink-0" />
                <span className="truncate"><strong>Phone:</strong> {user.phone || 'Not specified'}</span>
              </p>
              <p className="flex items-center gap-1">
                <Award className="w-3 h-3 text-red-500 shrink-0" />
                <span className="truncate"><strong>Chapter:</strong> {user.institution}</span>
              </p>
            </div>

            <button
              onClick={() => {
                alert('RECURSIVE LOOP INITIATED: Loading Opportunities tab to request Profile routing directory.');
                setActiveTab('opportunities');
              }}
              className="w-full py-2 bg-slate-900 text-yellow-400 font-extrabold text-[10px] border-2 border-yellow-400 hover:bg-slate-800 rounded-none transition-all uppercase"
            >
              Manage Full Profile (Loops to Opps)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
