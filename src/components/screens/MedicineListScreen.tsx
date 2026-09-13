import React from 'react';
import { Medicine } from '../../types';
import {
  Plus,
  History,
  Clock,
  Check,
  AlertCircle,
  ChevronRight,
  Pill,
  Camera,
  Package,
  AlertTriangle,
} from 'lucide-react';
import { playChime } from '../../utils/audioHaptics';

interface Props {
  medicines: Medicine[];
  onAddMedicine: () => void;
  onOpenReminder: (medicine: Medicine) => void;
  onViewHistory: () => void;
  onOpenScanner?: () => void;
  onOpenRefill?: (medicine: Medicine) => void;
}

export const MedicineListScreen: React.FC<Props> = ({
  medicines,
  onAddMedicine,
  onOpenReminder,
  onViewHistory,
  onOpenScanner,
  onOpenRefill,
}) => {
  const periods = ['Morning', 'Noon', 'Evening', 'Bedtime'] as const;

  return (
    <div className="flex flex-col h-full p-4 sm:p-5 overflow-y-auto animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Medicines
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daily prescribed routine & supply
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Feature 1: Scan Bottle Camera Button */}
          {onOpenScanner && (
            <button
              type="button"
              onClick={onOpenScanner}
              className="h-10 px-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-semibold text-xs flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 transition-colors"
              title="Scan prescription bottle with camera OCR"
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Scan Bottle</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAddMedicine}
            className="h-10 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* History quick banner */}
      <button
        type="button"
        onClick={() => {
          playChime('subtle');
          onViewHistory();
        }}
        className="mb-4 p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-left hover:border-slate-300 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Medicine History & Log
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              View past taken, missed, and snoozed doses
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>

      {/* Grouped by period */}
      <div className="space-y-4">
        {periods.map((period) => {
          const periodMeds = medicines.filter((m) => m.period === period);
          if (periodMeds.length === 0) return null;

          return (
            <div key={period} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {period} Schedule
                </span>
                <span className="text-[11px] text-slate-400">
                  {periodMeds.length} item{periodMeds.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-2.5">
                {periodMeds.map((med) => {
                  const isTaken = med.status === 'taken';
                  const isMissed = med.status === 'missed';
                  const isLowSupply =
                    (med.remainingCount ?? 30) <= (med.refillThreshold ?? 7);

                  return (
                    <div
                      key={med.id}
                      className={`p-3.5 rounded-2xl border transition-all text-left shadow-xs space-y-2.5 ${
                        isTaken
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                          : isMissed
                          ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                      }`}
                    >
                      <div
                        onClick={() => onOpenReminder(med)}
                        className="flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-xs"
                            style={{ backgroundColor: med.pillColor || '#3B82F6' }}
                          >
                            <Pill className="w-5 h-5" />
                          </div>

                          <div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                              {med.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {med.dose} • {med.instructions}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isTaken ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                              Taken
                            </span>
                          ) : isMissed ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Missed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                              <Clock className="w-3.5 h-3.5" />
                              {med.time}
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      {/* Feature 3: Pill Inventory Supply & Refill Trigger */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-slate-400" />
                          <span
                            className={`font-semibold ${
                              isLowSupply
                                ? 'text-amber-600 dark:text-amber-400 font-bold'
                                : 'text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {med.remainingCount ?? 20} pills left
                            {isLowSupply ? ' (Low Stock!)' : ''}
                          </span>
                        </div>

                        {onOpenRefill && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenRefill(med);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                              isLowSupply
                                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            Refill
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="mt-auto pt-6 pb-2 space-y-2">
        <button
          type="button"
          onClick={onAddMedicine}
          className="w-full py-3.5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Prescription or Supplement</span>
        </button>
      </div>
    </div>
  );
};
