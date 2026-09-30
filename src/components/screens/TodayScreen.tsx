import React, { useState } from 'react';
import { Medicine, Appointment, Caregiver, WellnessCheckin } from '../../types';
import {
  Check,
  RotateCcw,
  Clock,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Package,
  Sparkles,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  medicines: Medicine[];
  nextAppointment?: Appointment;
  caregivers: Caregiver[];
  wellnessCheckin?: WellnessCheckin;
  onSaveWellnessCheckin: (checkin: WellnessCheckin) => void;
  onTriggerEmergencySos: (type?: 'manual_sos' | 'fall_detected') => void;
  onOpenRefillModal: (medicine: Medicine) => void;
  onOpenPrepModal: (appointment: Appointment) => void;
  onMarkMedicine: (id: string, status: 'taken' | 'snoozed' | 'skipped') => void;
  onOpenReminderModal: (medicine: Medicine) => void;
  onNavigateAppointments: () => void;
  onNavigateCareCircle: () => void;
  onNavigateMedicines: () => void;
  onScanPrescription?: () => void;
  onOpenApkModal?: () => void;
}

export const TodayScreen: React.FC<Props> = ({
  medicines,
  nextAppointment,
  wellnessCheckin,
  onSaveWellnessCheckin,
  onTriggerEmergencySos,
  onOpenRefillModal,
  onOpenPrepModal,
  onMarkMedicine,
  onOpenReminderModal,
  onNavigateAppointments,
  onNavigateMedicines,
}) => {
  // Sort medicines chronologically by time
  const sortedMedicines = [...medicines].sort((a, b) => a.time.localeCompare(b.time));

  // Find next pending or missed medicine
  const nextPendingMed =
    sortedMedicines.find((m) => m.status === 'pending') ||
    sortedMedicines.find((m) => m.status === 'missed') ||
    sortedMedicines.find((m) => m.status === 'snoozed');

  // Track micro-interaction state for instant visual feedback
  const [justRecordedId, setJustRecordedId] = useState<string | null>(null);

  // Check low supply pill
  const lowSupplyMed = medicines.find(
    (m) => (m.remainingCount ?? 30) <= (m.refillThreshold ?? 7)
  );

  const handleTakeNow = (med: Medicine) => {
    playChime('success');
    triggerHaptic(60);
    setJustRecordedId(med.id);
    onMarkMedicine(med.id, 'taken');
    setTimeout(() => {
      setJustRecordedId(null);
    }, 2800);
  };

  const handleSnooze = (med: Medicine) => {
    playChime('subtle');
    triggerHaptic(40);
    onMarkMedicine(med.id, 'snoozed');
  };

  const allTaken = medicines.length > 0 && medicines.every((m) => m.status === 'taken');

  return (
    <div className="flex flex-col min-h-full px-5 py-6 space-y-6 max-w-xl mx-auto w-full animate-fadeIn pb-12">
      {/* 1. Header: Calm Greeting */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Good morning, Margaret
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Here's your medication plan for today.
          </p>
        </div>

        {/* SOS Emergency button - Red used ONLY for emergency */}
        <button
          type="button"
          onClick={() => onTriggerEmergencySos('manual_sos')}
          className="min-h-[44px] px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60 font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
          title="Emergency SOS contact"
        >
          <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span>SOS</span>
        </button>
      </div>

      {/* Low supply alert banner if applicable (quiet amber notice) */}
      {lowSupplyMed && (
        <div className="p-3.5 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 truncate">
            <Package className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-amber-900 dark:text-amber-200">
                Low supply: {lowSupplyMed.name}
              </span>
              <span className="text-amber-700 dark:text-amber-300 ml-1">
                ({lowSupplyMed.remainingCount ?? 5} pills left)
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenRefillModal(lowSupplyMed)}
            className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg shrink-0 transition-colors"
          >
            Refill
          </button>
        </div>
      )}

      {/* 2. Main Focus: NEXT MEDICINE CARD */}
      <section aria-labelledby="next-medicine-title">
        <div className="flex items-center justify-between mb-2 px-0.5">
          <span
            id="next-medicine-title"
            className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Next Medicine
          </span>
          {nextPendingMed && (
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
              {nextPendingMed.period}
            </span>
          )}
        </div>

        {nextPendingMed ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs transition-all">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
                {nextPendingMed.time}
              </span>
              {nextPendingMed.status === 'missed' && (
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Past scheduled time
                </span>
              )}
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {nextPendingMed.name}
              </h2>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                {nextPendingMed.dose}
              </p>
              {nextPendingMed.instructions && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {nextPendingMed.instructions}
                </p>
              )}
            </div>

            {/* Action Buttons: Strongest CTA is TAKE NOW */}
            {justRecordedId === nextPendingMed.id ? (
              <div className="h-12 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-xl flex items-center justify-center gap-2 text-teal-700 dark:text-teal-300 font-bold text-sm animate-fadeIn">
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>✓ TAKEN · Medication recorded.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleTakeNow(nextPendingMed)}
                  className="flex-1 h-12 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>TAKE NOW</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSnooze(nextPendingMed)}
                  className="h-12 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>SNOOZE</span>
                </button>
              </div>
            )}
          </div>
        ) : allTaken ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 text-center shadow-xs">
            <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center mb-2">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              All medicines taken for today
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              You are completely up to date with your medication plan.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 text-center shadow-xs">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No medications scheduled for today.
            </p>
            <button
              type="button"
              onClick={onNavigateMedicines}
              className="mt-2 text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline"
            >
              + Add a medicine
            </button>
          </div>
        )}
      </section>

      {/* 3. TODAY'S MEDICINES: Simple, clean timeline/list */}
      <section aria-labelledby="todays-medicines-title">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <span
            id="todays-medicines-title"
            className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Today's Medicines
          </span>
          <button
            type="button"
            onClick={onNavigateMedicines}
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-0.5"
          >
            <span>Manage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-xs overflow-hidden">
          {sortedMedicines.map((med) => {
            const isTaken = med.status === 'taken';
            const isMissed = med.status === 'missed';
            const isSnoozed = med.status === 'snoozed';

            return (
              <div
                key={med.id}
                onClick={() => onOpenReminderModal(med)}
                className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Status Indicator: Check for Taken, Dot for Upcoming */}
                  <div className="pt-0.5 shrink-0">
                    {isTaken ? (
                      <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : isMissed ? (
                      <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                        !
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                      </div>
                    )}
                  </div>

                  {/* Medicine Details */}
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                        {med.time}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {med.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {med.dose}
                    </p>
                  </div>
                </div>

                {/* Right side: Status Label & Quick Action */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-semibold ${
                      isTaken
                        ? 'text-teal-700 dark:text-teal-400'
                        : isMissed
                        ? 'text-amber-700 dark:text-amber-400'
                        : isSnoozed
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isTaken ? 'Taken' : isMissed ? 'Past due' : isSnoozed ? 'Snoozed' : 'Upcoming'}
                  </span>

                  {!isTaken && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTakeNow(med);
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-teal-700 hover:text-white bg-teal-50 hover:bg-teal-700 dark:bg-teal-950/60 dark:hover:bg-teal-700 rounded-lg border border-teal-200/80 dark:border-teal-800 transition-colors"
                    >
                      Take
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. UPCOMING APPOINTMENT: Simple, calm preview */}
      {nextAppointment && (
        <section aria-labelledby="upcoming-visit-title">
          <div className="flex items-center justify-between mb-2 px-0.5">
            <span
              id="upcoming-visit-title"
              className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Upcoming Appointment
            </span>
            <button
              type="button"
              onClick={onNavigateAppointments}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
            >
              All visits
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-teal-700 dark:text-teal-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {nextAppointment.doctorName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {nextAppointment.specialty} · {nextAppointment.date}, {nextAppointment.time}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenPrepModal(nextAppointment)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors shrink-0"
            >
              View
            </button>
          </div>
        </section>
      )}

      {/* 5. Daily Wellness Check-In: Simple, quiet row */}
      <section aria-label="Daily Check-in">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
          <span className="font-medium text-slate-600 dark:text-slate-300">
            How are you feeling today?
          </span>
          <div className="flex items-center gap-1.5">
            {(
              [
                { mood: 'great', label: 'Good', icon: Smile },
                { mood: 'okay', label: 'Okay', icon: Meh },
                { mood: 'tired', label: 'Tired', icon: Frown },
              ] as const
            ).map(({ mood, label, icon: MoodIcon }) => {
              const isSelected = wellnessCheckin?.mood === mood;
              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() =>
                    onSaveWellnessCheckin({
                      id: `well-${Date.now()}`,
                      date: 'Today',
                      mood,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    })
                  }
                  className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                    isSelected
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <MoodIcon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
