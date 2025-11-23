import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flag, User, Calendar, ArrowRight } from 'lucide-react';
import { WelcomeInput, GenderSelect, ThemeSelect } from '../components/MD3Components';
import { UserProfile, Theme } from '../types';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [theme, setTheme] = useState<Theme>('system');

  const handleSubmit = () => {
    if (name && birthDate && gender) {
      onComplete({ name, birthDate, gender, theme });
    }
  };

  const isValid = name.length > 0 && birthDate.length > 0 && gender !== null;

  return (
    // Updated padding: px-6 pt-14 pb-6 for safe area
    <div className="min-h-screen bg-white dark:bg-slate-950 px-6 pt-14 pb-6 flex flex-col max-w-md mx-auto transition-colors duration-300">
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-[#eef2ff] dark:bg-indigo-900/20 rounded-[24px] flex items-center justify-center text-[#4f46e5] dark:text-indigo-400 shadow-sm">
            <Flag size={40} strokeWidth={1.5} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">{t('welcome.title')} 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-4">
            {t('welcome.intro')}
          </p>
        </div>

        <div className="space-y-2">
          <WelcomeInput
            label={t('welcome.nameLabel')}
            placeholder={t('welcome.namePlaceholder')}
            value={name}
            onChange={setName}
            icon={<User size={18} />}
          />

          <WelcomeInput
            label={t('welcome.birthDateLabel')}
            placeholder={t('welcome.birthDatePlaceholder')}
            type="date"
            value={birthDate}
            onChange={setBirthDate}
            icon={<Calendar size={18} />}
          />

          <GenderSelect
            selected={gender}
            onChange={setGender}
            label={t('welcome.genderLabel')}
            maleLabel={t('gender.male')}
            femaleLabel={t('gender.female')}
          />

          <ThemeSelect
            selected={theme}
            onChange={setTheme}
            label={t('settings.theme') || "Design"}
            lightLabel={t('settings.themeLight') || "Hell"}
            darkLabel={t('settings.themeDark') || "Dunkel"}
            systemLabel={t('settings.themeSystem') || "System"}
          />
        </div>
      </div>

      <div className="pb-8">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${isValid
            ? 'bg-[#e2e8f0] dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-[#cbd5e1] dark:hover:bg-slate-700 shadow-sm translate-y-0'
            : 'bg-slate-50 dark:bg-slate-900 text-slate-300 dark:text-slate-700 cursor-not-allowed'
            }`}
        >
          {t('welcome.button')} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
