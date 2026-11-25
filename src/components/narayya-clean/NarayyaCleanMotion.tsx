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
import {
  NARAYYA_COLORS,
  NARAYYA_FONTS,
  NarayyaFontsStyle,
  NarayyaLogo,
  NayaMascot,
  resolveNayaExpression,
} from '../narayya-brand/NarayyaBrandKit';

export type NarayyaItem = {
  title: string;
  desc: string;
  icon?: string;
};

export type NarayyaScene = {
  headline: string;
  subtext: string;
  badge?: string;
  category?: string;
  highlightHeadline?: string;
  highlightWords?: string[];
  cardLayout?: string;
  items?: NarayyaItem[];
  icon?: string;
  imageUrl?: string;
  expression?: string;
  highlight?: string;
  durationSec?: number;
};

export type WordTiming = {
  text: string;
  startSec: number;
  endSec: number;
};

export type NarayyaCleanMotionProps = {
  title: string;
  brandName?: string;
  tagline?: string;
  bgImageUrl?: string;
  productImageUrl?: string;
  scenes: NarayyaScene[];
  wordTimings?: WordTiming[];
};

const NarayyaBackdrop: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NARAYYA_COLORS.blushPetal, overflow: 'hidden' }}>
    <div
      style={{
        position: 'absolute',
        width: 960,
        height: 960,
        top: -220,
        left: -260,
        background: 'radial-gradient(circle, rgba(255,249,245,0.85) 0%, transparent 65%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 940,
        height: 940,
        bottom: -220,
        right: -240,
        background: 'radial-gradient(circle, rgba(227,194,180,0.65) 0%, transparent 65%)',
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage:
          'linear-gradient(rgba(58,30,44,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(58,30,44,0.035) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: 58,
        left: 60,
        right: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <NarayyaLogo size={54} showWordmark={false} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: NARAYYA_FONTS.title, fontSize: 28, fontWeight: 600, color: NARAYYA_COLORS.deepPlum, lineHeight: 1 }}>
            Narayya
          </span>
          <span style={{ fontFamily: NARAYYA_FONTS.body, fontSize: 12, fontWeight: 500, letterSpacing: '0.26em', color: NARAYYA_COLORS.deepPlum }}>
            BEAUTY
          </span>
        </div>
      </div>
      <span style={{ fontFamily: NARAYYA_FONTS.highlight, fontSize: 30, color: NARAYYA_COLORS.roseMauve }}>
        cantik dengan caramu
      </span>
    </div>
    <div
      style={{
        position: 'absolute',
        bottom: 56,
        left: 60,
        right: 60,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span style={{ fontFamily: NARAYYA_FONTS.body, fontSize: 16, fontWeight: 500, letterSpacing: '0.14em', color: NARAYYA_COLORS.deepPlum, opacity: 0.72 }}>
        #NARAYYABEAUTY #GLOWDENGANNARAYYA
      </span>
      <span style={{ fontFamily: NARAYYA_FONTS.body, fontSize: 16, fontWeight: 600, color: NARAYYA_COLORS.roseMauve }}>
        @narayyabeauty
      </span>
    </div>
  </AbsoluteFill>
);

const NarayyaHeadline: React.FC<{
  category: string;
  headline: string;
  highlight?: string;
}> = ({ category, headline, highlight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, stiffness: 140 } });

  const words = String(headline || 'Glow Up Tanpa Ribet').trim().split(/\s+/).filter(Boolean);
  const splitIdx = Math.max(1, words.length - 2);
  const mainText = highlight ? headline : words.slice(0, splitIdx).join(' ');
  const scriptText = highlight || (words.length > 1 ? words.slice(splitIdx).join(' ') : '');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 18}px)`,
        padding: '0 24px',
      }}
    >
      <div
        style={{
          padding: '7px 22px',
          borderRadius: 999,
          backgroundColor: NARAYYA_COLORS.creamPearl,
          border: `1.5px solid ${NARAYYA_COLORS.champagneGold}`,
          fontFamily: NARAYYA_FONTS.body,
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: '0.18em',
          color: NARAYYA_COLORS.deepPlum,
          textTransform: 'uppercase',
        }}
      >
        {category}
      </div>
      <div style={{ fontFamily: NARAYYA_FONTS.title, fontSize: words.length > 5 ? 58 : 68, fontWeight: 600, color: NARAYYA_COLORS.deepPlum, lineHeight: 1.06, textAlign: 'center' }}>
        {mainText}
      </div>
      {scriptText ? (
        <div style={{ fontFamily: NARAYYA_FONTS.highlight, fontSize: 64, color: NARAYYA_COLORS.roseMauve, lineHeight: 1.05, textAlign: 'center', marginTop: -6 }}>
          {scriptText}
        </div>
      ) : null}
    </div>
  );
};

const NarayyaCardShell: React.FC<{ badge: string; children: React.ReactNode }> = ({ badge, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 3, fps, config: { damping: 20, stiffness: 140 } });

  return (
    <div
      style={{
        width: 940,
        backgroundColor: NARAYYA_COLORS.creamPearl,
        borderRadius: 32,
        border: `2px solid ${NARAYYA_COLORS.champagneGold}`,
        boxShadow: '0 22px 54px rgba(58, 30, 44, 0.09)',
        padding: '26px 30px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 18}px)`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            backgroundColor: NARAYYA_COLORS.roseMauve,
            color: NARAYYA_COLORS.creamPearl,
            fontFamily: NARAYYA_FONTS.body,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: '0.08em',
            padding: '7px 18px',
            borderRadius: 999,
            textTransform: 'uppercase',
          }}
        >
          {badge}
        </div>
        <span style={{ fontFamily: NARAYYA_FONTS.body, fontSize: 15, letterSpacing: '0.12em', color: NARAYYA_COLORS.champagneGold, fontWeight: 600 }}>
          NARAYYA BEAUTY
        </span>
      </div>
      {children}
    </div>
  );
};

