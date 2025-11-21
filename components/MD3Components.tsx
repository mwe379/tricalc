import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Plus, Minus, Settings, Trash2, Check, X, Trophy } from 'lucide-react';

// -- Types --
export type ThemeColor = 'blue' | 'orange' | 'green' | 'purple';

// -- Styles --
const InputStyles = () => (
  <style>{`
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }
  `}</style>
);

// -- Helpers --
const getThemeStyles = (isActive: boolean, theme: ThemeColor) => {
  if (isActive) {
    switch (theme) {
      case 'orange': return 'bg-[#ea580c] text-white shadow-md';
      case 'green': return 'bg-[#059669] text-white shadow-md';
      case 'purple': return 'bg-[#7c3aed] text-white shadow-md';
      case 'blue':
      default: return 'bg-[#2563eb] text-white shadow-md';
    }
  } else {
    switch (theme) {
      case 'orange': return 'bg-[#ffedd5] text-[#9a3412] hover:bg-[#fed7aa]';
      case 'green': return 'bg-[#d1fae5] text-[#065f46] hover:bg-[#a7f3d0]';
      case 'purple': return 'bg-[#ede9fe] text-[#5b21b6] hover:bg-[#ddd6fe]';
      case 'blue':
      default: return 'bg-[#dbeafe] text-[#1e40af] hover:bg-[#bfdbfe]';
    }
  }
};

// -- Wrapper --
export const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="pb-32 pt-4 px-4 max-w-md mx-auto w-full">
    <InputStyles />
    {children}
  </div>
);

// -- Discipline Layout (Colored Header) --
export const DisciplineLayout = ({
  children,
  theme = 'blue',
  title,
  subtitle,
  onSettingsClick
}: {
  children: React.ReactNode;
  theme: ThemeColor;
  title: string;
  subtitle?: string;
  onSettingsClick?: () => void;
}) => {
  const getThemeColors = () => {
    switch (theme) {
      case 'orange': return 'bg-orange-50 text-orange-900';
      case 'green': return 'bg-emerald-50 text-emerald-900';
      case 'purple': return 'bg-indigo-50 text-indigo-900';
      case 'blue':
      default: return 'bg-blue-50 text-blue-900';
    }
  }

  return (
    // WICHTIGE ÄNDERUNG: pb-48 (statt pb-32)
    // Erhöhtes Bottom-Padding, damit der Content nicht hinter der Werbung+Navbar verschwindet
    <div className="min-h-screen bg-[#f3f5f7] pb-48 max-w-md mx-auto w-full">
      <InputStyles />
      <div className={`pt-24 pb-6 px-6 shadow-sm ${getThemeColors()}`}>
        {subtitle && (
          <div className="text-[10px] font-bold opacity-60 tracking-widest uppercase mb-1">
            {subtitle}
          </div>
        )}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          <button
            onClick={onSettingsClick}
            className="opacity-60 hover:opacity-100 transition-opacity p-2 -mr-2"
          >
            <Settings size={28} />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {children}
      </div>
    </div>
  );
};

// -- Standard Header --
export const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-6 mt-2">
    <div className="flex justify-between items-start mb-1">
      {subtitle && (
        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
          {subtitle}
        </span>
      )}
      <button className="text-slate-300 hover:text-slate-500">
        <Settings size={20} />
      </button>
    </div>
    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
  </div>
);

// -- Card --
export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-[24px] p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-50 ${className}`}>
    {children}
  </div>
);

// -- Label --
export const Label = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1 ${className}`}>
    {children}
  </h3>
);

// -- Performance Badge --
export const PerformanceBadge = ({
  percentile,
  akLabel
}: {
  percentile: number;
  akLabel: string;
}) => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f3e8ff] rounded-full text-[#7e22ce] text-xs font-bold mb-2 shadow-sm border border-[#e9d5ff] animate-in zoom-in-95">
      <Trophy size={14} fill="currentColor" className="text-[#a855f7]" />
      <span>Schneller als {percentile}% der AK ({akLabel})</span>
    </div>
  );
};

