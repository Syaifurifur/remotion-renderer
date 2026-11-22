import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BeautyIcon, resolveIconCategory } from '../../BeautyIcons';

const SANS = '-apple-system, "Segoe UI", Roboto, sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';

export type EditorialScene = {
  headline: string;
  subtext: string;
  badge?: string;
  icon?: string;
  imageUrl?: string;
  durationSec?: number;
};

export type EditorialMotionProps = {
  title: string;
  brandName?: string;
  tagline?: string;
  accentColor?: string;
  bgImageUrl?: string;
  productImageUrl?: string;
  scenes: EditorialScene[];
};

/** 4-point sparkle star accent */
const Sparkle: React.FC<{
  x: number | string;
  y: number | string;
  size?: number;
  color?: string;
  delay?: number;
}> = ({ x, y, size = 34, color = '#6D28D9', delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 150 } });
  const rot = Math.sin((frame + delay) / 22) * 14;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${pop}) rotate(${rot}deg)`,
        opacity: pop * 0.9,
        pointerEvents: 'none',
      }}
    >
      <path
        d="M16 1 C17 11 21 15 31 16 C21 17 17 21 16 31 C15 21 11 17 1 16 C11 15 15 11 16 1 Z"
        fill={color}
      />
    </svg>
  );
};

/** Warm off-white paper grid + slow drifting pastel orbs */
const PaperBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift1 = Math.sin(frame / 45) * 26;
  const drift2 = Math.cos(frame / 52) * 28;

  return (
    <AbsoluteFill style={{ backgroundColor: '#F5F2EB', overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(17,24,39,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 460,
          height: 460,
          borderRadius: '50%',
          background: 'rgba(234, 216, 177, 0.58)',
          top: 110 + drift1,
          left: -120,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'rgba(212, 204, 230, 0.52)',
          top: 670 - drift2,
          right: -140,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(217, 232, 181, 0.52)',
          bottom: 130 + drift2,
          left: 70,
        }}
      />
    </AbsoluteFill>
  );
};

/** Winding dashed indigo roadmap spine connecting all scenes */
const WindingTrack: React.FC<{ progress: number }> = ({ progress }) => {
  const pathLength = 2400;
  const drawn = pathLength * Math.min(1, Math.max(0.08, progress));

  return (
    <svg
      viewBox="0 0 1080 1920"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <path
        d="M 540 -40 C 790 340, 250 720, 560 1120 C 830 1460, 310 1720, 540 1960"
        fill="none"
        stroke="rgba(49, 46, 129, 0.14)"
        strokeWidth="14"
        strokeDasharray="16 14"
      />
      <path
        d="M 540 -40 C 790 340, 250 720, 560 1120 C 830 1460, 310 1720, 540 1960"
        fill="none"
        stroke="#312E81"
        strokeWidth="14"
        strokeDasharray={`${drawn} ${pathLength}`}
        strokeLinecap="round"
      />
      <path
        d="M 540 -40 C 790 340, 250 720, 560 1120 C 830 1460, 310 1720, 540 1960"
        fill="none"
        stroke="#F5F2EB"
        strokeWidth="4"
        strokeDasharray="12 16"
        strokeDashoffset={-drawn * 0.15}
      />
    </svg>
  );
};

/** Top STEP X/N segmented progress header */
const TopStepBar: React.FC<{ stepIndex: number; totalSteps: number; label: string }> = ({
  stepIndex,
  totalSteps,
  label,
}) => (
  <div
    style={{
      position: 'absolute',
      top: 62,
      left: 56,
      right: 56,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      pointerEvents: 'none',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span
        style={{
          fontFamily: SANS,
          fontSize: 22,
          fontWeight: 900,
          color: '#111827',
          letterSpacing: '0.08em',
        }}
      >
        STEP {stepIndex + 1}/{totalSteps}
      </span>
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 24,
          color: '#4B5563',
        }}
      >
        {label}
      </span>
    </div>
    <div style={{ display: 'flex', gap: 10 }}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 10,
            borderRadius: 99,
            backgroundColor: i <= stepIndex ? '#312E81' : 'rgba(49, 46, 129, 0.18)',
          }}
        />
      ))}
    </div>
  </div>
);

/** Splits a headline into Bold Sans + Italic Serif editorial pair */
const EditorialHeadline: React.FC<{ headline: string; serifFirst?: boolean }> = ({
  headline,
  serifFirst = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 160 } });

  const words = String(headline || 'Motion Editorial').trim().split(/\s+/).filter(Boolean);
  const splitIdx = Math.max(1, words.length - 1);
  const firstPart = words.slice(0, splitIdx).join(' ');
  const lastPart = words.slice(splitIdx).join(' ');

  return (
    <div
      style={{
        fontSize: words.length > 4 ? 62 : 74,
        lineHeight: 1.12,
        textAlign: 'center',
        letterSpacing: '-0.02em',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 26}px) scale(${0.94 + enter * 0.06})`,
        padding: '0 24px',
      }}
    >
      {serifFirst ? (
        <>
          <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, color: '#3730A3' }}>
            {firstPart}
          </span>{' '}
          <span style={{ fontFamily: SANS, fontWeight: 900, color: '#111827' }}>{lastPart}</span>
        </>
      ) : (
        <>
          <span style={{ fontFamily: SANS, fontWeight: 900, color: '#111827' }}>{firstPart}</span>{' '}
          {lastPart ? (
            <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, color: '#3730A3' }}>
              {lastPart}
            </span>
          ) : null}
        </>
      )}
    </div>
  );
};

