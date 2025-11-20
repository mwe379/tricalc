
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { WelcomeInput, GenderSelect, Card, Label, ResetButton } from '../components/MD3Components';
import { ArrowLeft, User, Calendar, TriangleAlert } from 'lucide-react';
import { calculateAgeGroup } from '../utils';

interface Props {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onClose: () => void;
  onResetApp: () => void;
}

export const SettingsTab: React.FC<Props> = ({ userProfile, onUpdateProfile, onClose, onResetApp }) => {
  const [name, setName] = useState(userProfile.name);
  const [birthDate, setBirthDate] = useState(userProfile.birthDate);
  const [gender, setGender] = useState(userProfile.gender);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const ageGroup = calculateAgeGroup(birthDate);

  const handleSave = () => {
    onUpdateProfile({
      name,
      birthDate,
      gender,
      isPro: userProfile.isPro // Preserve existing pro status in data, even if UI is gone
    });
    onClose();
  };

  return (
    <div className="min-h-screen bg-[#f3f5f7] pb-32 max-w-md mx-auto w-full">
      {/* White Header - Updated top padding to pt-14 for safe area */}
      <div className="bg-white pt-14 pb-4 px-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Einstellungen</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        
        <div>
            <Label>Mein Profil ({ageGroup})</Label>
            <Card>
                <WelcomeInput 
                    label="Anzeigename" 
                    placeholder="Dein Name" 
                    value={name} 
                    onChange={setName}
                    icon={<User size={18} />}
                />
                <WelcomeInput 
                    label="Geburtsdatum" 
                    placeholder="tt.mm.jjjj" 
                    type="date"
                    value={birthDate} 
                    onChange={setBirthDate}
                    icon={<Calendar size={18} />}
                />
                <GenderSelect 
                    selected={gender} 
                    onChange={setGender} 
                />
                
                <button
                    onClick={handleSave}
                    className="w-full bg-[#0f172a] text-white font-bold py-3 rounded-xl mt-2 hover:bg-slate-800 transition-colors active:scale-95"
                >
                    Änderungen speichern
                </button>
            </Card>
        </div>

        {/* Danger Zone for Reset App */}
        <div>
            <div className="flex items-center gap-2 mb-3 pl-1">
                <TriangleAlert size={14} className="text-red-500" />
                <h3 className="text-[11px] font-bold text-red-500 uppercase tracking-widest">Gefahrenzone</h3>
            </div>
            
            <Card className="border-red-100">
                {!showResetConfirm ? (
                    <button 
                        onClick={() => setShowResetConfirm(true)}
                        className="w-full py-3 rounded-xl border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors"
                    >
                        App zurücksetzen
                    </button>
                ) : (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <p className="text-sm text-slate-600 mb-4 text-center">
                            Möchtest du wirklich alle Daten löschen und von vorne beginnen? Dies kann nicht rückgängig gemacht werden.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                            >
                                Abbrechen
                            </button>
                            <button 
                                onClick={onResetApp}
                                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-md shadow-red-200"
                            >
                                Ja, alles löschen
                            </button>
                        </div>
                    </div>
                )}
            </Card>
        </div>

        <div className="text-center pt-4 pb-8">
            <p className="text-[10px] text-slate-400">
                TriCalc MD3 v1.0.3 • Build 2024
            </p>
        </div>

      </div>
    </div>
  );
};
