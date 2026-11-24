import React from 'react';
import { staticFile } from 'remotion';

export const NARAYYA_COLORS = {
  deepPlum: '#3A1E2C',
  roseMauve: '#C97B8B',
  champagneGold: '#C9A27A',
  softNude: '#E3C2B4',
  blushPetal: '#F7E6E4',
  creamPearl: '#FFF9F5',
} as const;

export const NARAYYA_FONTS = {
  title: '"NarayyaTitle", Georgia, "Times New Roman", serif',
  highlight: '"NarayyaScript", "Brush Script MT", Georgia, cursive',
  body: '"NarayyaBody", -apple-system, "Segoe UI", Roboto, sans-serif',
} as const;

/** Embeds local Cormorant Garamond, Allura, and Jost fonts from public/fonts */
export const NarayyaFontsStyle: React.FC = () => (
  <style>
    {`
      @font-face {
        font-family: 'NarayyaTitle';
        src: url('${staticFile('fonts/CormorantGaramond-SemiBold.ttf')}') format('truetype');
        font-weight: 400 700;
        font-style: normal;
        font-display: block;
      }
      @font-face {
        font-family: 'NarayyaScript';
        src: url('${staticFile('fonts/Allura-Regular.ttf')}') format('truetype');
        font-weight: 400;
        font-style: normal;
        font-display: block;
      }
      @font-face {
        font-family: 'NarayyaBody';
        src: url('${staticFile('fonts/Jost-Regular.ttf')}') format('truetype');
        font-weight: 300 800;
        font-style: normal;
        font-display: block;
      }
    `}
  </style>
);

/** Circular N Monogram + Optional Wordmark */
export const NarayyaLogo: React.FC<{
  size?: number;
  showWordmark?: boolean;
  showTagline?: boolean;
}> = ({ size = 76, showWordmark = true, showTagline = false }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `2.5px solid ${NARAYYA_COLORS.champagneGold}`,
        padding: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: NARAYYA_COLORS.deepPlum,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: NARAYYA_FONTS.title,
          fontStyle: 'italic',
          fontSize: size * 0.48,
          fontWeight: 600,
          color: NARAYYA_COLORS.creamPearl,
          lineHeight: 1,
        }}
      >
        N
      </div>
    </div>

    {showWordmark ? (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <span
          style={{
            fontFamily: NARAYYA_FONTS.title,
            fontSize: size * 0.62,
            fontWeight: 600,
            color: NARAYYA_COLORS.deepPlum,
            lineHeight: 1,
          }}
        >
          Narayya
        </span>
        <span
          style={{
            fontFamily: NARAYYA_FONTS.body,
            fontSize: size * 0.2,
            fontWeight: 500,
            letterSpacing: '0.32em',
            color: NARAYYA_COLORS.deepPlum,
          }}
        >
          BEAUTY
        </span>
      </div>
    ) : null}

    {showTagline ? (
      <span
        style={{
          fontFamily: NARAYYA_FONTS.highlight,
          fontSize: size * 0.44,
          color: NARAYYA_COLORS.roseMauve,
          lineHeight: 1.1,
        }}
      >
        cantik dengan caramu
      </span>
    ) : null}
  </div>
);

export type NayaExpression = 'senang' | 'kedip' | 'kaget' | 'senyum';

export function resolveNayaExpression(
  explicit?: string,
  badge?: string,
  headline?: string,
  index = 0
): NayaExpression {
  const raw = String(explicit || '').toLowerCase().trim();
  if (raw === 'senang' || raw === 'kedip' || raw === 'kaget' || raw === 'senyum') {
    return raw;
  }
  const text = `${badge || ''} ${headline || ''}`.toLowerCase();
  if (/rahasia|tips|rekomendasi|kedip|best|favorit/.test(text)) return 'kedip';
  if (/kaget|ternyata|fakta|plot|masalah|jujur|review/.test(text)) return 'kaget';
  if (index === 0 || /hai|halo|intro|sapa|senang|glow|cantik/.test(text)) return 'senang';
  return 'senyum';
}

/**
 * Mascot "Naya" si bestie kecantikan Narayya
 * - Rambut bob Deep Plum (#3A1E2C)
 * - Hiasan bunga emas (#C9A27A) & anting bulat emas
 * - Pipi merona & baju Rose Mauve (#C97B8B)
 * - Arch frame Soft Nude (#E3C2B4) ber-border Champagne Gold (#C9A27A)
 */