/** Dark pill badge (e.g., Langkah 1, ✳ Brand) */
const DarkPill: React.FC<{ text: string; bg?: string; delay?: number }> = ({
  text,
  bg = '#312E81',
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 170 } });

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        backgroundColor: bg,
        color: '#FFFFFF',
        fontFamily: SANS,
        fontSize: 26,
        fontWeight: 800,
        padding: '12px 28px',
        borderRadius: 999,
        boxShadow: '0 14px 32px rgba(17, 24, 39, 0.18)',
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      {text}
    </div>
  );
};

/** Synchronized spoken subtitle card at the bottom of the light editorial canvas */
const EditorialSubtitleCard: React.FC<{
  subtext: string;
  iconType: ReturnType<typeof resolveIconCategory>;
  tagLeft: string;
  tagRight: string;
}> = ({ subtext, iconType, tagLeft, tagRight }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame: frame - 6, fps, config: { damping: 15, stiffness: 150 } });
  const pct = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 100], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: 900,
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        padding: '26px 32px',
        boxShadow: '0 22px 55px rgba(17, 24, 39, 0.11)',
        border: '1px solid rgba(17, 24, 39, 0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 28}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            backgroundColor: '#EEF2FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <BeautyIcon type={iconType} primaryColor="#4F46E5" accentColor="#EC4899" size={34} />
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 30,
            fontWeight: 700,
            color: '#1F2937',
            lineHeight: 1.38,
          }}
        >
          {subtext}
        </div>
      </div>

      {/* Equalizer / Progress Strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span
          style={{
            fontFamily: SANS,
            fontSize: 18,
            fontWeight: 800,
            color: '#FFFFFF',
            backgroundColor: '#111827',
            padding: '6px 16px',
            borderRadius: 999,
          }}
        >
          {tagLeft}
        </span>
        <div
          style={{
            flex: 1,
            height: 8,
            borderRadius: 99,
            backgroundColor: '#E5E7EB',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4F46E5, #EC4899, #F59E0B)',
              borderRadius: 99,
            }}
          />
        </div>
        <span
          style={{
            fontFamily: SANS,
            fontSize: 18,
            fontWeight: 800,
            color: '#312E81',
          }}
        >
          {tagRight}
        </span>
      </div>
    </div>
  );
};

/** Beat 0: Smartphone Mockup Hero with Pixabay/AI Visual + Morphing Accent */
const PhoneHeroProp: React.FC<{ visualUrl?: string; title: string }> = ({ visualUrl, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 3, fps, config: { damping: 13, stiffness: 140 } });
  const floatY = Math.sin(frame / 18) * 10;
  const barColors = ['#3B82F6', '#6366F1', '#EC4899', '#F59E0B'];

  return (
    <div
      style={{
        width: 500,
        height: 760,
        borderRadius: 56,
        backgroundColor: '#111827',
        padding: 18,
        boxShadow: '0 36px 80px rgba(17, 24, 39, 0.25)',
        transform: `translateY(${floatY}px) scale(${0.86 + enter * 0.14})`,
        opacity: enter,
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 42,
          backgroundColor: '#FAF8F4',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 24px 32px',
          backgroundImage:
            'linear-gradient(rgba(17,24,39,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.04) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      >
        {/* Dynamic Island */}
        <div style={{ width: 126, height: 28, borderRadius: 99, backgroundColor: '#111827' }} />

        <div
          style={{
            fontFamily: SANS,
            fontSize: 34,
            fontWeight: 900,
            color: '#111827',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {title.slice(0, 18)}
        </div>

        {/* Framed Pixabay / AI Illustration inside phone */}
        {visualUrl ? (
          <div
            style={{
              width: 340,
              height: 340,
              borderRadius: 36,
              overflow: 'hidden',
              boxShadow: '0 18px 40px rgba(79, 70, 229, 0.28)',
              border: '4px solid #FFFFFF',
            }}
          >
            <Img src={visualUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: interpolate(frame % 60, [0, 30, 60], [110, 44, 110]),
              background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
              transform: `rotate(${frame * 1.4}deg)`,
              boxShadow: '0 20px 50px rgba(99, 102, 241, 0.35)',
            }}
          />
        )}

        {/* 4 Colorful Rounded UI Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 90 }}>
          {[54, 72, 48, 86].map((h, i) => (
            <div
              key={i}
              style={{
                width: 68,
                height: h + Math.sin(frame / 10 + i) * 10,
                borderRadius: 16,
                backgroundColor: barColors[i],
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/** Beat 1: Fanned Visual Cards + White Progress Card + Green Check */
const FannedVisualCardProp: React.FC<{
  visualUrl?: string;
  badge: string;
  iconType: ReturnType<typeof resolveIconCategory>;
}> = ({ visualUrl, badge, iconType }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 150 } });
  const barPct = interpolate(frame, [8, 42], [15, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'relative',
        width: 820,
        height: 620,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 3 Fanned Tilted Cards behind */}
      <div style={{ display: 'flex', gap: 20, marginBottom: -40 }}>
        {['#0D9488', '#4F46E5', '#DB2777'].map((col, i) => (
          <div
            key={i}
            style={{
              width: 220,
              height: 290,
              borderRadius: 28,
              backgroundColor: col,
              overflow: 'hidden',
              border: '4px solid #FFFFFF',
              boxShadow: '0 20px 44px rgba(17, 24, 39, 0.16)',
              transform: `rotate(${(i - 1) * 7 * enter}deg) translateY(${(1 - enter) * 50}px)`,
              opacity: enter,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {visualUrl && i === 1 ? (
              <Img src={visualUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <BeautyIcon type={iconType} primaryColor="#FFFFFF" accentColor="#FDE68A" size={86} />
            )}
          </div>
        ))}
      </div>

      {/* Elevated White Skill / Progress Card */}
      <div
        style={{
          width: 720,
          backgroundColor: '#FFFFFF',
          borderRadius: 30,
          padding: '28px 34px',
          boxShadow: '0 28px 64px rgba(17, 24, 39, 0.16)',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          zIndex: 2,
        }}
      >
        <BeautyIcon type={iconType} primaryColor="#6D28D9" accentColor="#EC4899" size={64} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontFamily: SANS, fontSize: 32, fontWeight: 900, color: '#111827' }}>
            {badge}
          </span>
          <div style={{ width: '100%', height: 14, borderRadius: 99, backgroundColor: '#E5E7EB', overflow: 'hidden' }}>
            <div
              style={{
                width: `${barPct}%`,
                height: '100%',
                borderRadius: 99,
                background: 'linear-gradient(90deg, #14B8A6, #F59E0B, #EC4899)',
              }}
            />
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#047857',
            color: '#FFFFFF',
            fontFamily: SANS,
            fontSize: 22,
            fontWeight: 800,
            padding: '10px 20px',
            borderRadius: 999,
          }}
        >
          ✓ ready
        </div>
      </div>
    </div>
  );
};

/** Beat 2: Waveform + Visual Showcase Card */
const WaveformVisualProp: React.FC<{
  visualUrl?: string;
  label: string;
}> = ({ visualUrl, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 150 } });
  const barColors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

  return (
    <div
      style={{
        width: 820,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        opacity: enter,
        transform: `scale(${0.92 + enter * 0.08})`,
      }}
    >
      {visualUrl ? (
        <div
          style={{
            width: 520,
            height: 360,
            borderRadius: 32,
            overflow: 'hidden',
            border: '6px solid #FFFFFF',
            boxShadow: '0 26px 60px rgba(17, 24, 39, 0.16)',
            transform: `rotate(${Math.sin(frame / 24) * 1.8}deg)`,
          }}
        >
          <Img src={visualUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : null}

      <div
        style={{
          width: 780,
          backgroundColor: '#FFFFFF',
          borderRadius: 30,
          padding: '24px 32px',
          boxShadow: '0 22px 54px rgba(17, 24, 39, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: SANS, fontSize: 26, fontWeight: 800, color: '#111827' }}>
            {label}
          </span>
          <span style={{ fontFamily: SANS, fontSize: 22, fontWeight: 700, color: '#4F46E5' }}>
            HD • AUDIO SYNC
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 74 }}>
          {Array.from({ length: 28 }, (_, i) => {
            const h = 16 + Math.abs(Math.sin(frame * 0.22 + i * 0.6)) * 54;
            return (
              <div
                key={i}
                style={{
                  width: 12,
                  height: h,
                  borderRadius: 99,
                  backgroundColor: barColors[i % barColors.length],
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** Beat 3: Hub-and-Spoke Orbit + Final CTA Card */
const HubOrbitFinalProp: React.FC<{
  visualUrl?: string;
  ctaText: string;
  iconType: ReturnType<typeof resolveIconCategory>;
}> = ({ visualUrl, ctaText, iconType }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 3, fps, config: { damping: 14, stiffness: 150 } });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
        opacity: enter,
        transform: `scale(${0.92 + enter * 0.08})`,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 560,
          height: 560,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Dashed Orbital Ring */}
        <div
          style={{
            position: 'absolute',
            width: 480,
            height: 480,
            borderRadius: '50%',
            border: '3px dashed rgba(49, 46, 129, 0.35)',
            transform: `rotate(${frame * 0.5}deg)`,
          }}
        />
        {/* Center Circle with Visual or Icon */}
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '6px solid #FFFFFF',
            boxShadow: '0 26px 65px rgba(17, 24, 39, 0.18)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {visualUrl ? (
            <Img src={visualUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <BeautyIcon type={iconType} primaryColor="#4F46E5" accentColor="#EC4899" size={130} />
          )}
        </div>

        {/* 3 Orbiting Satellite Badges */}
        {[
          { label: 'ide', x: 220, y: -10, color: '#6D28D9' },
          { label: 'visual', x: 455, y: 240, color: '#0D9488' },
          { label: 'audio', x: 20, y: 240, color: '#EC4899' },
        ].map((sat, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: sat.x,
              top: sat.y,
              backgroundColor: '#FFFFFF',
              border: `2px solid ${sat.color}`,
              borderRadius: 24,
              padding: '10px 20px',
              boxShadow: '0 12px 28px rgba(17, 24, 39, 0.14)',
              fontFamily: SANS,
              fontSize: 22,
              fontWeight: 800,
              color: sat.color,
              transform: `translateY(${Math.sin(frame / 14 + i * 2) * 8}px)`,
            }}
          >
            ✦ {sat.label}
          </div>
        ))}
      </div>

      <DarkPill text={ctaText} bg="#312E81" delay={10} />
    </div>
  );
};

export const EditorialMotion: React.FC<EditorialMotionProps> = ({
  title,
  brandName = 'NARAYYA BEAUTY',
  bgImageUrl,
  productImageUrl,
  scenes = [],
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const safeScenes = scenes.length
    ? scenes
    : [{ headline: title, subtext: brandName, badge: 'INTRO', durationSec: 5 }];

  const weights = safeScenes.map((s) =>
    Math.max(15, `${s.headline || ''} ${s.subtext || ''}`.trim().length)
  );
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const globalProgress = frame / Math.max(1, durationInFrames);

  let cursor = 0;

  return (
    <AbsoluteFill>
      <PaperBackdrop />
      <WindingTrack progress={globalProgress} />

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
        const badge = scene.badge || `Langkah ${idx + 1}`;
        const beat = idx === 0 ? 0 : idx === safeScenes.length - 1 ? 3 : idx % 2 === 1 ? 1 : 2;

        return (
          <Sequence key={idx} from={from} durationInFrames={sceneFrames}>
            <AbsoluteFill
              style={{
                padding: '150px 56px 76px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <TopStepBar stepIndex={idx} totalSteps={safeScenes.length} label={brandName} />

              <Sparkle x={120} y={240} size={34} delay={4} />
              <Sparkle x={910} y={420} size={40} delay={10} />
              <Sparkle x={150} y={1340} size={30} delay={14} />

              {/* Top: Pill Badge + Editorial Dual-Font Headline */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 20,
                  marginTop: 10,
                }}
              >
                <DarkPill text={badge} bg={idx === 0 ? '#111827' : '#312E81'} delay={0} />
                <EditorialHeadline headline={scene.headline} serifFirst={idx % 2 === 1} />
              </div>

              {/* Center: Tactile UI Mockup Prop */}
              {beat === 0 && <PhoneHeroProp visualUrl={visualUrl} title={brandName} />}
              {beat === 1 && (
                <FannedVisualCardProp visualUrl={visualUrl} badge={badge} iconType={iconType} />
              )}
              {beat === 2 && <WaveformVisualProp visualUrl={visualUrl} label={brandName} />}
              {beat === 3 && (
                <HubOrbitFinalProp
                  visualUrl={visualUrl}
                  ctaText={scene.badge || 'Save dulu biar ngga lupa'}
                  iconType={iconType}
                />
              )}

              {/* Bottom: Synchronized Subtitle + Equalizer Progress Card */}
              <EditorialSubtitleCard
                subtext={scene.subtext}
                iconType={iconType}
                tagLeft={`✳ ${brandName}`}
                tagRight={`POIN ${idx + 1}/${safeScenes.length}`}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export default EditorialMotion;
