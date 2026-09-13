import React from 'react';
import { Medicine, Appointment, Caregiver, WellnessCheckin } from '../../types';
import { ASSETS_3D } from '../../assets/assetRegistry';
import { DailyWellnessCard } from '../wellness/DailyWellnessCard';
import { TodayDoseTimeline } from '../timeline/TodayDoseTimeline';
import {
  Check,
  Clock,
  RotateCcw,
  Calendar,
  ChevronRight,
  Shield,
  Bell,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Package,
  FileQuestion,
  ShieldAlert,
  HelpCircle,
  Pill,
  Download,
  Usb,
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
  caregivers,
  wellnessCheckin,
  onSaveWellnessCheckin,
  onTriggerEmergencySos,
  onOpenRefillModal,
  onOpenPrepModal,
  onMarkMedicine,
  onOpenReminderModal,
  onNavigateAppointments,
  onNavigateCareCircle,
  onNavigateMedicines,
  onScanPrescription,
  onOpenApkModal,
}) => {
  // Find next pending or missed medicine
  const pendingMed = medicines.find((m) => m.status === 'pending') || medicines.find((m) => m.status === 'missed');
  const activeCaregiver = caregivers.find((c) => c.status === 'active');

  const takenCount = medicines.filter((m) => m.status === 'taken').length;
  const totalCount = medicines.length;

  // Find any medicine with low supply (<= 7 days)
  const lowSupplyMed = medicines.find(
    (m) => (m.remainingCount ?? 30) <= (m.refillThreshold ?? 7)
  );

  const [pillClockError, setPillClockError] = React.useState(false);
  const [doctorCalendarError, setDoctorCalendarError] = React.useState(false);

  const handleQuickMark = (id: string, status: 'taken' | 'snoozed' | 'skipped') => {
    if (status === 'taken') {
      playChime('success');
      triggerHaptic(60);
    } else {
      playChime('click');
      triggerHaptic(40);
    }
    onMarkMedicine(id, status);
  };

  return (
    <div className="flex flex-col h-full p-4 sm:p-5 pb-8 overflow-y-auto space-y-4 animate-fadeIn">
      {/* Top Header with Greeting & Action Hub */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Thursday, 12 September
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Good morning, Margaret</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Transfer to Phone via USB */}
          {onOpenApkModal && (
            <button
              type="button"
              onClick={() => {
                playChime('click');
                triggerHaptic(40);
                onOpenApkModal();
              }}
              className="relative h-10 px-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center gap-1.5 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors shadow-xs font-semibold text-xs"
              title="Transfer app to phone via USB cable"
            >
              <Usb className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">USB Phone</span>
            </button>
          )}

          {/* Test reminder alarm */}
          <button
            type="button"
            onClick={() => {
              if (pendingMed) onOpenReminderModal(pendingMed);
            }}
            className="relative w-10 h-10 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-slate-700 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
            title="Reminder notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingMed && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Primary Next Medicine Card with 3D Visual - Displayed Prominently at Top */}
      <div className="rounded-3xl bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-900/60 p-4 shadow-sm relative overflow-hidden">
        {/* Missed dose warning notice if applicable */}
        {pendingMed?.status === 'missed' && (
          <div className="mb-2.5 flex items-center">
            <span className="text-[11px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Missed Dose • Take as soon as safe</span>
            </span>
          </div>
        )}

        <div className="flex items-start gap-3 mb-3">
          {/* 3D Visual with fallback container */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-white dark:border-slate-700 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative">
            {!pillClockError ? (
              <img
                src={ASSETS_3D.pillClock}
                alt="3D Pill Clock reminder"
                className="w-full h-full object-cover"
                onError={() => setPillClockError(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-teal-600 flex flex-col items-center justify-center text-white p-1">
                <Clock className="w-6 h-6" />
              </div>
            )}
          </div>

          {/* Medicine Details & Badges with flex-wrap and min-w-0 to stay strictly inside the box */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full shrink-0">
                <Clock className="w-3 h-3 shrink-0" />
                <span>{pendingMed ? `Due at ${pendingMed.time}` : 'Up to date'}</span>
              </span>
              {pendingMed?.remainingCount !== undefined && (
                <span
                  className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                    pendingMed.remainingCount <= (pendingMed.refillThreshold ?? 7)
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {pendingMed.remainingCount} pills left
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">
              {pendingMed ? pendingMed.name : 'All medicines taken!'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
              {pendingMed ? pendingMed.dose : 'Great job taking care of your health today.'}
            </p>
          </div>
        </div>

        {pendingMed?.instructions && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Doctor Note: </span>
            {pendingMed.instructions}
          </div>
        )}

        {pendingMed ? (
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickMark(pendingMed.id, 'taken')}
              className="h-12 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all text-sm"
            >
              <Check className="w-4 h-4" strokeWidth={3} />
              <span>Taken</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickMark(pendingMed.id, 'snoozed')}
              className="h-12 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Snooze 15m</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickMark(pendingMed.id, 'skipped')}
              className="h-12 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium rounded-xl flex items-center justify-center transition-colors text-xs"
            >
              <span>Skip</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onNavigateMedicines}
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl text-center"
          >
            Review all prescribed medicines
          </button>
        )}
      </div>

      {/* Feature: Timeline View - Displays upcoming doses in a vertically scrollable, card-based list for the rest of the day */}
      <TodayDoseTimeline
        medicines={medicines}
        onMarkMedicine={onMarkMedicine}
        onOpenReminderModal={onOpenReminderModal}
        onOpenRefillModal={onOpenRefillModal}
        onScanPrescription={onScanPrescription}
      />

      {/* Feature 3: Low Pill Supply & Refill Alert Banner */}
      {lowSupplyMed && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-2 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-amber-950 dark:text-amber-100 truncate">
                Refill Needed: {lowSupplyMed.name}
              </p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                Only {lowSupplyMed.remainingCount} pills remaining in supply
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenRefillModal(lowSupplyMed)}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold rounded-xl shrink-0 shadow-xs transition-colors"
          >
            Refill Now
          </button>
        </div>
      )}

      {/* Progress pill banner */}
      <div className="p-3 bg-gradient-to-r from-blue-50 via-teal-50 to-emerald-50 dark:from-slate-800/80 dark:to-slate-800/50 rounded-2xl border border-blue-100 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Daily Health Routine
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              {takenCount} of {totalCount} medicines completed today
            </p>
          </div>
        </div>
        <button
          onClick={onNavigateMedicines}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          Schedule
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Feature 5: Daily Wellness & Mood Check-In Card */}
      <DailyWellnessCard
        currentCheckin={wellnessCheckin}
        onSaveCheckin={onSaveWellnessCheckin}
        caregiverName={activeCaregiver?.name || 'Priya'}
      />

      {/* Upcoming Appointment Card with 3D Calendar Visual & Feature 4 Doctor Prep */}
      <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-xs">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-white dark:border-slate-700 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative">
            {!doctorCalendarError ? (
              <img
                src={ASSETS_3D.doctorCalendar}
                alt="3D Appointment Calendar"
                className="w-full h-full object-cover"
                onError={() => setDoctorCalendarError(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-teal-600 to-blue-600 flex items-center justify-center text-white">
                <Calendar className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-0.5 rounded-full mb-1">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>Upcoming Doctor Visit</span>
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
              {nextAppointment ? nextAppointment.doctorName : 'No appointment booked'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
              {nextAppointment
                ? `${nextAppointment.specialty} • ${nextAppointment.clinic}`
                : 'Stay on top of your annual checkups and prescriptions.'}
            </p>
          </div>
        </div>

        {nextAppointment ? (
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {nextAppointment.date} at {nextAppointment.time}
              </span>
              <button
                type="button"
                onClick={onNavigateAppointments}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
              >
                Details <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature 4: Visit Prep Quick Button */}
            <button
              type="button"
              onClick={() => onOpenPrepModal(nextAppointment)}
              className="w-full py-2 px-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 text-teal-800 dark:text-teal-200 text-xs font-semibold flex items-center justify-between transition-colors border border-teal-200/80 dark:border-teal-800"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                <span>Doctor Visit Prep Pocket</span>
              </div>
              <span className="text-[11px] font-bold bg-teal-200/60 dark:bg-teal-900 px-2 py-0.5 rounded-md">
                {nextAppointment.prepQuestions?.length || 3} questions ready →
              </span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onNavigateAppointments}
            className="w-full mt-2 py-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5"
          >
            <span>Book an appointment</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Care Circle Privacy Status pill */}
      <button
        type="button"
        onClick={onNavigateCareCircle}
        className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-left hover:border-slate-300 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Care Circle Privacy Active
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {activeCaregiver
                ? `${activeCaregiver.name} (${activeCaregiver.relation}) can see approved updates`
                : 'No caregiver connected yet • Tap to invite'}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {/* Simulation Triggers for Showcase */}
      <div className="pt-2 flex items-center justify-center gap-3 text-xs text-slate-500">
        <button
          type="button"
          onClick={() => onTriggerEmergencySos('fall_detected')}
          className="hover:text-red-600 hover:underline flex items-center gap-1"
        >
          <AlertTriangle className="w-3 h-3 text-red-500" />
          <span>Simulate Fall Sensor Detection</span>
        </button>
      </div>
    </div>
  );
};
