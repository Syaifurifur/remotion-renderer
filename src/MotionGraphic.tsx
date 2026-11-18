import React from 'react';
import {
  AbsoluteFill,
  Audio,
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
}

export interface MotionGraphicProps {
  title: string;
  themeColor: string;
  audioUrl?: string;
  fps: number;
  durationInFrames: number;
  scenes: SceneItem[];
}

const SceneSlide: React.FC<{
  scene: SceneItem;
  themeColor: string;
  index: number;
  total: number;
}> = ({ scene, themeColor, index, total }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const fadeOut = interpolate(
    frame,
    [Math.max(0, durationInFrames - 10), durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const yOffset = interpolate(enter, [0, 1], [60, 0]);
  const scale = interpolate(enter, [0, 1], [0.94, 1]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        padding: '0 84px',
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          transform: `translateY(${yOffset}px) scale(${scale})`,
          background: 'rgba(255, 255, 255, 0.08)',
          border: '2px solid rgba(255, 255, 255, 0.16)',
          borderRadius: 42,
          padding: '64px 56px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: themeColor || '#0b63ce',
            color: '#ffffff',
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: '0.12em',
            padding: '14px 28px',
            borderRadius: 999,
            textTransform: 'uppercase',
            marginBottom: 34,
          }}
        >
          {scene.badge || `POIN ${index + 1}/${total}`}
        </div>

        <h1
          style={{
            color: '#ffffff',
            fontSize: 74,
            fontWeight: 900,
            lineHeight: 1.12,
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          {scene.headline}
        </h1>

        <p
          style={{
            color: '#cbd5e1',
            fontSize: 40,
            fontWeight: 500,
            lineHeight: 1.45,
            marginTop: 32,
            marginBottom: 0,
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
  fps = 30,
  durationInFrames,
  scenes = [],
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / Math.max(1, durationInFrames - 1));
  const floatY = Math.sin(frame / 25) * 28;

  const safeScenes = scenes.length
    ? scenes
    : [{ headline: title, subtext: 'Tryout League • Digital Space Hub', badge: 'INFO', durationSec: 5 }];

  const totalSceneSec = safeScenes.reduce((acc, s) => acc + Math.max(2, Number(s.durationSec) || 5), 0);
  let cursorFrame = 0;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 20% 20%, ${themeColor}55 0%, #071d43 52%, #030b1c 100%)`,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Animated ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: 180 + floatY,
          right: -120,
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: themeColor,
          opacity: 0.22,
          filter: 'blur(90px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 220 - floatY,
          left: -140,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: '#38bdf8',
          opacity: 0.14,
          filter: 'blur(90px)',
        }}
      />

      {/* Top brand bar */}
      <div
        style={{
          position: 'absolute',
          top: 84,
          left: 84,
          right: 84,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ color: '#e2e8f0', fontSize: 30, fontWeight: 800, letterSpacing: '0.06em' }}>
          TRYOUT LEAGUE
        </span>
        <span style={{ color: '#94a3b8', fontSize: 26, fontWeight: 600 }}>UTBK-SNBT 2026</span>
      </div>

      {/* Scenes */}
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
            <SceneSlide scene={scene} themeColor={themeColor} index={idx} total={safeScenes.length} />
          </Sequence>
        );
      })}

      {/* Bottom progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 92,
          left: 84,
          right: 84,
          height: 12,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.16)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: '#38bdf8',
            borderRadius: 999,
          }}
        />
      </div>

      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  );
};
