import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { LucideIconResolver } from '../shared/LucideIconResolver';

const SANS = '-apple-system, "Segoe UI", Roboto, sans-serif';
const MONO = 'Consolas, "Courier New", monospace';

export type CleanUiItem = {
  title: string;
  desc: string;
  icon?: string;
};

export type CleanUiScene = {
  headline: string;
  subtext: string;
  badge?: string;
  category?: string;
  highlightHeadline?: string;
  highlightWords?: string[];
  cardLayout?: string;
  items?: CleanUiItem[];
  icon?: string;
  imageUrl?: string;
  durationSec?: number;
};

export type WordTiming = {
  text: string;
  startSec: number;
  endSec: number;
};

export type CleanUiMotionProps = {
  title: string;
  brandName?: string;
  tagline?: string;
  bgImageUrl?: string;
  productImageUrl?: string;
  scenes: CleanUiScene[];
  wordTimings?: WordTiming[];
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
      <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', color: '#64748B' }}>
        FOLLOW ACCOUNT FOR TIPS
      </span>
      <span style={{ fontFamily: SANS, fontSize: 18, fontWeight: 900, letterSpacing: '0.06em', color: '#1E293B' }}>
        {brandName}
      </span>
    </div>
  </AbsoluteFill>
);

const TwoToneHeadline: React.FC<{
  category: string;
  headline: string;
  highlightHeadline?: string;
}> = ({ category, headline, highlightHeadline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, stiffness: 140 } });

  const words = String(headline || 'CLEAN MOTION').trim().split(/\s+/).filter(Boolean);
  const hlClean = String(highlightHeadline || '').toLowerCase().trim();
  const mid = Math.max(1, Math.ceil(words.length / 2));
  const line1 = hlClean ? headline : words.slice(0, mid).join(' ');
  const line2 = hlClean ? highlightHeadline : words.slice(mid).join(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
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

/** Synchronized word-highlighted caption using Edge TTS wordTimings (with proportional fallback) */
const HighlightCaption: React.FC<{
  subtext: string;
  highlightWords?: string[];
  tone?: 'mint' | 'peach';
  sceneStartSec: number;
  sceneDurationSec: number;
  wordTimings?: WordTiming[];
}> = ({ subtext, highlightWords = [], tone = 'mint', sceneStartSec, sceneDurationSec, wordTimings = [] }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame: frame - 4, fps, config: { damping: 20, stiffness: 140 } });
  const words = String(subtext || '').trim().split(/\s+/).filter(Boolean);

  const localSec = frame / Math.max(1, fps);
  const globalSec = sceneStartSec + localSec;

  // Match active word via real WordBoundary timings if available, else proportional
  let activeIdx = Math.min(
    words.length - 1,
    Math.floor(interpolate(frame, [0, Math.max(1, durationInFrames)], [0, words.length], { extrapolateRight: 'clamp' }))
  );

  if (wordTimings.length > 0) {
    const activeWT = wordTimings.find((wt) => globalSec >= wt.startSec && globalSec <= wt.endSec + 0.15);
    if (activeWT) {
      const cleanWT = activeWT.text.toLowerCase().replace(/[^a-z0-9]/g, '');
      const matched = words.findIndex((w) => w.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanWT);
      if (matched >= 0) activeIdx = matched;
    } else if (sceneDurationSec > 0) {
      const pct = Math.min(1, localSec / sceneDurationSec);
      activeIdx = Math.min(words.length - 1, Math.floor(pct * words.length));
    }
  }

  const hlSet = new Set(highlightWords.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, '')));
  const highlightBg = tone === 'peach' ? 'rgba(251, 146, 60, 0.24)' : 'rgba(20, 184, 166, 0.20)';

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
        const cleanW = w.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isActive = i === activeIdx || (hlSet.has(cleanW) && Math.abs(i - activeIdx) <= 2);
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

