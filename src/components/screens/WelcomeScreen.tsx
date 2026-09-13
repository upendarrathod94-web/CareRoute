import React from 'react';
import { ASSETS_3D } from '../../assets/assetRegistry';
import { ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
  onExistingUser: () => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onGetStarted, onExistingUser }) => {
  return (
    <div className="flex flex-col h-full justify-between p-6 text-center animate-fadeIn">
      {/* Top Tag */}
      <div className="pt-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold dark:bg-teal-950/50 dark:border-teal-800 dark:text-teal-300">
          <HeartPulse className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Patient-First Health Companion</span>
        </div>
      </div>

      {/* 3D Visual Centerpiece */}
      <div className="flex flex-col items-center my-auto py-2">
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 mb-6 rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-700 ring-1 ring-slate-200 dark:ring-slate-800 transform hover:scale-[1.02] transition-transform">
          <img
            src={ASSETS_3D.welcome}
            alt="CareRoute 3D Journey"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          Welcome to <span className="text-blue-600 dark:text-blue-400">CareRoute</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-xs mx-auto">
          Simple medicine reminders and doctor visit management, with family support when you want it.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pb-2">
        <button
          onClick={onGetStarted}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 text-lg transition-all"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={onExistingUser}
          className="w-full h-12 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 font-medium rounded-2xl text-base transition-colors"
        >
          I already have an account
        </button>

        <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Private by default • Patient controlled</span>
        </div>
      </div>
    </div>
  );
};
