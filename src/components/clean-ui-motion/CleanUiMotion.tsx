import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BeautyIcon, resolveIconCategory } from '../../BeautyIcons';

const SANS = '-apple-system, "Segoe UI", Roboto, sans-serif';
const MONO = 'Consolas, "Courier New", monospace';

export type CleanUiScene = {
  headline: string;
  subtext: string;
  badge?: string;
  icon?: string;
  imageUrl?: string;
  durationSec?: number;
};

export type CleanUiMotionProps = {
  title: string;
  brandName?: string;
  tagline?: string;
  bgImageUrl?: string;
  productImageUrl?: string;
  scenes: CleanUiScene[];
};

const CleanGridBackdrop: React.FC<{ brandName: string }> = ({ brandName }) => (
  <AbsoluteFill style={{ backgroundColor: '#FAFBF9', overflow: 'hidden' }}>
    <div
      style={{
        position: 'absolute',
        width: 900,
        height: 900,
        top: -180,
        left: -260,
        background: 'radial-gradient(circle, rgba(20,184,166,0.11) 0%, transparent 65%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 960,
        height: 960,
        bottom: -200,
        right: -240,
        background: 'radial-gradient(circle, rgba(251,146,60,0.13) 0%, transparent 65%)',
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage:
          'linear-gradient(rgba(15,23,42,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.045) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
      }}
    />
    {/* Top-right brand mark */}
    <div
      style={{
        position: 'absolute',
        top: 66,
        right: 64,
        fontFamily: SANS,
        fontSize: 19,
        fontWeight: 800,
        letterSpacing: '0.1em',
        color: '#334155',
        textTransform: 'uppercase',
      }}
    >
      {brandName}
    </div>
    {/* Bottom-left follow micro tag */}
    <div
      style={{
        position: 'absolute',
        bottom: 62,
        left: 64,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: '#64748B',
        }}
      >
        FOLLOW ACCOUNT FOR TIPS
      </span>
      <span
        style={{
          fontFamily: SANS,
          fontSize: 18,
          fontWeight: 900,
          letterSpacing: '0.06em',
          color: '#1E293B',
        }}
      >
        {brandName}
      </span>
    </div>
  </AbsoluteFill>
);

const TwoToneHeadline: React.FC<{ category: string; headline: string }> = ({
  category,
  headline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, stiffness: 140 } });

  const words = String(headline || 'CLEAN MOTION').trim().split(/\s+/).filter(Boolean);
  const mid = Math.max(1, Math.ceil(words.length / 2));
  const line1 = words.slice(0, mid).join(' ');
  const line2 = words.slice(mid).join(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 22,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 18}px)`,
      }}
    >
      <div
        style={{
          padding: '8px 24px',
          borderRadius: 999,
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #CBD5E1',
          fontFamily: SANS,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: '#475569',
          textTransform: 'uppercase',
        }}
      >
        {category}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontSize: words.length > 5 ? 58 : 68,
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          textTransform: 'uppercase',
          padding: '0 28px',
        }}
      >
        <div style={{ color: '#1E293B' }}>{line1}</div>
        {line2 ? <div style={{ color: '#0F766E' }}>{line2}</div> : null}
      </div>
    </div>
  );
};

const CleanCardShell: React.FC<{
  badge: string;
  rightLabel?: string;
  children: React.ReactNode;
}> = ({ badge, rightLabel = 'Ilustrasi', children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 3, fps, config: { damping: 20, stiffness: 140 } });

  return (
    <div
      style={{
        width: 920,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        border: '1px solid #E2E8F0',
        boxShadow: '0 22px 52px rgba(15, 23, 42, 0.06)',
        padding: '26px 30px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 20}px)`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            backgroundColor: '#0F766E',
            color: '#FFFFFF',
            fontFamily: SANS,
            fontSize: 20,
            fontWeight: 700,
            padding: '8px 18px',
            borderRadius: 12,
          }}
        >
          {badge}
        </div>
        <span style={{ fontFamily: SANS, fontSize: 19, color: '#94A3B8', fontWeight: 500 }}>
          {rightLabel}
        </span>
      </div>
      {children}
    </div>
  );
};

