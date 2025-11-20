import React from 'react';
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
          ${isActive ? activeColorClass : 'bg-transparent text-slate-400 group-hover:bg-slate-50'}
        `}
      >
        {React.cloneElement(icon as React.ReactElement<any>, { 
            size: 22, 
            strokeWidth: isActive ? 2.5 : 2,
            className: isActive ? activeTextClass : 'text-slate-400'
        })}
      </div>
      <span className={`text-[11px] font-medium transition-colors duration-200 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
        {label}
      </span>
    </button>
  );
};

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[84px] bg-white border-t border-slate-200 flex items-center justify-around z-50 pb-4 md:pb-0 max-w-md mx-auto w-full shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.03)]">
      <NavItem
        icon={<Waves />}
        label="Schwimmen"
        isActive={activeTab === Tab.Swim}
        onClick={() => onTabChange(Tab.Swim)}
        activeColorClass="bg-blue-100"
        activeTextClass="text-blue-700"
      />
      <NavItem
        icon={<Bike />}
        label="Rad"
        isActive={activeTab === Tab.Bike}
        onClick={() => onTabChange(Tab.Bike)}
        activeColorClass="bg-orange-100"
        activeTextClass="text-orange-700"
      />
      <NavItem
        icon={<Footprints />}
        label="Laufen"
        isActive={activeTab === Tab.Run}
        onClick={() => onTabChange(Tab.Run)}
        activeColorClass="bg-emerald-100"
        activeTextClass="text-emerald-700"
      />
      <NavItem
        icon={<Flag />}
        label="Total"
        isActive={activeTab === Tab.Total}
        onClick={() => onTabChange(Tab.Total)}
        activeColorClass="bg-indigo-100"
        activeTextClass="text-indigo-700"
      />
    </div>
  );
};