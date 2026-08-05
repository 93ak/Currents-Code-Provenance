import React, { useState } from 'react';
import { Opportunity, User } from '../types';
import { Briefcase, MapPin, DollarSign, Calendar, ExternalLink, PlusCircle, Search, Sparkles, X, CheckCircle, Tag, Building2 } from 'lucide-react';

interface OpportunitiesViewProps {
  opportunities: Opportunity[];
  user: User | null;
  onCreateOpportunity: (oppData: Partial<Opportunity>) => Promise<boolean>;
  searchQuery: string;
  darkMode?: boolean;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  user,
  onCreateOpportunity,
  searchQuery,
  darkMode = false,
}) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedTimeline, setSelectedTimeline] = useState<'all' | 'present' | 'past' | 'future'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeOppModal, setActiveOppModal] = useState<Opportunity | null>(null);

  // New Opportunity Form State
  const [newOppData, setNewOppData] = useState({
    title: '',
    companyOrOrg: '',
    type: 'Internship' as Opportunity['type'],
    location: 'Remote',
    stipendOrSalary: '',
    deadline: '',
    description: '',
    applyUrl: '',
    requirementsStr: '',
    tagsStr: '',
    logoUrl: '',
    bannerUrl: '',
    status: 'Open' as 'Open' | 'Closed' | 'Upcoming',
    timeline: 'present' as 'past' | 'present' | 'future',
  });

  const types = ['All', 'Internship', 'Scholarship', 'Research Grant', 'Mentorship', 'Career Fair'];
  const timelines: { id: 'all' | 'present' | 'past' | 'future'; label: string }[] = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'present', label: 'Open Now (Present)' },
    { id: 'future', label: 'Upcoming Applications (Future)' },
    { id: 'past', label: 'Past & Archived (Past)' },
  ];

  const filteredOpps = opportunities.filter((opp) => {
    const matchesType = selectedType === 'All' || opp.type === selectedType;
    const oppTime = opp.timeline || (opp.status === 'Closed' ? 'past' : opp.status === 'Upcoming' ? 'future' : 'present');
    const matchesTimeline = selectedTimeline === 'all' || oppTime === selectedTimeline;
    const matchesSearch =
      !searchQuery ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.companyOrOrg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesTimeline && matchesSearch;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOppData.title || !newOppData.companyOrOrg || !newOppData.description || !newOppData.applyUrl) return;

    const requirements = newOppData.requirementsStr
      ? newOppData.requirementsStr.split('\n').map(s => s.trim()).filter(Boolean)
      : ['Active IET student member', 'Enrolled in STEM / Engineering degree'];

    const tags = newOppData.tagsStr
      ? newOppData.tagsStr.split(',').map(s => s.trim()).filter(Boolean)
      : ['IET', newOppData.type];

    const ok = await onCreateOpportunity({
      ...newOppData,
      requirements,
      tags,
    });

    if (ok) {
      setShowCreateModal(false);
      setNewOppData({
        title: '',
        companyOrOrg: '',
        type: 'Internship',
        location: 'Remote',
        stipendOrSalary: '',
        deadline: '',
        description: '',
        applyUrl: '',
        requirementsStr: '',
        tagsStr: '',
        logoUrl: '',
        bannerUrl: '',
        status: 'Open',
        timeline: 'present',
      });
    }
  };

  const card = darkMode ? 'bg-[#1e1e2e] border-slate-700 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900';
  const inputCls = darkMode
    ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-[#9b51e0]'
    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#9b51e0]';
  const labelCls = darkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border shadow-sm ${card}`}>
        <div>
          <h1 className={`text-2xl font-bold font-['Poppins'] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Career & Academic Opportunities</h1>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Internships, scholarships, grants, and mentorships for IET chapter members</p>
        </div>

        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-[#622569] hover:bg-[#9b51e0] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Opportunity</span>
          </button>
        )}
      </div>

      {/* Timeline & Category Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-2xl">
          {timelines.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTimeline(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedTimeline === t.id ? 'bg-[#622569] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedType === t
                  ? 'bg-purple-100 text-[#622569] border border-purple-300'
                  : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpps.map((opp) => {
          const oppTime = opp.timeline || (opp.status === 'Closed' ? 'past' : opp.status === 'Upcoming' ? 'future' : 'present');

          return (
            <div
              key={opp.id}
              className={`rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group ${card}`}
            >
              <div>
                <div className="h-36 relative overflow-hidden bg-slate-900">
                  <img
                    src={opp.bannerUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'}
                    alt={opp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-white/90 backdrop-blur-md text-[#622569] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{opp.type}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${
                      oppTime === 'present' ? 'bg-emerald-500 text-white' : oppTime === 'past' ? 'bg-slate-700/90 text-slate-200' : 'bg-[#622569]/90 text-white'
                    }`}>
                      {oppTime === 'present' ? '✅ Open' : oppTime === 'past' ? '📁 Closed' : '🌟 Upcoming'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-xs font-semibold">{opp.companyOrOrg}</p>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3
                    onClick={() => setActiveOppModal(opp)}
                    className={`font-bold text-base font-['Poppins'] hover:text-[#622569] cursor-pointer line-clamp-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}
                  >
                    {opp.title}
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    <div className={`flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span>{opp.location}</span>
                    </div>
                    {opp.stipendOrSalary && (
                      <div className={`flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <DollarSign className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span>{opp.stipendOrSalary}</span>
                      </div>
                    )}
                    {opp.deadline && (
                      <div className={`flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span>Deadline: {opp.deadline}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`p-5 pt-0 border-t flex items-center justify-between gap-3 mt-4 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <button
                  onClick={() => setActiveOppModal(opp)}
                  className={`text-xs font-semibold transition-colors ${darkMode ? 'text-slate-300 hover:text-[#9b51e0]' : 'text-slate-600 hover:text-[#622569]'}`}
                >
                  View Details
                </button>
                {oppTime === 'present' && (
                  <a
                    href={opp.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-4 rounded-xl text-xs font-bold bg-[#622569] hover:bg-[#9b51e0] text-white shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    Apply Now <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredOpps.length === 0 && (
        <div className={`rounded-3xl border p-8 text-center ${card}`}>
          <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No opportunities match the current filters.</p>
        </div>
      )}

      {/* OPPORTUNITY DETAILS MODAL */}
      {activeOppModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl border max-h-[90vh] overflow-y-auto ${card}`}>
            <button
              onClick={() => setActiveOppModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              {activeOppModal.logoUrl && (
                <img src={activeOppModal.logoUrl} alt="" className="w-14 h-14 rounded-2xl border border-slate-200 object-cover shrink-0" />
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#622569] bg-purple-100 px-3 py-1 rounded-full">
                  {activeOppModal.type}
                </span>
                <h2 className={`text-xl font-bold mt-2 font-['Poppins'] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{activeOppModal.title}</h2>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{activeOppModal.companyOrOrg}</p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <p><MapPin className="w-3.5 h-3.5 inline mr-1 text-purple-500" /><strong>Location:</strong> {activeOppModal.location}</p>
              {activeOppModal.stipendOrSalary && <p><DollarSign className="w-3.5 h-3.5 inline mr-1 text-purple-500" /><strong>Stipend:</strong> {activeOppModal.stipendOrSalary}</p>}
              {activeOppModal.deadline && <p><Calendar className="w-3.5 h-3.5 inline mr-1 text-purple-500" /><strong>Deadline:</strong> {activeOppModal.deadline}</p>}
            </div>

            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{activeOppModal.description}</p>

            {activeOppModal.requirements && activeOppModal.requirements.length > 0 && (
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Eligibility Requirements</h4>
                <ul className="space-y-1 text-xs">
                  {activeOppModal.requirements.map((req, idx) => (
                    <li key={idx} className={`flex items-start gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={`flex justify-end gap-3 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <button
                onClick={() => setActiveOppModal(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${darkMode ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Close
              </button>
              {(activeOppModal.timeline === 'present' || activeOppModal.status === 'Open') && (
                <a
                  href={activeOppModal.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#622569] hover:bg-[#9b51e0] rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  Apply Now <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
 
      {/* CREATE OPPORTUNITY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-lg w-full p-6 space-y-4 relative shadow-2xl border max-h-[90vh] overflow-y-auto ${card}`}>
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className={`text-lg font-bold font-['Poppins'] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Post an Opportunity
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Title *</label>
                  <input type="text" required value={newOppData.title} onChange={(e) => setNewOppData({ ...newOppData, title: e.target.value })} placeholder="e.g. Embedded Firmware Engineering Intern" className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${inputCls}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Organization *</label>
                  <input type="text" required value={newOppData.companyOrOrg} onChange={(e) => setNewOppData({ ...newOppData, companyOrOrg: e.target.value })} placeholder="e.g. Siemens Tech Labs" className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${inputCls}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Type</label>
                  <select value={newOppData.type} onChange={(e) => setNewOppData({ ...newOppData, type: e.target.value as Opportunity['type'] })} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${inputCls}`}>
                    <option value="Internship">Internship</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Research Grant">Research Grant</option>
                    <option value="Mentorship">Mentorship</option>
                    <option value="Career Fair">Career Fair</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Location</label>
                  <input type="text" value={newOppData.location} onChange={(e) => setNewOppData({ ...newOppData, location: e.target.value })} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${inputCls}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Stipend / Award</label>
                  <input type="text" value={newOppData.stipendOrSalary} onChange={(e) => setNewOppData({ ...newOppData, stipendOrSalary: e.target.value })} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${inputCls}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Deadline</label>
                  <input type="date" value={newOppData.deadline} onChange={(e) => setNewOppData({ ...newOppData, deadline: e.target.value })} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${inputCls}`} />
                </div>
                <div className="col-span-2">
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Apply URL *</label>
                  <input type="url" required value={newOppData.applyUrl} onChange={(e) => setNewOppData({ ...newOppData, applyUrl: e.target.value })} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${inputCls}`} />
                </div>
                <div className="col-span-2">
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Description *</label>
                  <textarea rows={3} required value={newOppData.description} onChange={(e) => setNewOppData({ ...newOppData, description: e.target.value })} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none resize-none ${inputCls}`} />
                </div>
                <div className="col-span-2">
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Requirements (one per line)</label>
                  <textarea rows={2} value={newOppData.requirementsStr} onChange={(e) => setNewOppData({ ...newOppData, requirementsStr: e.target.value })} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none resize-none ${inputCls}`} />
                </div>
              </div>
              <div className={`flex justify-end gap-3 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <button type="button" onClick={() => setShowCreateModal(false)} className={`px-4 py-2 rounded-xl text-xs font-bold ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-[#622569] hover:bg-[#9b51e0] rounded-xl shadow transition-all">Publish Opportunity</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
