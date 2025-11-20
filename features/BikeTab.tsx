
import React, { useState } from 'react';
import { BikeState, UserProfile } from '../types';
import { 
  DisciplineLayout, TimeDisplayCard, Toggle, Card, Label, 
  StepperInput, PresetGroup, VerticalPicker 
} from '../components/MD3Components';
import { calculateBikeTime, formatTime, formatSingleDigit } from '../utils';
import { Timer, RotateCw } from 'lucide-react';

interface Props {
  data: BikeState;
  onChange: (data: BikeState) => void;
  mode: string;
  onModeChange: (mode: string) => void;
  onPresetChange: (preset: 'Sprint' | 'Olympisch' | '70.3 (Halb)' | '140.6 (Lang)') => void;
  onSave: (totalSeconds: number) => void;
  headerSubtitle: string;
  onOpenSettings: () => void;
  userProfile: UserProfile | null;
}

export const BikeTab: React.FC<Props> = ({ 
    data, onChange, mode, onModeChange, onPresetChange, onSave, 
    headerSubtitle, onOpenSettings, userProfile
}) => {

  // Target Time State
  const [targetHours, setTargetHours] = useState(0);
  const [targetMinutes, setTargetMinutes] = useState(40);
  const [targetSeconds, setTargetSeconds] = useState(0);

  const calculateResults = () => {
      if (mode === 'time') {
          const secs = calculateBikeTime(data.distanceKm, data.speedKmh);
          return {
              displayMain: formatTime(secs),
              displayLabel: 'Geschätzte Radzeit',
              secondsForTotal: secs
          };
      } else {
          // Result is Speed
          // Speed = Dist / Time(h)
          const totalTargetHours = targetHours + (targetMinutes / 60) + (targetSeconds / 3600);
          let speed = 0;
          if (totalTargetHours > 0) {
              speed = data.distanceKm / totalTargetHours;
          }
          
          const totalTargetSeconds = (targetHours * 3600) + (targetMinutes * 60) + targetSeconds;

          return {
              displayMain: `${speed.toFixed(1)} km/h`,
              displayLabel: 'Ø GESCHWINDIGKEIT',
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
    if (val === 20) onPresetChange('Sprint');
    else if (val === 40) onPresetChange('Olympisch');
    else if (val === 90) onPresetChange('70.3 (Halb)');
    else if (val === 180) onPresetChange('140.6 (Lang)');
    else onChange({ ...data, distanceKm: val });
  };

  // Split speed into integer and decimal parts
  const speedInt = Math.floor(data.speedKmh);
  const speedDec = Math.round((data.speedKmh % 1) * 10);

  const updateSpeed = (newInt: number, newDec: number) => {
      let i = newInt; let d = newDec;
      if (d > 9) { d = 0; i++; }
      if (d < 0) { d = 9; i--; }
      if (i < 0) { i = 0; d = 0; }
      const newSpeed = i + (d / 10);
      onChange({ ...data, speedKmh: newSpeed });
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
        theme="orange" 
        title="Radfahren" 
        subtitle={headerSubtitle} 
        onSettingsClick={onOpenSettings}
    >
      <TimeDisplayCard 
        label={displayLabel}
        time={displayMain} 
        textColor="text-[#c2410c]"
        onAdd={() => onSave(secondsForTotal)}
      />

      <Toggle 
        options={[
            { label: 'Zeit berechnen', value: 'time', icon: <Timer size={16} strokeWidth={2.5} /> },
            { label: 'Tempo berechnen', value: 'pace', icon: <RotateCw size={16} strokeWidth={2.5} /> }
        ]}
        active={mode} 
        onChange={onModeChange}
        theme="orange"
      />

      <Label>Distanz</Label>
      <Card className="mb-8">
        <StepperInput 
          value={data.distanceKm.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} 
          unit="KM" 
          onIncrease={() => updateDist(0.1)} 
          onDecrease={() => updateDist(-0.1)}
          onManualChange={handleDistManual}
        />
        <PresetGroup 
          options={[
            { label: 'Sprint', value: 20 },
            { label: 'Olympisch', value: 40 },
            { label: '70.3 (Halb)', value: 90 },
            { label: '140.6 (Lang)', value: 180 },
          ]}
          activeValue={data.distanceKm}
          onSelect={handlePreset}
          theme="orange"
        />
      </Card>

      {mode === 'time' ? (
        <>
            <Label>Durchschnittsgeschwindigkeit</Label>
            <Card className="flex flex-col items-center">
                <div className="flex items-center gap-4">
                <VerticalPicker 
                    value={speedInt.toString()} 
                    onIncrease={() => updateSpeed(speedInt + 1, speedDec)}
                    onDecrease={() => updateSpeed(speedInt - 1, speedDec)}
                    onManualChange={(v) => updateSpeed(parseInt(v) || 0, speedDec)}
                />
                <span className="text-2xl font-bold text-slate-300">,</span>
                <VerticalPicker 
                    value={speedDec.toString()} 
                    onIncrease={() => updateSpeed(speedInt, speedDec + 1)}
                    onDecrease={() => updateSpeed(speedInt, speedDec - 1)}
                    onManualChange={(v) => updateSpeed(speedInt, parseInt(v) || 0)}
                />
                </div>
                <div className="flex gap-16 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>KM/H</span>
                    <span>DEZ</span>
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