const HeroVisualCard: React.FC<{
  badge: string;
  visualUrl?: string;
  headline: string;
  icon?: string;
  items?: CleanUiItem[];
}> = ({ badge, visualUrl, headline, icon, items = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 8, fps, config: { damping: 20, stiffness: 140 } });
  const tags = items.length ? items.map((i) => i.title).slice(0, 3) : ['Fokus', 'Teruji', 'Rapi'];

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
            <LucideIconResolver name={icon} color="#0F766E" size={34} />
            <span style={{ fontFamily: SANS, fontSize: 24, fontWeight: 800, color: '#0F172A' }}>
              Poin Utama
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
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {tags.map((tag, i) => (
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

const StaggeredGridCard: React.FC<{
  badge: string;
  visualUrl?: string;
  icon?: string;
  subtext: string;
  items?: CleanUiItem[];
  sceneFrames: number;
}> = ({ badge, visualUrl, icon, subtext, items = [], sceneFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = String(subtext || '').split(/\s+/).filter(Boolean);
  const tiles: CleanUiItem[] =
    items.length >= 2
      ? items.slice(0, 3)
      : [
          { title: 'Fokus', desc: words.slice(0, 3).join(' ') || 'Visual bersih', icon: icon || 'sparkles' },
          { title: 'Manfaat', desc: words.slice(3, 6).join(' ') || 'Hasil nyata', icon: 'droplets' },
          { title: 'Pilihan', desc: words.slice(6, 9).join(' ') || 'Aman harian', icon: 'shield-check' },
        ];

  return (
    <CleanCardShell badge={badge} rightLabel="Ilustrasi">
      {visualUrl ? (
        <div style={{ width: '100%', height: 220, borderRadius: 18, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
          <Img src={visualUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${tiles.length}, 1fr)`, gap: 16 }}>
        {tiles.map((tile, i) => {
          const appearAt = Math.round((i * 0.25 + 0.08) * sceneFrames);
          const tileEnter = spring({
            frame: frame - appearAt,
            fps,
            config: { damping: 18, stiffness: 150 },
          });
          return (
            <React.Fragment key={i}>
              <Sequence from={appearAt} durationInFrames={12} layout="none">
                <Audio src={staticFile('audio/sfx/pop.mp3')} volume={0.22} />
              </Sequence>
              <div
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
                  transform: `translateY(${(1 - tileEnter) * 20}px)`,
                }}
              >
                <LucideIconResolver name={tile.icon || icon} color="#0F766E" size={40} />
                <span style={{ fontFamily: SANS, fontSize: 22, fontWeight: 800, color: '#0F172A', textAlign: 'center' }}>
                  {tile.title}
                </span>
                <span style={{ fontFamily: SANS, fontSize: 17, color: '#64748B', textAlign: 'center', lineHeight: 1.3 }}>
                  {tile.desc}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </CleanCardShell>
  );
};

const FlowDiagramCard: React.FC<{
  badge: string;
  visualUrl?: string;
  icon?: string;
  items?: CleanUiItem[];
  sceneFrames: number;
}> = ({ badge, visualUrl, icon, items = [], sceneFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps: CleanUiItem[] =
    items.length >= 2
      ? items.slice(0, 3)
      : [
          { title: 'Masalah', desc: 'Identifikasi', icon: 'alert-circle' },
          { title: 'Solusi', desc: 'Tepat sasaran', icon: icon || 'sparkles' },
          { title: 'Hasil', desc: 'Lebih optimal', icon: 'check-circle' },
        ];

  return (
    <CleanCardShell badge={badge} rightLabel="Alur kerja">
      {visualUrl ? (
        <div style={{ width: '100%', height: 210, borderRadius: 18, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
          <Img src={visualUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : null}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {steps.map((st, i) => {
          const appearAt = Math.round((i * 0.25 + 0.08) * sceneFrames);
          const sEnter = spring({
            frame: frame - appearAt,
            fps,
            config: { damping: 18, stiffness: 150 },
          });
          return (
            <React.Fragment key={i}>
              <Sequence from={appearAt} durationInFrames={12} layout="none">
                <Audio src={staticFile('audio/sfx/pop.mp3')} volume={0.22} />
              </Sequence>
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
                <LucideIconResolver name={st.icon || icon} color="#0F766E" size={36} />
                <span style={{ fontFamily: SANS, fontSize: 21, fontWeight: 800, color: '#0F172A', textAlign: 'center' }}>
                  {st.title}
                </span>
              </div>
              {i < steps.length - 1 ? (
                <span style={{ fontFamily: SANS, fontSize: 28, fontWeight: 800, color: '#94A3B8' }}>→</span>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 12 }}>
        {steps.map((st, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              padding: '10px 12px',
              textAlign: 'center',
              fontFamily: SANS,
              fontSize: 17,
              fontWeight: 700,
              color: '#0F766E',
            }}
          >
            ✓ {st.desc}
          </div>
        ))}
      </div>
    </CleanCardShell>
  );
};

const ErrorFixCard: React.FC<{
  badge: string;
  headline: string;
  items?: CleanUiItem[];
  sceneFrames: number;
}> = ({ badge, headline, items = [], sceneFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step1Enter = spring({ frame: frame - Math.round(sceneFrames * 0.2), fps, config: { damping: 18, stiffness: 150 } });
  const step2Enter = spring({ frame: frame - Math.round(sceneFrames * 0.48), fps, config: { damping: 18, stiffness: 150 } });
  const issueText = items[0]?.desc || headline;
  const fixText = items[1]?.desc || 'Solusi tepat & teruji';

  return (
    <CleanCardShell badge={badge} rightLabel="Contoh">
      <div
        style={{
          backgroundColor: '#FFF7ED',
          border: '1.5px solid #FED7AA',
          borderRadius: 16,
          padding: '18px 22px',
          fontFamily: MONO,
          fontSize: 22,
          color: '#9A3412',
        }}
      >
        ⚠ {issueText}
      </div>
      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          padding: '16px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          opacity: step1Enter,
          transform: `translateY(${(1 - step1Enter) * 14}px)`,
        }}
      >
        <LucideIconResolver name="alert-circle" color="#0F766E" size={30} />
        <span style={{ fontFamily: SANS, fontSize: 22, fontWeight: 700, color: '#1E293B' }}>
          {items[0]?.title || 'Kenali penyebabnya'}
        </span>
      </div>
      <div
        style={{
          backgroundColor: 'rgba(20, 184, 166, 0.10)',
          border: '1.5px solid #0F766E',
          borderRadius: 16,
          padding: '16px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          opacity: step2Enter,
          transform: `translateY(${(1 - step2Enter) * 14}px)`,
        }}
      >
        <LucideIconResolver name="check-circle" color="#0F766E" size={30} />
        <span style={{ fontFamily: SANS, fontSize: 22, fontWeight: 800, color: '#0F766E' }}>
          {fixText}
        </span>
      </div>
    </CleanCardShell>
  );
};

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
  const bookmarkFill = interpolate(frame, [20, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40, padding: '0 64px' }}>
      {visualUrl ? (
        <div style={{ width: 240, height: 240, borderRadius: 28, overflow: 'hidden', border: '2px solid #E2E8F0', boxShadow: '0 20px 44px rgba(15, 23, 42, 0.08)' }}>
          <Img src={visualUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : null}
      <div style={{ fontFamily: SANS, fontSize: 46, fontWeight: 800, color: '#1E293B', textAlign: 'center', lineHeight: 1.35, minHeight: 170 }}>
        {typed}
        <span style={{ color: '#0F766E', opacity: cursorVisible ? 1 : 0 }}>|</span>
      </div>
      <svg width={88} height={88} viewBox="0 0 64 64">
        <path
          d="M18 10 H46 V54 L32 43 L18 54 Z"
          fill={`rgba(15, 118, 110, ${bookmarkFill * 0.22})`}
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
  wordTimings = [],
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const safeScenes = scenes.length
    ? scenes
    : [{ headline: title, subtext: brandName, badge: 'INTRO', durationSec: 5 }];

  const transitionFrames = safeScenes.length > 1 ? 10 : 0;
  const totalOverlap = transitionFrames * (safeScenes.length - 1);
  const rawTotal = durationInFrames + totalOverlap;

  const weights = safeScenes.map((s) =>
    Math.max(15, `${s.headline || ''} ${s.subtext || ''}`.trim().length)
  );
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let cursorFrames = 0;

  return (
    <AbsoluteFill>
      <CleanGridBackdrop brandName={brandName} />

      <TransitionSeries>
        {safeScenes.map((scene, idx) => {
          const ratio = weights[idx] / Math.max(1, totalWeight);
          const sceneFrames =
            idx === safeScenes.length - 1
              ? Math.max(30, rawTotal - cursorFrames)
              : Math.max(30, Math.round(rawTotal * ratio));
          const sceneStartSec = Math.max(0, (cursorFrames - idx * transitionFrames) / Math.max(1, fps));
          const sceneDurationSec = sceneFrames / Math.max(1, fps);
          cursorFrames += sceneFrames;

          const visualUrl = scene.imageUrl || productImageUrl || bgImageUrl;
          const category = scene.category || scene.badge || `POIN ${idx + 1}`;
          const isLast = idx === safeScenes.length - 1 && safeScenes.length > 1;
          const layout =
            scene.cardLayout ||
            (isLast ? 'typewriter_outro' : idx === 0 ? 'hero_visual' : idx === 1 ? 'grid_3' : 'flow_3');

          return (
            <React.Fragment key={idx}>
              <TransitionSeries.Sequence durationInFrames={sceneFrames}>
                <AbsoluteFill
                  style={{
                    padding: '150px 56px 140px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: layout === 'typewriter_outro' ? 'center' : 'space-between',
                  }}
                >
                  {layout === 'typewriter_outro' ? (
                    <TypewriterBookmarkOutro
                      headline={scene.headline}
                      subtext={scene.subtext}
                      visualUrl={visualUrl}
                    />
                  ) : (
                    <>
                      <TwoToneHeadline
                        category={category}
                        headline={scene.headline}
                        highlightHeadline={scene.highlightHeadline}
                      />

                      {layout === 'hero_visual' && (
                        <HeroVisualCard
                          badge={`</> ${category}`}
                          visualUrl={visualUrl}
                          headline={scene.headline}
                          icon={scene.icon}
                          items={scene.items}
                        />
                      )}
                      {layout === 'grid_3' && (
                        <StaggeredGridCard
                          badge={category}
                          visualUrl={visualUrl}
                          icon={scene.icon}
                          subtext={scene.subtext}
                          items={scene.items}
                          sceneFrames={sceneFrames}
                        />
                      )}
                      {layout === 'error_fix' && (
                        <ErrorFixCard
                          badge={category}
                          headline={scene.headline}
                          items={scene.items}
                          sceneFrames={sceneFrames}
                        />
                      )}
                      {(layout === 'flow_3' || !['hero_visual', 'grid_3', 'error_fix'].includes(layout)) && (
                        <FlowDiagramCard
                          badge={category}
                          visualUrl={visualUrl}
                          icon={scene.icon}
                          items={scene.items}
                          sceneFrames={sceneFrames}
                        />
                      )}

                      <HighlightCaption
                        subtext={scene.subtext}
                        highlightWords={scene.highlightWords}
                        tone={idx % 2 === 1 ? 'peach' : 'mint'}
                        sceneStartSec={sceneStartSec}
                        sceneDurationSec={sceneDurationSec}
                        wordTimings={wordTimings}
                      />
                    </>
                  )}
                </AbsoluteFill>
              </TransitionSeries.Sequence>

              {idx < safeScenes.length - 1 ? (
                <TransitionSeries.Transition
                  presentation={idx % 2 === 0 ? fade() : slide({ direction: 'from-bottom' })}
                  timing={linearTiming({ durationInFrames: transitionFrames })}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export default CleanUiMotion;
