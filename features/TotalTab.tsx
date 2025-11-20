
import React, { useState } from 'react';
import { TransitionState, UserProfile } from '../types';
import { 
  DisciplineLayout, Label, VerticalPicker, ResetButton, PerformanceBadge 
} from '../components/MD3Components';
import { Waves, Bike, Footprints, Clock } from 'lucide-react';
import { formatTime, formatSingleDigit, calculateTotalPerformancePercentile } from '../utils';

interface Props {
  swimSeconds: number;
  bikeSeconds: number;
  runSeconds: number;
  transitionData: TransitionState;
  onTransitionChange: (data: TransitionState) => void;
  onReset: () => void;
  headerSubtitle: string;
  onOpenSettings: () => void;
  showAds: boolean;
  userProfile: UserProfile | null;
  swimDistMeters: number;
  bikeDistKm: number;
  runDistKm: number;
}

// Simple row for Swim, Bike, Run
const ActivityRow: React.FC<{ icon: React.ReactNode, label: string, time: string, colorClass: string, bgClass: string }> = ({ icon, label, time, colorClass, bgClass }) => (
    <div className="flex items-center justify-between py-5 px-1">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${bgClass} flex items-center justify-center`}>
                {React.cloneElement(icon as React.ReactElement<any>, { size: 24, className: colorClass })}
            </div>
            <span className="text-slate-900 font-bold text-base">{label}</span>
        </div>
        <span className="text-slate-300 font-mono font-medium text-lg tracking-widest">
            {time === "0:00:00" ? "- - : - - : - -" : time}
        </span>
    </div>
);

// Transition Presets
const COMMON_TRANSITIONS = [
  { label: '1:30', min: 1, sec: 30 },
  { label: '2:00', min: 2, sec: 0 },
  { label: '3:00', min: 3, sec: 0 },
  { label: '4:00', min: 4, sec: 0 },
  { label: '5:00', min: 5, sec: 0 },
];

// Row for Transition with expand logic for editing
const TransitionRow: React.FC<{ 
    label: string; 
    minutes: number; 
    seconds: number; 
    onUpdate: (m: number, s: number) => void;
    isOpen: boolean;
    onToggle: () => void;
}> = ({ label, minutes, seconds, onUpdate, isOpen, onToggle }) => {
    
    const formattedTime = (minutes === 0 && seconds === 0) 
        ? "---" 
        : `${minutes}:${formatSingleDigit(seconds)}`;

    const update = (m: number, s: number) => {
        let nm = m; let ns = s;
        if(ns >= 60) { nm++; ns = 0; }
        if(ns < 0) { nm--; ns = 59; }
        if(nm < 0) { nm = 0; ns = 0; }
        onUpdate(nm, ns);
    };

    return (
        <div className="py-2">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-6 pl-2">
                    <div className="w-10 h-8 rounded border border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-400 uppercase">
                        {label}
                    </div>
                </div>
                
                {/* This acts as the button trigger in the screenshot */}
                <button 
                    onClick={onToggle}
                    className={`w-32 h-10 rounded-xl border font-mono text-sm font-medium flex items-center justify-center transition-colors
                        ${isOpen 
                            ? 'border-[#4c4aec] bg-[#4c4aec] text-white shadow-md' 
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}
                    `}
                >
                    {formattedTime}
                </button>
            </div>

            {isOpen && (
                <div className="mt-4 mb-2 bg-slate-50 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <VerticalPicker 
                            value={formatSingleDigit(minutes)} 
                            label="MIN"
                            onIncrease={() => update(minutes + 1, seconds)}
                            onDecrease={() => update(minutes - 1, seconds)}
                            onManualChange={(v) => update(parseInt(v) || 0, seconds)}
                        />
                        <span className="text-xl font-bold text-slate-300">:</span>
                        <VerticalPicker 
                            value={formatSingleDigit(seconds)} 
                            label="SEK"
                            onIncrease={() => update(minutes, seconds + 1)}
                            onDecrease={() => update(minutes, seconds - 1)}
                            onManualChange={(v) => update(minutes, parseInt(v) || 0)}
                        />
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-2">
                      {COMMON_TRANSITIONS.map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => onUpdate(preset.min, preset.sec)}
                          className="px-3 py-2 bg-white rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500 hover:border-[#4c4aec] hover:text-[#4c4aec] transition-all active:scale-95 shadow-sm"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const TotalTab: React.FC<Props> = ({ 
    swimSeconds, bikeSeconds, runSeconds, transitionData, 
    onTransitionChange, onReset, headerSubtitle, onOpenSettings, showAds,
    userProfile, swimDistMeters, bikeDistKm, runDistKm
}) => {
  
  const [openTransition, setOpenTransition] = useState<'T1' | 'T2' | null>(null);

  const t1Seconds = (transitionData.t1Minutes * 60) + transitionData.t1Seconds;
  const t2Seconds = (transitionData.t2Minutes * 60) + transitionData.t2Seconds;

  const totalSeconds = swimSeconds + bikeSeconds + runSeconds + t1Seconds + t2Seconds;

  // Calculate Percentile for Total
  let percentileData = null;
  if (userProfile) {
      percentileData = calculateTotalPerformancePercentile(
          totalSeconds, 
          swimDistMeters,
          bikeDistKm,
          runDistKm,
          userProfile.gender, 
          userProfile.birthDate
      );
  }

  return (
    <DisciplineLayout 
        theme="purple" 
        title="Gesamtzeit" 
        subtitle={headerSubtitle}
        onSettingsClick={onOpenSettings}
    >
      
      {/* Target Time Card */}
      <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-slate-50 text-center mb-6 flex flex-col items-center">
        <h3 className="text-[11px] font-bold text-[#4c4aec] uppercase tracking-widest mb-2 opacity-80">ZIELZEIT</h3>
        <div className="text-6xl font-black text-[#1e1b4b] tracking-tighter mb-4">
            {formatTime(totalSeconds)}
        </div>
        
        {percentileData && percentileData.valid && (
            <PerformanceBadge 
                percentile={percentileData.percentile} 
                akLabel={percentileData.akLabel} 
            />
        )}
        
        <div className="mt-6 flex flex-col gap-1 w-full">
            <ActivityRow 
                icon={<Waves />} 
                label="Schwimmen" 
                time={formatTime(swimSeconds)}
                bgClass="bg-blue-50"
                colorClass="text-blue-600"
            />
            <div className="h-px bg-slate-100 w-full" />
            
            <TransitionRow 
                label="T1" 
                minutes={transitionData.t1Minutes}
                seconds={transitionData.t1Seconds}
                onUpdate={(m, s) => onTransitionChange({...transitionData, t1Minutes: m, t1Seconds: s})}
                isOpen={openTransition === 'T1'}
                onToggle={() => setOpenTransition(openTransition === 'T1' ? null : 'T1')}
            />

            <div className="h-px bg-slate-100 w-full" />
            
            <ActivityRow 
                icon={<Bike />} 
                label="Radfahren" 
                time={formatTime(bikeSeconds)}
                bgClass="bg-orange-50"
                colorClass="text-orange-600"
            />

            <div className="h-px bg-slate-100 w-full" />
            
            <TransitionRow 
                label="T2" 
                minutes={transitionData.t2Minutes}
                seconds={transitionData.t2Seconds}
                onUpdate={(m, s) => onTransitionChange({...transitionData, t2Minutes: m, t2Seconds: s})}
                isOpen={openTransition === 'T2'}
                onToggle={() => setOpenTransition(openTransition === 'T2' ? null : 'T2')}
            />
            
            <div className="h-px bg-slate-100 w-full" />

            <ActivityRow 
                icon={<Footprints />} 
                label="Laufen" 
                time={formatTime(runSeconds)}
                bgClass="bg-emerald-50"
                colorClass="text-emerald-600"
            />
             <div className="h-px bg-slate-100 w-full mb-4 border-dashed" />
        </div>

        {showAds && (
            <div className="text-center mb-4 w-full">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Werbung</div>
                <div className="mt-2 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-400">Anzeige hier</p>
                </div>
            </div>
        )}

        <ResetButton label="Alle Zeiten zurücksetzen" onClick={onReset} />

      </div>

    </DisciplineLayout>
  );
};
