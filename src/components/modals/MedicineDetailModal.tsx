import React from 'react';
import { Medicine } from '../../types';
import {
  X,
  Check,
  RotateCcw,
  Clock,
  Calendar,
  Package,
  AlertTriangle,
  Building2,
  FileText,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  medicine: Medicine | null;
  isOpen: boolean;
  onClose: () => void;
  onMark: (id: string, status: 'taken' | 'snoozed' | 'skipped') => void;
  onOpenRefill?: (medicine: Medicine) => void;
}

export const MedicineDetailModal: React.FC<Props> = ({
  medicine,
  isOpen,
  onClose,
  onMark,
  onOpenRefill,
}) => {
  if (!isOpen || !medicine) return null;

  const isTaken = medicine.status === 'taken';

  const handleTake = () => {
    playChime('success');
    triggerHaptic(60);
    onMark(medicine.id, 'taken');
    onClose();
  };

  const handleSnooze = () => {
    playChime('subtle');
    triggerHaptic(30);
    onMark(medicine.id, 'snoozed');
    onClose();
  };

  const handleSkip = () => {
    playChime('click');
    onMark(medicine.id, 'skipped');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="med-detail-name"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Section 8: Visually Dominant Information */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Medication Details
          </span>
          <h2
            id="med-detail-name"
            className="text-2xl font-bold text-slate-900 dark:text-white mt-1 leading-tight"
          >
            {medicine.name}
          </h2>
          <p className="text-base font-semibold text-slate-600 dark:text-slate-300 mt-1">
            {medicine.dose}
          </p>
        </div>

        {/* Next Dose & Schedule Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
              Next dose:
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
              {medicine.time}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
              Schedule:
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              Every {medicine.period.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Supporting Details */}
        <div className="space-y-3 mb-6 text-xs text-slate-600 dark:text-slate-300">
          {medicine.instructions && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                Instructions:
              </span>
              <span>{medicine.instructions}</span>
            </div>
          )}

          <div className="flex items-center justify-between p-2 px-3 border border-slate-100 dark:border-slate-800 rounded-xl">
            <span className="text-slate-500 dark:text-slate-400">Supply status:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {medicine.remainingCount ?? 30} tablets remaining
            </span>
          </div>

          {medicine.rxNumber && (
            <div className="flex items-center justify-between px-3 text-slate-400">
              <span>Prescription: {medicine.rxNumber}</span>
              {medicine.pharmacyName && <span>{medicine.pharmacyName}</span>}
            </div>
          )}
        </div>

        {/* Primary Actions: Take Now, Snooze, Refill */}
        <div className="space-y-2.5">
          {!isTaken ? (
            <button
              type="button"
              onClick={handleTake}
              className="w-full h-12 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-colors"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Take Now</span>
            </button>
          ) : (
            <div className="h-12 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 font-bold rounded-xl flex items-center justify-center gap-2 text-sm">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Already Marked Taken</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSnooze}
              className="h-11 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Snooze</span>
            </button>

            {onOpenRefill && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRefill(medicine);
                }}
                className="h-11 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Refill</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
