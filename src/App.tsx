import React, { useState, useEffect } from 'react';
import {
  AccessibilitySettings,
  Appointment,
  Caregiver,
  CaregiverPermissions,
  Doctor,
  MainTab,
  Medicine,
  MedicineHistoryItem,
  ScreenId,
  UserRole,
  WellnessCheckin,
  PrescriptionScanResult,
} from './types';
import {
  INITIAL_ACCESSIBILITY,
  INITIAL_APPOINTMENTS,
  INITIAL_CAREGIVERS,
  INITIAL_HISTORY,
  INITIAL_MEDICINES,
  INITIAL_WELLNESS,
  DOCTORS_LIST,
} from './data/mockData';
import { db, syncMedicineToCloud, syncAppointmentToCloud } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { MobileFrame } from './components/MobileFrame';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { RoleSelectionScreen } from './components/screens/RoleSelectionScreen';
import { AccessibilitySetupScreen } from './components/screens/AccessibilitySetupScreen';
import { PrivacyConsentScreen } from './components/screens/PrivacyConsentScreen';
import { TodayScreen } from './components/screens/TodayScreen';
import { AppointmentsScreen } from './components/screens/AppointmentsScreen';
import { DoctorSearchScreen } from './components/screens/DoctorSearchScreen';
import { DoctorProfileScreen } from './components/screens/DoctorProfileScreen';
import { AvailableSlotsScreen } from './components/screens/AvailableSlotsScreen';
import { BookingReviewScreen } from './components/screens/BookingReviewScreen';
import { BookingConfirmedScreen } from './components/screens/BookingConfirmedScreen';
import { MedicineListScreen } from './components/screens/MedicineListScreen';
import { AddMedicineScreen } from './components/screens/AddMedicineScreen';
import { MedicineReminderModal } from './components/screens/MedicineReminderModal';
import { MedicineHistoryScreen } from './components/screens/MedicineHistoryScreen';
import { CareCircleScreen } from './components/screens/CareCircleScreen';
import { InviteCaregiverScreen } from './components/screens/InviteCaregiverScreen';
import { CaregiverPermissionsScreen } from './components/screens/CaregiverPermissionsScreen';
import { CaregiverDashboardScreen } from './components/screens/CaregiverDashboardScreen';
import { NotificationSettingsScreen } from './components/screens/NotificationSettingsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { PrescriptionScannerModal } from './components/modals/PrescriptionScannerModal';
import { EmergencySosModal } from './components/modals/EmergencySosModal';
import { RefillOrderModal } from './components/modals/RefillOrderModal';
import { DoctorVisitPrepModal } from './components/appointments/DoctorVisitPrepModal';
import { ApkExportModal } from './components/modals/ApkExportModal';
import { AlertTriangle } from 'lucide-react';
import { playChime, triggerHaptic } from './utils/audioHaptics';

