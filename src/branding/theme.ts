export const narayyaTheme = {
  colors: {
    blush: '#F4C6D7',
    blushDeep: '#E7AFC5',
    roseGold: '#C58B8A',
    cream: '#FFF8F5',
    deepRose: '#684752',
    cocoa: '#8A6872',
    white: '#FFFFFF',
  },
  fonts: {
    display: 'NarayyaPlayfair, Georgia, serif',
    editorial: 'NarayyaCormorant, Georgia, serif',
    body: 'NarayyaPoppins, Arial, sans-serif',
    script: 'NarayyaAllura, cursive',
  },
} as const;

export type NarayyaBranding = {
  brandName?: string;
  tagline?: string;
  primaryColor?: string;
  accentColor?: string;
};
