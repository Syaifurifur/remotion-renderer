import React from 'react';
import { Composition } from 'remotion';
import { NarayyaBeauty, NarayyaBeautyProps } from './NarayyaBeauty';

const defaultProps: NarayyaBeautyProps = {
  title: 'Rahasia Kulit Glowing',
  themeColor: '#F4C6D7',
  audioUrl: '',
  productImageUrl: '',
  bgImageUrl: '',
  fps: 24,
  durationInFrames: 1440,
  scenes: [
    {
      badge: 'BEAUTY TIPS',
      headline: 'Kulit Glowing Dimulai dari Rutinitas',
      subtext: 'Kenali kebutuhan kulitmu dan rawat dengan konsisten.',
      durationSec: 8,
    },
    {
      badge: 'DAILY RITUAL',
      headline: 'Pilih Perawatan yang Tepat',
      subtext: 'Bangun rutinitas sederhana yang nyaman untuk kulit.',
      durationSec: 8,
    },
  ],
  branding: {
    brandName: 'NARAYYA BEAUTY',
    tagline: 'Glow beautifully, every day',
  },
};

export const NarayyaComposition: React.FC = () => (
  <Composition<NarayyaBeautyProps>
    id="NarayyaBeauty"
    component={NarayyaBeauty}
    durationInFrames={1440}
    fps={24}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => ({
      durationInFrames: Math.max(72, props.durationInFrames || 1440),
      fps: props.fps || 24,
    })}
  />
);
