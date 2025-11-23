import React, { useState } from 'react';
import { UserProfile } from '../types';
import { WelcomeInput, GenderSelect, Card, Label } from '../components/MD3Components';
import { ArrowLeft, User, Calendar, Globe } from 'lucide-react';
import { calculateAgeGroup } from '../utils';
import 'cordova-plugin-purchase';
import { useTranslation } from 'react-i18next';

interface Props {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onClose: () => void;
  onPurchase: () => void;
  onRestore: () => void;
  product: CdvPurchase.Product | null;
  storeAvailable: boolean;
}

export const SettingsTab: React.FC<Props> = ({ userProfile, onUpdateProfile, onClose, onPurchase, onRestore, product, storeAvailable }) => {
  const { t, i18n } = useTranslation();
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

  const getPriceText = () => {
    if (product && product.offers && product.offers.length > 0) {
      const offer = product.offers[0];
      if (offer.pricingPhases && offer.pricingPhases.length > 0) {
        return offer.pricingPhases[0].price;
      }
    }
    return "0,99 €";
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
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
          <h1 className="text-xl font-bold text-slate-900">{t('settings.title')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">

        <div>
          <Label>{t('settings.language')}</Label>
          <Card>
            <div className="flex gap-3">
              <button
                onClick={() => changeLanguage('en')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${i18n.resolvedLanguage === 'en'
                  ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
                  : 'bg-[#f8fafc] border-transparent text-slate-400 hover:bg-slate-100'
                  }`}
              >
                English
              </button>
              <button
                onClick={() => changeLanguage('de')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${i18n.resolvedLanguage === 'de'
                  ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
                  : 'bg-[#f8fafc] border-transparent text-slate-400 hover:bg-slate-100'
                  }`}
              >
                Deutsch
              </button>
            </div>
          </Card>
        </div>

        <div>
          <Label>{t('settings.myProfile')} ({ageGroup})</Label>
          <Card>
            <WelcomeInput
              label={t('settings.displayName')}
              placeholder="Dein Name"
              value={name}
              onChange={setName}
              icon={<User size={18} />}
            />
            <WelcomeInput
              label={t('settings.birthDate')}
              placeholder="tt.mm.jjjj"
              type="date"
              value={birthDate}
              onChange={setBirthDate}
              icon={<Calendar size={18} />}
            />
            <GenderSelect
              selected={gender}
              onChange={setGender}
              label={t('settings.gender')}
              maleLabel={t('gender.male')}
              femaleLabel={t('gender.female')}
            />

            <button
              onClick={handleSave}
              className="w-full bg-[#0f172a] text-white font-bold py-3 rounded-xl mt-2 hover:bg-slate-800 transition-colors active:scale-95"
            >
              {t('common.save')}
            </button>
          </Card>
        </div>

        <div>
          <Label>{t('settings.proVersion')}</Label>
          <Card>
            {userProfile.isPro ? (
              <div className="flex items-center justify-center gap-2 py-4 text-emerald-600 font-bold">
                <span>{t('settings.proActive')}</span>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={onPurchase}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  {t('settings.removeAds')} ({getPriceText()})
                </button>
                <button
                  onClick={onRestore}
                  className="w-full text-slate-500 text-sm font-medium py-2 hover:text-slate-800 transition-colors"
                >
                  {t('settings.restorePurchases')}
                </button>
              </div>
            )}
          </Card>
        </div>

        <div className="text-center pt-4 pb-8">
          <p className="text-[10px] text-slate-400">
            TriCalc v1.2.1
          </p>
        </div>

      </div>
    </div>
  );
};