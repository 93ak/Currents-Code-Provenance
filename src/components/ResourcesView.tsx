import React, { useState } from 'react';
import { Resource, User } from '../types';
import { BookOpen, ExternalLink, PlusCircle, Search, Sparkles, X, FileText, Video, Wrench, Bookmark, Tag, Trash2, Layers } from 'lucide-react';

interface ResourcesViewProps {
  resources: Resource[];
  user: User | null;
  onCreateResource: (resData: Partial<Resource>) => Promise<boolean>;
  onDeleteResource?: (id: string) => void;
  searchQuery: string;
  darkMode?: boolean;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  resources,
  user,
  onCreateResource,
  onDeleteResource,
  searchQuery,
  darkMode = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTimeline, setSelectedTimeline] = useState<'all' | 'present' | 'past' | 'future'>('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeResModal, setActiveResModal] = useState<Resource | null>(null);

  const [newResData, setNewResData] = useState({
    title: '',
    description: '',
    category: 'Engineering & Tech' as Resource['category'],
    type: 'E-Book' as Resource['type'],
    authorOrProvider: '',
    url: '',
    thumbnailUrl: '',
    level: 'All Levels' as Resource['level'],
    tagsStr: '',
    timeline: 'present' as 'past' | 'present' | 'future',
  });

  const categories = ['All', 'Engineering & Tech', 'Academic & Research', 'Career & Skill', 'IET Standards', 'Project Templates'];
  const timelines: { id: 'all' | 'present' | 'past' | 'future'; label: string }[] = [
    { id: 'all', label: 'All Resources' },
    { id: 'present', label: 'Current Library' },
    { id: 'past', label: 'Historical & Classics' },
    { id: 'future', label: 'Upcoming Guides' },
  ];

  const filteredResources = resources.filter((res) => {
    const matchesCat = selectedCategory === 'All' || res.category === selectedCategory;
    const resTime = res.timeline || 'present';
    const matchesTimeline = selectedTimeline === 'all' || resTime === selectedTimeline;
    const matchesSearch =
      !searchQuery ||
      res.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.authorOrProvider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.tags || []).some(t => t?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesTimeline && matchesSearch;
  });

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResData.title || !newResData.description || !newResData.url) return;

    const tags = newResData.tagsStr
      ? newResData.tagsStr.split(',').map(s => s.trim()).filter(Boolean)
      : [newResData.category, newResData.type];

    const ok = await onCreateResource({
      ...newResData,
      authorOrProvider: newResData.authorOrProvider || (user ? user.username : 'IET Member'),
      tags,
    });

    if (ok) {
      setShowShareModal(false);
      setNewResData({
        title: '',
        description: '',
        category: 'Engineering & Tech',
        type: 'E-Book',
        authorOrProvider: '',
        url: '',
        thumbnailUrl: '',
        level: 'All Levels',
        tagsStr: '',
        timeline: 'present',
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video Course': return <Video className="w-4 h-4" />;
      case 'Research Paper': return <FileText className="w-4 h-4" />;
      case 'Template': return <Layers className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const card = darkMode ? 'bg-[#1e1e2e] border-slate-700 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900';
  const inputCls = darkMode
    ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-[#9b51e0]'
    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#9b51e0]';
  const labelCls = darkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border shadow-sm ${card}`}>
        <div>
          <h1 className={`text-2xl font-bold font-['Poppins'] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Engineering & Academic Resources</h1>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Learning kits, research papers, and project templates for IET members</p>
        </div>
        {user && (
          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2.5 bg-[#622569] hover:bg-[#9b51e0] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share Resource</span>
          </button>
        )}
      </div>

      {/* Filters */}
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
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-100 text-[#622569] border border-purple-300'
                  : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => {
          const resTime = res.timeline || 'present';
          return (
            <div
              key={res.id}
              className={`rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group ${card}`}
            >
              <div>
                <div className="h-36 relative overflow-hidden bg-slate-900">
                  <img
                    src={res.thumbnailUrl || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80'}
                    alt={res.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-white/90 backdrop-blur-md text-[#622569] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{res.type}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${
                      resTime === 'present' ? 'bg-[#622569]/90 text-white' : resTime === 'past' ? 'bg-slate-700/90 text-slate-200' : 'bg-amber-500 text-white'
                    }`}>
                      {resTime === 'present' ? '✨ Current' : resTime === 'past' ? '🏛️ Archive' : '🔮 Upcoming'}
                    </span>
                  </div>
                  <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-[9px] font-semibold px-2.5 py-1 rounded-full">
                    {res.level}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3
                    onClick={() => setActiveResModal(res)}
                    className={`font-bold text-base font-['Poppins'] cursor-pointer hover:text-[#622569] line-clamp-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}
                  >
                    {res.title}
                  </h3>
                  <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>By {res.authorOrProvider}</p>
                  <p className={`text-xs line-clamp-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{res.description}</p>
                </div>
              </div>

              <div className={`p-5 pt-0 border-t flex items-center justify-between gap-3 mt-4 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <button
                  onClick={() => setActiveResModal(res)}
                  className={`text-xs font-semibold transition-colors ${darkMode ? 'text-slate-300 hover:text-[#9b51e0]' : 'text-slate-600 hover:text-[#622569]'}`}
                >
                  View Details
                </button>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-4 rounded-xl text-xs font-bold bg-[#622569] hover:bg-[#9b51e0] text-white shadow-sm flex items-center gap-1.5 transition-all"
                >
                  Access Now <ExternalLink className="w-3 h-3" />
                </a>
                {user && user.role === 'admin' && onDeleteResource && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this resource?')) {
                        onDeleteResource(res.id);
                      }
                    }}
                    className="p-2 ml-auto rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors border border-rose-200"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className={`rounded-3xl border p-8 text-center ${card}`}>
          <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No resources match the current filters.</p>
        </div>
      )}
      </div>

      {/* RESOURCE DETAILS MODAL */}
      {activeResModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl border max-h-[90vh] overflow-y-auto ${card}`}>
            <button
              onClick={() => setActiveResModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#622569] bg-purple-100 px-3 py-1 rounded-full">
                {activeResModal.category}
              </span>
              <h2 className={`text-xl font-bold font-['Poppins'] mt-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{activeResModal.title}</h2>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>By {activeResModal.authorOrProvider}</p>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <p><strong>Type:</strong> {activeResModal.type}</p>
              <p><strong>Level:</strong> {activeResModal.level}</p>
            </div>

            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{activeResModal.description}</p>

            {activeResModal.tags && activeResModal.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {activeResModal.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className={`flex justify-end gap-3 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <button
                onClick={() => setActiveResModal(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${darkMode ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Close
              </button>
              <a
                href={activeResModal.url}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 text-xs font-bold text-white bg-[#622569] hover:bg-[#9b51e0] rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                Access Resource <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SHARE RESOURCE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-lg w-full p-6 space-y-4 relative shadow-2xl border max-h-[90vh] overflow-y-auto ${card}`}>
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className={`text-lg font-bold font-['Poppins'] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Share a Learning Resource
            </h2>

            <form onSubmit={handleShareSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Resource Title *</label>
                  <input type="text" required value={newResData.title} onChange={(e) => setNewResData({ ...newResData, title: e.target.value })} placeholder="e.g. Modern Power Electronics" className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${inputCls}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Category</label>
                  <select value={newResData.category} onChange={(e) => setNewResData({ ...newResData, category: e.target.value as Resource['category'] })} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${inputCls}`}>
                    <option value="Engineering & Tech">Engineering & Tech</option>
                    <option value="Academic & Research">Academic & Research</option>
                    <option value="Career & Skill">Career & Skill</option>
                    <option value="IET Standards">IET Standards</option>
                    <option value="Project Templates">Project Templates</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Resource Type</label>
                  <select value={newResData.type} onChange={(e) => setNewResData({ ...newResData, type: e.target.value as Resource['type'] })} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${inputCls}`}>
                    <option value="E-Book">E-Book</option>
                    <option value="Video Course">Video Course</option>
                    <option value="Research Paper">Research Paper</option>
                    <option value="Template">Template</option>
                    <option value="Kit">Kit</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Author / Provider</label>
                  <input type="text" value={newResData.authorOrProvider} onChange={(e) => setNewResData({ ...newResData, authorOrProvider: e.target.value })} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${inputCls}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Level</label>
                  <select value={newResData.level} onChange={(e) => setNewResData({ ...newResData, level: e.target.value as Resource['level'] })} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${inputCls}`}>
                    <option value="All Levels">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced / Research">Advanced / Research</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Resource Link *</label>
                  <input type="url" required value={newResData.url} onChange={(e) => setNewResData({ ...newResData, url: e.target.value })} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${inputCls}`} />
                </div>
                <div className="col-span-2">
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Description *</label>
                  <textarea rows={3} required value={newResData.description} onChange={(e) => setNewResData({ ...newResData, description: e.target.value })} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none resize-none ${inputCls}`} />
                </div>
              </div>
              <div className={`flex justify-end gap-3 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <button type="button" onClick={() => setShowShareModal(false)} className={`px-4 py-2 rounded-xl text-xs font-bold ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-[#622569] hover:bg-[#9b51e0] rounded-xl shadow transition-all">Publish Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
