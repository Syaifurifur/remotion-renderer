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
import { BarChartAnim } from './components/bar-chart-anim/BarChartAnim';
import { BounceInHeadline } from './components/bounce-in-headline/BounceInHeadline';
import { ChapterTitle } from './components/chapter-title/ChapterTitle';
import { CleanUiMotion } from './components/clean-ui-motion/CleanUiMotion';
import { EditorialMotion } from './components/editorial-motion/EditorialMotion';
import { EndCard } from './components/end-card/EndCard';
import { GlitchText } from './components/glitch-text/GlitchText';
import { GradientTextSweep } from './components/gradient-text-sweep/GradientTextSweep';
import { KineticWordStack } from './components/kinetic-word-stack/KineticWordStack';
import { KpiCounter } from './components/kpi-counter/KpiCounter';
import { NeonSign } from './components/neon-sign/NeonSign';
import { SocialReel } from './components/social-reel/SocialReel';
import { TextMaskReveal } from './components/text-mask-reveal/TextMaskReveal';

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
  bgmUrl?: string;
  productImageUrl?: string;
  bgImageUrl?: string;
  branding?: BrandingConfig;
  templateStyle?: string;
  fps: number;
  durationInFrames: number;
  scenes: SceneItem[];
}

function splitToWords(text: string, maxItems = 4): string[] {
  const words = String(text || '')
    .trim()
    .replace(/[!?.]+$/g, '')
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return ['REVEAL', 'NOW'];
  if (words.length <= maxItems) return words;
  const perGroup = Math.ceil(words.length / maxItems);
  const grouped: string[] = [];
  for (let i = 0; i < words.length; i += perGroup) {
    grouped.push(words.slice(i, i + perGroup).join(' '));
  }
  return grouped.slice(0, maxItems);
}

/**
 * Top Visual & Icon Showcase Overlay:
 * Displays the AI-generated visual thumbnail, the contextual BeautyIcon medallion,
 * and the scene badge in the top safe zone without blocking the center standard Remotion template.
 */
const TopVisualAndIconSupport: React.FC<{
  scene: SceneItem;
  index: number;
  total: number;
  accentColor: string;
  visualUrl?: string;
  brandName?: string;
}> = ({ scene, index, total, accentColor, visualUrl, brandName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 15, stiffness: 140 } });
  const floatY = Math.sin(frame / 16) * 6;
  const iconType = resolveIconCategory(scene.icon, scene.badge, scene.headline);

  return (
    <div
      style={{
        position: 'absolute',
        top: 86,
        left: 56,
        right: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        opacity: enter,
        transform: `translateY(${(1 - enter) * -24}px)`,
        pointerEvents: 'none',
      }}
    >
      {/* Left: Brand + Icon Medallion + Scene Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: 'rgba(10, 15, 29, 0.82)',
          border: `1.5px solid ${accentColor}`,
          borderRadius: 28,
          padding: '14px 24px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
        }}
      >
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateY(${floatY}px)`,
            boxShadow: `0 0 24px ${accentColor}66`,
          }}
        >
          <BeautyIcon type={iconType} primaryColor="#e11d74" accentColor={accentColor} size={42} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {brandName ? (
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: accentColor,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {brandName}
            </span>
          ) : null}
          <span
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {scene.badge || `SCENE ${index + 1}/${total}`}
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            ICON: {iconType.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Right: Framed AI Image / Product Visual Card */}
      {visualUrl ? (
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: 30,
            overflow: 'hidden',
            border: `2.5px solid ${accentColor}`,
            boxShadow: `0 20px 50px rgba(0,0,0,0.65), 0 0 30px ${accentColor}44`,
            transform: `translateY(${-floatY}px)`,
            background: '#0f172a',
          }}
        >
          <Img src={visualUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : null}
    </div>
  );
};

/**
 * Bottom Synchronized Voiceover Subtitle & Infographic Data Card:
 * Guarantees that the spoken headline + subtext are always legible and synchronized with the audio,
 * accompanied by an animated infographic metric strip (progress, rating, highlight bar).
 */
