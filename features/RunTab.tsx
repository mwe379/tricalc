
import React, { useState } from 'react';
import { RunState, UserProfile } from '../types';
import { 
  DisciplineLayout, TimeDisplayCard, Toggle, Card, Label, 
  StepperInput, PresetGroup, VerticalPicker 
} from '../components/MD3Components';
import { calculateRunTime, formatTime, formatSingleDigit } from '../utils';
import { Timer, Footprints } from 'lucide-react';

interface Props {
  data: RunState;
  onChange: (data: RunState) => void;
  mode: string;
  onModeChange: (mode: string) => void;
  onPresetChange: (preset: 'Sprint' | 'Olympisch' | '70.3 (Halb)' | '140.6 (Lang)') => void;
  onSave: (totalSeconds: number) => void;
  headerSubtitle: string;
  onOpenSettings: () => void;
  userProfile: UserProfile | null;
}

export const RunTab: React.FC<Props> = ({ 
    data, onChange, mode, onModeChange, onPresetChange, onSave, 
    headerSubtitle, onOpenSettings, userProfile
}) => {

  // Target Time State
  const [targetHours, setTargetHours] = useState(0);
  const [targetMinutes, setTargetMinutes] = useState(30);
  const [targetSeconds, setTargetSeconds] = useState(0);

  const calculateResults = () => {
      if (mode === 'time') {
          const secs = calculateRunTime(data.distanceKm, data.paceMinPerKm, data.paceSecPerKm);
          return {
              displayMain: formatTime(secs),
              displayLabel: 'Geschätzte Laufzeit',
              secondsForTotal: secs
          };
      } else {
          // Result is Pace
          // Pace = Time / Dist
          const totalTargetSeconds = (targetHours * 3600) + (targetMinutes * 60) + targetSeconds;
          let paceSecondsTotal = 0;
          if (data.distanceKm > 0) {
              paceSecondsTotal = totalTargetSeconds / data.distanceKm;
          }

          const pMin = Math.floor(paceSecondsTotal / 60);
          const pSec = Math.round(paceSecondsTotal % 60);
          
          return {
              displayMain: `${pMin}:${formatSingleDigit(pSec)}/km`,
              displayLabel: 'Ø PACE',
              secondsForTotal: totalTargetSeconds
          };
      }
  };

  const { displayMain, displayLabel, secondsForTotal } = calculateResults();

  const updateDist = (delta: number) => {
    const newVal = parseFloat((data.distanceKm + delta).toFixed(2));
    onChange({ ...data, distanceKm: Math.max(0, newVal) });
  };

  const handleDistManual = (val: string) => {
    const normalized = val.replace(',', '.');
    const floatVal = parseFloat(normalized);
    if (!isNaN(floatVal)) {
        onChange({ ...data, distanceKm: floatVal });
    }
  };

  const handlePreset = (val: number) => {
    if (val === 5) onPresetChange('Sprint');
    else if (val === 10) onPresetChange('Olympisch');
    else if (val === 21.1) onPresetChange('70.3 (Halb)');
    else if (val === 42.2) onPresetChange('140.6 (Lang)');
    else onChange({ ...data, distanceKm: val });
  };

  const updatePace = (min: number, sec: number) => {
    let newMin = min; let newSec = sec;
    if (newSec >= 60) { newMin++; newSec = 0; }
    if (newSec < 0) { newMin--; newSec = 59; }
    if (newMin < 0) { newMin = 0; newSec = 0; }
    onChange({ ...data, paceMinPerKm: newMin, paceSecPerKm: newSec });
  };

  const updateTargetTime = (h: number, m: number, s: number) => {
    let nh = h; let nm = m; let ns = s;
    if (ns >= 60) { nm++; ns = 0; }
    if (ns < 0) { nm--; ns = 59; }
    if (nm >= 60) { nh++; nm = 0; }
    if (nm < 0) { nh--; nm = 59; }
    if (nh < 0) { nh = 0; nm = 0; ns = 0; }
    setTargetHours(nh); setTargetMinutes(nm); setTargetSeconds(ns);
  };

  return (
    <DisciplineLayout 
        theme="green" 
        title="Laufen" 
        subtitle={headerSubtitle} 
        onSettingsClick={onOpenSettings}
    >
      <TimeDisplayCard 
        label={displayLabel}
        time={displayMain} 
        textColor="text-[#047857]"
        onAdd={() => onSave(secondsForTotal)}
      />

      <Toggle 
        options={[
            { label: 'Zeit berechnen', value: 'time', icon: <Timer size={16} strokeWidth={2.5} /> },
            { label: 'Pace berechnen', value: 'pace', icon: <Footprints size={16} strokeWidth={2.5} /> }
        ]}
        active={mode} 
        onChange={onModeChange}
        theme="green"
      />

      <Label>Distanz</Label>
      <Card className="mb-8">
        <StepperInput 
          value={data.distanceKm.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
          unit="KM" 
          onIncrease={() => updateDist(0.01)} 
          onDecrease={() => updateDist(-0.01)}
          onManualChange={handleDistManual} 
        />
        <PresetGroup 
          options={[
            { label: 'Sprint', value: 5 },
            { label: 'Olympisch', value: 10 },
            { label: '70.3 (Halb)', value: 21.1 },
            { label: '140.6 (Lang)', value: 42.2 },
          ]}
          activeValue={data.distanceKm}
          onSelect={handlePreset}
          theme="green"
        />
      </Card>

      {mode === 'time' ? (
        <>
          <Label>Pace (MIN/KM)</Label>
          <Card className="flex flex-col items-center">
            <div className="flex items-center gap-4">
              <VerticalPicker 
                value={formatSingleDigit(data.paceMinPerKm)} 
                onIncrease={() => updatePace(data.paceMinPerKm + 1, data.paceSecPerKm)}
                onDecrease={() => updatePace(data.paceMinPerKm - 1, data.paceSecPerKm)}
                onManualChange={(v) => updatePace(parseInt(v) || 0, data.paceSecPerKm)}
              />
              <span className="text-2xl font-bold text-slate-300">:</span>
              <VerticalPicker 
                value={formatSingleDigit(data.paceSecPerKm)} 
                onIncrease={() => updatePace(data.paceMinPerKm, data.paceSecPerKm + 1)}
                onDecrease={() => updatePace(data.paceMinPerKm, data.paceSecPerKm - 1)}
                onManualChange={(v) => updatePace(data.paceMinPerKm, parseInt(v) || 0)}
              />
            </div>
            <div className="flex gap-16 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Min</span>
                <span>Sek</span>
            </div>
          </Card>
        </>
      ) : (
        <>
            <Label>Zielzeit</Label>
             <Card className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                    <VerticalPicker 
                        value={formatSingleDigit(targetHours)} 
                        onIncrease={() => updateTargetTime(targetHours + 1, targetMinutes, targetSeconds)}
                        onDecrease={() => updateTargetTime(targetHours - 1, targetMinutes, targetSeconds)}
                        onManualChange={(v) => updateTargetTime(parseInt(v) || 0, targetMinutes, targetSeconds)}
                    />
                    <span className="text-xl font-bold text-slate-300">:</span>
                    <VerticalPicker 
                        value={formatSingleDigit(targetMinutes)} 
                        onIncrease={() => updateTargetTime(targetHours, targetMinutes + 1, targetSeconds)}
                        onDecrease={() => updateTargetTime(targetHours, targetMinutes - 1, targetSeconds)}
                        onManualChange={(v) => updateTargetTime(targetHours, parseInt(v) || 0, targetSeconds)}
                    />
                    <span className="text-xl font-bold text-slate-300">:</span>
                    <VerticalPicker 
                        value={formatSingleDigit(targetSeconds)} 
                        onIncrease={() => updateTargetTime(targetHours, targetMinutes, targetSeconds + 1)}
                        onDecrease={() => updateTargetTime(targetHours, targetMinutes, targetSeconds - 1)}
                        onManualChange={(v) => updateTargetTime(targetHours, targetMinutes, parseInt(v) || 0)}
                    />
                </div>
                <div className="flex gap-12 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Std</span>
                    <span>Min</span>
                    <span>Sek</span>
                </div>
            </Card>
        </>
      )}
    </DisciplineLayout>
  );
};
