import React, { useState } from 'react';
import { User } from '../types';
import {
  Mail, Phone, MapPin, Building, Calendar, Edit3, Github, Linkedin,
  ShieldCheck, Sparkles, X, Tag
} from 'lucide-react';

interface ProfileViewProps {
  user: User;
  onUpdateProfile: (updatedData: Partial<User>) => Promise<boolean>;
  darkMode?: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateProfile, darkMode = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const [formData, setFormData] = useState({
    username: user.username,
    phone: user.phone || '',
    gender: user.gender || 'Male',
    dob: user.dob || '',
    city: user.city || '',
    institution: user.institution || '',
    bio: user.bio || '',
    githubUrl: user.githubUrl || '',
    linkedinUrl: user.linkedinUrl || '',
    avatarUrl: user.avatarUrl || '',
    skills: user.skills || [],
    interests: user.interests || [],
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const success = await onUpdateProfile(formData);
    setSaving(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
  };

  const card = darkMode ? 'bg-[#1e1e2e] border-slate-700' : 'bg-white border-slate-200/80';
  const innerCard = darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50/80 border-slate-100';
  const labelCls = darkMode ? 'text-slate-300' : 'text-slate-700';
  const inputCls = darkMode
    ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-[#9b51e0]'
    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#9b51e0]';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Profile Header Card */}
      <div className={`rounded-3xl border shadow-sm overflow-hidden ${card}`}>
        {/* Cover Banner */}
        <div className="h-44 bg-gradient-to-r from-purple-900 via-[#622569] to-[#9b51e0] relative">
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#622569] px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>MEMBER RECORD VERIFIED</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-8 relative pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-20 mb-6">
            <div className="flex items-end gap-6">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={user.username}
                className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-md bg-white shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className={`text-3xl font-bold font-['Poppins'] tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{user.username}</h1>
                  {user.role === 'lead' && (
                    <span className="bg-purple-100 text-[#622569] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Chapter Lead
                    </span>
                  )}
                </div>
                <p className={`text-xs font-semibold mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{user.institution}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 rounded-xl bg-[#622569] hover:bg-[#9b51e0] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* EDIT FORM or READ-ONLY VIEW */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-5">
              <h3 className={`text-sm font-bold font-['Poppins'] ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Update Profile Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Full Name</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#9b51e0]/20 transition-all ${inputCls}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className={`w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#9b51e0]/20 transition-all ${inputCls}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl text-sm outline-none ${inputCls}`}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl text-sm outline-none ${inputCls}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl text-sm outline-none ${inputCls}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Institution</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl text-sm outline-none ${inputCls}`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Bio / Statement</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl text-sm outline-none resize-none ${inputCls}`}
                    placeholder="Tell the chapter about yourself..."
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl text-sm outline-none ${inputCls}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl text-sm outline-none ${inputCls}`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Avatar Image URL</label>
                  <input
                    type="url"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl text-sm outline-none ${inputCls}`}
                  />
                </div>

                {/* Skills Tag Management */}
                <div className="md:col-span-2">
                  <label className={`block text-xs font-semibold mb-1 ${labelCls}`}>Skills</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="e.g. Python, React, IoT"
                      className={`flex-1 px-3 py-2 border rounded-xl text-sm outline-none ${inputCls}`}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-[#622569] hover:bg-[#9b51e0] text-white text-xs font-bold rounded-xl transition-all"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.skills.map((s) => (
                      <span key={s} className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-[#622569] text-xs font-semibold rounded-lg">
                        {s}
                        <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => removeSkill(s)} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`flex justify-end gap-3 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${darkMode ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#622569] hover:bg-[#9b51e0] shadow transition-all disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          ) : (
            /* READ ONLY VIEW */
            <div className={`space-y-6 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              {/* Bio Statement */}
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>About Member</h4>
                <p className={`text-sm leading-relaxed p-4 rounded-2xl border ${innerCard} ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {user.bio || 'No bio provided yet.'}
                </p>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Mail, label: 'Email Address', value: user.email },
                  { icon: Phone, label: 'Phone Number', value: user.phone || 'N/A' },
                  { icon: Calendar, label: 'Date of Birth & Gender', value: `${user.dob || 'N/A'} • ${user.gender || 'N/A'}` },
                  { icon: MapPin, label: 'City', value: user.city || 'N/A' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className={`p-4 rounded-2xl border space-y-1 ${innerCard}`}>
                    <div className={`flex items-center gap-2 text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                      <Icon className="w-3.5 h-3.5 text-purple-600" />
                      <span>{label}</span>
                    </div>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{value}</p>
                  </div>
                ))}

                <div className={`p-4 rounded-2xl border space-y-1 md:col-span-2 ${innerCard}`}>
                  <div className={`flex items-center gap-2 text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                    <Building className="w-3.5 h-3.5 text-purple-600" />
                    <span>Institution</span>
                  </div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{user.institution}</p>
                </div>
              </div>

              {/* Skills & Interests */}
              {user.skills && user.skills.length > 0 && (
                <div className="space-y-2">
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((s) => (
                      <span key={s} className="px-3 py-1 bg-purple-100 text-[#622569] text-xs font-semibold rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Connections */}
              <div className={`pt-4 border-t flex gap-4 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                {user.githubUrl && (
                  <a href={user.githubUrl} target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-xs font-semibold hover:text-[#622569] ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <Github className="w-4 h-4" />
                    <span>GitHub Profile</span>
                  </a>
                )}
                {user.linkedinUrl && (
                  <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-xs font-semibold hover:text-[#622569] ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