export default function App() {
  // Navigation & Role State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome');
  const [currentTab, setCurrentTab] = useState<MainTab>('today');
  const [userRole, setUserRole] = useState<UserRole>('patient');

  // App Data State
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(INITIAL_ACCESSIBILITY);
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [history, setHistory] = useState<MedicineHistoryItem[]>(INITIAL_HISTORY);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [caregivers, setCaregivers] = useState<Caregiver[]>(INITIAL_CAREGIVERS);

  // Booking Flow State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(DOCTORS_LIST[0]);
  const [pendingDate, setPendingDate] = useState<string>('Thursday, 18 Sep');
  const [pendingTime, setPendingTime] = useState<string>('10:30 AM');
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment>(INITIAL_APPOINTMENTS[0]);

  // Active Reminder Modal State
  const [activeReminderMed, setActiveReminderMed] = useState<Medicine | null>(null);

  // Feature 1: Prescription Scanner Modal State
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);

  // Feature 2: Emergency SOS / Fall Alert State
  const [emergencySos, setEmergencySos] = useState<{
    isOpen: boolean;
    type: 'manual_sos' | 'fall_detected';
  }>({ isOpen: false, type: 'manual_sos' });

  // Feature 3: Pill Refill Order Modal State
  const [activeRefillMed, setActiveRefillMed] = useState<Medicine | null>(null);

  // Feature 4: Doctor Visit Prep Pocket Modal State
  const [activePrepAppt, setActivePrepAppt] = useState<Appointment | null>(null);

  // Feature 5: Daily Wellness & Mood Check-In State
  const [wellnessCheckin, setWellnessCheckin] = useState<WellnessCheckin | undefined>(INITIAL_WELLNESS);

  // APK & PWA Export Modal State
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);

  // Toast & Notification Banner Simulation
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notificationBanner, setNotificationBanner] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onClick?: () => void;
  } | null>(null);

  // Usability Testing Checklist tracking
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  // Edge case simulation flags
  const [isOffline, setIsOffline] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(true);

  // Firestore Real-Time / Initial Cloud Synchronization
  useEffect(() => {
    let isMounted = true;
    const initFirebaseData = async () => {
      try {
        const medsSnap = await getDocs(collection(db, 'medicines'));
        if (!medsSnap.empty && isMounted) {
          const loadedMeds: Medicine[] = [];
          medsSnap.forEach((doc) => {
            loadedMeds.push(doc.data() as Medicine);
          });
          if (loadedMeds.length > 0) {
            setMedicines(loadedMeds);
          }
        } else {
          // Initialize default medicines to Firestore cloud
          INITIAL_MEDICINES.forEach((m) => syncMedicineToCloud(m));
        }

        const apptsSnap = await getDocs(collection(db, 'appointments'));
        if (!apptsSnap.empty && isMounted) {
          const loadedAppts: Appointment[] = [];
          apptsSnap.forEach((doc) => {
            loadedAppts.push(doc.data() as Appointment);
          });
          if (loadedAppts.length > 0) {
            setAppointments(loadedAppts);
          }
        } else {
          // Initialize default appointments to Firestore cloud
          INITIAL_APPOINTMENTS.forEach((a) => syncAppointmentToCloud(a));
        }
        if (isMounted) setFirebaseConnected(true);
      } catch (error) {
        console.warn('Firebase initialized with local fallback:', error);
      }
    };

    initFirebaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Mark task as completed
  const markTaskComplete = (taskId: string) => {
    if (!completedTaskIds.includes(taskId)) {
      setCompletedTaskIds((prev) => [...prev, taskId]);
      playChime('success');
      triggerHaptic(50);
    }
  };

  // Switch Tabs
  const handleNavigateTab = (tab: MainTab) => {
    setCurrentTab(tab);
    if (tab === 'today') setCurrentScreen('today');
    else if (tab === 'appointments') {
      setCurrentScreen(appointments.length === 0 ? 'empty_appointments' : 'appointments');
    } else if (tab === 'medicines') setCurrentScreen('medicines');
    else if (tab === 'circle') setCurrentScreen('care_circle');
    else if (tab === 'profile') setCurrentScreen('profile');
  };

  // Jump to specific screen
  const handleJumpToScreen = (screen: ScreenId) => {
    setCurrentScreen(screen);
    if (['today', 'reminder_active'].includes(screen)) {
      setCurrentTab('today');
    } else if (
      [
        'appointments',
        'empty_appointments',
        'doctor_search',
        'doctor_profile',
        'available_slots',
        'booking_review',
        'booking_confirmed',
      ].includes(screen)
    ) {
      setCurrentTab('appointments');
    } else if (['medicines', 'add_medicine', 'medicine_history'].includes(screen)) {
      setCurrentTab('medicines');
    } else if (
      ['care_circle', 'invite_caregiver', 'permissions_settings', 'caregiver_dashboard'].includes(screen)
    ) {
      setCurrentTab('circle');
    } else if (['profile', 'notification_settings', 'access_setup', 'role', 'privacy_consent'].includes(screen)) {
      setCurrentTab('profile');
    }
  };

  // Medicine Actions with Duplicate Tap Edge Case Handling
  const handleMarkMedicine = (id: string, status: 'taken' | 'snoozed' | 'skipped') => {
    const med = medicines.find((m) => m.id === id);
    if (!med) return;

    // Edge Case: Accidental duplicate mark as taken
    if (med.status === 'taken' && status === 'taken') {
      showToast('Already marked taken! Duplicate tap ignored safely to protect you.');
      playChime('alert');
      return;
    }

    // Feature 3: Supply tracking decrement when taken
    let updatedRemaining = med.remainingCount;
    if (status === 'taken' && med.remainingCount !== undefined) {
      updatedRemaining = Math.max(0, med.remainingCount - 1);
    }

    const updatedMedicineList = medicines.map((m) =>
      m.id === id
        ? {
            ...m,
            status,
            remainingCount: updatedRemaining,
          }
        : m
    );
    setMedicines(updatedMedicineList);
    const updatedTarget = updatedMedicineList.find((m) => m.id === id);
    if (updatedTarget) {
      syncMedicineToCloud(updatedTarget).catch((e) => console.warn('Cloud sync:', e));
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHistory((prev) => [
      {
        id: `hist-${Date.now()}`,
        medicineName: med.name,
        dose: med.dose,
        scheduledTime: med.time,
        status,
        timestamp: `${nowStr} (${status.charAt(0).toUpperCase() + status.slice(1)})`,
        dateLabel: 'Today',
      },
      ...prev,
    ]);

    if (status === 'taken') {
      if (updatedRemaining !== undefined && updatedRemaining <= (med.refillThreshold ?? 7)) {
        showToast(`${med.name} logged as taken! Only ${updatedRemaining} pills left in supply.`);
      } else {
        showToast(`${med.name} logged as taken! Great work.`);
      }
      markTaskComplete('task-2'); // Task 2: Mark medicine as taken
    } else if (status === 'snoozed') {
      showToast(`Reminder snoozed for 15 minutes.`);
    } else {
      showToast(`${med.name} skipped for this scheduled period.`);
    }

    if (activeReminderMed) setActiveReminderMed(null);
  };

  // Feature 1 Handler: Apply Scanned Prescription
  const handleApplyPrescriptionScan = (scan: PrescriptionScanResult) => {
    const newMed: Medicine = {
      id: `med-${Date.now()}`,
      name: scan.medicineName,
      dose: scan.dose,
      instructions: scan.instructions,
      time: scan.time,
      period: scan.period,
      status: 'pending',
      pillColor: '#2563EB',
      shape: 'round',
      remainingCount: scan.totalQuantity,
      totalQuantity: scan.totalQuantity,
      refillThreshold: 7,
      rxNumber: scan.rxNumber,
      pharmacyName: scan.pharmacyName,
    };
    setMedicines((prev) => [...prev, newMed]);
    syncMedicineToCloud(newMed).catch((e) => console.warn('Cloud sync error:', e));
    showToast(`Prescription OCR added: ${newMed.name} (${newMed.dose})!`);
    setCurrentScreen('medicines');
    setCurrentTab('medicines');
  };

  // Feature 3 Handler: Refill Fulfillment
  const handleConfirmRefill = (medicineId: string, quantityToAdd: number, deliveryMethod: string) => {
    const med = medicines.find((m) => m.id === medicineId);
    if (!med) return;

    const updatedMed = {
      ...med,
      remainingCount: (med.remainingCount ?? 0) + quantityToAdd,
    };

    setMedicines((prev) =>
      prev.map((m) => (m.id === medicineId ? updatedMed : m))
    );
    syncMedicineToCloud(updatedMed).catch((e) => console.warn('Cloud sync error:', e));

    const deliveryText =
      deliveryMethod === 'home'
        ? 'Home delivery placed (2 business days)'
        : deliveryMethod === 'caregiver'
        ? 'Priya Sharma (Daughter) notified for pickup'
        : 'Ready for pharmacy drive-thru pickup today';

    showToast(`Refill requested (+${quantityToAdd} pills)! ${deliveryText}.`);
  };

  // Feature 4 Handler: Update Appointment Visit Prep Notes
  const handleUpdateAppointment = (updatedAppt: Appointment) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === updatedAppt.id ? updatedAppt : a))
    );
    syncAppointmentToCloud(updatedAppt).catch((e) => console.warn('Cloud sync error:', e));
    showToast('Doctor visit prep questions & voice notes updated!');
  };

  // Feature 5 Handler: Save Morning Wellness Check-In
  const handleSaveWellnessCheckin = (checkin: WellnessCheckin) => {
    setWellnessCheckin(checkin);
    showToast(`Morning check-in saved (${checkin.mood}) & shared with Priya!`);
  };

  // Add Medicine
  const handleSaveMedicine = (newMed: Omit<Medicine, 'id'>) => {
    const created: Medicine = {
      ...newMed,
      id: `med-${Date.now()}`,
    };
    setMedicines((prev) => [...prev, created]);
    syncMedicineToCloud(created).catch((e) => console.warn('Cloud sync error:', e));
    showToast(`${created.name} added to ${created.period} schedule!`);
    setCurrentScreen('medicines');
    setCurrentTab('medicines');
    markTaskComplete('task-1'); // Task 1: Add medicine reminder
  };

  // Appointment Booking Flow
  const handleStartBooking = () => {
    setCurrentScreen('doctor_search');
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setCurrentScreen('doctor_profile');
  };

  const handleProceedToSlots = () => {
    setCurrentScreen('available_slots');
  };

  const handleSelectSlot = (date: string, time: string) => {
    setPendingDate(date);
    setPendingTime(time);
    setCurrentScreen('booking_review');
  };

  const handleConfirmBooking = (reason: string, notifyCaregiver: boolean) => {
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      clinic: selectedDoctor.clinic,
      date: pendingDate,
      time: pendingTime,
      reason,
      status: 'confirmed',
      caregiverNotified: notifyCaregiver,
    };

    setAppointments((prev) => [newAppt, ...prev]);
    setConfirmedAppt(newAppt);
    syncAppointmentToCloud(newAppt).catch((e) => console.warn('Cloud sync error:', e));
    setCurrentScreen('booking_confirmed');
    markTaskComplete('task-3'); // Task 3: Book an appointment
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast('Appointment successfully cancelled.');
  };

  // Care Circle Actions
  const handleSimulateCaregiverJoin = () => {
    if (caregivers.length === 0 || caregivers.every((c) => c.status === 'removed')) {
      const newCg: Caregiver = {
        id: 'cg-1',
        name: 'Priya Sharma',
        relation: 'Daughter',
        phone: '+1 (555) 234-8901',
        email: 'priya.sharma@example.com',
        avatarInitial: 'P',
        status: 'active',
        joinedDate: 'Joined just now',
        permissions: {
          seeAppointments: true,
          receiveMissedAlerts: true,
          seeMedicineReminders: true,
          seeFullMedicineNames: false,
          emergencyContactAccess: true,
        },
      };
      setCaregivers([newCg]);
    } else {
      setCaregivers((prev) =>
        prev.map((c) => (c.id === 'cg-1' ? { ...c, status: 'active' } : c))
      );
    }
    showToast('Priya Sharma accepted invite and joined your Care Circle!');
    setCurrentScreen('care_circle');
    setCurrentTab('circle');
    markTaskComplete('task-5'); // Task 5: Invite a caregiver
  };

  const handleUpdateCaregiverPermissions = (newPerms: Partial<CaregiverPermissions>) => {
    setCaregivers((prev) =>
      prev.map((c) =>
        c.id === 'cg-1'
          ? { ...c, permissions: { ...c.permissions, ...newPerms } }
          : c
      )
    );
    showToast('Caregiver permissions updated.');
  };

  const handleRemoveCaregiver = () => {
    setCaregivers((prev) =>
      prev.map((c) => (c.id === 'cg-1' ? { ...c, status: 'removed' } : c))
    );
    showToast("Priya Sharma's caregiver access has been revoked.");
    setCurrentScreen('care_circle');
    markTaskComplete('task-6'); // Task 6: Remove caregiver access
  };

  // Accessibility update
  const handleUpdateAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...newSettings }));
    if (newSettings.textSize && newSettings.textSize !== 'standard') {
      markTaskComplete('task-4'); // Task 4: Change text size
    }
  };

  // Test Notification Trigger
  const handleTestNotification = () => {
    const med = medicines[0];
    const isNameHidden = accessibility.hideLockScreenNames;
    const title = isNameHidden ? 'Time for your medicine' : `Time for ${med.name}`;
    const message = isNameHidden
      ? 'A scheduled prescription dose is due now.'
      : `${med.dose} • Tap to record taken or snooze`;

    playChime('alert');
    triggerHaptic(80);

    setNotificationBanner({
      visible: true,
      title,
      message,
      onClick: () => {
        setNotificationBanner(null);
        setActiveReminderMed(med);
      },
    });

    setTimeout(() => {
      setNotificationBanner((prev) => (prev?.title === title ? null : prev));
    }, 6000);
  };

  // Sign out / reset
  const handleSignOut = () => {
    setCurrentScreen('welcome');
    setUserRole('patient');
    showToast('Logged out. Returning to Welcome screen.');
  };

  // Render current screen inside Mobile Frame
  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onGetStarted={() => setCurrentScreen('role')}
            onExistingUser={() => {
              setCurrentScreen('today');
              setCurrentTab('today');
            }}
          />
        );

      case 'role':
        return (
          <RoleSelectionScreen
            selectedRole={userRole}
            onSelectRole={(role) => setUserRole(role)}
            onContinue={() => {
              if (userRole === 'caregiver') {
                setCurrentScreen('caregiver_dashboard');
              } else {
                setCurrentScreen('access_setup');
              }
            }}
          />
        );

      case 'access_setup':
        return (
          <AccessibilitySetupScreen
            settings={accessibility}
            onUpdateSettings={handleUpdateAccessibility}
            onContinue={() => setCurrentScreen('privacy_consent')}
          />
        );

      case 'privacy_consent':
        return (
          <PrivacyConsentScreen
            onAgreeAndContinue={() => {
              showToast('Welcome, Margaret! Your profile is ready.');
              setCurrentScreen('today');
              setCurrentTab('today');
            }}
          />
        );

      case 'today':
        return (
          <TodayScreen
            medicines={medicines}
            nextAppointment={appointments[0]}
            caregivers={caregivers}
            wellnessCheckin={wellnessCheckin}
            onSaveWellnessCheckin={handleSaveWellnessCheckin}
            onTriggerEmergencySos={(type) =>
              setEmergencySos({ isOpen: true, type: type || 'manual_sos' })
            }
            onOpenRefillModal={(med) => setActiveRefillMed(med)}
            onOpenPrepModal={(appt) => setActivePrepAppt(appt)}
            onMarkMedicine={handleMarkMedicine}
            onOpenReminderModal={(med) => setActiveReminderMed(med)}
            onNavigateAppointments={() => {
              setCurrentTab('appointments');
              setCurrentScreen(appointments.length === 0 ? 'empty_appointments' : 'appointments');
            }}
            onNavigateCareCircle={() => {
              setCurrentTab('circle');
              setCurrentScreen('care_circle');
            }}
            onNavigateMedicines={() => {
              setCurrentTab('medicines');
              setCurrentScreen('medicines');
            }}
            onScanPrescription={() => setIsScannerOpen(true)}
            onOpenApkModal={() => setIsApkModalOpen(true)}
          />
        );

      case 'empty_appointments':
      case 'appointments':
        return (
          <AppointmentsScreen
            appointments={currentScreen === 'empty_appointments' ? [] : appointments}
            onStartBooking={handleStartBooking}
            onCancelAppointment={handleCancelAppointment}
            onRescheduleAppointment={(appt) => {
              setSelectedDoctor(DOCTORS_LIST.find((d) => d.id === appt.doctorId) || DOCTORS_LIST[0]);
              setCurrentScreen('available_slots');
            }}
            onOpenPrepModal={(appt) => setActivePrepAppt(appt)}
          />
        );

      case 'doctor_search':
        return (
          <DoctorSearchScreen
            onSelectDoctor={handleSelectDoctor}
            onBack={() => {
              setCurrentTab('appointments');
              setCurrentScreen('appointments');
            }}
          />
        );

      case 'doctor_profile':
        return (
          <DoctorProfileScreen
            doctor={selectedDoctor}
            onProceedToSlots={handleProceedToSlots}
            onBack={() => setCurrentScreen('doctor_search')}
          />
        );

      case 'available_slots':
        return (
          <AvailableSlotsScreen
            doctor={selectedDoctor}
            onSelectSlot={handleSelectSlot}
            onBack={() => setCurrentScreen('doctor_profile')}
          />
        );

      case 'booking_review':
        return (
          <BookingReviewScreen
            doctor={selectedDoctor}
            date={pendingDate}
            time={pendingTime}
            onConfirm={handleConfirmBooking}
            onBack={() => setCurrentScreen('available_slots')}
          />
        );

      case 'booking_confirmed':
        return (
          <BookingConfirmedScreen
            appointment={confirmedAppt}
            onDone={() => {
              setCurrentTab('appointments');
              setCurrentScreen('appointments');
            }}
            onShowToast={showToast}
          />
        );

      case 'medicines':
        return (
          <MedicineListScreen
            medicines={medicines}
            onAddMedicine={() => setCurrentScreen('add_medicine')}
            onOpenReminder={(med) => setActiveReminderMed(med)}
            onViewHistory={() => setCurrentScreen('medicine_history')}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenRefill={(med) => setActiveRefillMed(med)}
          />
        );

      case 'add_medicine':
        return (
          <AddMedicineScreen
            onSave={handleSaveMedicine}
            onCancel={() => setCurrentScreen('medicines')}
          />
        );

      case 'reminder_active':
        return (
          <MedicineReminderModal
            medicine={medicines[0]}
            onMark={(status) => handleMarkMedicine(medicines[0].id, status)}
            onDismiss={() => setCurrentScreen('today')}
          />
        );

      case 'medicine_history':
        return (
          <MedicineHistoryScreen
            history={history}
            onBack={() => setCurrentScreen('medicines')}
          />
        );

      case 'care_circle':
        return (
          <CareCircleScreen
            caregivers={caregivers}
            onInvite={() => setCurrentScreen('invite_caregiver')}
            onSelectCaregiver={() => setCurrentScreen('permissions_settings')}
            onPreviewCaregiverDashboard={() => setCurrentScreen('caregiver_dashboard')}
          />
        );

      case 'invite_caregiver':
        return (
          <InviteCaregiverScreen
            onBack={() => setCurrentScreen('care_circle')}
            onSimulateJoin={handleSimulateCaregiverJoin}
          />
        );

      case 'permissions_settings':
        return (
          <CaregiverPermissionsScreen
            caregiver={caregivers[0]}
            onUpdatePermissions={handleUpdateCaregiverPermissions}
            onRemoveCaregiver={handleRemoveCaregiver}
            onPreviewCaregiverDashboard={() => setCurrentScreen('caregiver_dashboard')}
            onBack={() => setCurrentScreen('care_circle')}
          />
        );

      case 'caregiver_dashboard':
        return (
          <CaregiverDashboardScreen
            caregiver={caregivers[0]}
            nextAppointment={appointments[0]}
            medicines={medicines}
            wellnessCheckin={wellnessCheckin}
            onPickUpRefill={(med) => setActiveRefillMed(med)}
            onExitCaregiverView={() => {
              setCurrentScreen('care_circle');
              setUserRole('patient');
            }}
            onShowToast={showToast}
          />
        );

      case 'notification_settings':
        return (
          <NotificationSettingsScreen
            settings={accessibility}
            onUpdateSettings={handleUpdateAccessibility}
            onBack={() => setCurrentScreen('profile')}
            onTestNotification={handleTestNotification}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            settings={accessibility}
            onNavigateAccessibility={() => setCurrentScreen('access_setup')}
            onNavigateNotifications={() => setCurrentScreen('notification_settings')}
            onNavigateCareCircle={() => {
              setCurrentTab('circle');
              setCurrentScreen('care_circle');
            }}
            onSignOut={handleSignOut}
            onShowToast={showToast}
            onOpenApkModal={() => setIsApkModalOpen(true)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden select-none">
      {/* Offline Alert Bar if simulated / offline */}
      {isOffline && (
        <div className="bg-amber-950/95 border-b border-amber-800 text-amber-200 px-4 py-1.5 text-xs flex items-center justify-center gap-2 shrink-0 z-50">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Offline Mode:</strong> CareRoute is operating offline-first with local cached timers.
          </span>
        </div>
      )}

      {/* Direct Phone Application - Responsive and Edge-to-Edge for All Devices */}
      <main className="flex-1 w-full h-full flex flex-col items-center justify-start overflow-hidden min-h-0 bg-slate-950">
        <MobileFrame
          currentScreen={currentScreen}
          currentTab={currentTab}
          accessibility={accessibility}
          onNavigateTab={handleNavigateTab}
          onJumpToScreen={handleJumpToScreen}
          notificationBanner={notificationBanner}
          onDismissNotification={() => setNotificationBanner(null)}
          hideTopControlBar={true}
        >
          {renderScreenContent()}
        </MobileFrame>
      </main>

      {/* Floating Active Medicine Reminder Alarm Modal */}
      {activeReminderMed && (
        <MedicineReminderModal
          medicine={activeReminderMed}
          onMark={(status) => handleMarkMedicine(activeReminderMed.id, status)}
          onDismiss={() => setActiveReminderMed(null)}
        />
      )}

      {/* Feature 1: Prescription Camera OCR Scanner Modal */}
      <PrescriptionScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onApplyPrescription={handleApplyPrescriptionScan}
      />

      {/* Feature 2: Emergency SOS & Fall Alert with False-Alarm Grace Window */}
      <EmergencySosModal
        isOpen={emergencySos.isOpen}
        onClose={() => setEmergencySos((prev) => ({ ...prev, isOpen: false }))}
        caregiver={caregivers.find((c) => c.status === 'active')}
        medicines={medicines}
        initialType={emergencySos.type}
        onAlertDispatched={() => {
          showToast('SOS dispatched! Live GPS & Medical ID sent to Priya Sharma.');
        }}
      />

      {/* Feature 3: Pill Supply & Refill Countdown Order Modal */}
      <RefillOrderModal
        isOpen={!!activeRefillMed}
        onClose={() => setActiveRefillMed(null)}
        medicine={activeRefillMed}
        onConfirmRefill={handleConfirmRefill}
      />

      {/* Feature 4: Doctor Visit Prep Pocket & Voice Instructions Modal */}
      <DoctorVisitPrepModal
        isOpen={!!activePrepAppt}
        onClose={() => setActivePrepAppt(null)}
        appointment={activePrepAppt}
        onUpdateAppointment={handleUpdateAppointment}
      />

      {/* APK & PWA Export Guide Modal */}
      <ApkExportModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />

      {/* Feedback Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white border border-slate-700 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn max-w-sm text-center">
          <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