/** Word-highlighted subtitle synchronized to the scene */
const HighlightCaption: React.FC<{ subtext: string; tone?: 'mint' | 'peach' }> = ({
  subtext,
  tone = 'mint',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame: frame - 5, fps, config: { damping: 20, stiffness: 140 } });
  const words = String(subtext || '').trim().split(/\s+/).filter(Boolean);
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, words.length], {
    extrapolateRight: 'clamp',
  });
  const activeIdx = Math.min(words.length - 1, Math.floor(progress));
  const highlightBg = tone === 'peach' ? 'rgba(251, 146, 60, 0.22)' : 'rgba(20, 184, 166, 0.18)';

  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: 33,
        fontWeight: 600,
        color: '#334155',
        textAlign: 'center',
        lineHeight: 1.5,
        padding: '0 44px',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 14}px)`,
      }}
    >
      {words.map((w, i) => {
        const isActive = i >= activeIdx - 1 && i <= activeIdx + 1;
        return (
          <React.Fragment key={i}>
            <span
              style={{
                backgroundColor: isActive ? highlightBg : 'transparent',
                color: isActive ? '#0F172A' : '#334155',
                padding: isActive ? '2px 8px' : '2px 0',
                borderRadius: 8,
              }}
            >
              {w}
            </span>{' '}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** Card 0: Visual Preview + Code/Specs Highlight */
const HeroVisualCard: React.FC<{
  badge: string;
  visualUrl?: string;
  headline: string;
  iconType: ReturnType<typeof resolveIconCategory>;
}> = ({ badge, visualUrl, headline, iconType }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 8, fps, config: { damping: 20, stiffness: 140 } });

  return (
    <CleanCardShell badge={badge} rightLabel="Ilustrasi">
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {visualUrl ? (
          <div
            style={{
              width: 310,
              height: 310,
              borderRadius: 22,
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
              flexShrink: 0,
              transform: `scale(${0.92 + pop * 0.08})`,
            }}
          >
            <Img src={visualUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : null}

        <div
          style={{
            flex: 1,
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 20,
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <BeautyIcon type={iconType} primaryColor="#0F766E" accentColor="#F59E0B" size={40} />
            <span style={{ fontFamily: SANS, fontSize: 24, fontWeight: 800, color: '#0F172A' }}>
              Highlight
            </span>
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 21,
              color: '#0F766E',
              backgroundColor: 'rgba(20, 184, 166, 0.14)',
              padding: '10px 14px',
              borderRadius: 10,
              lineHeight: 1.4,
            }}
          >
            {headline}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Cepat', 'Rapi', 'Teruji'].map((tag, i) => (
              <span
                key={i}
                style={{
                  fontFamily: SANS,
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#475569',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  padding: '6px 14px',
                  borderRadius: 999,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </CleanCardShell>
  );
};

/** Card 1: 3-Column Staggered Feature Grid */
const StaggeredGridCard: React.FC<{
  badge: string;
  visualUrl?: string;
  iconType: ReturnType<typeof resolveIconCategory>;
  subtext: string;
}> = ({ badge, visualUrl, iconType, subtext }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = String(subtext || '').split(/\s+/).filter(Boolean);
  const tiles = [
    { title: 'Fokus', desc: words.slice(0, 3).join(' ') || 'Visual bersih', icon: iconType },
    { title: 'Manfaat', desc: words.slice(3, 6).join(' ') || 'Hasil nyata', icon: 'facial' as const },
    { title: 'Pilihan', desc: words.slice(6, 9).join(' ') || 'Aman harian', icon: 'commerce' as const },
  ];

  return (
    <CleanCardShell badge={badge} rightLabel="Ilustrasi">
      {visualUrl ? (
        <div
          style={{
            width: '100%',
            height: 220,
            borderRadius: 18,
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
          }}
        >
          <Img src={visualUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {tiles.map((tile, i) => {
          const tileEnter = spring({
            frame: frame - (8 + i * 10),
            fps,
            config: { damping: 20, stiffness: 150 },
          });
          return (
            <div
              key={i}
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 20,
                padding: '22px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                opacity: tileEnter,
                transform: `translateY(${(1 - tileEnter) * 18}px)`,
              }}
            >
              <BeautyIcon type={tile.icon} primaryColor="#0F766E" accentColor="#334155" size={44} />
              <span style={{ fontFamily: SANS, fontSize: 22, fontWeight: 800, color: '#0F172A' }}>
                {tile.title}
              </span>
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 17,
                  color: '#64748B',
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}
              >
                {tile.desc}
              </span>
            </div>
          );
        })}
      </div>
    </CleanCardShell>
  );
};

/** Card 2: Horizontal Flow Diagram + Sub-Pills */
const FlowDiagramCard: React.FC<{
  badge: string;
  visualUrl?: string;
  iconType: ReturnType<typeof resolveIconCategory>;
}> = ({ badge, visualUrl, iconType }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = ['Masalah', 'Formula', 'Hasil'];
  const pills = ['Ringkas', 'Terarah', 'Sesuai'];

  return (
    <CleanCardShell badge={badge} rightLabel="Alur kerja">
      {visualUrl ? (
        <div
          style={{
            width: '100%',
            height: 210,
            borderRadius: 18,
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
          }}
        >
          <Img src={visualUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : null}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {steps.map((st, i) => {
          const sEnter = spring({
            frame: frame - (6 + i * 10),
            fps,
            config: { damping: 20, stiffness: 150 },
          });
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  flex: 1,
                  backgroundColor: i === 1 ? 'rgba(20, 184, 166, 0.10)' : '#F8FAFC',
                  border: `1.5px solid ${i === 1 ? '#0F766E' : '#E2E8F0'}`,
                  borderRadius: 18,
                  padding: '20px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  opacity: sEnter,
                  transform: `scale(${0.92 + sEnter * 0.08})`,
                }}
              >
                <BeautyIcon
                  type={i === 0 ? 'skincare' : i === 1 ? iconType : 'social'}
                  primaryColor="#0F766E"
                  accentColor="#F59E0B"
                  size={38}
                />
                <span style={{ fontFamily: SANS, fontSize: 21, fontWeight: 800, color: '#0F172A' }}>
                  {st}
                </span>
              </div>
              {i < steps.length - 1 ? (
                <span style={{ fontFamily: SANS, fontSize: 28, fontWeight: 800, color: '#94A3B8' }}>
                  →
                </span>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {pills.map((p, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              padding: '10px 12px',
              textAlign: 'center',
              fontFamily: SANS,
              fontSize: 18,
              fontWeight: 700,
              color: '#0F766E',
            }}
          >
            ✓ {p}
          </div>
        ))}
      </div>
    </CleanCardShell>
  );
};

/** Card 3 (Final): Typewriter CTA + Animated Bookmark Icon */
const TypewriterBookmarkOutro: React.FC<{ headline: string; subtext: string; visualUrl?: string }> = ({
  headline,
  subtext,
  visualUrl,
}) => {
  const frame = useCurrentFrame();
  const fullText = `${headline}. ${subtext}`.trim();
  const visibleChars = Math.min(fullText.length, Math.floor(frame * 1.4));
  const typed = fullText.slice(0, visibleChars);
  const cursorVisible = Math.floor(frame / 10) % 2 === 0;
  const bookmarkFill = interpolate(frame, [20, 44], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        padding: '0 64px',
      }}
    >
      {visualUrl ? (
        <div
          style={{
            width: 240,
            height: 240,
            borderRadius: 28,
            overflow: 'hidden',
            border: '2px solid #E2E8F0',
            boxShadow: '0 20px 44px rgba(15, 23, 42, 0.08)',
          }}
        >
          <Img src={visualUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : null}

      <div
        style={{
          fontFamily: SANS,
          fontSize: 48,
          fontWeight: 800,
          color: '#1E293B',
          textAlign: 'center',
          lineHeight: 1.35,
          minHeight: 180,
        }}
      >
        {typed}
        <span style={{ color: '#0F766E', opacity: cursorVisible ? 1 : 0 }}>|</span>
      </div>

      {/* Animated Bookmark Save Icon */}
      <svg width={88} height={88} viewBox="0 0 64 64">
        <path
          d="M18 10 H46 V54 L32 43 L18 54 Z"
          fill={`rgba(15, 118, 110, ${bookmarkFill * 0.2})`}
          stroke="#0F766E"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const CleanUiMotion: React.FC<CleanUiMotionProps> = ({
  title,
  brandName = 'NARAYYA BEAUTY',
  bgImageUrl,
  productImageUrl,
  scenes = [],
}) => {
  const { durationInFrames } = useVideoConfig();
  const safeScenes = scenes.length
    ? scenes
    : [{ headline: title, subtext: brandName, badge: 'INTRO', durationSec: 5 }];

  const weights = safeScenes.map((s) =>
    Math.max(15, `${s.headline || ''} ${s.subtext || ''}`.trim().length)
  );
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let cursor = 0;

  return (
    <AbsoluteFill>
      <CleanGridBackdrop brandName={brandName} />

      {safeScenes.map((scene, idx) => {
        const ratio = weights[idx] / Math.max(1, totalWeight);
        const sceneFrames =
          idx === safeScenes.length - 1
            ? Math.max(24, durationInFrames - cursor)
            : Math.max(24, Math.round(durationInFrames * ratio));
        const from = cursor;
        cursor += sceneFrames;

        const visualUrl = scene.imageUrl || productImageUrl || bgImageUrl;
        const iconType = resolveIconCategory(scene.icon, scene.badge, scene.headline);
        const category = scene.badge || `POIN ${idx + 1}`;
        const isLast = idx === safeScenes.length - 1 && safeScenes.length > 1;

        return (
          <React.Fragment key={idx}>
            <Sequence from={from} durationInFrames={sceneFrames}>
              <AbsoluteFill
                style={{
                  padding: '150px 56px 140px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: isLast ? 'center' : 'space-between',
                }}
              >
                {isLast ? (
                  <TypewriterBookmarkOutro
                    headline={scene.headline}
                    subtext={scene.subtext}
                    visualUrl={visualUrl}
                  />
                ) : (
                  <>
                    <TwoToneHeadline category={category} headline={scene.headline} />

                    {idx === 0 && (
                      <HeroVisualCard
                        badge={`</> ${category}`}
                        visualUrl={visualUrl}
                        headline={scene.headline}
                        iconType={iconType}
                      />
                    )}
                    {idx === 1 && (
                      <StaggeredGridCard
                        badge={category}
                        visualUrl={visualUrl}
                        iconType={iconType}
                        subtext={scene.subtext}
                      />
                    )}
                    {idx >= 2 && (
                      <FlowDiagramCard
                        badge={category}
                        visualUrl={visualUrl}
                        iconType={iconType}
                      />
                    )}

                    <HighlightCaption
                      subtext={scene.subtext}
                      tone={idx % 2 === 1 ? 'peach' : 'mint'}
                    />
                  </>
                )}
              </AbsoluteFill>
            </Sequence>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

export default CleanUiMotion;
