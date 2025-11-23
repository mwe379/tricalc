import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tab } from '../types';
import { Waves, Bike, Footprints, Flag } from 'lucide-react';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  activeColorClass: string;
  activeTextClass: string;
}> = ({ icon, label, isActive, onClick, activeColorClass, activeTextClass }) => {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center gap-1.5 group focus:outline-none h-full pt-2"
    >
      <div
        className={`
          flex items-center justify-center w-14 h-8 rounded-full transition-all duration-300
          ${isActive ? activeColorClass : 'bg-transparent text-slate-400 dark:text-slate-500 group-hover:bg-slate-50 dark:group-hover:bg-slate-800'}
        `}
      >
        {React.cloneElement(icon as React.ReactElement<any>, {
          size: 22,
          strokeWidth: isActive ? 2.5 : 2,
          className: isActive ? activeTextClass : 'text-slate-400 dark:text-slate-500'
        })}
      </div>
      <span className={`text-[11px] font-medium transition-colors duration-200 ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
        {label}
      </span>
    </button>
  );
};

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[84px] bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around z-50 pb-4 md:pb-0 max-w-md mx-auto w-full shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.03)] transition-colors duration-300">
      <NavItem
        icon={<Waves />}
        label={t('nav.swim')}
        isActive={activeTab === Tab.Swim}
        onClick={() => onTabChange(Tab.Swim)}
        activeColorClass="bg-blue-100 dark:bg-blue-900/30"
        activeTextClass="text-blue-700 dark:text-blue-300"
      />
      <NavItem
        icon={<Bike />}
        label={t('nav.bike')}
        isActive={activeTab === Tab.Bike}
        onClick={() => onTabChange(Tab.Bike)}
        activeColorClass="bg-orange-100 dark:bg-orange-900/30"
        activeTextClass="text-orange-700 dark:text-orange-300"
      />
      <NavItem
        icon={<Footprints />}
        label={t('nav.run')}
        isActive={activeTab === Tab.Run}
        onClick={() => onTabChange(Tab.Run)}
        activeColorClass="bg-emerald-100 dark:bg-emerald-900/30"
        activeTextClass="text-emerald-700 dark:text-emerald-300"
      />
      <NavItem
        icon={<Flag />}
        label={t('nav.total')}
        isActive={activeTab === Tab.Total}
        onClick={() => onTabChange(Tab.Total)}
        activeColorClass="bg-indigo-100 dark:bg-indigo-900/30"
        activeTextClass="text-indigo-700 dark:text-indigo-300"
      />
    </div>
  );
};