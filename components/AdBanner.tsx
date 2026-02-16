// AdBanner.tsx
import React from 'react';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ || process.env.ADMOB_BANNER_TEST === 'true'
    ? TestIds.BANNER
    : 'ca-app-pub-5809956184473213/5602190046';

export default function AdBanner() {
    return (
        <BannerAd
            unitId={adUnitId}
            // unitId="ca-app-pub-5809956184473213/5602190046"
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
    );
}
