import React, { useState } from 'react';
import {
  HeartPulse,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Users,
  Activity,
  Zap,
} from 'lucide-react';
import type { PageId, UserProfile } from '../types';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { signInWithSupabase, signUpWithSupabase, signInWithGoogle } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { useToast } from '../context/ToastContext';

interface AuthPageProps {
  onNavigate: (page: PageId) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleQuickDemoLogin = async () => {
    setEmail('alex.morgan@healthbuddy.io');
    setPassword('demo123456');
    setMode('signin');
    setIsLoading(true);
    setErrorMsg('');
    try {
      const { user, error } = await signInWithSupabase('alex.morgan@healthbuddy.io', 'demo123456');
      if (error) {
        setErrorMsg(error);
      } else if (user) {
        showToast({
          type: 'success',
          title: 'Demo Sign In Successful',
          message: `Logged in as ${user.name}`,
        });
        onLoginSuccess(user);
        onNavigate('dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Quick sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg('');
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error);
        showToast({ type: 'error', title: 'Google Sign-In Failed', message: error });
      }
      // On success, Supabase redirects the browser — no further action needed here
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google sign-in failed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { user, error } = await signUpWithSupabase(email, password, fullName);
        if (error) {
          setErrorMsg(error);
          showToast({ type: 'error', title: 'Registration Failed', message: error });
        } else if (user) {
          showToast({
            type: 'success',
            title: 'Account Created Successfully!',
            message: `Welcome to HealthBuddy, ${user.name}!`,
          });
          onLoginSuccess(user);
          onNavigate('dashboard');
        }
      } else {
        const { user, error } = await signInWithSupabase(email, password);
        if (error) {
          setErrorMsg(error);
          showToast({ type: 'error', title: 'Sign In Failed', message: error });
        } else if (user) {
          showToast({
            type: 'success',
            title: 'Welcome Back!',
            message: `Signed in as ${user.name}`,
          });
          onLoginSuccess(user);
          onNavigate('dashboard');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-stretch font-sans selection:bg-teal-500 selection:text-white overflow-x-hidden">
      {/* LEFT PANEL — High-Tech Startup Hero Showcase */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 p-12 relative overflow-hidden border-r border-slate-800">
        {/* Glow ambient effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Brand Logo */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group z-10"
        >
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 shadow-xl group-hover:scale-105 transition-transform">
            <HeartPulse className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-none">HealthBuddy</h1>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-teal-400">
              Post-Care Management
            </span>
          </div>
        </div>

        {/* Center Showcase Content */}
        <div className="my-auto py-12 z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider animate-pulse-subtle">
            <Sparkles className="w-4 h-4 text-teal-300" /> Powered by Supabase Auth & DB
          </div>

          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            “Survival is only the first step.”
          </h2>

          <p className="text-slate-300 text-base leading-relaxed">
            Understand your health. Respond faster. Manage continuous post-recovery care for yourself and your entire family.
          </p>

          {/* Floating Glassmorphic Metric Cards */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 w-fit mb-2">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">24/7 AI Triage</h4>
              <p className="text-xs text-slate-400 mt-0.5">Symptom evaluation & guidance</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 w-fit mb-2">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Family Profiles</h4>
              <p className="text-xs text-slate-400 mt-0.5">Centralized record tracking</p>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 z-10">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-teal-400" /> HIPAA Compliant Security UI
          </span>
          <span className="font-mono text-[11px] text-teal-400">v2.4 Production</span>
        </div>
      </div>

      {/* RIGHT PANEL — Modern Interactive Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Mobile Header Logo */}
        <div
          onClick={() => onNavigate('landing')}
          className="lg:hidden flex items-center gap-3 cursor-pointer mb-8"
        >
          <div className="p-2.5 rounded-2xl bg-teal-600 text-white shadow-md">
            <HeartPulse className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight">HealthBuddy</span>
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Top Form Header */}
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h3>

              {isSupabaseConfigured ? (
                <Badge variant="success" size="sm" dot>
                  Supabase Live
                </Badge>
              ) : (
                <Badge variant="teal" size="sm" dot>
                  Local Auth Mode
                </Badge>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-400">
              {mode === 'signin'
                ? 'Sign in to access your personal health overview & medicine reminders.'
                : 'Register to start tracking medications, emergency contacts, and family health.'}
            </p>
          </div>

          {/* Tab Switcher Pills */}
          <div className="flex rounded-2xl bg-slate-900 p-1.5 border border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                mode === 'signin'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo One-Click Sign In Trigger */}
          <div className="p-3.5 rounded-2xl bg-teal-950/60 border border-teal-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 shrink-0">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <p className="text-xs font-bold text-teal-200">Instant Demo Access</p>
                <p className="text-[10px] text-teal-400">One-click sign in as Alex Morgan</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs shrink-0"
            >
              Demo Sign In
            </button>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 bg-rose-950/80 text-rose-200 text-xs rounded-2xl border border-rose-800 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {mode === 'signup' && (
              <Input
                label="Full Name *"
                placeholder="e.g. Alex Morgan"
                variant="dark"
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            )}

            <Input
              label="Email Address *"
              type="email"
              placeholder="e.g. alex.morgan@healthbuddy.io"
              variant="dark"
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-1">
              <Input
                label="Password *"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                variant="dark"
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="p-1 text-slate-400 hover:text-teal-400 focus:outline-none transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-teal-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {mode === 'signup' && (
              <Input
                label="Confirm Password *"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                variant="dark"
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="p-1 text-slate-400 hover:text-teal-400 focus:outline-none transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-teal-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="mt-2 text-sm font-extrabold py-3.5"
            >
              {mode === 'signin' ? 'Sign In to HealthBuddy' : 'Register Account'}
            </Button>
          </form>

          {/* ─── Google Sign-In Divider ─── */}
          <div className="relative flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">or continue with</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 font-bold text-sm transition-all shadow-sm border border-gray-200 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isGoogleLoading ? (
              <svg className="w-5 h-5 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              /* Official Google G logo SVG */
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            )}
            <span>{isGoogleLoading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Toggle mode text */}
          <div className="pt-2 text-center text-xs text-slate-400">
            <p>
              {mode === 'signin' ? "Don't have a HealthBuddy account?" : 'Already registered?'}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setErrorMsg('');
                }}
                className="ml-1 text-teal-400 font-extrabold hover:underline"
              >
                {mode === 'signin' ? 'Create Account' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="pt-4 border-t border-slate-900 text-center text-[11px] text-slate-500">
            <p className="flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Encrypted 256-Bit SSL Connection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
