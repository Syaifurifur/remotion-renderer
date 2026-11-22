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

export interface SceneItem {
  headline: string;
  subtext: string;
  badge?: string;
  durationSec: number;
  showProduct?: boolean;
  imageUrl?: string;
  motion?: 'zoomIn' | 'panRight' | 'zoomOut' | 'panLeft';
}

export interface MotionGraphicProps {
  title: string;
  themeColor: string;
  audioUrl?: string;
  productImageUrl?: string;
  bgImageUrl?: string;
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
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.45 }}
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
  fallbackProductUrl?: string;
  index: number;
  total: number;
}> = ({ scene, themeColor, fallbackProductUrl, index, total }) => {
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

  const activeImage = scene.imageUrl || fallbackProductUrl;
  const isFullSceneImage = Boolean(scene.imageUrl);

  const yIn = interpolate(enter, [0, 1], [38, 0]);
  const badgeScale = interpolate(enter, [0, 1], [0.88, 1]);

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Scene Visual */}
      {activeImage &&
        (isFullSceneImage ? (
          <AbsoluteFill style={{ overflow: 'hidden' }}>
            <Img
              src={activeImage}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `translate(${imgX}px, ${imgY}px) scale(${imgScale})`,
              }}
            />
          </AbsoluteFill>
        ) : (
          <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 90 }}>
            <div
              style={{
                width: 720,
                height: 920,
                borderRadius: 56,
                overflow: 'hidden',
                transform: `translate(${imgX}px, ${imgY}px) scale(${imgScale})`,
                boxShadow: `0 40px 120px rgba(0, 0, 0, 0.78), 0 0 80px ${themeColor}40`,
                border: '1.5px solid rgba(255,255,255,0.22)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 92% 92% at 50% 50%, #000 72%, rgba(0,0,0,0.4) 92%, transparent 100%)',
                maskImage:
                  'radial-gradient(ellipse 92% 92% at 50% 50%, #000 72%, rgba(0,0,0,0.4) 92%, transparent 100%)',
              }}
            >
              <Img src={activeImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </AbsoluteFill>
        ))}

      {/* Top/Bottom Contrast Scrim */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(5,8,14,0.62) 0%, rgba(5,8,14,0) 24%, rgba(5,8,14,0) 56%, rgba(5,8,14,0.88) 82%, rgba(5,8,14,0.97) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Safe Zone: Sleek Pill Badge */}
      <div
        style={{
          position: 'absolute',
          top: 120,
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
            background: 'rgba(15, 23, 42, 0.76)',
            border: `1.5px solid ${themeColor || '#38bdf8'}`,
            boxShadow: `0 10px 30px ${themeColor}44`,
            color: '#f8fafc',
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: '0.14em',
            padding: '12px 30px',
            borderRadius: 999,
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: themeColor || '#38bdf8',
            }}
          />
          {scene.badge || `POIN ${index + 1}/${total}`}
        </div>
      </div>

      {/* Bottom Safe Zone: Kinetic Typography */}
      <div
        style={{
          position: 'absolute',
          bottom: 118,
          left: 68,
          right: 68,
          textAlign: 'center',
          transform: `translateY(${yIn}px)`,
        }}
      >
        <h1
          style={{
            color: '#ffffff',
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.12,
            margin: 0,
            letterSpacing: '-0.025em',
            textShadow: '0 8px 32px rgba(0,0,0,0.9)',
          }}
        >
          {scene.headline}
        </h1>
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
  fps = 24,
  durationInFrames,
  scenes = [],
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / Math.max(1, durationInFrames - 1));

  const safeScenes = scenes.length
    ? scenes
    : [
        {
          headline: title,
          subtext: 'Promo Spesial Hari Ini',
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
        background: `linear-gradient(165deg, #10151c 0%, #1c2430 48%, #090d14 100%)`,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {bgImageUrl && (
        <AbsoluteFill style={{ overflow: 'hidden', opacity: 0.45 }}>
          <Img src={bgImageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </AbsoluteFill>
      )}

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
              fallbackProductUrl={productImageUrl}
              index={idx}
              total={safeScenes.length}
            />
          </Sequence>
        );
      })}

      <LightStreaksOverlay themeColor={themeColor} frame={frame} />

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
            background: `linear-gradient(90deg, ${themeColor || '#38bdf8'}, #ffffff)`,
            borderRadius: 999,
          }}
        />
      </div>

      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  );
};