export const NayaMascot: React.FC<{
  expression?: NayaExpression;
  width?: number;
  withArch?: boolean;
}> = ({ expression = 'senang', width = 230, withArch = true }) => {
  const height = Math.round(width * 1.24);

  return (
    <svg width={width} height={height} viewBox="0 0 240 298" fill="none" xmlns="http://www.w3.org/2000/svg">
      {withArch ? (
        <path
          d="M 14 126 C 14 54, 62 12, 120 12 C 178 12, 226 54, 226 126 L 226 272 C 226 282, 218 288, 208 288 L 32 288 C 22 288, 14 282, 14 272 Z"
          fill={NARAYYA_COLORS.softNude}
          stroke={NARAYYA_COLORS.champagneGold}
          strokeWidth="4"
        />
      ) : null}

      {/* Back Hair (Bob Plum) */}
      <path
        d="M 62 118 C 58 158, 56 184, 54 198 C 68 198, 78 192, 82 184 L 158 184 C 162 192, 172 198, 186 198 C 184 184, 182 158, 178 118 C 176 74, 152 46, 120 46 C 88 46, 64 74, 62 118 Z"
        fill={NARAYYA_COLORS.deepPlum}
      />

      {/* Shoulders / Dress (Rose Mauve) */}
      <path
        d="M 62 286 C 64 234, 86 212, 120 212 C 154 212, 176 234, 178 286 Z"
        fill={NARAYYA_COLORS.roseMauve}
      />
      {/* Neck & Collarbone */}
      <rect x="108" y="182" width="24" height="36" rx="10" fill="#FDE4D8" />
      <path d="M 106 214 Q 120 226 134 214" stroke={NARAYYA_COLORS.champagneGold} strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Face */}
      <ellipse cx="120" cy="134" rx="46" ry="54" fill="#FDE4D8" />

      {/* Front Hair Bangs */}
      <path
        d="M 72 122 C 74 74, 96 52, 120 52 C 144 52, 166 74, 168 122 C 152 94, 134 86, 120 86 C 106 86, 88 94, 72 122 Z"
        fill={NARAYYA_COLORS.deepPlum}
      />

      {/* Gold Earrings */}
      <circle cx="72" cy="144" r="4.5" fill={NARAYYA_COLORS.champagneGold} />
      <circle cx="168" cy="144" r="4.5" fill={NARAYYA_COLORS.champagneGold} />

      {/* Gold Flower Hairpin */}
      <g transform="translate(154, 76)">
        <circle cx="0" cy="-7" r="5" fill={NARAYYA_COLORS.champagneGold} />
        <circle cx="6.5" cy="-2" r="5" fill={NARAYYA_COLORS.champagneGold} />
        <circle cx="4" cy="5.5" r="5" fill={NARAYYA_COLORS.champagneGold} />
        <circle cx="-4" cy="5.5" r="5" fill={NARAYYA_COLORS.champagneGold} />
        <circle cx="-6.5" cy="-2" r="5" fill={NARAYYA_COLORS.champagneGold} />
        <circle cx="0" cy="0" r="3.5" fill={NARAYYA_COLORS.creamPearl} />
      </g>

      {/* Rosy Cheeks */}
      <circle cx="90" cy="146" r="10" fill="#F5B2B5" opacity="0.75" />
      <circle cx="150" cy="146" r="10" fill="#F5B2B5" opacity="0.75" />

      {/* Eyebrows */}
      <path d="M 92 114 Q 100 109 108 113" stroke={NARAYYA_COLORS.deepPlum} strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M 132 113 Q 140 109 148 114" stroke={NARAYYA_COLORS.deepPlum} strokeWidth="2.8" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <circle cx="100" cy="126" r="5.5" fill={NARAYYA_COLORS.deepPlum} />
      <circle cx="98.5" cy="124" r="1.8" fill="#FFFFFF" />
      {expression === 'kedip' ? (
        <path
          d="M 133 127 Q 140 120 147 127"
          stroke={NARAYYA_COLORS.deepPlum}
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <>
          <circle cx="140" cy="126" r="5.5" fill={NARAYYA_COLORS.deepPlum} />
          <circle cx="138.5" cy="124" r="1.8" fill="#FFFFFF" />
        </>
      )}

      {/* Subtle Nose */}
      <path d="M 118 139 Q 120 142 122 139" stroke="#D9A79C" strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* Mouth by Expression */}
      {expression === 'senang' && (
        <path
          d="M 107 154 Q 120 156 133 154 C 131 168, 109 168, 107 154 Z"
          fill="#B66376"
        />
      )}
      {expression === 'kaget' && (
        <ellipse cx="120" cy="159" rx="6.5" ry="8.5" fill="#B66376" />
      )}
      {(expression === 'kedip' || expression === 'senyum') && (
        <path
          d="M 108 154 Q 120 165 132 154"
          stroke="#B66376"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
};