const BottomInfographicAndVoiceSync: React.FC<{
  scene: SceneItem;
  index: number;
  total: number;
  accentColor: string;
}> = ({ scene, index, total, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame: frame - 4, fps, config: { damping: 16, stiffness: 120 } });
  const sceneProgress = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const stepPct = Math.round(((index + 1) / Math.max(1, total)) * 100);
  const scorePct = 88 + ((index * 3) % 11);
  const iconType = resolveIconCategory(scene.icon, scene.badge, scene.headline);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 74,
        left: 56,
        right: 56,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 26}px)`,
        pointerEvents: 'none',
      }}
    >
      {/* Synchronized Spoken Typography Card (Headline + Subtext) */}
      <div
        style={{
          background: 'rgba(8, 12, 24, 0.86)',
          border: '1.5px solid rgba(255,255,255,0.18)',
          borderRadius: 28,
          padding: '22px 30px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.65)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: accentColor,
              letterSpacing: '0.03em',
            }}
          >
            {scene.headline}
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: '#e2e8f0',
              background: 'rgba(255,255,255,0.1)',
              padding: '4px 14px',
              borderRadius: 999,
            }}
          >
            {index + 1} / {total}
          </span>
        </div>

        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: '#f8fafc',
            lineHeight: 1.38,
          }}
        >
          {scene.subtext}
        </div>

        {/* Live Voiceover Progress Bar inside the subtitle card */}
        <div
          style={{
            width: '100%',
            height: 6,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.14)',
            overflow: 'hidden',
            marginTop: 4,
          }}
        >
          <div
            style={{
              width: `${sceneProgress * 100}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${accentColor}, #ffffff)`,
              borderRadius: 999,
            }}
          />
        </div>
      </div>

      {/* 3-Column Infographic Summary Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.84)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 20,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <BeautyIcon type={iconType} primaryColor={accentColor} accentColor="#ffffff" size={34} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 700 }}>TAHAP INFO</span>
            <span style={{ fontSize: 22, color: '#ffffff', fontWeight: 900 }}>{stepPct}%</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.84)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 20,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <BeautyIcon type="commerce" primaryColor="#22c55e" accentColor="#ffffff" size={34} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 700 }}>EFEKTIVITAS</span>
            <span style={{ fontSize: 22, color: '#22c55e', fontWeight: 900 }}>{scorePct}%</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.84)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 20,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <BeautyIcon type="social" primaryColor="#f43f5e" accentColor="#ffffff" size={34} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 700 }}>REKOMENDASI</span>
            <span style={{ fontSize: 22, color: '#f43f5e', fontWeight: 900 }}>★ 4.9/5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StandardSceneTemplate: React.FC<{
  styleId: string;
  scene: SceneItem;
  allScenes: SceneItem[];
  index: number;
  total: number;
  sceneFrames: number;
  fps: number;
  themeColor: string;
  bgImageUrl?: string;
  productImageUrl?: string;
  branding?: BrandingConfig;
}> = ({
  styleId,
  scene,
  allScenes,
  index,
  total,
  sceneFrames,
  fps,
  themeColor,
  bgImageUrl,
  productImageUrl,
  branding,
}) => {
  const frame = useCurrentFrame();
  const accent = branding?.accent || themeColor || '#22d3ee';
  const badge = scene.badge || `SCENE ${index + 1}`;
  const headline = String(scene.headline || 'HIGHLIGHT').trim();
  const subtext = String(scene.subtext || branding?.tagline || '').trim();
  const activeVisual = scene.imageUrl || productImageUrl || bgImageUrl;

  const kbScale = interpolate(frame, [0, Math.max(1, sceneFrames)], [1.0, 1.1], {
    extrapolateRight: 'clamp',
  });

  // Mix of standard Remotion templates (including Infographic KpiCounter / BarChartAnim)
  let resolvedStyle = styleId;
  if (styleId === 'luxury-editorial' || styleId === 'standard-mix' || !styleId) {
    if (index === total - 1 && total > 1) {
      resolvedStyle = 'end-card';
    } else if (index === 2 || (total >= 3 && index === total - 2)) {
      resolvedStyle = 'kpi-counter';
    } else {
      const cycle = ['gradient-text-sweep', 'chapter-title', 'text-mask-reveal', 'kinetic-word-stack'];
      resolvedStyle = cycle[index % cycle.length];
    }
  }

  let centerTemplate: React.ReactNode = null;

  switch (resolvedStyle) {
    case 'kinetic-word-stack':
      centerTemplate = (
        <KineticWordStack
          backgroundColor="rgba(5, 8, 24, 0.68)"
          accentColor="#22d3ee"
          textColor="#ecfeff"
          words={splitToWords(headline, 4)}
        />
      );
      break;

    case 'text-mask-reveal':
      centerTemplate = (
        <TextMaskReveal
          backgroundColor="rgba(5, 8, 24, 0.68)"
          accentColor={accent}
          textColor="#ecfeff"
          lines={splitToWords(headline, 3)}
        />
      );
      break;

    case 'gradient-text-sweep':
      centerTemplate = (
        <GradientTextSweep
          backgroundColor="rgba(5, 8, 24, 0.68)"
          accentColor={accent}
          textColor="#ecfeff"
          headline={headline}
          subline={badge}
        />
      );
      break;

    case 'neon-sign':
      centerTemplate = (
        <NeonSign
          backgroundColor="rgba(8, 0, 16, 0.70)"
          neonColor="#f0abfc"
          glowColor="#c026d3"
          flickerColor="#e879f9"
          frameColor="#3f3f46"
          textColor="#fae8ff"
          subColor="#f0abfc"
          signText={splitToWords(headline, 2).join(' ').toUpperCase()}
          subText={badge}
        />
      );
      break;

    case 'glitch-text': {
      const words = splitToWords(headline, 2).join(' ').toUpperCase();
      const dynamicFont = Math.max(48, Math.min(108, Math.floor(860 / Math.max(6, words.length))));
      centerTemplate = (
        <GlitchText
          text={words}
          glitchColor="#FFFFFF"
          intensity={0.8}
          backgroundColor="rgba(10, 10, 15, 0.72)"
          fontSize={dynamicFont}
          duration={Math.max(2, sceneFrames / Math.max(1, fps))}
        />
      );
      break;
    }

    case 'bounce-in-headline':
      centerTemplate = (
        <BounceInHeadline
          headline={splitToWords(headline, 2).join(' ')}
          background="rgba(17, 24, 39, 0.68)"
          color="#fbbf24"
          bounces={3}
          height={110}
          delay={6}
          duration={32}
        />
      );
      break;

    case 'kpi-counter':
      centerTemplate = (
        <KpiCounter
          backgroundColor="rgba(15, 23, 42, 0.72)"
          cardColor="#1e293b"
          textColor="#f8fafc"
          subtextColor="#94a3b8"
          accentColor={accent}
          title={headline}
          subtitle={badge}
          metrics={allScenes.slice(0, 4).map((sc, i) => ({
            label: sc.badge || `POIN ${i + 1}`,
            value: [98, 95, 92, 100][i % 4],
            prefix: i === 1 ? '+' : '',
            suffix: '%',
            decimals: 0,
            color: ['#22c55e', '#38bdf8', '#f59e0b', '#ec4899'][i % 4],
            icon: ['★', '↑', '✓', '♥'][i % 4],
          }))}
        />
      );
      break;

    case 'bar-chart-anim':
      centerTemplate = (
        <BarChartAnim
          title={headline}
          subtitle={badge}
          background="rgba(15, 23, 42, 0.72)"
          titleColor="#ffffff"
          accentColor={accent}
          bars={allScenes.slice(0, 4).map((sc, i) => ({
            label: (sc.badge || `P${i + 1}`).slice(0, 10),
            value: [75, 88, 94, 100][i % 4],
            color: ['#60a5fa', '#34d399', '#fbbf24', '#f472b6'][i % 4],
          }))}
        />
      );
      break;

    case 'end-card':
      centerTemplate = (
        <EndCard
          title={headline}
          subtitle={badge}
          ctaText={branding?.name || 'Follow Sekarang'}
          background="rgba(11, 31, 58, 0.70)"
          titleColor="#ffffff"
          accentColor="#d4af37"
        />
      );
      break;

    case 'chapter-title':
    default:
      centerTemplate = (
        <ChapterTitle
          chapterLabel={badge}
          title={headline}
          subtitle={branding?.tagline || ''}
          background="rgba(13, 17, 23, 0.68)"
          chapterColor="#d4af37"
          titleColor="#ffffff"
        />
      );
      break;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#050818', overflow: 'hidden' }}>
      {/* AI Background Image Layer */}
      {activeVisual ? (
        <AbsoluteFill style={{ opacity: 0.55, overflow: 'hidden' }}>
          <Img
            src={activeVisual}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${kbScale})`,
            }}
          />
        </AbsoluteFill>
      ) : null}

      {/* Standard Remotion Template Layer */}
      {centerTemplate}

      {/* Top Support: Visual Thumbnail + BeautyIcon Medallion + Scene Badge */}
      <TopVisualAndIconSupport
        scene={scene}
        index={index}
        total={total}
        accentColor={accent}
        visualUrl={activeVisual}
        brandName={branding?.name}
      />

      {/* Bottom Support: Synchronized Voiceover Subtitle + 3-Col Infographic Strip */}
      <BottomInfographicAndVoiceSync
        scene={scene}
        index={index}
        total={total}
        accentColor={accent}
      />
    </AbsoluteFill>
  );
};

export const MotionGraphic: React.FC<MotionGraphicProps> = ({
  title,
  themeColor = '#22d3ee',
  audioUrl,
  bgmUrl,
  productImageUrl,
  bgImageUrl,
  branding,
  templateStyle = 'social-reel',
  fps = 24,
  durationInFrames,
  scenes = [],
}) => {
  const frame = useCurrentFrame();
  const outroLiftStart = Math.max(0, durationInFrames - fps * 4);
  const bgmVolume = interpolate(frame, [outroLiftStart, durationInFrames], [0.12, 0.24], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const safeScenes = scenes.length
    ? scenes
    : [
        {
          headline: title,
          subtext: branding?.tagline || 'Standard Remotion Template',
          badge: 'SCENE 1',
          durationSec: 5,
        },
      ];

  // If templateStyle is 'clean-ui-motion', render the H2BY.STUDIO Clean UI Motion skill template + ducked ambient BGM
  if (templateStyle === 'clean-ui-motion') {
    return (
      <AbsoluteFill>
        <CleanUiMotion
          title={title}
          brandName={branding?.name || 'NARAYYA BEAUTY'}
          tagline={branding?.tagline}
          bgImageUrl={bgImageUrl}
          productImageUrl={productImageUrl}
          scenes={safeScenes}
        />
        {bgmUrl ? <Audio src={bgmUrl} volume={bgmVolume} loop /> : null}
        {audioUrl ? <Audio src={audioUrl} /> : null}
      </AbsoluteFill>
    );
  }

  // If templateStyle is 'editorial-motion', render the Warm Paper Editorial Motion skill template
  if (templateStyle === 'editorial-motion') {
    return (
      <AbsoluteFill>
        <EditorialMotion
          title={title}
          brandName={branding?.name || 'NARAYYA BEAUTY'}
          tagline={branding?.tagline}
          accentColor={branding?.accent || themeColor}
          bgImageUrl={bgImageUrl}
          productImageUrl={productImageUrl}
          scenes={safeScenes}
        />
        {audioUrl ? <Audio src={audioUrl} /> : null}
      </AbsoluteFill>
    );
  }

  // If templateStyle is 'social-reel', render the genuine SocialReel template with full scene sync + images + icons + infographic bar
  if (templateStyle === 'social-reel') {
    const s0 = safeScenes[0] || { headline: title, subtext: '' };
    const s1 = safeScenes[1] || s0;
    const s2 = safeScenes[2] || s1;
    const s3 = safeScenes[3] || s2;
    const hWords = String(s0.headline || title).trim().split(/\s+/);
    const mid = Math.ceil(hWords.length / 2);
    const headlineTop = hWords.slice(0, mid).join(' ') || title;
    const headlineAccent = hWords.slice(mid).join(' ') || s0.badge || 'NOW!';

    const infoLines = [s2.headline, s2.subtext, s1.subtext]
      .map((line) => String(line || '').trim())
      .filter(Boolean)
      .slice(0, 3);

    return (
      <AbsoluteFill>
        <SocialReel
          brandName={branding?.name || 'NARAYYA BEAUTY'}
          handle={`@${String(branding?.name || 'narayyabeauty').toLowerCase().replace(/[^a-z0-9]/g, '')}`}
          headline={headlineTop}
          headlineAccent={headlineAccent}
          secondCopy={`${s1.headline}\n${s1.subtext || ''}`.trim()}
          infoLines={infoLines.length ? infoLines : [title, branding?.tagline || 'Follow for more']}
          ctaText={s3.badge || 'Follow Sekarang →'}
          accentColor="#ff3b7f"
          bgFrom="#1a1a2e"
          bgVia="#16213e"
          bgTo="#0f3460"
          caption={`${title} #narayyabeauty #reels`}
          likeCount="12.4K"
          bgImageUrl={bgImageUrl || productImageUrl}
          scenes={safeScenes}
        />
        {audioUrl ? <Audio src={audioUrl} /> : null}
      </AbsoluteFill>
    );
  }

  // Weight each scene's duration by its spoken character count (headline + subtext)
  // so scene switches match the spoken voiceover audio timing!
  const sceneWeights = safeScenes.map((s) =>
    Math.max(15, `${s.headline || ''} ${s.subtext || ''}`.trim().length)
  );
  const totalWeight = sceneWeights.reduce((acc, w) => acc + w, 0);
  let cursorFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#050818' }}>
      {safeScenes.map((scene, idx) => {
        const ratio = sceneWeights[idx] / Math.max(1, totalWeight);
        const sceneFrames =
          idx === safeScenes.length - 1
            ? Math.max(24, durationInFrames - cursorFrame)
            : Math.max(24, Math.round(durationInFrames * ratio));
        const from = cursorFrame;
        cursorFrame += sceneFrames;

        return (
          <Sequence key={idx} from={from} durationInFrames={sceneFrames}>
            <StandardSceneTemplate
              styleId={templateStyle}
              scene={scene}
              allScenes={safeScenes}
              index={idx}
              total={safeScenes.length}
              sceneFrames={sceneFrames}
              fps={fps}
              themeColor={themeColor}
              bgImageUrl={bgImageUrl}
              productImageUrl={productImageUrl}
              branding={branding}
            />
          </Sequence>
        );
      })}
      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  );
};
