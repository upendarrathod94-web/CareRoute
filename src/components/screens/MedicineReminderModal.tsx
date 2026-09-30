import React, { useState } from 'react';
import { Medicine } from '../../types';
import {
  Check,
  RotateCcw,
  X,
  Clock,
  Calendar,
  AlertTriangle,
  Package,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  medicine: Medicine;
  onMark: (status: 'taken' | 'snoozed' | 'skipped') => void;
  onDismiss: () => void;
}

export const MedicineReminderModal: React.FC<Props> = ({
  medicine,
  onMark,
  onDismiss,
}) => {
  const [recorded, setRecorded] = useState(false);

  const handleTake = () => {
    playChime('success');
    triggerHaptic(60);
    setRecorded(true);
    setTimeout(() => {
      onMark('taken');
    }, 1400);
  };

  const handleSnooze = () => {
    playChime('subtle');
    triggerHaptic(30);
    onMark('snoozed');
  };

  const handleSkip = () => {
    playChime('click');
    onMark('skipped');
  };

  const getScheduleLabel = (period: string) => {
    switch (period) {
      case 'Morning':
        return 'Every morning';
      case 'Noon':
        return 'Every lunchtime';
      case 'Evening':
        return 'Every evening';
      case 'Bedtime':
        return 'Every bedtime';
      default:
        return 'Daily';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminder-title"
    >
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Section 8: Most Important Information Visually Dominant */}
        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Medication Due
          </span>
          <h2
            id="reminder-title"
            className="text-2xl font-bold text-slate-900 dark:text-white mt-1 leading-snug"
          >
            {medicine.name}
          </h2>
          <p className="text-base font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
            {medicine.dose}
          </p>
        </div>

        {/* Next dose & Schedule info */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
              Next dose:
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
              {medicine.time}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
              Schedule:
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {getScheduleLabel(medicine.period)}
            </span>
          </div>
        </div>

        {/* Supporting details */}
        {medicine.instructions && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs text-slate-600 dark:text-slate-300 mb-5">
            <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
              Instructions:
            </span>
            <span>{medicine.instructions}</span>
          </div>
        )}

        {/* Actions: Take Now, Snooze, Skip */}
        {recorded ? (
          <div className="h-14 bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 rounded-2xl flex flex-col items-center justify-center text-teal-800 dark:text-teal-300 animate-fadeIn">
            <span className="font-bold text-base flex items-center gap-1.5">
              <Check className="w-5 h-5 stroke-[3]" />
              ✓ TAKEN
            </span>
            <span className="text-xs font-medium">Medication recorded.</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleTake}
              className="w-full h-14 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-base shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>TAKE NOW</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSnooze}
                className="h-11 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>SNOOZE</span>
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className="h-11 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 font-medium rounded-xl text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                <span>SKIP</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
