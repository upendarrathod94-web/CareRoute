import React from 'react';
import { AccessibilitySettings } from '../../types';
import {
  Sliders,
  Bell,
  Globe,
  Shield,
  Phone,
  AlertTriangle,
  ChevronRight,
  LogOut,
  Heart,
  HelpCircle,
  Download,
  Usb,
  Sparkles,
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
  onRevisitWelcome?: () => void;
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
  onRevisitWelcome,
  onTestAlarm,
}) => {
  return (
    <div className="flex flex-col h-full p-4 sm:p-5 overflow-y-auto animate-fadeIn">
      {/* Patient Profile Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700 mb-4 shadow-xs flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
          M
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-lg text-slate-900 dark:text-white">
              Margaret Lewis
            </h1>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              Patient
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Age 72 • Prescriptions: 4 Active
          </p>
          <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium mt-0.5">
            Text Size: <span className="capitalize font-bold">{settings.textSize}</span> • {settings.darkMode ? 'Dark' : 'Light'} Mode
          </p>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/60 shadow-xs mb-4">
        {/* Accessibility */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            onNavigateAccessibility();
          }}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Accessibility & Display
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Text sizing, contrast, dark mode, audio
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[11px] capitalize text-slate-500">{settings.textSize}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Notifications & Privacy */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            onNavigateNotifications();
          }}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Notifications & Privacy
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Lock-screen name masking, vibration, sounds
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Care Circle & Sharing */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            onNavigateCareCircle();
          }}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Care Circle & Family Access
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Manage what Priya or caregivers can see
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Language */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            onShowToast('Language set to English (US). Additional languages available in production.');
          }}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                App Language
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Simple words without medical jargon
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">English</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Emergency Contact */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            onShowToast('Primary Emergency Contact: Priya Sharma (+1 555-234-8901)');
          }}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Emergency Contact
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Priya Sharma (Daughter) • One-tap dialing
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Transfer to Phone via USB / Download Android APK */}
        {onOpenApkModal && (
          <button
            type="button"
            onClick={() => {
              playChime('click');
              onOpenApkModal();
            }}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                <Usb className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-teal-700 dark:text-teal-400">
                  Transfer to Phone via USB / APK
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Step-by-step instructions to copy &amp; install on your Android phone
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center gap-1">
              <Usb className="w-3 h-3" />
              <span>USB</span>
            </span>
          </button>
        )}

        {/* Revisit Welcome Tour */}
        {onRevisitWelcome && (
          <button
            type="button"
            onClick={() => {
              playChime('click');
              onRevisitWelcome();
            }}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Welcome Tour & Setup
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Revisit introductory walkthrough & role selection
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        )}

        {/* Test Dose Reminder Alert */}
        {onTestAlarm && (
          <button
            type="button"
            onClick={() => {
              playChime('alert');
              onTestAlarm();
            }}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Test Lock-Screen Dose Alert
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Simulate incoming high-priority medicine notification
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
              Test
            </span>
          </button>
        )}
      </div>

      {/* Safe Clinical & Emergency Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 mb-4 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <strong>Important Clinical & Legal Disclaimer:</strong>
          <p className="mt-0.5">
            CareRoute is an organizational companion and is not a licensed physician or emergency dispatch provider. In any acute medical emergency, please dial 911 immediately.
          </p>
        </div>
      </div>

      {/* Sign Out / Reset Button */}
      <div className="mt-auto pt-2 pb-2">
        <button
          type="button"
          onClick={onSignOut}
          className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out / Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};
