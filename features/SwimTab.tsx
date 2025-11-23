import React from 'react';
import { useTranslation } from 'react-i18next';
import { SwimState, UserProfile } from '../types';
import {
  DisciplineLayout, TimeDisplayCard, Toggle, Card, Label,
  StepperInput, PresetGroup, VerticalPicker
} from '../components/MD3Components';
import { AdMobBanner } from '../components/AdMobBanner';
import { calculateSwimTime, formatTime, formatSingleDigit, parseManualInput } from '../utils';
import { useTargetTime, usePace } from '../hooks/useCalculatorLogic';
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
  const { t } = useTranslation();

  // Target Time State (for "Pace berechnen" mode)
  const { hours, minutes, seconds, updateTime, totalSeconds } = useTargetTime(0, 30, 0);

  // Pace Logic Helper
  const { calculateNewPace } = usePace();

  // 1. Calculate Results based on Mode
  const calculateResults = () => {
    if (mode === 'time') {
      // Result is Time
      const secs = calculateSwimTime(data.distanceMeters, data.paceMinPer100m, data.paceSecPer100m);
      return {
        displayMain: formatTime(secs),
        displayLabel: t('swim.estimatedTime'),
        secondsForTotal: secs
      };
    } else {
      // Result is Pace
      // Pace = Time / (Distance / 100)
      const distanceHundreds = data.distanceMeters / 100;

      let paceSecondsTotal = 0;
      if (distanceHundreds > 0) {
        paceSecondsTotal = totalSeconds / distanceHundreds;
      }

      const pMin = Math.floor(paceSecondsTotal / 60);
      const pSec = Math.round(paceSecondsTotal % 60);

      return {
        displayMain: `${pMin}:${formatSingleDigit(pSec)}/100m`,
        displayLabel: t('swim.avgPace'),
        secondsForTotal: totalSeconds
      };
    }
  };

  const { displayMain, displayLabel, secondsForTotal } = calculateResults();

  // Handlers for Distance
  const handleDistIncrease = () => onChange({ ...data, distanceMeters: data.distanceMeters + 10 });
  const handleDistDecrease = () => onChange({ ...data, distanceMeters: Math.max(0, data.distanceMeters - 10) });

  const handleDistManual = (val: string) => {
    const floatVal = parseManualInput(val);
    if (floatVal > 0 || val === '0') {
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
    const { min: newMin, sec: newSec } = calculateNewPace(min, sec);
    onChange({ ...data, paceMinPer100m: newMin, paceSecPer100m: newSec });
  };

  // Render Distance in KM
  const distKm = data.distanceMeters / 1000;
  const distDisplay = distKm.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <DisciplineLayout
      theme="blue"
      title={t('nav.swim')}
      subtitle={headerSubtitle}
      onSettingsClick={onOpenSettings}
      hasTopAd={!userProfile?.isPro}
    >
      {!userProfile?.isPro && <AdMobBanner />}
      <TimeDisplayCard
        label={displayLabel}
        time={displayMain}
        textColor="text-blue-700"
        onAdd={() => onSave(secondsForTotal)}
        subLabel={t('actions.addToTotal')}
        addedLabel={t('actions.added')}
      />

      <Toggle
        options={[
          { label: t('swim.calcTime'), value: 'time', icon: <Timer size={16} strokeWidth={2.5} /> },
          { label: t('swim.calcPace'), value: 'pace', icon: <Timer size={16} strokeWidth={2.5} /> }
        ]}
        active={mode}
        onChange={onModeChange}
        theme="blue"
      />

      <Label>{t('swim.distance')}</Label>
      <Card className="mb-5">
        <StepperInput
          value={distDisplay}
          unit={t('units.km')}
          onIncrease={handleDistIncrease}
          onDecrease={handleDistDecrease}
          onManualChange={handleDistManual}
        />
        <PresetGroup
          options={[
            { label: t('presets.sprint'), value: 750 },
            { label: t('presets.olympic'), value: 1500 },
            { label: t('presets.half'), value: 1900 },
            { label: t('presets.full'), value: 3800 },
          ]}
          activeValue={data.distanceMeters}
          onSelect={handlePreset}
          theme="blue"
        />
      </Card>

      {mode === 'time' ? (
        <>
          <Label>{t('swim.paceLabel')}</Label>
          <Card className="flex flex-col items-center">
            <div className="flex items-center gap-4">
      )}
            </DisciplineLayout>
            );
};