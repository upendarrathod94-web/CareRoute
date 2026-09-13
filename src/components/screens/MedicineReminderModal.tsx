import React from 'react';
import { Medicine } from '../../types';
import { ASSETS_3D } from '../../assets/assetRegistry';
import { Check, RotateCcw, X, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
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
  const [imgError, setImgError] = React.useState(false);

  const handleAction = (status: 'taken' | 'snoozed' | 'skipped') => {
    if (status === 'taken') {
      playChime('success');
      triggerHaptic(80);
    } else if (status === 'snoozed') {
      playChime('subtle');
      triggerHaptic(40);
    } else {
      playChime('click');
    }
    onMark(status);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-5 flex flex-col text-center relative overflow-hidden">
        {/* Close / Dismiss */}
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 3D Visual Centerpiece */}
        <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-700 mb-3 mt-1 bg-gradient-to-br from-blue-500/10 to-teal-500/10 flex items-center justify-center relative">
          {!imgError ? (
            <img
              src={ASSETS_3D.pillClock}
              alt="3D Medicine Alarm"
              className="w-full h-full object-cover animate-pulse"
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center text-white">
              <Clock className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* Alarm Time Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 text-xs font-bold mx-auto mb-2 max-w-full">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>
            Scheduled for {medicine.time}
            {medicine.remainingCount !== undefined && ` • ${medicine.remainingCount} pills left`}
          </span>
        </div>

        {/* Medicine Name & Dose */}
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
          Time for {medicine.name}
        </h2>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
          {medicine.dose}
        </p>

        {medicine.instructions && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl text-xs text-slate-700 dark:text-slate-300 mb-4 border border-slate-200/60 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white">Note: </span>
            {medicine.instructions}
          </div>
        )}

        {/* Big accessible action buttons */}
        <div className="space-y-2.5 mb-4">
          <button
            type="button"
            onClick={() => handleAction('taken')}
            className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 text-lg transition-transform active:scale-95"
          >
            <Check className="w-6 h-6" strokeWidth={3} />
            <span>Taken</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleAction('snoozed')}
              className="h-12 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Snooze 15 min</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('skipped')}
              className="h-12 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium rounded-xl text-xs flex items-center justify-center transition-colors"
            >
              <span>Skip this dose</span>
            </button>
          </div>
        </div>

        {/* Clinical Safe Dose Disclaimer */}
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] leading-relaxed text-amber-900 dark:text-amber-200 text-left flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Missed a dose?</strong> Follow your prescription instructions or contact your doctor or pharmacist. <strong>Do not double a dose.</strong>
          </p>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-3">
          <ShieldCheck className="w-3 h-3 text-teal-600" />
          <span>Care Circle alerted only if grace window passes</span>
        </div>
      </div>
    </div>
  );
};
