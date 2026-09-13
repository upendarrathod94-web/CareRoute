import React from 'react';
import { UserRole } from '../../types';
import { User, Users, Check, ArrowRight, Shield } from 'lucide-react';

interface Props {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onContinue: () => void;
}

export const RoleSelectionScreen: React.FC<Props> = ({
  selectedRole,
  onSelectRole,
  onContinue,
}) => {
  return (
    <div className="flex flex-col h-full justify-between p-6 animate-fadeIn">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
            Step 1 of 3
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Account Setup</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Who's using CareRoute?
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
          This helps us customize the text size, reminders, and privacy controls specifically for your needs.
        </p>

        <div className="space-y-4">
          {/* Patient Role Card */}
          <button
            type="button"
            onClick={() => onSelectRole('patient')}
            className={`w-full p-5 rounded-2xl border-2 text-left transition-all relative flex items-start gap-4 ${
              selectedRole === 'patient'
                ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-500 shadow-md ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                selectedRole === 'patient'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <User className="w-6 h-6" />
            </div>

            <div className="flex-1 pr-6">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  I'm the patient
                </h3>
                <span className="text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                  Most common
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                Manage my own medicines, see appointment schedules, and stay in control of my health.
              </p>
            </div>

            {selectedRole === 'patient' && (
              <div className="absolute top-5 right-5 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Check className="w-4 h-4" strokeWidth={3} />
              </div>
            )}
          </button>

          {/* Caregiver Role Card */}
          <button
            type="button"
            onClick={() => onSelectRole('caregiver')}
            className={`w-full p-5 rounded-2xl border-2 text-left transition-all relative flex items-start gap-4 ${
              selectedRole === 'caregiver'
                ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 dark:border-teal-500 shadow-md ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                selectedRole === 'caregiver'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Users className="w-6 h-6" />
            </div>

            <div className="flex-1 pr-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                I'm a caregiver
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                Help a parent, spouse, or family member when needed, strictly with their permission.
              </p>
            </div>

            {selectedRole === 'caregiver' && (
              <div className="absolute top-5 right-5 w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-sm">
                <Check className="w-4 h-4" strokeWidth={3} />
              </div>
            )}
          </button>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Caregivers can only see information the patient explicitly permits. Access can be removed at any moment.
          </p>
        </div>
      </div>

      <div className="pt-4 pb-2">
        <button
          type="button"
          onClick={onContinue}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 text-base transition-all"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
