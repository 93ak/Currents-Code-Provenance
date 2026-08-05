import React from 'react';
import { Announcement } from '../types';
import { Megaphone, Pin, Calendar, UserCheck, Trash2 } from 'lucide-react';
import { User } from '../types';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  user: User | null;
  onDeleteAnnouncement?: (id: string) => void;
  darkMode?: boolean;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ announcements, user, onDeleteAnnouncement, darkMode = false }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="p-3 bg-purple-50 text-[#622569] rounded-2xl shrink-0">
          <Megaphone className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-['Poppins']">
            Chapter Notices & Announcements
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official circulars, competition alerts, and chapter management news
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`bg-white rounded-3xl border shadow-sm p-6 sm:p-8 space-y-4 relative transition-all ${
              ann.pinned ? 'border-purple-300 ring-1 ring-purple-100' : 'border-slate-200/80'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  ann.category === 'Important' ? 'bg-rose-50 text-rose-700' : 'bg-purple-50 text-[#622569]'
                }`}>
                  {ann.category}
                </span>
                {ann.pinned && (
                  <span className="text-[10px] font-bold bg-[#622569] text-white px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Pin className="w-3 h-3" /> Pinned
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>{ann.date}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-['Poppins']">{ann.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {ann.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Issued by <strong>{ann.authorName}</strong> ({ann.authorRole})</span>
              </span>
              {user && user.role === 'admin' && onDeleteAnnouncement && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this announcement?')) {
                      onDeleteAnnouncement(ann.id);
                    }
                  }}
                  className="p-1.5 ml-auto rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors border border-rose-200"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
