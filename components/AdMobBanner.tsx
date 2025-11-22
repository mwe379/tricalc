import React, { useEffect } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdOptions } from '@capacitor-community/admob';

const ANDROID_BANNER_ID = 'ca-app-pub-9120977887635362/3605476190';

export const AdMobBanner: React.FC = () => {

    useEffect(() => {
        let active = true;

        const initAndShowBanner = async () => {
            try {
                await AdMob.initialize({
                    initializeForTesting: false,
                });

                if (!active) return;

                const options: BannerAdOptions = {
                    adId: ANDROID_BANNER_ID,
                    adSize: BannerAdSize.ADAPTIVE_BANNER,

                    // ÄNDERUNG: Wir platzieren ihn OBEN, das ist layout-technisch viel sicherer
                    position: BannerAdPosition.TOP_CENTER,
                    margin: 0,

                    isTesting: false
                };

                await AdMob.showBanner(options);

            } catch (err) {
                console.error('AdMob Fehler:', err);
            }
        };

        initAndShowBanner();

        return () => {
            active = false;
            AdMob.removeBanner().catch(err => console.error('Fehler beim Entfernen:', err));
        };
    }, []);

    return null;
};