import React from 'react';

export type BeautyIconType =
  | 'skincare'
  | 'beauty'
  | 'decorative'
  | 'facial'
  | 'commerce'
  | 'social';

export function resolveIconCategory(
  explicit?: string,
  badge?: string,
  headline?: string
): BeautyIconType {
  const raw = String(explicit || '').toLowerCase().trim();
  if (['skincare', 'beauty', 'decorative', 'facial', 'commerce', 'social'].includes(raw)) {
    return raw as BeautyIconType;
  }

  const text = `${badge || ''} ${headline || ''}`.toLowerCase();
  if (/serum|toner|moisturizer|sunscreen|retinol|niacinamide|skincare|parfum|edp/.test(text)) {
    return 'skincare';
  }
  if (/wajah|kulit|glowing|facial|cleansing|cerah|lembap|halus/.test(text)) {
    return 'facial';
  }
  if (/promo|diskon|harga|checkout|keranjang|cta|beli|order|gratis|gift/.test(text)) {
    return 'commerce';
  }
  if (/like|share|comment|follow|save|subscribe|social/.test(text)) {
    return 'social';
  }
  if (/lipstick|makeup|mirror|brush|lip|beauty|cantik/.test(text)) {
    return 'beauty';
  }
  return 'decorative';
}

export const BeautyIcon: React.FC<{
  type: BeautyIconType;
  primaryColor?: string;
  accentColor?: string;
  size?: number;
}> = ({ type, primaryColor = '#e11d74', accentColor = '#7c3aed', size = 110 }) => {
  const gradId = `grad-${type}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradId} x1="12" y1="12" x2="84" y2="84" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>
      </defs>

      {type === 'skincare' && (
        <g stroke={`url(#${gradId})`} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          {/* Dropper */}
          <path d="M24 22l10-10a6 6 0 0 1 8.5 8.5l-10 10" />
          <path d="M20 18l16 16" />
          <path d="M26 28L16 48l10-4 10-14" />
          <path d="M16 58c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-8-12-8-12s-8 8-8 12z" />
          {/* Serum bottle */}
          <rect x="48" y="34" width="28" height="46" rx="6" />
          <path d="M54 34v-8h16v8" />
          <path d="M56 20h12v6H56z" />
          <rect x="48" y="50" width="20" height="16" rx="2" />
        </g>
      )}

      {type === 'beauty' && (
        <g stroke={`url(#${gradId})`} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Lipstick */}
          <path d="M26 28l12-10v18H26V28z" />
          <rect x="23" y="36" width="18" height="14" rx="2" />
          <rect x="21" y="50" width="22" height="28" rx="4" />
          {/* Compact mirror / palette */}
          <circle cx="64" cy="54" r="18" />
          <circle cx="64" cy="54" r="11" strokeDasharray="4 4" />
          <path d="M56 24c4-4 12-4 16 0" />
        </g>
      )}

      {type === 'decorative' && (
        <g stroke={`url(#${gradId})`} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
          {/* Botanical flower & sparkles */}
          <circle cx="48" cy="48" r="8" />
          <path d="M48 40c0-12 10-18 10-18s4 10-4 18" />
          <path d="M48 40c0-12-10-18-10-18s-4 10 4 18" />
          <path d="M56 48c12 0 18-10 18-10s-10-4-18 4" />
          <path d="M40 48c-12 0-18-10-18-10s10-4 18 4" />
          <path d="M48 56v24" />
          <path d="M48 70c10-2 16-10 16-10s-8-4-16 4" />
          {/* Sparkle */}
          <path d="M74 20v10M69 25h10" />
          <path d="M22 64v8M18 68h8" />
        </g>
      )}

      {type === 'facial' && (
        <g stroke={`url(#${gradId})`} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
          {/* Headband & glowing face */}
          <path d="M28 44c0-13 9-22 20-22s20 9 20 22" />
          <path d="M26 42c6-6 38-6 44 0" />
          <path d="M30 46c0 16 8 28 18 28s18-12 18-28" />
          <path d="M38 52c2-2 5-2 7 0M51 52c2-2 5-2 7 0" />
          <path d="M43 62c3 3 7 3 10 0" />
          {/* Sparkles */}
          <path d="M20 26v8M16 30h8" />
          <path d="M76 28v8M72 32h8" />
        </g>
      )}

      {type === 'commerce' && (
        <g stroke={`url(#${gradId})`} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Shield + check & promo badge */}
          <path d="M48 16l24 10v20c0 16-10 28-24 34-14-6-24-18-24-34V26l24-10z" />
          <path d="M38 48l7 7 15-15" />
          <path d="M76 18v10M71 23h10" />
          <path d="M20 66v8M16 70h8" />
        </g>
      )}

      {type === 'social' && (
        <g stroke={`url(#${gradId})`} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Heart + Share */}
          <path d="M48 76S20 58 20 38a14 14 0 0 1 28-4 14 14 0 0 1 28 4c0 20-28 38-28 38z" />
          <path d="M38 42c0-4 3-7 7-7" />
        </g>
      )}
    </svg>
  );
};
