import React from 'react';
import { staticFile } from 'remotion';
import { narayyaTheme } from './theme';

/**
 * Place the licensed WOFF2 files in public/fonts (see docs/NARAYYA-BEAUTY.md).
 * The CSS uses staticFile so the fonts are bundled with Remotion, not fetched at render time.
 */
export const NarayyaFonts: React.FC = () => (
  <style>{`
    @font-face {
      font-family: 'NarayyaPlayfair';
      src: url('${staticFile('fonts/PlayfairDisplay-Regular.woff2')}') format('woff2');
      font-style: normal; font-weight: 400; font-display: swap;
    }
    @font-face {
      font-family: 'NarayyaPlayfair';
      src: url('${staticFile('fonts/PlayfairDisplay-Bold.woff2')}') format('woff2');
      font-style: normal; font-weight: 700; font-display: swap;
    }
    @font-face {
      font-family: 'NarayyaCormorant';
      src: url('${staticFile('fonts/CormorantGaramond-Regular.woff2')}') format('woff2');
      font-style: normal; font-weight: 400; font-display: swap;
    }
    @font-face {
      font-family: 'NarayyaPoppins';
      src: url('${staticFile('fonts/Poppins-Regular.woff2')}') format('woff2');
      font-style: normal; font-weight: 400; font-display: swap;
    }
    @font-face {
      font-family: 'NarayyaPoppins';
      src: url('${staticFile('fonts/Poppins-SemiBold.woff2')}') format('woff2');
      font-style: normal; font-weight: 600; font-display: swap;
    }
    @font-face {
      font-family: 'NarayyaAllura';
      src: url('${staticFile('fonts/Allura-Regular.woff2')}') format('woff2');
      font-style: normal; font-weight: 400; font-display: swap;
    }
  `}</style>
);

export const narayyaFontFamilies = narayyaTheme.fonts;
