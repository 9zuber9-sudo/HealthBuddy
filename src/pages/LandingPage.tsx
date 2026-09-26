import React from 'react';
import {
  HeartPulse,
  Sparkles,
  ShieldAlert,
  Pill,
  FileText,
  Users,
  MapPin,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import type { PageId } from '../types';
import { Button } from '../components/common/Button';

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const featureCards = [
    {
      id: 'ai-guide' as PageId,
      title: 'AI Health Guide',
      subtitle: 'Instant non-diagnostic symptom analysis and guidance for what to do next.',
      icon: Sparkles,
      color: 'from-sky-500 to-teal-500',
    },
    {
      id: 'emergency' as PageId,
      title: 'Emergency Mode',
      subtitle: 'Instant emergency call, nearby hospital finder, and essential first-aid guides.',
      icon: ShieldAlert,
      color: 'from-red-500 to-rose-600',
    },
    {
      id: 'medicines' as PageId,
      title: 'Medicine Reminder',
      subtitle: 'Schedule dosage times, track daily completion, and set medication alerts.',
      icon: Pill,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'records' as PageId,
      title: 'Health Records',
      subtitle: 'Securely store prescriptions, lab reports, vaccination files, and doctor notes.',
      icon: FileText,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'family' as PageId,
      title: 'Family Health',
      subtitle: 'Manage prescriptions, emergency info, and medical histories for loved ones.',
      icon: Users,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'healthcare' as PageId,
      title: 'Find Healthcare',
      subtitle: 'Locate nearby 24/7 hospitals, pharmacies, clinical labs, and urgent care clinics.',
      icon: MapPin,
      color: 'from-blue-500 to-cyan-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      <header className="px-6 py-5 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 shadow-lg">
            <HeartPulse className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight">HealthBuddy</span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-slate-300 hover:text-white" onClick={() => onNavigate('auth')}>
            Sign In
          </Button>
          <Button variant="primary" size="md" onClick={() => onNavigate('auth')} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Get Started
          </Button>
        </div>
      </header>

      <section className="relative pt-16 pb-20 px-6 max-w-6xl mx-auto text-center flex flex-col items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-subtle">
          <Sparkles className="w-4 h-4" /> Next-Gen Post-Care SaaS Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl leading-tight">
          HealthBuddy
        </h1>

        <p className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-sky-300 mt-4 max-w-3xl">
          “Survival is only the first step.”
        </p>

        <p className="text-base sm:text-xl text-slate-400 mt-6 max-w-2xl font-normal leading-relaxed">
          Understand your health. Respond faster. Manage care for yourself and your family.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Button
            variant="primary"
            size="xl"
            onClick={() => onNavigate('auth')}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="border-slate-700 text-slate-200 hover:bg-slate-800"
            onClick={() => {
              const el = document.getElementById('features');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore Features
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 w-full max-w-4xl pt-8 border-t border-slate-800/80 text-left">
          <div className="p-4 rounded-2xl bg-slate-850/50 border border-slate-800">
            <span className="text-2xl font-black text-teal-400">24/7</span>
            <p className="text-xs text-slate-400 mt-1">Emergency Guidance</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-850/50 border border-slate-800">
            <span className="text-2xl font-black text-emerald-400">100%</span>
            <p className="text-xs text-slate-400 mt-1">Private & Encrypted</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-850/50 border border-slate-800">
            <span className="text-2xl font-black text-sky-400">Multi-User</span>
            <p className="text-xs text-slate-400 mt-1">Family Health Management</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-850/50 border border-slate-800">
            <span className="text-2xl font-black text-purple-400">REST API</span>
            <p className="text-xs text-slate-400 mt-1">Backend Ready Architecture</p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-6 bg-slate-950 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Comprehensive Post-Recovery Management
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
              Designed for modern health-tech startup needs with zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  onClick={() => onNavigate(feat.id)}
                  className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} text-slate-950 flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {feat.subtitle}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-teal-400 group-hover:text-teal-300">
                    <span>Open Module</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="mt-auto py-8 px-6 border-t border-slate-800 text-center text-xs text-slate-500 bg-slate-900">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-slate-400 font-medium">
            “HealthBuddy provides general health information and does not replace professional medical advice.”
          </p>
          <p className="text-slate-600">
            HealthBuddy © 2026 • Modern Healthcare SaaS Platform Demo
          </p>
        </div>
      </footer>
    </div>
  );
};
