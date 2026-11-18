import React from 'react';
import { Composition } from 'remotion';
import { MotionGraphic, MotionGraphicProps } from './MotionGraphic';

const defaultProps: MotionGraphicProps = {
  title: 'Tips UTBK-SNBT 2026',
  themeColor: '#0b63ce',
  audioUrl: '',
  fps: 30,
  durationInFrames: 900,
  scenes: [
    {
      headline: 'Strategi Skor IRT Tinggi',
      subtext: 'Fokus kuasai soal penalaran dengan tingkat akurasi konsisten.',
      badge: 'HOOK',
      durationSec: 5,
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
  );
};