const NarayyaCaption: React.FC<{
  subtext: string;
  highlightWords?: string[];
  sceneStartSec: number;
  sceneDurationSec: number;
  wordTimings?: WordTiming[];
}> = ({ subtext, highlightWords = [], sceneStartSec, sceneDurationSec, wordTimings = [] }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame: frame - 5, fps, config: { damping: 20, stiffness: 140 } });
  const words = String(subtext || '').trim().split(/\s+/).filter(Boolean);

  const localSec = frame / Math.max(1, fps);
  const globalSec = sceneStartSec + localSec;

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

  return (
    <div style={{ fontFamily: NARAYYA_FONTS.body, fontSize: 32, fontWeight: 500, color: NARAYYA_COLORS.deepPlum, textAlign: 'center', lineHeight: 1.48, padding: '0 36px', opacity: enter }}>
      {words.map((w, i) => {
        const cleanW = w.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isActive = i === activeIdx || (hlSet.has(cleanW) && Math.abs(i - activeIdx) <= 2);
        return (
          <React.Fragment key={i}>
            <span
              style={{
                backgroundColor: isActive ? 'rgba(201, 123, 139, 0.25)' : 'transparent',
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

export const NarayyaCleanMotion: React.FC<NarayyaCleanMotionProps> = ({
  title,
  bgImageUrl,
  productImageUrl,
  scenes = [],
  wordTimings = [],
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const safeScenes = scenes.length
    ? scenes
    : [{ headline: title, subtext: 'Cantik dengan caramu bersama Narayya Beauty.', badge: 'INTRO', durationSec: 5 }];

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
      <NarayyaFontsStyle />
      <NarayyaBackdrop />

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
          const expr = resolveNayaExpression(scene.expression, scene.badge, scene.headline, idx);
          const category = scene.category || scene.badge || (idx === 0 ? 'TUTORIAL' : `TIPS ${idx}`);
          const isLast = idx === safeScenes.length - 1 && safeScenes.length > 1;
          const words = String(scene.subtext || '').split(/\s+/).filter(Boolean);
          const tiles: NarayyaItem[] =
            scene.items && scene.items.length >= 2
              ? scene.items.slice(0, 3)
              : [
                  { title: 'Fokus', desc: words.slice(0, 2).join(' ') || 'Alami', icon: scene.icon || 'sparkles' },
                  { title: 'Lembut', desc: words.slice(2, 4).join(' ') || 'Nyaman', icon: 'droplets' },
                  { title: 'Bestie', desc: 'Tips Naya', icon: 'heart' },
                ];

          return (
            <React.Fragment key={idx}>
              <TransitionSeries.Sequence durationInFrames={sceneFrames}>
                <Audio src={staticFile('audio/sfx/pop.mp3')} volume={0.2} />

                <AbsoluteFill
                  style={{
                    padding: '150px 56px 120px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {isLast ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
                      <NarayyaLogo size={92} showWordmark showTagline />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
                        <NayaMascot expression="senang" width={210} />
                        {visualUrl ? (
                          <div style={{ width: 230, height: 260, borderRadius: 28, overflow: 'hidden', border: `3px solid ${NARAYYA_COLORS.champagneGold}`, boxShadow: '0 20px 44px rgba(58, 30, 44, 0.12)' }}>
                            <Img src={visualUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ) : null}
                      </div>
                      <NarayyaHeadline
                        category={category}
                        headline={scene.headline}
                        highlight={scene.highlight || scene.highlightHeadline || 'Glow on, Cantik!'}
                      />
                      <NarayyaCaption
                        subtext={scene.subtext}
                        highlightWords={scene.highlightWords}
                        sceneStartSec={sceneStartSec}
                        sceneDurationSec={sceneDurationSec}
                        wordTimings={wordTimings}
                      />
                    </div>
                  ) : (
                    <>
                      <NarayyaHeadline
                        category={category}
                        headline={scene.headline}
                        highlight={scene.highlight || scene.highlightHeadline}
                      />

                      <NarayyaCardShell badge={category}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                          <NayaMascot expression={expr} width={200} />

                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {visualUrl ? (
                              <div style={{ width: '100%', height: 230, borderRadius: 22, overflow: 'hidden', border: `2px solid ${NARAYYA_COLORS.softNude}` }}>
                                <Img src={visualUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            ) : null}

                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${tiles.length}, 1fr)`, gap: 10 }}>
                              {tiles.map((t, ti) => (
                                <Sequence key={ti} from={Math.round((ti * 0.22 + 0.05) * sceneFrames)} layout="none">
                                  <div
                                    style={{
                                      backgroundColor: NARAYYA_COLORS.blushPetal,
                                      border: `1px solid ${NARAYYA_COLORS.softNude}`,
                                      borderRadius: 16,
                                      padding: '12px 10px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      gap: 6,
                                    }}
                                  >
                                    <LucideIconResolver name={t.icon || scene.icon} color={NARAYYA_COLORS.roseMauve} size={28} />
                                    <span style={{ fontFamily: NARAYYA_FONTS.body, fontSize: 16, fontWeight: 700, color: NARAYYA_COLORS.deepPlum, textAlign: 'center' }}>
                                      {t.title}
                                    </span>
                                    <span style={{ fontFamily: NARAYYA_FONTS.body, fontSize: 13, color: NARAYYA_COLORS.deepPlum, opacity: 0.78, textAlign: 'center' }}>
                                      {t.desc}
                                    </span>
                                  </div>
                                </Sequence>
                              ))}
                            </div>
                          </div>
                        </div>
                      </NarayyaCardShell>

                      <NarayyaCaption
                        subtext={scene.subtext}
                        highlightWords={scene.highlightWords}
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

export default NarayyaCleanMotion;
