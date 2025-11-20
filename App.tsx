
import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { SwimTab } from './features/SwimTab';
import { BikeTab } from './features/BikeTab';
import { RunTab } from './features/RunTab';
import { TotalTab } from './features/TotalTab';
import { WelcomeScreen } from './features/WelcomeScreen';
import { SettingsTab } from './features/SettingsTab';
import { Tab, SwimState, BikeState, RunState, TransitionState, UserProfile } from './types';
import { calculateAgeGroup } from './utils';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Swim);
  const [previousTab, setPreviousTab] = useState<Tab>(Tab.Swim);

  // -- User Profile / Onboarding --
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  // Load profile from storage on mount
  useEffect(() => {
    const storedProfile = localStorage.getItem('triCalcProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
      setIsOnboardingComplete(true);
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    localStorage.setItem('triCalcProfile', JSON.stringify(profile));
    setUserProfile(profile);
    setIsOnboardingComplete(true);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
      localStorage.setItem('triCalcProfile', JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
  }

  const getHeaderSubtitle = () => {
    if (!userProfile) return 'HI GAST';
    const ageGroup = calculateAgeGroup(userProfile.birthDate);
    return `HI ${userProfile.name.toUpperCase()} • ${ageGroup}`;
  };

  // -- Application State --

  // Global Calculation Mode State ('time' or 'pace')
  const [calculationMode, setCalculationMode] = useState<string>('time');

  // LIVE INPUT STATE (Scratchpad)
  const [swimData, setSwimData] = useState<SwimState>({
    distanceMeters: 750, // Sprint
    paceMinPer100m: 2,
    paceSecPer100m: 0
  });

  const [bikeData, setBikeData] = useState<BikeState>({
    distanceKm: 20, // Sprint
    speedKmh: 30
  });

  const [runData, setRunData] = useState<RunState>({
    distanceKm: 5, // Sprint
    paceMinPerKm: 6,
    paceSecPerKm: 0
  });

  const [transitionData, setTransitionData] = useState<TransitionState>({
      t1Minutes: 0,
      t1Seconds: 0,
      t2Minutes: 0,
      t2Seconds: 0
  });

  // SAVED STATE (Race Plan / Total Tab)
  const [savedSwimSeconds, setSavedSwimSeconds] = useState<number>(0);
  const [savedBikeSeconds, setSavedBikeSeconds] = useState<number>(0);
  const [savedRunSeconds, setSavedRunSeconds] = useState<number>(0);

  const handleResetAll = () => {
      // Reset Inputs
      setSwimData({ distanceMeters: 750, paceMinPer100m: 2, paceSecPer100m: 0 });
      setBikeData({ distanceKm: 20, speedKmh: 30 });
      setRunData({ distanceKm: 5, paceMinPerKm: 6, paceSecPerKm: 0 });
      setTransitionData({ t1Minutes: 0, t1Seconds: 0, t2Minutes: 0, t2Seconds: 0 });
      
      // Reset Saved Times
      setSavedSwimSeconds(0);
      setSavedBikeSeconds(0);
      setSavedRunSeconds(0);
  }

  const handlePresetSelect = (preset: 'Sprint' | 'Olympisch' | '70.3 (Halb)' | '140.6 (Lang)') => {
      switch (preset) {
          case 'Sprint':
              setSwimData(d => ({ ...d, distanceMeters: 750 }));
              setBikeData(d => ({ ...d, distanceKm: 20 }));
              setRunData(d => ({ ...d, distanceKm: 5 }));
              break;
          case 'Olympisch':
              setSwimData(d => ({ ...d, distanceMeters: 1500 }));
              setBikeData(d => ({ ...d, distanceKm: 40 }));
              setRunData(d => ({ ...d, distanceKm: 10 }));
              break;
          case '70.3 (Halb)':
              setSwimData(d => ({ ...d, distanceMeters: 1900 }));
              setBikeData(d => ({ ...d, distanceKm: 90 }));
              setRunData(d => ({ ...d, distanceKm: 21.1 }));
              break;
          case '140.6 (Lang)':
              setSwimData(d => ({ ...d, distanceMeters: 3800 }));
              setBikeData(d => ({ ...d, distanceKm: 180 }));
              setRunData(d => ({ ...d, distanceKm: 42.2 }));
              break;
      }
  };

  const openSettings = () => {
      setPreviousTab(activeTab);
      setActiveTab(Tab.Settings);
  };

  const closeSettings = () => {
      setActiveTab(previousTab);
  };

  const handleTabChange = (tab: Tab) => {
      setActiveTab(tab);
  }

  const renderContent = () => {
    const subtitle = getHeaderSubtitle();

    switch (activeTab) {
      case Tab.Swim:
        return (
          <SwimTab 
            data={swimData} 
            onChange={setSwimData} 
            mode={calculationMode}
            onModeChange={setCalculationMode}
            onPresetChange={handlePresetSelect}
            onSave={(seconds) => setSavedSwimSeconds(seconds)}
            headerSubtitle=""
            onOpenSettings={openSettings}
            userProfile={userProfile}
          />
        );
      case Tab.Bike:
        return (
          <BikeTab 
            data={bikeData} 
            onChange={setBikeData} 
            mode={calculationMode}
            onModeChange={setCalculationMode}
            onPresetChange={handlePresetSelect}
            onSave={(seconds) => setSavedBikeSeconds(seconds)}
            headerSubtitle=""
            onOpenSettings={openSettings}
            userProfile={userProfile}
          />
        );
      case Tab.Run:
        return (
          <RunTab 
            data={runData} 
            onChange={setRunData} 
            mode={calculationMode}
            onModeChange={setCalculationMode}
            onPresetChange={handlePresetSelect}
            onSave={(seconds) => setSavedRunSeconds(seconds)}
            headerSubtitle=""
            onOpenSettings={openSettings}
            userProfile={userProfile}
          />
        );
      case Tab.Total:
        return (
          <TotalTab 
            swimSeconds={savedSwimSeconds} 
            bikeSeconds={savedBikeSeconds} 
            runSeconds={savedRunSeconds} 
            transitionData={transitionData}
            onTransitionChange={setTransitionData}
            onReset={handleResetAll}
            headerSubtitle=""
            onOpenSettings={openSettings}
            userProfile={userProfile}
            swimDistMeters={swimData.distanceMeters}
            bikeDistKm={bikeData.distanceKm}
            runDistKm={runData.distanceKm}
          />
        );
      case Tab.Settings:
         return userProfile ? (
            <SettingsTab 
                userProfile={userProfile} 
                onUpdateProfile={handleUpdateProfile}
                onClose={closeSettings}
            />
         ) : null;
      default:
        return null;
    }
  };

  if (!isOnboardingComplete) {
    return <WelcomeScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#f3f5f7] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 relative max-w-md mx-auto shadow-2xl border-x border-slate-200/50">
      <main className="h-full w-full overflow-y-auto scroll-smooth no-scrollbar">
        {renderContent()}
      </main>
      {activeTab !== Tab.Settings && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
};

export default App;
