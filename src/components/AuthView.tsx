import React, { useState } from 'react';
import { api } from '../api';
import { User } from '../types';
import {
  UserCheck, Lock, Mail, Phone, Calendar, MapPin,
  Building, User as UserIcon, Sparkles, AlertCircle, ArrowRight, ChevronDown
} from 'lucide-react';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
  darkMode?: boolean;
}

import { COUNTRY_CODES } from '../countryCodes';

/**
 * Validates a phone number (just the local part, without country code).
 * Accepts 6–15 digits, allowing spaces and hyphens.
 */
function validatePhone(local: string): string | null {
  if (!local) return null; // phone is optional
  const digits = local.replace(/[\s\-]/g, '');
  if (!/^\d+$/.test(digits)) return 'Phone number must contain only digits, spaces, or hyphens.';
  if (digits.length < 6)  return 'Phone number is too short (minimum 6 digits).';
  if (digits.length > 15) return 'Phone number is too long (maximum 15 digits).';
  return null;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, darkMode = false }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regData, setRegData] = useState({
    username: '',
    email: '',
    password: '',
    gender: 'Male',
    dob: '',
    city: '',
    institution: ''
  });

  // Phone state — country code + local number
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]); // India default
  const [localPhone, setLocalPhone] = useState('');

  const handlePhoneChange = (value: string) => {
    setLocalPhone(value);
    const err = validatePhone(value);
    setPhoneError(err);
  };

  const getFullPhone = () => {
    if (!localPhone) return '';
    const digits = localPhone.replace(/[\s\-]/g, '');
    return `${selectedCountry.dial} ${digits}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both Email Address and Password.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await api.login(loginEmail, loginPassword);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMsg('Failed to connect to backend server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.username || !regData.email || !regData.password) {
      setErrorMsg('Username, Email and Password are required.');
      return;
    }
    const phoneValidation = validatePhone(localPhone);
    if (phoneValidation) {
      setPhoneError(phoneValidation);
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await api.register({
        ...regData,
        phone: getFullPhone(),
      });
      if (res.success && res.user) {
        onAuthSuccess(res.user);
      } else {
        setErrorMsg(res.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo account quick login
  const handleQuickDemoLogin = async (email: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.login(email, 'password123');
      if (res.success && res.user) {
        onAuthSuccess(res.user);
      } else {
        setErrorMsg('Demo account login error.');
      }
    } catch {
      setErrorMsg('Failed to sign in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const cardBg = darkMode ? 'bg-[#1e1e2e] border-slate-700' : 'bg-white border-white/20';
  const labelColor = darkMode ? 'text-slate-300' : 'text-slate-700';
  const inputBase = darkMode
    ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:bg-slate-700 focus:border-[#9b51e0]'
    : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#9b51e0]';
  const inputCls = `w-full py-2.5 bg-opacity-100 border rounded-xl text-sm focus:ring-2 focus:ring-[#9b51e0]/20 outline-none transition-all ${inputBase}`;

  return (
    <div className={`min-h-[calc(100vh-65px)] py-12 px-4 flex items-center justify-center transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-[#2a0c31] via-[#1a0a20] to-[#0f0a1a]'
        : 'bg-gradient-to-br from-[#622569] via-[#4a1b50] to-[#2b0f30]'
    }`}>
      <div className={`w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border ${cardBg}`}>

        {/* Auth Header */}
        <div className="bg-gradient-to-r from-[#622569] to-[#9b51e0] p-8 text-white text-center relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="w-12 h-12 mx-auto mb-3 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md relative z-10">
            <Sparkles className="w-6 h-6 text-purple-200" />
          </div>
          <h2 className="text-2xl font-bold font-['Poppins'] tracking-tight relative z-10">IET CONNECT PORTAL</h2>
          <p className="text-xs text-purple-100/90 mt-1 relative z-10">Empowering Engineers & Technology Innovators Worldwide</p>

          {/* Toggle Pills */}
          <div className="mt-6 inline-flex bg-black/20 p-1 rounded-2xl border border-white/10 relative z-10">
            <button
              onClick={() => { setIsLoginView(true); setErrorMsg(null); }}
              className={`px-6 py-2 rounded-xl text-xs font-semibold transition-all ${
                isLoginView ? 'bg-white text-[#622569] shadow-md' : 'text-purple-100 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLoginView(false); setErrorMsg(null); }}
              className={`px-6 py-2 rounded-xl text-xs font-semibold transition-all ${
                !isLoginView ? 'bg-white text-[#622569] shadow-md' : 'text-purple-100 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-8">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isLoginView ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${labelColor}`}>Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="email@example.com"
                    className={`${inputCls} pl-10 pr-4`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${labelColor}`}>Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputCls} pl-10 pr-4`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#622569] hover:bg-[#9b51e0] active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Authenticating...' : 'Access Portal'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              {/* Demo Accounts Box */}
              <div className={`mt-8 pt-6 border-t text-center ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <p className={`text-xs font-medium mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Quick Demo Login (Pre-configured Users)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('venkatns2008@gmail.com')}
                    className="py-2 px-3 bg-purple-50 hover:bg-purple-100 text-[#622569] text-xs font-medium rounded-xl border border-purple-200 transition-colors"
                  >
                    Login as Chapter Lead
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('sarah.chen@iet.org')}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border transition-colors ${
                      darkMode
                        ? 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    Login as Student Member
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>Username *</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={regData.username}
                      onChange={(e) => setRegData({ ...regData, username: e.target.value })}
                      placeholder="John Doe"
                      className={`${inputCls} pl-9 pr-3 py-2 text-xs`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      placeholder="john@example.com"
                      className={`${inputCls} pl-9 pr-3 py-2 text-xs`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      placeholder="••••••••"
                      className={`${inputCls} pl-9 pr-3 py-2 text-xs`}
                    />
                  </div>
                </div>

                {/* Phone Number — Country Code + Local Number */}
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>
                    Phone Number
                    <span className={`ml-1 font-normal ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>(optional)</span>
                  </label>
                  <div className={`flex items-center border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#9b51e0]/20 transition-all ${darkMode ? 'border-slate-600 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                    {/* Country Code Selector */}
                    <div className={`relative shrink-0 border-r ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                      <select
                        value={selectedCountry.code}
                        onChange={(e) => {
                          const found = COUNTRY_CODES.find(c => c.code === e.target.value);
                          if (found) setSelectedCountry(found);
                        }}
                        className={`appearance-none h-full pl-3 pr-7 py-2 bg-transparent text-xs font-mono font-medium outline-none cursor-pointer ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}
                        title="Select country code"
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>
                            {c.dial.padEnd(5, '\u00A0')} {c.flag}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Local Number Input */}
                    <div className="relative flex-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        value={localPhone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="98765 43210"
                        className={`w-full bg-transparent pl-9 pr-3 py-2 text-xs outline-none ${darkMode ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`}
                        maxLength={17}
                      />
                    </div>
                  </div>
                  {phoneError && (
                    <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {phoneError}
                    </p>
                  )}
                  {!phoneError && localPhone && (
                    <p className={`mt-1 text-[11px] ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      ✓ Full number: {getFullPhone()}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>Gender</label>
                  <select
                    value={regData.gender}
                    onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                    className={`${inputCls} px-3 py-2 text-xs`}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>Date of Birth</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="date"
                      value={regData.dob}
                      onChange={(e) => setRegData({ ...regData, dob: e.target.value })}
                      className={`${inputCls} pl-9 pr-3 py-2 text-xs`}
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>City</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={regData.city}
                      onChange={(e) => setRegData({ ...regData, city: e.target.value })}
                      placeholder="Chennai"
                      className={`${inputCls} pl-9 pr-3 py-2 text-xs`}
                    />
                  </div>
                </div>

                {/* Institution */}
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>Institution / Campus</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={regData.institution}
                      onChange={(e) => setRegData({ ...regData, institution: e.target.value })}
                      placeholder="SRM / RVCE / Anna Univ"
                      className={`${inputCls} pl-9 pr-3 py-2 text-xs`}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !!phoneError}
                className="w-full py-3 px-4 bg-[#622569] hover:bg-[#9b51e0] text-white font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Member Record...' : 'Register Account'}
                {!loading && <UserCheck className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
