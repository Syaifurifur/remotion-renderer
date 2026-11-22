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
  fps: number;
  durationInFrames: number;
  scenes: SceneItem[];
}

const SceneSlide: React.FC<{
  scene: SceneItem;
  themeColor: string;
  productImageUrl?: string;
  index: number;
  total: number;
}> = ({ scene, themeColor, productImageUrl, index, total }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const fadeOut = interpolate(
    frame,
    [Math.max(0, durationInFrames - 10), durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const yOffset = interpolate(enter, [0, 1], [54, 0]);
  const scale = interpolate(enter, [0, 1], [0.94, 1]);
  const productZoom = interpolate(frame, [0, Math.max(1, durationInFrames)], [1, 1.08]);
  const showProduct = Boolean(productImageUrl) && scene.showProduct !== false;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        padding: '150px 76px 140px',
        opacity: fadeOut,
      }}
    >
      {showProduct && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 40,
            transform: `translateY(${yOffset * 0.6}px) scale(${scale})`,
          }}
        >
          <div
            style={{
              width: 640,
              height: 640,
              borderRadius: 48,
              overflow: 'hidden',
              border: '4px solid rgba(255,255,255,0.28)',
              boxShadow: `0 28px 80px ${themeColor}66`,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Img
              src={productImageUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${productZoom})`,
              }}
            />
          </div>
        </div>
      )}

      <div
        style={{
          transform: `translateY(${yOffset}px) scale(${scale})`,
          background: 'rgba(255, 255, 255, 0.09)',
          border: '2px solid rgba(255, 255, 255, 0.18)',
          borderRadius: 40,
          padding: showProduct ? '48px 48px' : '64px 56px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: themeColor || '#0b63ce',
            color: '#ffffff',
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: '0.12em',
            padding: '12px 26px',
            borderRadius: 999,
            textTransform: 'uppercase',
            marginBottom: 26,
          }}
        >
          {scene.badge || `POIN ${index + 1}/${total}`}
        </div>

        <h1
          style={{
            color: '#ffffff',
            fontSize: showProduct ? 60 : 72,
            fontWeight: 900,
            lineHeight: 1.14,
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          {scene.headline}
        </h1>

        <p
          style={{
            color: '#cbd5e1',
            fontSize: showProduct ? 34 : 40,
            fontWeight: 500,
            lineHeight: 1.45,
            marginTop: 24,
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
  productImageUrl,
  fps = 30,
  durationInFrames,
  scenes = [],
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / Math.max(1, durationInFrames - 1));
  const floatY = Math.sin(frame / 25) * 28;

  const safeScenes = scenes.length
    ? scenes
    : [{ headline: title, subtext: 'Promo Spesial Hari Ini', badge: 'PROMO', durationSec: 5, showProduct: true }];

  const totalSceneSec = safeScenes.reduce((acc, s) => acc + Math.max(2, Number(s.durationSec) || 5), 0);
  let cursorFrame = 0;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 20% 20%, ${themeColor}55 0%, #071d43 52%, #030b1c 100%)`,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
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

      <div
        style={{
          position: 'absolute',
          top: 76,
          left: 76,
          right: 76,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ color: '#e2e8f0', fontSize: 28, fontWeight: 800, letterSpacing: '0.06em' }}>
          REKOMENDASI PRODUK
        </span>
        <span style={{ color: '#94a3b8', fontSize: 24, fontWeight: 600 }}>PROMO PILIHAN</span>
      </div>

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
            <SceneSlide
              scene={scene}
              themeColor={themeColor}
              productImageUrl={productImageUrl}
              index={idx}
              total={safeScenes.length}
            />
          </Sequence>
        );
      })}

      <div
        style={{
          position: 'absolute',
          bottom: 84,
          left: 76,
          right: 76,
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
