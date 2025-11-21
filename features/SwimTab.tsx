import React, { useState } from 'react';
import { SwimState, UserProfile } from '../types';
import {
  DisciplineLayout, TimeDisplayCard, Toggle, Card, Label,
  StepperInput, PresetGroup, VerticalPicker
} from '../components/MD3Components';
import { AdMobBanner } from '../components/AdMobBanner';
import { calculateSwimTime, formatTime, formatSingleDigit } from '../utils';
import { Timer, Footprints } from 'lucide-react';

interface Props {
  data: SwimState;
  onChange: (data: SwimState) => void;
  mode: string;
  onModeChange: (mode: string) => void;
  onPresetChange: (preset: 'Sprint' | 'Olympisch' | '70.3 (Halb)' | '140.6 (Lang)') => void;
  onSave: (totalSeconds: number) => void;
  headerSubtitle: string;
  onOpenSettings: () => void;
  userProfile: UserProfile | null;
}

export const SwimTab: React.FC<Props> = ({
  data, onChange, mode, onModeChange, onPresetChange, onSave,
  headerSubtitle, onOpenSettings, userProfile
}) => {

  // Target Time State (for "Pace berechnen" mode)
  const [targetHours, setTargetHours] = useState(0);
  const [targetMinutes, setTargetMinutes] = useState(30);
  const [targetSeconds, setTargetSeconds] = useState(0);

  // 1. Calculate Results based on Mode
  const calculateResults = () => {
    if (mode === 'time') {
      // Result is Time
      const secs = calculateSwimTime(data.distanceMeters, data.paceMinPer100m, data.paceSecPer100m);
      return {
        displayMain: formatTime(secs),
        displayLabel: 'Geschätzte Schwimmzeit',
        secondsForTotal: secs
      };
    } else {
      // Result is Pace
      // Pace = Time / (Distance / 100)
      const totalTargetSeconds = (targetHours * 3600) + (targetMinutes * 60) + targetSeconds;
      const distanceHundreds = data.distanceMeters / 100;

      let paceSecondsTotal = 0;
      if (distanceHundreds > 0) {
        paceSecondsTotal = totalTargetSeconds / distanceHundreds;
      }

      const pMin = Math.floor(paceSecondsTotal / 60);
      const pSec = Math.round(paceSecondsTotal % 60);

      return {
        displayMain: `${pMin}:${formatSingleDigit(pSec)}/100m`,
        displayLabel: 'Ø PACE',
        secondsForTotal: totalTargetSeconds
      };
    }
  };

  const { displayMain, displayLabel, secondsForTotal } = calculateResults();

  // Handlers for Distance
  const handleDistIncrease = () => onChange({ ...data, distanceMeters: data.distanceMeters + 10 });
  const handleDistDecrease = () => onChange({ ...data, distanceMeters: Math.max(0, data.distanceMeters - 10) });

  const handleDistManual = (val: string) => {
    // Input comes in from StepperInput local state. Replace comma with dot.
    const normalized = val.replace(',', '.');
    const floatVal = parseFloat(normalized);
    if (!isNaN(floatVal)) {
      // Input is in KM (1.5), State is in Meters (1500)
      onChange({ ...data, distanceMeters: Math.round(floatVal * 1000) });
    }
  };

  const handlePreset = (val: number) => {
    if (val === 750) onPresetChange('Sprint');
    else if (val === 1500) onPresetChange('Olympisch');
    else if (val === 1900) onPresetChange('70.3 (Halb)');
    else if (val === 3800) onPresetChange('140.6 (Lang)');
    else onChange({ ...data, distanceMeters: val });
  };

  // Handlers for Pace
  const updatePace = (min: number, sec: number) => {
    let newMin = min; let newSec = sec;
    if (newSec >= 60) { newMin++; newSec = 0; }
    if (newSec < 0) { newMin--; newSec = 59; }
    if (newMin < 0) { newMin = 0; newSec = 0; }
    onChange({ ...data, paceMinPer100m: newMin, paceSecPer100m: newSec });
  };

  // Handlers for Target Time
  const updateTargetTime = (h: number, m: number, s: number) => {
    let nh = h; let nm = m; let ns = s;
    if (ns >= 60) { nm++; ns = 0; }
    if (ns < 0) { nm--; ns = 59; }
    if (nm >= 60) { nh++; nm = 0; }
    if (nm < 0) { nh--; nm = 59; }
    if (nh < 0) { nh = 0; nm = 0; ns = 0; }
    setTargetHours(nh); setTargetMinutes(nm); setTargetSeconds(ns);
  };

  // Render Distance in KM
  const distKm = data.distanceMeters / 1000;
  const distDisplay = distKm.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <DisciplineLayout
      theme="blue"
      title="Schwimmen"
      subtitle={headerSubtitle}
      onSettingsClick={onOpenSettings}
      hasTopAd={!userProfile?.isPro}
    >
      {!userProfile?.isPro && <AdMobBanner />}

      <TimeDisplayCard
        label={displayLabel}
        time={displayMain}
        onAdd={() => onSave(secondsForTotal)}
        textColor="text-[#005596]"
      />

      <Toggle
        options={[
          { label: 'Zeit berechnen', value: 'time', icon: <Timer size={16} strokeWidth={2.5} /> },
          { label: 'Pace berechnen', value: 'pace', icon: <Footprints size={16} strokeWidth={2.5} /> }
        ]}
        active={mode}
        onChange={onModeChange}
        theme="blue"
      />

      <Label>Distanz</Label>
      <Card className="mb-5">
        <StepperInput
          value={distDisplay}
          unit="KM"
          onIncrease={handleDistIncrease}
          onDecrease={handleDistDecrease}
          onManualChange={handleDistManual}
        />
        <PresetGroup
          options={[
            { label: 'Sprint', value: 750 },
            { label: 'Olympisch', value: 1500 },
            { label: '70.3 (Halb)', value: 1900 },
            { label: '140.6 (Lang)', value: 3800 },
          ]}
          activeValue={data.distanceMeters}
          onSelect={handlePreset}
          theme="blue"
        />
      </Card>

      {mode === 'time' ? (
        <>
          <Label>Pace (MIN/100M)</Label>
          <Card className="flex flex-col items-center">
            <div className="flex items-center gap-4">
              <VerticalPicker
                value={formatSingleDigit(data.paceMinPer100m)}
                onIncrease={() => updatePace(data.paceMinPer100m + 1, data.paceSecPer100m)}
                onDecrease={() => updatePace(data.paceMinPer100m - 1, data.paceSecPer100m)}
                onManualChange={(v) => updatePace(parseInt(v) || 0, data.paceSecPer100m)}
              />
              <span className="text-2xl font-bold text-slate-300">:</span>
              <VerticalPicker
                value={formatSingleDigit(data.paceSecPer100m)}
                onIncrease={() => updatePace(data.paceMinPer100m, data.paceSecPer100m + 1)}
                onDecrease={() => updatePace(data.paceMinPer100m, data.paceSecPer100m - 1)}
                onManualChange={(v) => updatePace(data.paceMinPer100m, parseInt(v) || 0)}
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