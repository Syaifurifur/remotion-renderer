import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BeautyIcon, resolveIconCategory } from './BeautyIcons';
import { AmbientBokeh, BounceHeadline, BrandHeaderCard } from './TemplateEffects';

export interface SceneItem {
  headline: string;
  subtext: string;
  badge?: string;
  durationSec: number;
  showProduct?: boolean;
  imageUrl?: string;
  icon?: string;
  motion?: 'zoomIn' | 'panRight' | 'zoomOut' | 'panLeft';
}

export interface BrandingConfig {
  name?: string;
  tagline?: string;
  primary?: string;
  secondary?: string;
  accent?: string;
}

export interface MotionGraphicProps {
  title: string;
  themeColor: string;
  audioUrl?: string;
  productImageUrl?: string;
  bgImageUrl?: string;
  branding?: BrandingConfig;
  fps: number;
  durationInFrames: number;
  scenes: SceneItem[];
}

const MOTIONS: Array<'zoomIn' | 'panRight' | 'zoomOut' | 'panLeft'> = [
  'zoomIn',
  'panRight',
  'zoomOut',
  'panLeft',
];

const LightStreaksOverlay: React.FC<{ themeColor: string; frame: number }> = ({
  themeColor,
  frame,
}) => {
  const dashOffset1 = -(frame * 11) % 1600;
  const dashOffset2 = (frame * 8) % 1600;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.42 }}
      >
        <defs>
          <linearGradient id="streakA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <path
          d="M -120 1280 C 260 940, 780 1120, 1220 520"
          fill="none"
          stroke="url(#streakA)"
          strokeWidth="3.5"
          strokeDasharray="420 1180"
          strokeDashoffset={dashOffset1}
        />
        <path
          d="M -80 680 C 340 1060, 720 620, 1180 1180"
          fill="none"
          stroke={themeColor || 'rgba(255,255,255,0.45)'}
          strokeWidth="2.5"
          strokeDasharray="340 1260"
          strokeDashoffset={dashOffset2}
        />
      </svg>
    </AbsoluteFill>
  );
};

