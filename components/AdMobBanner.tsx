import React, { useEffect } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdOptions } from '@capacitor-community/admob';

// Offizielle Google AdMob Test ID für Android
const ANDROID_TEST_ID = 'ca-app-pub-3940256099942544/6300978111';

export const AdMobBanner: React.FC = () => {

    useEffect(() => {
        let active = true;

        const initAndShowBanner = async () => {
            try {
                // 1. Initialisieren (Idempotent)
                await AdMob.initialize({
                    initializeForTesting: true,
                });

                if (!active) return;

                // 2. Konfiguration
                const options: BannerAdOptions = {
                    adId: ANDROID_TEST_ID,
                    // WICHTIG: ADAPTIVE_BANNER nutzt die volle Breite des Geräts
                    adSize: BannerAdSize.ADAPTIVE_BANNER,

                    // Positionierung
                    position: BannerAdPosition.BOTTOM_CENTER,

                    // MARGIN-LOGIK:
                    // Deine BottomNav ist 84px hoch.
                    // Wir setzen margin auf 84 (oder 88 für etwas Luft), 
                    // damit der Banner GENAU ÜBER der Navigation schwebt.
                    margin: 84,

                    isTesting: true
                };

                // 3. Anzeigen
                await AdMob.showBanner(options);

            } catch (err) {
                console.error('AdMob Fehler:', err);
            }
        };

        initAndShowBanner();

        // Cleanup beim Verlassen
        return () => {
            active = false;
            AdMob.removeBanner().catch(err => console.error('Fehler beim Entfernen:', err));
        };
    }, []);

    return null;
};