import { useState, useEffect } from 'react';
import 'cordova-plugin-purchase';

// Define your product ID here. 
// IMPORTANT: This ID must match exactly what you set up in Google Play Console / App Store Connect.
const PRODUCT_ID_REMOVE_ADS = 'remove_ads';

export const useIAP = () => {
    const [isPro, setIsPro] = useState(false);
    const [storeAvailable, setStoreAvailable] = useState(false);
    const [product, setProduct] = useState<CdvPurchase.Product | null>(null);

    useEffect(() => {
        const initStore = () => {
            if (!window.CdvPurchase) {
                console.log('CdvPurchase not available yet');
                return;
            }

            const store = window.CdvPurchase.store;

            // Register the product
            store.register({
                id: PRODUCT_ID_REMOVE_ADS,
                type: window.CdvPurchase.ProductType.NON_CONSUMABLE,
                platform: window.CdvPurchase.Platform.GOOGLE_PLAY,
            });

            // Setup event listeners
            store.when()
                .approved((transaction) => {
                    console.log('Transaction approved', transaction);
                    transaction.verify();
                })
                .verified((receipt) => {
                    console.log('Receipt verified', receipt);
                    setIsPro(true);
                    receipt.finish();
                })
                .finished((transaction) => {
                    console.log('Transaction finished', transaction);
                })
                .updated((p) => {
                    const product = p as unknown as CdvPurchase.Product;
                    if (product.id === PRODUCT_ID_REMOVE_ADS) {
                        setProduct(product);
                        setIsPro(product.owned);
                    }
                });

            // Initialize the store
            store.initialize([
                window.CdvPurchase.Platform.GOOGLE_PLAY
            ]);

            store.ready(() => {
                console.log('Store ready');
                setStoreAvailable(true);
                // Check if already owned
                const p = store.get(PRODUCT_ID_REMOVE_ADS);
                if (p) {
                    setProduct(p);
                    setIsPro(p.owned);
                }
                // Force update to ensure we have the latest state (e.g. after refund)
                store.update();
            });
        };

        document.addEventListener('deviceready', initStore);

        return () => {
            document.removeEventListener('deviceready', initStore);
        };
    }, []);

    const purchase = () => {
        if (!window.CdvPurchase) {
            console.error('Store not initialized');
            return;
        }
        const store = window.CdvPurchase.store;
        const product = store.get(PRODUCT_ID_REMOVE_ADS);
        if (product) {
            product.getOffer()?.order();
        } else {
            console.error('Product not found');
        }
    };

    const restore = () => {
        if (!window.CdvPurchase) return;
        window.CdvPurchase.store.restorePurchases();
    }

    return {
        isPro,
        storeAvailable,
        product,
        purchase,
        restore
    };
};
