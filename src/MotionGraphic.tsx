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

const LightStreaksAndMist: React.FC<{ themeColor: string; frame: number }> = ({
  themeColor,
  frame,
}) => {
  const mist1X = Math.sin(frame / 42) * 90;
  const mist1Y = Math.cos(frame / 55) * 45;
  const mist2X = Math.cos(frame / 36) * 110;
  const mist2Y = Math.sin(frame / 48) * 50;
  const dashOffset1 = -(frame * 10) % 1600;
  const dashOffset2 = (frame * 7) % 1600;
  const spotlightScale = 1 + Math.sin(frame / 30) * 0.08;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Studio radial spotlight behind hero product */}
      <div
        style={{
          position: 'absolute',
          top: '22%',
          left: '50%',
          width: 820,
          height: 820,
          transform: `translate(-50%, 0) scale(${spotlightScale})`,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${themeColor}44 0%, rgba(255,255,255,0.08) 38%, transparent 70%)`,
        }}
      />

      {/* Drifting volumetric mist layers (pure radial gradients for fast CPU rendering) */}
      <div
        style={{
          position: 'absolute',
          top: 460 + mist1Y,
          left: -140 + mist1X,
          width: 820,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(226,232,240,0.14) 0%, rgba(226,232,240,0.04) 45%, transparent 72%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 340 + mist2Y,
          right: -160 + mist2X,
          width: 860,
          height: 560,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${themeColor}2a 0%, rgba(255,255,255,0.07) 42%, transparent 72%)`,
        }}
      />

      {/* Sweeping silver/white light-streak curves */}
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.65 }}
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
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2"
          strokeDasharray="340 1260"
          strokeDashoffset={dashOffset2}
        />
      </svg>
    </AbsoluteFill>
  );
};

const SceneOverlay: React.FC<{
  scene: SceneItem;
  themeColor: string;
  index: number;
  total: number;
}> = ({ scene, themeColor, index, total }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 15, stiffness: 140 } });
  const fadeOut = interpolate(
    frame,
    [Math.max(0, durationInFrames - 8), durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const yIn = interpolate(enter, [0, 1], [36, 0]);
  const badgeScale = interpolate(enter, [0, 1], [0.88, 1]);

  return (
    <AbsoluteFill style={{ opacity: fadeOut, pointerEvents: 'none' }}>
      {/* Top Safe Zone: Sleek Pill Badge */}
      <div
        style={{
          position: 'absolute',
          top: 132,
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
              boxShadow: `0 0 14px ${themeColor || '#38bdf8'}`,
            }}
          />
          {scene.badge || `POIN ${index + 1}/${total}`}
        </div>
      </div>

      {/* Bottom Safe Zone: Frameless High-Contrast Kinetic Typography */}
      <div
        style={{
          position: 'absolute',
          bottom: 125,
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
            textShadow: '0 8px 32px rgba(0,0,0,0.85)',
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
            textShadow: '0 4px 20px rgba(0,0,0,0.85)',
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
  fps = 30,
  durationInFrames,
  scenes = [],
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / Math.max(1, durationInFrames - 1));
  const bgScale = interpolate(frame, [0, Math.max(1, durationInFrames)], [1.0, 1.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Continuous 3D-feel luxury commercial product motion across the entire video
  const floatY = Math.sin(frame / 22) * 18;
  const tiltDeg = Math.sin(frame / 45) * 6.5 - 1.5;
  const heroZoom = interpolate(
    frame,
    [0, Math.max(1, durationInFrames * 0.5), Math.max(2, durationInFrames)],
    [0.98, 1.1, 1.04],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const safeScenes = scenes.length
    ? scenes
    : [{ headline: title, subtext: 'Promo Spesial Hari Ini', badge: 'PROMO', durationSec: 5, showProduct: true }];

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
        <AbsoluteFill style={{ overflow: 'hidden', opacity: 0.58 }}>
          <Img
            src={bgImageUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${bgScale})`,
            }}
          />
        </AbsoluteFill>
      )}
      <LightStreaksAndMist themeColor={themeColor} frame={frame} />

      {/* Center Hero Product Showcase (55-60% frame height, frameless floating luxury feel) */}
      {productImageUrl && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 90,
          }}
        >
          <div
            style={{
              width: 720,
              height: 920,
              borderRadius: 56,
              overflow: 'hidden',
              transform: `translateY(${floatY}px) rotate(${tiltDeg}deg) scale(${heroZoom})`,
              boxShadow: `0 40px 120px rgba(0, 0, 0, 0.78), 0 0 80px ${themeColor}40`,
              border: '1.5px solid rgba(255,255,255,0.22)',
              WebkitMaskImage:
                'radial-gradient(ellipse 92% 92% at 50% 50%, #000 72%, rgba(0,0,0,0.4) 92%, transparent 100%)',
              maskImage:
                'radial-gradient(ellipse 92% 92% at 50% 50%, #000 72%, rgba(0,0,0,0.4) 92%, transparent 100%)',
            }}
          >
            <Img
              src={productImageUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Bottom dark gradient scrim for crisp text contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(5,8,14,0.55) 0%, rgba(5,8,14,0) 22%, rgba(5,8,14,0) 58%, rgba(5,8,14,0.88) 84%, rgba(5,8,14,0.96) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Dynamic Scene Overlays */}
      {safeScenes.map((scene, idx) => {
        const ratio = Math.max(2, Number(scene.durationSec) || 5) / Math.max(1, totalSceneSec);
        const sceneFrames =
          idx === safeScenes.length - 1
            ? Math.max(30, durationInFrames - cursorFrame)
            : Math.max(30, Math.round(durationInFrames * ratio));
        const from = cursorFrame;
        cursorFrame += sceneFrames;

        return (
          <Sequence key={idx} from={from} durationInFrames={sceneFrames}>
            <SceneOverlay
              scene={scene}
              themeColor={themeColor}
              index={idx}
              total={safeScenes.length}
            />
          </Sequence>
        );
      })}

      {/* Sleek Bottom Progress Line */}
      <div
        style={{
          position: 'absolute',
          bottom: 58,
          left: 72,
          right: 72,
          height: 6,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.14)',
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
