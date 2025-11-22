import React from 'react';
import { RunState, UserProfile } from '../types';
import {
  DisciplineLayout, TimeDisplayCard, Toggle, Card, Label,
  StepperInput, PresetGroup, VerticalPicker
} from '../components/MD3Components';
import { AdMobBanner } from '../components/AdMobBanner';
import { calculateRunTime, formatTime, formatSingleDigit, parseManualInput } from '../utils';
import { useTargetTime, usePace } from '../hooks/useCalculatorLogic';
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
  const { hours, minutes, seconds, updateTime, totalSeconds } = useTargetTime(0, 30, 0);

  // Pace Logic Helper
  const { calculateNewPace } = usePace();

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
      let paceSecondsTotal = 0;
      if (data.distanceKm > 0) {
        paceSecondsTotal = totalSeconds / data.distanceKm;
      }

      const pMin = Math.floor(paceSecondsTotal / 60);
      const pSec = Math.round(paceSecondsTotal % 60);

      return {
        displayMain: `${pMin}:${formatSingleDigit(pSec)}/km`,
        displayLabel: 'Ø PACE',
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
    if (val === 5) onPresetChange('Sprint');
    else if (val === 10) onPresetChange('Olympisch');
    else if (val === 21.1) onPresetChange('70.3 (Halb)');
    else if (val === 42.2) onPresetChange('140.6 (Lang)');
    else onChange({ ...data, distanceKm: val });
  };

  const updatePace = (min: number, sec: number) => {
    const { min: newMin, sec: newSec } = calculateNewPace(min, sec);
    onChange({ ...data, paceMinPerKm: newMin, paceSecPerKm: newSec });
  };

  return (
    <DisciplineLayout
      theme="green"
      title="Laufen"
      subtitle={headerSubtitle}
      onSettingsClick={onOpenSettings}
      hasTopAd={!userProfile?.isPro}
    >
      {!userProfile?.isPro && <AdMobBanner />}
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
      <Card className="mb-5">
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
