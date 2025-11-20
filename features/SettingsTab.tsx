
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { WelcomeInput, GenderSelect, Card, Label } from '../components/MD3Components';
import { ArrowLeft, User, Calendar, Crown, Check, CreditCard } from 'lucide-react';
import { calculateAgeGroup } from '../utils';

interface Props {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onClose: () => void;
}

export const SettingsTab: React.FC<Props> = ({ userProfile, onUpdateProfile, onClose }) => {
  const [name, setName] = useState(userProfile.name);
  const [birthDate, setBirthDate] = useState(userProfile.birthDate);
  const [gender, setGender] = useState(userProfile.gender);
  const [isPro, setIsPro] = useState(userProfile.isPro || false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const ageGroup = calculateAgeGroup(birthDate);

  const handleSave = () => {
    onUpdateProfile({
      name,
      birthDate,
      gender,
      isPro
    });
    onClose();
  };

  const handlePurchase = () => {
      setIsPaymentProcessing(true);
      // Simulate API Call
      setTimeout(() => {
          setIsPaymentProcessing(false);
          setIsPro(true);
          // Auto save after purchase
          onUpdateProfile({
            name,
            birthDate,
            gender,
            isPro: true
          });
      }, 1500);
  }

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
            <Label>Mitgliedschaft</Label>
            <Card className="relative overflow-hidden">
                {!isPro ? (
                    <>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                <Crown size={20} fill="currentColor" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Triathlon Pro werden</h3>
                        </div>
                        
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-start gap-2 text-sm text-slate-600">
                                <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                <span>Keine Werbung mehr</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-600">
                                <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                <span>Unterstütze die Entwicklung</span>
                            </li>
                        </ul>

                        <button
                            onClick={handlePurchase}
                            disabled={isPaymentProcessing}
                            className={`w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-200 active:scale-95 transition-all
                                ${isPaymentProcessing ? 'opacity-80 cursor-wait' : 'hover:opacity-90'}
                            `}
                        >
                            {isPaymentProcessing ? (
                                "Zahlung wird verarbeitet..." 
                            ) : (
                                <>
                                    <CreditCard size={18} />
                                    Werbung entfernen (0.99 €)
                                </>
                            )}
                        </button>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">Du bist Pro!</h3>
                        <p className="text-slate-500 text-sm">Vielen Dank für deine Unterstützung.</p>
                        <div className="mt-4 inline-block bg-slate-50 px-4 py-2 rounded-full text-xs font-bold text-slate-400 uppercase tracking-wide">
                            Werbung deaktiviert
                        </div>
                    </div>
                )}
            </Card>
        </div>

        <div className="text-center pt-4 pb-8">
            <p className="text-[10px] text-slate-400">
                TriCalc MD3 v1.0.2 • Build 2024
            </p>
        </div>

      </div>
    </div>
  );
};
