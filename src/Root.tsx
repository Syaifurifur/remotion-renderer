import React from 'react';
import { Composition } from 'remotion';
import { MotionGraphic, MotionGraphicProps } from './MotionGraphic';
import { NarayyaComposition } from './NarayyaRoot';

const defaultProps: MotionGraphicProps = {
  title: 'Promo Produk Affiliate',
  themeColor: '#0b63ce',
  audioUrl: '',
  productImageUrl: '',
  bgImageUrl: '',
  fps: 30,
  durationInFrames: 900,
  scenes: [
    {
      headline: 'Produk Wajib Punya!',
      subtext: 'Kualitas terbaik dengan harga promo spesial hari ini.',
      badge: 'HOOK',
      durationSec: 5,
      showProduct: true,
    },
  ],
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MotionGraphic"
      component={MotionGraphic}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
      calculateMetadata={({ props }) => ({
        durationInFrames: Math.max(90, props.durationInFrames || 900),
        fps: props.fps || 30,
      })}
    />
    <NarayyaComposition />
  );
};
