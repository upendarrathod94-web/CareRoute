import React, { useState, useRef, useEffect } from 'react';
import { PrescriptionScanResult } from '../../types';
import {
  Camera,
  RefreshCw,
  Sparkles,
  Check,
  RotateCcw,
  Zap,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  onApplyPrescription: (result: PrescriptionScanResult) => void;
  onNavigateHome?: () => void;
}

const SAMPLE_MEDICINE_IDENTIFICATIONS = [
  {
    medicineName: 'Atorvastatin Calcium',
    purpose: 'Cholesterol management & cardiovascular health',
    dose: '20 mg · 1 tablet',
    usage: 'Take 1 tablet by mouth daily at bedtime with a glass of water',
    timing: 'Bedtime · 09:00 PM',
    period: 'Bedtime' as const,
    time: '21:00',
    totalQuantity: 30,
    rxNumber: 'RX-772910',
    pharmacyName: 'Walgreens Pharmacy #4412',
    doctorName: 'Dr. Maya Rao, MD',
    refillsRemaining: 3,
    confidence: 99.4,
  },
  {
    medicineName: 'Metformin HCl',
    purpose: 'Blood sugar regulation & Type 2 Diabetes support',
    dose: '500 mg · 1 tablet',
    usage: 'Take 1 tablet twice daily with breakfast and dinner with water',
    timing: 'Morning · 08:30 AM',
    period: 'Morning' as const,
    time: '08:30',
    totalQuantity: 60,
    rxNumber: 'RX-441920',
    pharmacyName: 'CVS Caremark #109',
    doctorName: 'Dr. Elena Rostova, MD',
    refillsRemaining: 2,
    confidence: 98.9,
  },
  {
    medicineName: 'Lisinopril',
    purpose: 'Blood pressure regulation & heart protection',
    dose: '10 mg · 1 tablet',
    usage: 'Take 1 tablet once daily in the evening for blood pressure',
    timing: 'Evening · 07:30 PM',
    period: 'Evening' as const,
    time: '19:30',
    totalQuantity: 30,
    rxNumber: 'RX-994120',
    pharmacyName: 'Health Mart Pharmacy',
    doctorName: 'Dr. Maya Rao, MD',
    refillsRemaining: 4,
    confidence: 99.1,
  },
];

export const ScanScreen: React.FC<Props> = ({ onApplyPrescription, onNavigateHome }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [identifiedResult, setIdentifiedResult] = useState<typeof SAMPLE_MEDICINE_IDENTIFICATIONS[0] | null>(null);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);

  // Initialize camera stream
  const startCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera is not supported on this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
      }
      setCameraActive(true);
    } catch {
      setCameraError('Camera access unavailable. You can capture using the sample identification mode.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const handleCapture = () => {
    playChime('click');
    triggerHaptic(50);
    setIsScanning(true);

    // Capture frame if video is active
    if (videoRef.current && cameraActive) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          setCapturedPhotoUrl(canvas.toDataURL('image/jpeg', 0.85));
        }
      } catch {
        // Continue with OCR simulation
      }
    }

    // Process OCR recognition
    setTimeout(() => {
      setIsScanning(false);
      playChime('success');
      triggerHaptic(70);
      // Pick next sample bottle or random realistic identification
      const randomIdx = Math.floor(Math.random() * SAMPLE_MEDICINE_IDENTIFICATIONS.length);
      setIdentifiedResult(SAMPLE_MEDICINE_IDENTIFICATIONS[randomIdx]);
    }, 1200);
  };

  const handleScanAgain = () => {
    playChime('click');
    setIdentifiedResult(null);
    setCapturedPhotoUrl(null);
    startCamera();
  };

  const handleAddToMedicines = () => {
    if (!identifiedResult) return;
    playChime('success');
    triggerHaptic(60);
    onApplyPrescription({
      medicineName: identifiedResult.medicineName,
      dose: identifiedResult.dose,
      instructions: identifiedResult.usage,
      period: identifiedResult.period,
      time: identifiedResult.time,
      totalQuantity: identifiedResult.totalQuantity,
      rxNumber: identifiedResult.rxNumber,
      pharmacyName: identifiedResult.pharmacyName,
      doctorName: identifiedResult.doctorName,
      refillsRemaining: identifiedResult.refillsRemaining,
      confidence: identifiedResult.confidence,
    });
  };

  return (
    <div className="flex flex-col min-h-full px-5 py-6 space-y-5 max-w-xl mx-auto w-full animate-fadeIn pb-12">
      {/* 7. Header & Instructions */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Scan your medicine
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Place your medicine bottle, package, or tablet inside the frame.
        </p>
      </div>

      {!identifiedResult ? (
        /* CAMERA SCANNING VIEW */
        <div className="space-y-5">
          {/* Large Clean Camera Area */}
          <div className="relative aspect-4/3 sm:aspect-16/10 w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center">
            {cameraActive ? (
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <Camera className="w-12 h-12 text-slate-500 mb-2" />
                <p className="text-xs max-w-xs text-slate-300">
                  {cameraError || 'Camera ready. Position medicine bottle directly in front.'}
                </p>
              </div>
            )}

            {/* Viewfinder Target Frame */}
            <div className="absolute inset-8 sm:inset-10 border-2 border-white/60 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between">
                <span className="w-4 h-4 border-t-2 border-l-2 border-teal-400 -mt-1 -ml-1" />
                <span className="w-4 h-4 border-t-2 border-r-2 border-teal-400 -mt-1 -mr-1" />
              </div>
              <div className="text-center">
                <span className="text-[11px] font-semibold text-white/90 bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full">
                  Align bottle label here
                </span>
              </div>
              <div className="flex justify-between">
                <span className="w-4 h-4 border-b-2 border-l-2 border-teal-400 -mb-1 -ml-1" />
                <span className="w-4 h-4 border-b-2 border-r-2 border-teal-400 -mb-1 -mr-1" />
              </div>
            </div>

            {/* Scanning Overlay Animation */}
            {isScanning && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2 animate-fadeIn">
                <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
                <span className="text-sm font-bold">Identifying prescription...</span>
              </div>
            )}
          </div>

          {/* Primary CTA: CAPTURE */}
          <button
            type="button"
            disabled={isScanning}
            onClick={handleCapture}
            className="w-full h-14 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-base shadow-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            <span>CAPTURE</span>
          </button>
        </div>
      ) : (
        /* AFTER SCANNING IDENTIFICATION RESULTS */
        <div className="space-y-5 animate-fadeIn">
          {/* Identified Information Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Medicine Identified</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
                Medicine Name
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {identifiedResult.medicineName}
              </h2>
            </div>

            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
                Purpose
              </span>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {identifiedResult.purpose}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
                  Dosage
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {identifiedResult.dose}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
                  Timing
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {identifiedResult.timing}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
                Usage
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {identifiedResult.usage}
              </p>
            </div>
          </div>

          {/* Actions: Add to My Medicines & Scan Again */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleAddToMedicines}
              className="w-full h-14 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-base shadow-xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Add to My Medicines</span>
            </button>

            <button
              type="button"
              onClick={handleScanAgain}
              className="w-full h-12 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl flex items-center justify-center gap-2 text-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Scan Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
