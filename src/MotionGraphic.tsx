import React from 'react';
import { AbsoluteFill, Audio, Sequence } from 'remotion';
import { BounceInHeadline } from './components/bounce-in-headline/BounceInHeadline';
import { ChapterTitle } from './components/chapter-title/ChapterTitle';
import { EndCard } from './components/end-card/EndCard';
import { GlitchText } from './components/glitch-text/GlitchText';
import { GradientTextSweep } from './components/gradient-text-sweep/GradientTextSweep';
import { KineticWordStack } from './components/kinetic-word-stack/KineticWordStack';
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

const StandardSceneTemplate: React.FC<{
  styleId: string;
  scene: SceneItem;
  index: number;
  total: number;
  sceneFrames: number;
  fps: number;
  themeColor: string;
  branding?: BrandingConfig;
}> = ({ styleId, scene, index, total, sceneFrames, fps, themeColor, branding }) => {
  const accent = branding?.accent || themeColor || '#22d3ee';
  const badge = scene.badge || `SCENE ${index + 1}`;
  const headline = String(scene.headline || 'HIGHLIGHT').trim();
  const subtext = String(scene.subtext || branding?.tagline || '').trim();

  // Mix of standard Remotion templates when 'luxury-editorial' or 'standard-mix' is selected
  let resolvedStyle = styleId;
  if (styleId === 'luxury-editorial' || styleId === 'standard-mix' || !styleId) {
    if (index === total - 1 && total > 1) {
      resolvedStyle = 'end-card';
    } else {
      const cycle = ['gradient-text-sweep', 'chapter-title', 'text-mask-reveal', 'kinetic-word-stack'];
      resolvedStyle = cycle[index % cycle.length];
    }
  }

  switch (resolvedStyle) {
    case 'kinetic-word-stack':
      return (
        <KineticWordStack
          backgroundColor="#050818"
          accentColor="#22d3ee"
          textColor="#ecfeff"
          words={splitToWords(headline, 4)}
        />
      );

    case 'text-mask-reveal':
      return (
        <TextMaskReveal
          backgroundColor="#050818"
          accentColor={accent}
          textColor="#ecfeff"
          lines={splitToWords(headline, 3)}
        />
      );

    case 'gradient-text-sweep':
      return (
        <GradientTextSweep
          backgroundColor="#050818"
          accentColor={accent}
          textColor="#ecfeff"
          headline={headline}
          subline={subtext || badge}
        />
      );

    case 'neon-sign':
      return (
        <NeonSign
          backgroundColor="#080010"
          neonColor="#f0abfc"
          glowColor="#c026d3"
          flickerColor="#e879f9"
          frameColor="#3f3f46"
          textColor="#fae8ff"
          subColor="#f0abfc"
          signText={splitToWords(headline, 2).join(' ').toUpperCase()}
          subText={subtext || badge}
        />
      );

    case 'glitch-text': {
      const words = splitToWords(headline, 2).join(' ').toUpperCase();
      const dynamicFont = Math.max(48, Math.min(110, Math.floor(860 / Math.max(6, words.length))));
      return (
        <GlitchText
          text={words}
          glitchColor="#FFFFFF"
          intensity={0.8}
          backgroundColor="#0A0A0F"
          fontSize={dynamicFont}
          duration={Math.max(2, sceneFrames / Math.max(1, fps))}
        />
      );
    }

    case 'bounce-in-headline':
      return (
        <BounceInHeadline
          headline={splitToWords(headline, 2).join(' ')}
          background="#111827"
          color="#fbbf24"
          bounces={3}
          height={110}
          delay={6}
          duration={32}
        />
      );

    case 'end-card':
      return (
        <EndCard
          title={headline}
          subtitle={subtext || branding?.tagline || 'LEARN MORE'}
          ctaText={badge || branding?.name || 'Follow Now'}
          background="#0b1f3a"
          titleColor="#ffffff"
          accentColor="#d4af37"
        />
      );

    case 'chapter-title':
    default:
      return (
        <ChapterTitle
          chapterLabel={badge}
          title={headline}
          subtitle={subtext}
          background="#0d1117"
          chapterColor="#d4af37"
          titleColor="#ffffff"
        />
      );
  }
};

export const MotionGraphic: React.FC<MotionGraphicProps> = ({
  title,
  themeColor = '#22d3ee',
  audioUrl,
  branding,
  templateStyle = 'social-reel',
  fps = 24,
  durationInFrames,
  scenes = [],
}) => {
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

  // If templateStyle is 'social-reel', render the genuine SocialReel standard template directly
  if (templateStyle === 'social-reel') {
    const s0 = safeScenes[0] || { headline: title, subtext: '' };
    const s1 = safeScenes[1] || s0;
    const s2 = safeScenes[2] || s1;
    const s3 = safeScenes[3] || s2;
    const hWords = String(s0.headline || title).trim().split(/\s+/);
    const mid = Math.ceil(hWords.length / 2);
    const headlineTop = hWords.slice(0, mid).join(' ') || title;
    const headlineAccent = hWords.slice(mid).join(' ') || s0.badge || 'NOW!';

    const infoLines = [
      s2.headline,
      s2.subtext,
      s1.subtext,
    ]
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
          ctaText={s3.headline || s3.badge || 'Check Now →'}
          accentColor="#ff3b7f"
          bgFrom="#1a1a2e"
          bgVia="#16213e"
          bgTo="#0f3460"
          caption={`${title} #remotion #reels`}
          likeCount="12.4K"
        />
        {audioUrl ? <Audio src={audioUrl} /> : null}
      </AbsoluteFill>
    );
  }

  const totalSceneSec = safeScenes.reduce((acc, s) => acc + Math.max(2, Number(s.durationSec) || 5), 0);
  let cursorFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#050818' }}>
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
            <StandardSceneTemplate
              styleId={templateStyle}
              scene={scene}
              index={idx}
              total={safeScenes.length}
              sceneFrames={sceneFrames}
              fps={fps}
              themeColor={themeColor}
              branding={branding}
            />
          </Sequence>
        );
      })}
      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  );
};
