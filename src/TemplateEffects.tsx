// Adapted from RenderComp/free-remotion-templates (MIT License) for 1080x1920 vertical video
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

export const AmbientBokeh: React.FC<{
  colors: string[];
  count?: number;
}> = ({ colors, count = 14 }) => {
  const frame = useCurrentFrame();

  const circles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      seedX: seededRandom(i * 3 + 1),
      seedY: seededRandom(i * 5 + 2),
      sizeBase: 140 + seededRandom(i * 7 + 3) * 260,
      speed: 0.4 + seededRandom(i * 11 + 4) * 0.8,
      phase: seededRandom(i * 13 + 5) * Math.PI * 2,
      color: colors[Math.floor(seededRandom(i * 17 + 6) * colors.length)],
      opacity: 0.2 + seededRandom(i * 19 + 7) * 0.3,
    }));
  }, [count, colors]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {circles.map((c, i) => {
        const t = frame * 0.025 * c.speed + c.phase;
        const x = c.seedX * 100 + Math.sin(t) * 7;
        const y = c.seedY * 100 + Math.cos(t * 0.8) * 7;
        const pulse = 1 + Math.sin(t * 1.2) * 0.14;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: c.sizeBase * pulse,
              height: c.sizeBase * pulse,
              marginLeft: -(c.sizeBase * pulse) / 2,
              marginTop: -(c.sizeBase * pulse) / 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${c.color} 0%, transparent 70%)`,
              opacity: c.opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const BounceHeadline: React.FC<{
  text: string;
  color?: string;
  fontSize?: number;
  bounces?: number;
  height?: number;
  delay?: number;
  duration?: number;
  textShadow?: string;
}> = ({
  text,
  color = '#ffffff',
  fontSize = 62,
  bounces = 2,
  height = 42,
  delay = 0,
  duration = 22,
  textShadow = '0 8px 32px rgba(0,0,0,0.85)',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(progress, [0, 0.15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bounceY =
    progress >= 1 ? 0 : Math.abs(Math.sin(progress * Math.PI * bounces)) * height * (1 - progress);

  return (
    <h1
      style={{
        color,
        fontSize,
        fontWeight: 900,
        lineHeight: 1.12,
        margin: 0,
        letterSpacing: '-0.025em',
        textShadow,
        opacity,
        transform: `translateY(${-bounceY}px)`,
      }}
    >
      {text}
    </h1>
  );
};

export const BrandHeaderCard: React.FC<{
  name: string;
  tagline?: string;
  accentColor: string;
  lightMode?: boolean;
}> = ({ name, tagline, accentColor, lightMode = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const translateY = interpolate(enter, [0, 1], [-40, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 56,
        left: 64,
        right: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 26px',
        borderRadius: 24,
        background: lightMode ? 'rgba(255, 255, 255, 0.86)' : 'rgba(15, 23, 42, 0.68)',
        border: `1.5px solid ${accentColor}`,
        boxShadow: '0 14px 36px rgba(0, 0, 0, 0.16)',
        transform: `translateY(${translateY}px)`,
        opacity: enter,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: '0.14em',
            color: lightMode ? '#3D242C' : '#ffffff',
          }}
        >
          {name}
        </div>
        {tagline && (
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: lightMode ? '#8C5A66' : '#cbd5e1',
              marginTop: 2,
            }}
          >
            {tagline}
          </div>
        )}
      </div>
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: accentColor,
          boxShadow: `0 0 16px ${accentColor}`,
        }}
      />
    </div>
  );
};