const SceneSlide: React.FC<{
  scene: SceneItem;
  themeColor: string;
  accentColor: string;
  fallbackProductUrl?: string;
  hasBrandHeader: boolean;
  index: number;
  total: number;
}> = ({ scene, themeColor, accentColor, fallbackProductUrl, hasBrandHeader, index, total }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 150 } });
  const fadeIn = interpolate(frame, [0, 7], [0.25, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(
    frame,
    [Math.max(0, durationInFrames - 7), durationInFrames],
    [1, 0.25],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  const motion = scene.motion || MOTIONS[index % MOTIONS.length];
  const progress = Math.min(1, frame / Math.max(1, durationInFrames));

  let imgScale = 1.06;
  let imgX = 0;
  let imgY = 0;
  if (motion === 'zoomIn') {
    imgScale = interpolate(progress, [0, 1], [1.0, 1.14]);
  } else if (motion === 'zoomOut') {
    imgScale = interpolate(progress, [0, 1], [1.15, 1.02]);
  } else if (motion === 'panRight') {
    imgScale = 1.12;
    imgX = interpolate(progress, [0, 1], [-28, 28]);
  } else if (motion === 'panLeft') {
    imgScale = 1.12;
    imgX = interpolate(progress, [0, 1], [28, -28]);
  }
  imgY = Math.sin(frame / 20) * 8;

  const activeBgImage = scene.imageUrl;
  const showFloatingProduct = Boolean(fallbackProductUrl) && scene.showProduct !== false;
  const prodFloatY = Math.sin(frame / 18) * 14;
  const prodTilt = Math.sin(frame / 36) * 4.5 - 1;
  const prodScale = interpolate(progress, [0, 1], [0.97, 1.05]);

  const iconType = resolveIconCategory(scene.icon, scene.badge, scene.headline);
  const iconFloat = Math.sin(frame / 16) * 10;
  const iconScale = interpolate(enter, [0, 1], [0.75, 1]);
  const badgeScale = interpolate(enter, [0, 1], [0.88, 1]);

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Scene AI Background Visual */}
      {activeBgImage && (
        <AbsoluteFill style={{ overflow: 'hidden', opacity: 0.72 }}>
          <Img
            src={activeBgImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `translate(${imgX}px, ${imgY}px) scale(${imgScale})`,
            }}
          />
        </AbsoluteFill>
      )}

      {/* Floating Hero Product Photo OR Center Editorial Icon Showcase */}
      {showFloatingProduct ? (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 110 }}>
          <div
            style={{
              width: 640,
              height: 820,
              borderRadius: 52,
              overflow: 'hidden',
              transform: `translateY(${prodFloatY}px) rotate(${prodTilt}deg) scale(${prodScale})`,
              boxShadow: `0 40px 120px rgba(0, 0, 0, 0.85), 0 0 80px ${themeColor}44`,
              border: '1.5px solid rgba(255,255,255,0.26)',
              WebkitMaskImage:
                'radial-gradient(ellipse 92% 92% at 50% 50%, #000 72%, rgba(0,0,0,0.4) 92%, transparent 100%)',
              maskImage:
                'radial-gradient(ellipse 92% 92% at 50% 50%, #000 72%, rgba(0,0,0,0.4) 92%, transparent 100%)',
            }}
          >
            <Img src={fallbackProductUrl!} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 180 }}>
          <div
            style={{
              width: 240,
              height: 240,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.92)',
              border: `3px solid ${accentColor}`,
              boxShadow: `0 24px 70px rgba(0,0,0,0.25), 0 0 60px ${themeColor}55`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `translateY(${iconFloat}px) scale(${iconScale})`,
            }}
          >
            <BeautyIcon type={iconType} primaryColor="#e11d74" accentColor={themeColor || '#7c3aed'} size={132} />
          </div>
        </AbsoluteFill>
      )}

      {/* Top/Bottom Contrast Scrim */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(5,8,14,0.48) 0%, rgba(5,8,14,0) 24%, rgba(5,8,14,0) 56%, rgba(5,8,14,0.86) 82%, rgba(5,8,14,0.96) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Safe Zone: Sleek Pill Badge + Mini Icon */}
      <div
        style={{
          position: 'absolute',
          top: hasBrandHeader ? 176 : 116,
          left: 72,
          right: 72,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${badgeScale})`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(15, 23, 42, 0.78)',
            border: `1.5px solid ${accentColor || '#38bdf8'}`,
            boxShadow: `0 10px 30px ${themeColor}44`,
            color: '#f8fafc',
            fontSize: 25,
            fontWeight: 800,
            letterSpacing: '0.14em',
            padding: '10px 26px',
            borderRadius: 999,
            textTransform: 'uppercase',
          }}
        >
          <BeautyIcon type={iconType} primaryColor="#f472b6" accentColor="#ffffff" size={30} />
          {scene.badge || `POIN ${index + 1}/${total}`}
        </div>
      </div>

      {/* Bottom Safe Zone: Bounce-In Headline + Subtext */}
      <div
        style={{
          position: 'absolute',
          bottom: 118,
          left: 68,
          right: 68,
          textAlign: 'center',
        }}
      >
        <BounceHeadline
          text={scene.headline}
          color="#ffffff"
          fontSize={62}
          bounces={2}
          height={34}
          delay={0}
          duration={20}
        />
        <p
          style={{
            color: '#e2e8f0',
            fontSize: 34,
            fontWeight: 500,
            lineHeight: 1.4,
            marginTop: 18,
            marginBottom: 0,
            textShadow: '0 4px 20px rgba(0,0,0,0.9)',
          }}
        >
          {scene.subtext}
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const MotionGraphic: React.FC<MotionGraphicProps> = ({
  title,
  themeColor = '#0b63ce',
  audioUrl,
  productImageUrl,
  bgImageUrl,
  branding,
  fps = 24,
  durationInFrames,
  scenes = [],
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / Math.max(1, durationInFrames - 1));
  const bgScale = interpolate(frame, [0, Math.max(1, durationInFrames)], [1.0, 1.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isBranded = Boolean(branding?.name);
  const accentColor = branding?.accent || branding?.primary || themeColor || '#38bdf8';
  const bokehColors = isBranded
    ? [branding?.primary || '#F8C6D0', branding?.accent || '#D4A5A5', '#FFFFFF']
    : [themeColor || '#0b63ce', '#38bdf8', '#ffffff'];

  const safeScenes = scenes.length
    ? scenes
    : [
        {
          headline: title,
          subtext: branding?.tagline || 'Promo Spesial Hari Ini',
          badge: 'PROMO',
          durationSec: 5,
          showProduct: true,
        },
      ];

  const totalSceneSec = safeScenes.reduce((acc, s) => acc + Math.max(2, Number(s.durationSec) || 5), 0);
  let cursorFrame = 0;

  return (
    <AbsoluteFill
      style={{
        background: isBranded
          ? 'linear-gradient(165deg, #2a1820 0%, #422530 50%, #1b0f14 100%)'
          : 'linear-gradient(165deg, #10151c 0%, #1c2430 48%, #090d14 100%)',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {bgImageUrl && (
        <AbsoluteFill style={{ overflow: 'hidden', opacity: 0.62 }}>
          <Img
            src={bgImageUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${bgScale})` }}
          />
        </AbsoluteFill>
      )}

      <AmbientBokeh colors={bokehColors} count={12} />

      {safeScenes.map((scene, idx) => {
        const ratio = Math.max(2, Number(scene.durationSec) || 5) / Math.max(1, totalSceneSec);
        const sceneFrames =
          idx === safeScenes.length - 1
            ? Math.max(24, durationInFrames - cursorFrame)
            : Math.max(24, Math.round(durationInFrames * ratio));
        const from = cursorFrame;
        cursorFrame += sceneFrames;

        return (
          <Sequence key={idx} from={from} durationInFrames={sceneFrames}>
            <SceneSlide
              scene={scene}
              themeColor={themeColor}
              accentColor={accentColor}
              fallbackProductUrl={productImageUrl}
              hasBrandHeader={isBranded}
              index={idx}
              total={safeScenes.length}
            />
          </Sequence>
        );
      })}

      <LightStreaksOverlay themeColor={accentColor} frame={frame} />

      {branding?.name && (
        <BrandHeaderCard
          name={branding.name}
          tagline={branding.tagline}
          accentColor={accentColor}
          lightMode={false}
        />
      )}

      {/* Sleek Bottom Progress Line */}
      <div
        style={{
          position: 'absolute',
          bottom: 54,
          left: 72,
          right: 72,
          height: 6,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.16)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${accentColor}, #ffffff)`,
            borderRadius: 999,
          }}
        />
      </div>

      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  );
};
