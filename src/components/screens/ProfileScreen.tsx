import React from 'react';
import { AccessibilitySettings } from '../../types';
import {
  User,
  Bell,
  Clock,
  Users,
  Shield,
  Sliders,
  HelpCircle,
  ChevronRight,
  LogOut,
  Usb,
  Volume2,
} from 'lucide-react';
import { playChime } from '../../utils/audioHaptics';

interface Props {
  settings: AccessibilitySettings;
  onNavigateAccessibility: () => void;
  onNavigateNotifications: () => void;
  onNavigateCareCircle: () => void;
  onSignOut: () => void;
  onShowToast: (msg: string) => void;
  onOpenApkModal?: () => void;
  onTestAlarm?: () => void;
}

export const ProfileScreen: React.FC<Props> = ({
  settings,
  onNavigateAccessibility,
  onNavigateNotifications,
  onNavigateCareCircle,
  onSignOut,
  onShowToast,
  onOpenApkModal,
  onTestAlarm,
}) => {
  return (
    <div className="flex flex-col min-h-full px-5 py-6 space-y-6 max-w-xl mx-auto w-full animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings & Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your account, preferences, and Care Circle.
        </p>
      </div>

      {/* 10. Clean List Rows in Simple Sections */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-xs overflow-hidden">
        {/* Section 1: Profile */}
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-base flex items-center justify-center shrink-0">
              ML
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Margaret Lewis
                </h3>
                <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400">
                  Patient
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Age 72 · Medical ID: #CR-882190
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Medication Reminders */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            if (onTestAlarm) onTestAlarm();
            else onShowToast('Medication alarm sound verified.');
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Medication Reminders
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Alarm schedules, sound chimes, and snooze duration
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        {/* Section 3: Notifications */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            onNavigateNotifications();
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Notifications
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lock-screen name masking, vibration, and banner alerts
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        {/* Section 4: Care Circle */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            onNavigateCareCircle();
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Care Circle
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Priya Sharma (Daughter) · 1 caregiver connected
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        {/* Section 5: Privacy */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            onShowToast('HIPAA & Health Privacy encryption verified.');
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Privacy
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Encrypted storage, data sharing consents, cloud backup
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        {/* Section 6: Accessibility */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            onNavigateAccessibility();
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Accessibility
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Text sizing ({settings.textSize}), dark mode, high contrast
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        {/* Section 7: Help & Support / USB transfer */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            if (onOpenApkModal) onOpenApkModal();
            else onShowToast('Need help? Contact support or your healthcare provider.');
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Help & Support
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Phone install instructions, emergency contacts, FAQ
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>
      </div>

      {/* Sign Out Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSignOut}
          className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-400 hover:text-red-600 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
