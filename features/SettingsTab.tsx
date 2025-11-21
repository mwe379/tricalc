import React, { useState } from 'react';
import { UserProfile } from '../types';
import { WelcomeInput, GenderSelect, Card, Label } from '../components/MD3Components';
import { ArrowLeft, User, Calendar } from 'lucide-react';
import { calculateAgeGroup } from '../utils';

interface Props {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onClose: () => void;
  onPurchase: () => void;
  onRestore: () => void;
}

export const SettingsTab: React.FC<Props> = ({ userProfile, onUpdateProfile, onClose, onPurchase, onRestore }) => {
  const [name, setName] = useState(userProfile.name);
  const [birthDate, setBirthDate] = useState(userProfile.birthDate);
  const [gender, setGender] = useState(userProfile.gender);

  const ageGroup = calculateAgeGroup(birthDate);

  const handleSave = () => {
    onUpdateProfile({
      name,
      birthDate,
      gender,
      isPro: userProfile.isPro
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

        <div>
          <Label>Pro Version</Label>
          <Card>
            {userProfile.isPro ? (
              <div className="flex items-center justify-center gap-2 py-4 text-emerald-600 font-bold">
                <span>★ Pro Version Aktiviert</span>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={onPurchase}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  Werbung entfernen (0,99 €)
                </button>
                <button
                  onClick={onRestore}
                  className="w-full text-slate-500 text-sm font-medium py-2 hover:text-slate-800 transition-colors"
                >
                  Käufe wiederherstellen
                </button>
              </div>
            )}
          </Card>
        </div>

        <div className="text-center pt-4 pb-8">
          <p className="text-[10px] text-slate-400">
            TriCalc v1.2.0
          </p>
        </div>

      </div>
    </div>
  );
};