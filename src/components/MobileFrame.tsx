import React from 'react';
import { MainTab, ScreenId, AccessibilitySettings } from '../types';
import {
  Home,
  Calendar,
  Pill,
  Users,
  User,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../utils/audioHaptics';

interface Props {
  currentScreen: ScreenId;
  currentTab: MainTab;
  accessibility: AccessibilitySettings;
  onNavigateTab: (tab: MainTab) => void;
  onJumpToScreen: (screen: ScreenId) => void;
  notificationBanner: {
    visible: boolean;
    title: string;
    message: string;
    onClick?: () => void;
  } | null;
  onDismissNotification: () => void;
  children: React.ReactNode;
  hideTopControlBar?: boolean;
}

const TAB_CONFIG: { tab: MainTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { tab: 'today', label: 'Today', icon: Home },
  { tab: 'appointments', label: 'Visits', icon: Calendar },
  { tab: 'medicines', label: 'Medicines', icon: Pill },
  { tab: 'circle', label: 'Care Circle', icon: Users },
  { tab: 'profile', label: 'Profile', icon: User },
];

export const MobileFrame: React.FC<Props> = ({
  currentScreen,
  currentTab,
  accessibility,
  onNavigateTab,
  notificationBanner,
  children,
}) => {
  // Bottom navigation only visible on the 5 core tabs
  const isBottomNavVisible = ['today', 'appointments', 'medicines', 'care_circle', 'profile'].includes(currentScreen);

  const getTextScaleClass = () => {
    switch (accessibility.textSize) {
      case 'large':
        return 'text-[17px]';
      case 'largest':
        return 'text-[19px]';
      default:
        return 'text-[15px]';
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start overflow-hidden bg-slate-950">
      {/* Universal Direct Phone Application Container - Suitable for Mobile, Tablet & Desktop */}
      <div
        className={`w-full h-full max-w-xl md:max-w-2xl flex flex-col relative transition-all duration-200 overflow-hidden sm:border-x sm:border-slate-800/80 ${
          accessibility.darkMode
            ? 'bg-slate-900 text-slate-100'
            : 'bg-slate-50 text-slate-900'
        } ${accessibility.highContrast ? 'ring-4 ring-amber-400' : ''} ${getTextScaleClass()}`}
      >
        {/* In-App Notification Banner */}
        {notificationBanner?.visible && (
          <div
            onClick={notificationBanner.onClick}
            className="absolute top-3 left-3 right-3 z-40 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl border border-slate-700/80 cursor-pointer animate-fadeIn"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                CR
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-teal-400">CareRoute Alert</span>
                  <span className="text-[10px] text-slate-400">now</span>
                </div>
                <p className="font-bold text-xs text-white truncate mt-0.5">
                  {notificationBanner.title}
                </p>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {notificationBanner.message}
                </p>
              </div>
            </div>
            <p className="text-[9px] text-teal-300 mt-1 text-right">Tap to view</p>
          </div>
        )}

        {/* Universal Screen Content Canvas */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </div>

        {/* Accessible Bottom Navigation Bar */}
        {isBottomNavVisible && (
          <nav
            aria-label="Bottom Navigation"
            className={`h-16 px-4 border-t flex items-center justify-around shrink-0 z-20 transition-colors ${
              accessibility.darkMode
                ? 'bg-slate-900/98 border-slate-800'
                : 'bg-white/98 border-slate-200 shadow-sm'
            }`}
          >
            {TAB_CONFIG.map(({ tab, label, icon: Icon }) => {
              const isActive = currentTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    playChime('click');
                    triggerHaptic(30);
                    onNavigateTab(tab);
                  }}
                  className={`min-w-[56px] min-h-[48px] py-1 px-3 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${
                    isActive
                      ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                  <span className="text-[11px] whitespace-nowrap leading-none">
                    {label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};
