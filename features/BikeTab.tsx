import React from 'react';
import { BikeState, UserProfile } from '../types';
import {
  DisciplineLayout, TimeDisplayCard, Toggle, Card, Label,
  StepperInput, PresetGroup, VerticalPicker
} from '../components/MD3Components';
import { AdMobBanner } from '../components/AdMobBanner';
import { calculateBikeTime, formatTime, parseManualInput, formatSingleDigit } from '../utils';
import { useTargetTime } from '../hooks/useCalculatorLogic';
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
  const { hours, minutes, seconds, updateTime, totalSeconds } = useTargetTime(0, 40, 0);

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
      const totalTargetHours = totalSeconds / 3600;
      let speed = 0;
      if (totalTargetHours > 0) {
        speed = data.distanceKm / totalTargetHours;
      }

      return {
        displayMain: `${speed.toFixed(1)} km/h`,
        displayLabel: 'Ø GESCHWINDIGKEIT',
        secondsForTotal: totalSeconds
      };
    }
  };

  const { displayMain, displayLabel, secondsForTotal } = calculateResults();

  const updateDist = (delta: number) => {
    const newVal = parseFloat((data.distanceKm + delta).toFixed(2));
    onChange({ ...data, distanceKm: Math.max(0, newVal) });
  };

  const handleDistManual = (val: string) => {
    const floatVal = parseManualInput(val);
    if (floatVal > 0 || val === '0') {
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

  return (
    <DisciplineLayout
      theme="orange"
      title="Radfahren"
      subtitle={headerSubtitle}
      onSettingsClick={onOpenSettings}
      hasTopAd={!userProfile?.isPro}
    >
      {!userProfile?.isPro && <AdMobBanner />}
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
      <Card className="mb-5">
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
                value={formatSingleDigit(hours)}
                onIncrease={() => updateTime(hours + 1, minutes, seconds)}
                onDecrease={() => updateTime(hours - 1, minutes, seconds)}
                onManualChange={(v) => updateTime(parseInt(v) || 0, minutes, seconds)}
              />
              <span className="text-xl font-bold text-slate-300">:</span>
              <VerticalPicker
                value={formatSingleDigit(minutes)}
                onIncrease={() => updateTime(hours, minutes + 1, seconds)}
                onDecrease={() => updateTime(hours, minutes - 1, seconds)}
                onManualChange={(v) => updateTime(hours, parseInt(v) || 0, seconds)}
              />
              <span className="text-xl font-bold text-slate-300">:</span>
              <VerticalPicker
                value={formatSingleDigit(seconds)}
                onIncrease={() => updateTime(hours, minutes, seconds + 1)}
                onDecrease={() => updateTime(hours, minutes, seconds - 1)}
                onManualChange={(v) => updateTime(hours, minutes, parseInt(v) || 0)}
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
