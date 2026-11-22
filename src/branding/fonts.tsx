import React from 'react';
import { staticFile } from 'remotion';
import { narayyaTheme } from './theme';

/**
 * Uses the TTF font files committed under public/fonts.
 * Keep these paths aligned with the repository's font folder structure.
 */
export const NarayyaFonts: React.FC = () => (
  <style>{`
    @font-face {
      font-family: 'NarayyaPlayfair';
      src: url('${staticFile('fonts/Playfair_Display/static/PlayfairDisplay-Regular.ttf')}') format('truetype');
      font-style: normal;
      font-weight: 400;
      font-display: swap;
    }
    @font-face {
      font-family: 'NarayyaPlayfair';
      src: url('${staticFile('fonts/Playfair_Display/static/PlayfairDisplay-Bold.ttf')}') format('truetype');
      font-style: normal;
      font-weight: 700;
      font-display: swap;
    }
    @font-face {
      font-family: 'NarayyaCormorant';
      src: url('${staticFile('fonts/Cormorant_Garamond/static/CormorantGaramond-Regular.ttf')}') format('truetype');
      font-style: normal;
      font-weight: 400;
      font-display: swap;
    }
    @font-face {
      font-family: 'NarayyaPoppins';
      src: url('${staticFile('fonts/Poppins/Poppins-Regular.ttf')}') format('truetype');
      font-style: normal;
      font-weight: 400;
      font-display: swap;
    }
    @font-face {
      font-family: 'NarayyaPoppins';
      src: url('${staticFile('fonts/Poppins/Poppins-SemiBold.ttf')}') format('truetype');
      font-style: normal;
      font-weight: 600;
      font-display: swap;
    }
    @font-face {
      font-family: 'NarayyaAllura';
      src: url('${staticFile('fonts/Allura/Allura-Regular.ttf')}') format('truetype');
      font-style: normal;
      font-weight: 400;
      font-display: swap;
    }
  `}</style>
);

export const narayyaFontFamilies = narayyaTheme.fonts;