// -- Time Display Card --
export const TimeDisplayCard = ({
  label,
  time,
  textColor = 'text-[#005596]',
  onAdd,
  subLabel = "ZUR GESAMTZEIT HINZUFÜGEN"
}: {
  label: string;
  time: string;
  textColor?: string;
  onAdd?: () => void;
  subLabel?: string;
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    if (onAdd) {
      onAdd();
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  return (
    <div className="bg-white rounded-[28px] p-5 pb-5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] border border-slate-50 relative mb-5 transition-all">

      <div className="flex flex-col">
        <Label className="mb-1 opacity-60 text-left">{label}</Label>

        <div className="flex items-center justify-between">
          <span className={`text-6xl font-black tracking-tighter ${textColor}`}>
            {time}
          </span>

          {onAdd && (
            <button
              onClick={handleAdd}
              disabled={isAdded}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 flex-shrink-0 transform
                    ${isAdded ? 'bg-green-500 scale-105' : 'bg-[#4c4aec] hover:bg-[#3f3dbf] active:scale-95'}
                    `}
            >
              {isAdded ? <Check size={24} strokeWidth={3} /> : <Plus size={28} strokeWidth={2.5} />}
            </button>
          )}
        </div>

        {onAdd && (
          <div className="flex justify-end mt-2">
            <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors duration-300 ${isAdded ? 'text-green-600' : 'text-[#4c4aec]/80'}`}>
              {isAdded ? "HINZUGEFÜGT" : subLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// -- Toggle --
export interface ToggleOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export const Toggle = ({
  options,
  active,
  onChange,
  theme = 'blue'
}: {
  options: ToggleOption[];
  active: string;
  onChange: (o: string) => void;
  theme?: ThemeColor;
}) => (
  <div className="flex gap-2 mb-6">
    {options.map((opt) => {
      const isActive = active === opt.value;
      return (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`
                    flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2
                    ${getThemeStyles(isActive, theme)}
                    ${isActive ? 'scale-100' : 'scale-95'}
                `}
        >
          {opt.icon}
          {opt.label}
        </button>
      );
    })}
  </div>
);

// -- Stepper Input --
export const StepperInput = ({
  value,
  unit,
  onIncrease,
  onDecrease,
  onManualChange
}: {
  value: string;
  unit: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onManualChange?: (val: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value);
    }
  }, [value, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (onManualChange) {
      onManualChange(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="bg-[#f8fafc] rounded-[20px] p-3 flex items-center justify-between border border-slate-100 mb-3">
      <button
        onClick={onDecrease}
        className="w-11 h-11 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200 text-slate-500 hover:text-slate-800 active:scale-95 transition-all flex-shrink-0"
      >
        <Minus size={20} />
      </button>

      <div className="text-center flex-1 mx-2">
        <input
          type="text"
          inputMode="decimal"
          value={localValue}
          onFocus={() => setIsEditing(true)}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full text-3xl font-black text-slate-900 tracking-tight text-center bg-transparent border-none outline-none p-0"
        />
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{unit}</div>
      </div>

      <button
        onClick={onIncrease}
        className="w-11 h-11 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200 text-slate-500 hover:text-slate-800 active:scale-95 transition-all flex-shrink-0"
      >
        <Plus size={20} />
      </button>
    </div>
  );
};

// -- Presets --
export const PresetGroup = ({
  options,
  activeValue,
  onSelect,
  theme = 'blue'
}: {
  options: { label: string; value: any }[];
  activeValue: any;
  onSelect: (val: any) => void;
  theme?: ThemeColor;
}) => {
  return (
    <div className="flex gap-1">
      {options.map((opt, index) => {
        const isActive = Math.abs(activeValue - opt.value) < 0.001;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        let borderRadiusClass = '';
        if (isActive) {
          borderRadiusClass = 'rounded-full scale-[1.02] z-10';
        } else {
          if (isFirst) borderRadiusClass = 'rounded-l-full rounded-r-lg';
          else if (isLast) borderRadiusClass = 'rounded-r-full rounded-l-lg';
          else borderRadiusClass = 'rounded-lg';
        }

        return (
          <button
            key={opt.label}
            onClick={() => onSelect(opt.value)}
            className={`
            flex-1 py-2.5 px-1 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-tight transition-all duration-200
            ${getThemeStyles(isActive, theme)}
            ${borderRadiusClass}
          `}
          >
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// -- Vertical Picker --
export const VerticalPicker = ({
  value,
  label,
  subLabel,
  onIncrease,
  onDecrease,
  onManualChange
}: {
  value: string;
  label?: string;
  subLabel?: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onManualChange?: (val: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    if (!isEditing) setLocalValue(value);
  }, [value, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (onManualChange) onManualChange(localValue);
  };

  return (
    <div className="flex flex-col items-center w-20">
      <button onClick={onIncrease} className="text-slate-300 hover:text-slate-500 p-1 transition-colors"><ChevronUp size={20} /></button>

      <div className="bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.05)] w-16 h-12 flex items-center justify-center rounded-2xl my-0.5 overflow-hidden">
        <input
          type="number"
          inputMode="numeric"
          value={localValue}
          onFocus={() => setIsEditing(true)}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
          className="w-full h-full text-center text-xl font-bold text-slate-900 bg-transparent outline-none"
        />
      </div>

      <button onClick={onDecrease} className="text-slate-300 hover:text-slate-500 p-1 transition-colors"><ChevronDown size={20} /></button>

      {(label || subLabel) && (
        <div className="text-center mt-1">
          {label && <div className="text-[9px] font-bold text-slate-400 uppercase">{label}</div>}
          {subLabel && <div className="text-[8px] font-bold text-slate-300 uppercase mt-0.5">{subLabel}</div>}
        </div>
      )}
    </div>
  );
};

// -- Welcome Screen Inputs --
export const WelcomeInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  icon
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  icon?: React.ReactNode;
}) => (
  <div className="mb-5">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
      {label}
    </label>
    <div className="bg-[#f8fafc] border border-slate-200 rounded-xl flex items-center px-4 py-3 focus-within:border-blue-400 focus-within:bg-white transition-all">
      {icon && <div className="mr-3 text-slate-400">{icon}</div>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-none outline-none text-slate-700 w-full font-medium placeholder:text-slate-400"
      />
    </div>
  </div>
);

export const GenderSelect = ({
  selected,
  onChange
}: {
  selected: 'male' | 'female' | null;
  onChange: (val: 'male' | 'female') => void
}) => (
  <div className="mb-8">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
      Geschlecht
    </label>
    <div className="flex gap-3">
      <button
        onClick={() => onChange('male')}
        className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${selected === 'male'
            ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
            : 'bg-[#f8fafc] border-transparent text-slate-400 hover:bg-slate-100'
          }`}
      >
        Männlich
      </button>
      <button
        onClick={() => onChange('female')}
        className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${selected === 'female'
            ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
            : 'bg-[#f8fafc] border-transparent text-slate-400 hover:bg-slate-100'
          }`}
      >
        Weiblich
      </button>
    </div>
  </div>
);

// -- Reset Button --
export const ResetButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    onClick={onClick}
    className="w-full bg-red-50 text-red-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mt-8 hover:bg-red-100 transition-colors active:scale-95"
  >
    <Trash2 size={18} />
    {label}
  </button>
);