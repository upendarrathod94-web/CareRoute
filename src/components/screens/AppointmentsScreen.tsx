import React, { useState } from 'react';
import { Appointment } from '../../types';
import { ASSETS_3D } from '../../assets/assetRegistry';
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  CalendarCheck,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  appointments: Appointment[];
  onStartBooking: () => void;
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment: (appointment: Appointment) => void;
  onOpenPrepModal?: (appointment: Appointment) => void;
}

export const AppointmentsScreen: React.FC<Props> = ({
  appointments,
  onStartBooking,
  onCancelAppointment,
  onRescheduleAppointment,
  onOpenPrepModal,
}) => {
  const [selectedApptId, setSelectedApptId] = useState<string | null>(null);

  const handleCancel = (id: string) => {
    playChime('alert');
    triggerHaptic(50);
    onCancelAppointment(id);
    setSelectedApptId(null);
  };

  return (
    <div className="flex flex-col h-full p-4 sm:p-5 overflow-y-auto animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Appointments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your doctor visits and reminders
          </p>
        </div>

        <button
          type="button"
          onClick={onStartBooking}
          className="h-10 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Book Visit</span>
        </button>
      </div>

      {appointments.length === 0 ? (
        /* Empty State (Screen 6 in specification) */
        <div className="my-auto flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md mb-4 border border-slate-200 dark:border-slate-700">
            <img
              src={ASSETS_3D.doctorCalendar}
              alt="No appointments"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            No appointments yet
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mb-5 leading-relaxed">
            Book a visit with your doctor or specialist. We'll automatically remind you the day before and 1 hour before.
          </p>

          <button
            type="button"
            onClick={onStartBooking}
            className="w-full max-w-xs h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Find a Doctor & Book</span>
          </button>
        </div>
      ) : (
        /* Booked Appointments List */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>Upcoming Visits ({appointments.length})</span>
            <span>Reminders Active</span>
          </div>

          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs relative"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md">
                      {appt.specialty}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                      {appt.doctorName}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedApptId(selectedApptId === appt.id ? null : appt.id)
                  }
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pl-1 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {appt.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>{appt.time} (Arrive 15 min early)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{appt.clinic}</span>
                </div>
              </div>

              {appt.reason && (
                <div className="mb-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Reason: </span>
                  {appt.reason}
                </div>
              )}

              {/* Feature 4: Doctor Visit Prep Pocket Button */}
              {onOpenPrepModal && (
                <button
                  type="button"
                  onClick={() => onOpenPrepModal(appt)}
                  className="w-full mt-2.5 py-2 px-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 text-teal-800 dark:text-teal-200 text-xs font-semibold flex items-center justify-between transition-colors border border-teal-200/70 dark:border-teal-800"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                    <span>Doctor Visit Prep Pocket</span>
                  </div>
                  <span className="text-[11px] font-bold bg-teal-200/60 dark:bg-teal-900 px-2 py-0.5 rounded-md">
                    {appt.prepQuestions?.length || 2} questions ready →
                  </span>
                </button>
              )}

              {appt.caregiverNotified && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Shared with Care Circle (Priya Sharma)</span>
                </div>
              )}

              {/* Action dropdown drawer when selected */}
              {selectedApptId === appt.id && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onRescheduleAppointment(appt)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
                  >
                    Reschedule
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCancel(appt.id)}
                    className="flex-1 py-2 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Cancel Visit
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={onStartBooking}
            className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule another appointment</span>
          </button>
        </div>
      )}

      {/* Safety Notice */}
      <div className="mt-auto pt-4">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center flex items-center justify-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Need immediate urgent care? Please call 911 or visit the ER.</span>
        </p>
      </div>
    </div>
  );
};
