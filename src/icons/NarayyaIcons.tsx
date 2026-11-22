import React from 'react';
import { narayyaTheme } from '../branding/theme';

type IconProps = { size?: number; color?: string; strokeWidth?: number; style?: React.CSSProperties };
const Base: React.FC<IconProps & { children: React.ReactNode }> = ({ size=64, color=narayyaTheme.colors.roseGold, strokeWidth=2, style, children }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">{children}</svg>
);
export const SparkleIcon: React.FC<IconProps> = (p) => <Base {...p}><path d="M50 8 58 39 89 50 58 61 50 92 42 61 11 50 42 39Z"/><path d="m82 8 3 11 11 3-11 3-3 11-3-11-11-3 11-3Z"/></Base>;
export const HeartIcon: React.FC<IconProps> = (p) => <Base {...p}><path d="M50 84 16 51C-1 31 25 8 44 25l6 7 6-7c19-17 45 6 28 26Z"/></Base>;
export const FlowerIcon: React.FC<IconProps> = (p) => <Base {...p}><path d="M50 48C28 20 50 5 58 28c23-16 35 8 12 22 27 15 9 37-12 19-8 27-33 18-20-7-28 1-31-26-5-25Z"/><circle cx="50" cy="50" r="8"/></Base>;
export const SerumIcon: React.FC<IconProps> = (p) => <Base {...p}><path d="M40 12h20v14H40zM44 26v13L29 55v29h42V55L56 39V26"/><path d="M31 64h38M44 52c7-6 12-6 18 0"/></Base>;
export const ShoppingBagIcon: React.FC<IconProps> = (p) => <Base {...p}><path d="M20 35h60l-5 53H25Z"/><path d="M36 38V28a14 14 0 0 1 28 0v10"/></Base>;
export const ButterflyIcon: React.FC<IconProps> = (p) => <Base {...p}><path d="M50 48C25 10 5 22 18 51c8 17 22 13 32-3Zm0 0c25-38 45-26 32 3-8 17-22 13-32-3Zm0 0v39M50 35c-9-16-19-17-22-14m22 14c9-16 19-17 22-14"/></Base>;
