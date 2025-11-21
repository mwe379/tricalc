import React, { useEffect } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdOptions } from '@capacitor-community/admob';

// Offizielle Google AdMob Test ID für Android Banner
const ANDROID_TEST_ID = 'ca-app-pub-3940256099942544/6300978111';

export const AdMobBanner: React.FC = () => {

    useEffect(() => {
        let active = true;

        const initAndShowBanner = async () => {
            try {
                // 1. AdMob Initialisieren
                // FIX: 'requestTrackingAuthorization' entfernt, um den TypeScript-Fehler zu beheben.
                await AdMob.initialize({
                    initializeForTesting: true,
                });

                if (!active) return;

                // 2. Konfiguration des Banners
                const options: BannerAdOptions = {
                    adId: ANDROID_TEST_ID,
                    adSize: BannerAdSize.BANNER, // Standardgröße 320x50
                    // Wir positionieren es unten mittig mit Abstand
                    position: BannerAdPosition.BOTTOM_CENTER,
                    margin: 90,
                    isTesting: true // Aktiviert Test-Mode explizit
                };

                // 3. Banner anzeigen
                await AdMob.showBanner(options);

            } catch (err) {
                console.error('AdMob Fehler (Stelle sicher, dass du auf einem Gerät/Emulator bist):', err);
            }
        };

        initAndShowBanner();

        // Cleanup: Wenn der User den Tab verlässt, wird der Banner entfernt
        return () => {
            active = false;
            AdMob.removeBanner().catch(err => console.error('Fehler beim Entfernen des Banners:', err));
        };
    }, []);

    return null;
};