import React, { useState } from 'react';
import { User } from '../types';
import { MapPin, Mail, Github, Linkedin, ShieldCheck, Award } from 'lucide-react';

interface MembersViewProps {
  members: User[];
  searchQuery: string;
  user: User | null;
  darkMode?: boolean;
}

export const MembersView: React.FC<MembersViewProps> = ({ members, searchQuery, user, darkMode = false }) => {
  const [selectedCity, setSelectedCity] = useState<string>('All');

  const cities = ['All', ...Array.from(new Set(members.map(m => m.city).filter(Boolean)))];

  const filteredMembers = members.filter((m) => {
    const matchesCity = selectedCity === 'All' || m.city === selectedCity;
    const matchesSearch =
      !searchQuery ||
      m.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.skills && m.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCity && matchesSearch;
  });

  const card = darkMode ? 'bg-[#1e1e2e] border-slate-700' : 'bg-white border-slate-200/80';
  const headerCard = darkMode ? 'bg-[#1e1e2e] border-slate-700 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border shadow-sm ${headerCard}`}>
        <div>
          <h1 className={`text-2xl font-bold font-['Poppins'] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Member Directory</h1>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Connect with student engineers, researchers, and chapter leads
          </p>
        </div>
        <div className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* City Filters */}
      {cities.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCity === city
                  ? 'bg-[#622569] text-white shadow-sm'
                  : darkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className={`rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col ${card}`}
          >
            {/* Member Header */}
            <div className="relative">
              <div className="h-16 bg-gradient-to-r from-[#622569] to-[#9b51e0]" />
              <div className="px-4 pb-3">
                <img
                  src={member.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={member.username}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md -mt-7 bg-white"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Member Info */}
            <div className="px-4 pb-4 flex flex-col flex-1 gap-3">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className={`font-bold text-sm truncate ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    {member.username}
                  </h3>
                  {member.role === 'lead' && (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#622569] shrink-0" title="Chapter Lead" />
                  )}
                </div>
                <p className={`text-[10px] truncate ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {member.institution}
                </p>
              </div>

              <div className="space-y-1.5">
                <p className={`flex items-center gap-1.5 text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Mail className="w-3 h-3 text-purple-500 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </p>
                {member.city && (
                  <p className={`flex items-center gap-1.5 text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <MapPin className="w-3 h-3 text-purple-500 shrink-0" />
                    <span>{member.city}</span>
                  </p>
                )}
              </div>

              {/* Skills */}
              {member.skills && member.skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {member.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[9px] font-semibold bg-purple-100 text-[#622569] px-2 py-0.5 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className={`mt-auto pt-3 border-t flex items-center justify-between ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <span className={`flex items-center gap-1 text-[11px] font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Award className="w-3 h-3 text-amber-500" />
                  {member.points || 50} pts
                </span>
                <div className="flex items-center gap-2">
                  {member.githubUrl && (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                      title="GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg transition-colors text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className={`rounded-3xl border p-10 text-center ${darkMode ? 'bg-[#1e1e2e] border-slate-700' : 'bg-white border-slate-200'}`}>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            No members match the current filters.
          </p>
        </div>
      )}
    </div>
  );
};
