import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { User, ActivityLog } from '../types';
import { Shield, ShieldAlert, ShieldCheck, Trash2, Activity, Users, Loader2, AlertCircle } from 'lucide-react';

interface AdminViewProps {
  currentUser: User | null;
  darkMode: boolean;
}

export function AdminView({ currentUser, darkMode }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'activity'>('users');
  const [members, setMembers] = useState<User[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'users') {
        const res = await api.getMembers();
        if (res.success) setMembers(res.members);
        else setError('Failed to load users');
      } else {
        const res = await api.getActivities();
        if (res.success) setActivities(res.activities);
        else setError(res.message || 'Failed to load activity logs');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      const res = await api.updateUserRole(userId, newRole);
      if (res.success) {
        fetchData();
      } else {
        alert(res.message || 'Failed to update role');
      }
    } catch (err) {
      alert('Error updating role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('WARNING: Are you absolutely sure you want to delete this user? This cannot be undone.')) return;
    try {
      const res = await api.deleteUser(userId);
      if (res.success) {
        fetchData();
      } else {
        alert(res.message || 'Failed to delete user');
      }
    } catch (err) {
      alert('Error deleting user');
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Access Denied</h2>
        <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>You do not have permission to view this page.</p>
      </div>
    );
  }

  const bgClass = darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900';
  const textMuted = darkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-3xl font-bold font-['Poppins'] tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Admin Dashboard
          </h1>
          <p className={`text-sm mt-1 ${textMuted}`}>Manage platform users and monitor system activity.</p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'users' 
              ? 'border-[#9b51e0] text-[#9b51e0]' 
              : `border-transparent hover:text-slate-300 ${textMuted}`
          }`}
        >
          <Users className="w-4 h-4" /> User Management
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'activity' 
              ? 'border-[#9b51e0] text-[#9b51e0]' 
              : `border-transparent hover:text-slate-300 ${textMuted}`
          }`}
        >
          <Activity className="w-4 h-4" /> Activity Logs
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#9b51e0]" />
        </div>
      ) : activeTab === 'users' ? (
        <div className={`rounded-xl border overflow-hidden ${bgClass}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={`text-xs uppercase bg-black/5 dark:bg-white/5 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Joined</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={member.avatarUrl} alt={member.username} className="w-8 h-8 rounded-full bg-slate-200 object-cover" />
                        <div>
                          <p className="font-semibold">{member.username}</p>
                          <p className={`text-xs ${textMuted}`}>{member.institution}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${textMuted}`}>{member.email}</td>
                    <td className={`px-6 py-4 ${textMuted}`}>{member.joinedAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {member.role === 'admin' ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <Shield className="w-4 h-4 text-slate-400" />}
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          disabled={member.id === currentUser.id}
                          className={`text-xs py-1 px-2 rounded border outline-none ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-300'}`}
                        >
                          <option value="member">Member</option>
                          <option value="lead">Lead</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(member.id)}
                        disabled={member.id === currentUser.id}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={`rounded-xl border overflow-hidden ${bgClass}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={`text-xs uppercase bg-black/5 dark:bg-white/5 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <tr>
                  <th className="px-6 py-4 font-semibold">Time</th>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                  <th className="px-6 py-4 font-semibold">Entity</th>
                  <th className="px-6 py-4 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {activities.map(log => (
                  <tr key={log.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className={`px-6 py-3 whitespace-nowrap text-xs ${textMuted}`}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 font-medium">{log.userName}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        log.action.includes('DELETE') ? 'bg-rose-500/10 text-rose-500' :
                        log.action.includes('CREATE') || log.action.includes('INIT') ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className={`px-6 py-3 ${textMuted}`}>{log.entityType} <span className="text-xs opacity-70">({log.entityName})</span></td>
                    <td className="px-6 py-3">{log.details}</td>
                  </tr>
                ))}
                {activities.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No activity logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
