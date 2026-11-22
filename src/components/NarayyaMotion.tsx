import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { narayyaTheme } from '../branding/theme';
import { FlowerIcon, SparkleIcon } from '../icons/NarayyaIcons';

export const AnimatedTitle: React.FC<{ title: string; subtitle?: string; accent?: string }> = ({ title, subtitle, accent='BEAUTY TIPS' }) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const enter=spring({frame,fps,config:{damping:16,stiffness:110}});
  return <div style={{textAlign:'center',padding:'0 70px',opacity:interpolate(frame,[0,12],[0,1],{extrapolateRight:'clamp'}),transform:`translateY(${interpolate(enter,[0,1],[55,0])}px)`}}>
    <div style={{fontFamily:narayyaTheme.fonts.body,fontSize:24,letterSpacing:8,color:narayyaTheme.colors.roseGold,fontWeight:600}}>{accent}</div>
    <h1 style={{fontFamily:narayyaTheme.fonts.display,fontSize:82,lineHeight:1.05,fontWeight:400,color:narayyaTheme.colors.deepRose,margin:'22px 0'}}>{title}</h1>
    {subtitle ? <p style={{fontFamily:narayyaTheme.fonts.body,fontSize:32,color:narayyaTheme.colors.cocoa,lineHeight:1.4}}>{subtitle}</p> : null}
  </div>;
};

export const NarayyaLowerThird: React.FC<{ label:string; text:string }> = ({label,text}) => {
 const f=useCurrentFrame(); const x=interpolate(f,[0,12],[90,0],{extrapolateRight:'clamp'});
 return <div style={{position:'absolute',left:64,right:64,bottom:170,transform:`translateX(${x}px)`,background:'rgba(255,248,245,.94)',border:'2px solid '+narayyaTheme.colors.blush,borderRadius:28,padding:'24px 30px',boxShadow:'0 16px 50px rgba(104,71,82,.15)'}}>
  <div style={{fontFamily:narayyaTheme.fonts.body,fontSize:22,letterSpacing:4,color:narayyaTheme.colors.roseGold,fontWeight:600}}>{label}</div>
  <div style={{fontFamily:narayyaTheme.fonts.display,fontSize:38,color:narayyaTheme.colors.deepRose,marginTop:8}}>{text}</div>
 </div>;
};

export const NarayyaProductCard: React.FC<{ title:string; description:string }> = ({title,description}) => (
 <div style={{background:'rgba(255,248,245,.94)',border:'2px solid '+narayyaTheme.colors.blush,borderRadius:36,padding:34,textAlign:'center',boxShadow:'0 25px 70px rgba(104,71,82,.18)'}}>
  <div style={{fontFamily:narayyaTheme.fonts.display,fontSize:48,color:narayyaTheme.colors.deepRose}}>{title}</div>
  <div style={{fontFamily:narayyaTheme.fonts.body,fontSize:25,color:narayyaTheme.colors.cocoa,marginTop:12}}>{description}</div>
 </div>
);

export const NarayyaCTA: React.FC<{ text:string }> = ({text}) => {
 const f=useCurrentFrame(); const pulse=1+Math.sin(f/8)*.025;
 return <div style={{alignSelf:'center',background:narayyaTheme.colors.deepRose,color:'#fff',borderRadius:999,padding:'22px 48px',fontFamily:narayyaTheme.fonts.body,fontSize:27,fontWeight:600,transform:`scale(${pulse})`,boxShadow:'0 12px 35px rgba(104,71,82,.25)'}}>{text}</div>;
};

export const FloatingPetals: React.FC<{ count?:number }> = ({count=9}) => {
 const f=useCurrentFrame();
 return <AbsoluteFill style={{pointerEvents:'none',overflow:'hidden'}}>
  {Array.from({length:count},(_,i)=>{const x=(i*137)%100;const y=((f*(.35+(i%4)*.12)+i*17)%125)-15;const rotate=(f*1.2+i*43)%360;return <div key={i} style={{position:'absolute',left:x+'%',top:y+'%',opacity:.3+(i%3)*.12,transform:`translateX(${Math.sin((f+i*13)/18)*24}px) rotate(${rotate}deg)`}}><FlowerIcon size={24+(i%3)*10} color={i%2?narayyaTheme.colors.blushDeep:narayyaTheme.colors.roseGold}/></div>;})}
 </AbsoluteFill>;
};

export const SparkleOverlay: React.FC = () => {
 const f=useCurrentFrame();
 return <AbsoluteFill style={{pointerEvents:'none'}}>
  {[0,1,2,3,4].map((i)=><div key={i} style={{position:'absolute',left:(12+i*19)+'%',top:(18+(i%3)*24)+'%',opacity:.25+Math.abs(Math.sin((f+i*9)/12))*.65,transform:`scale(${.65+Math.abs(Math.sin((f+i*7)/10))*.65}) rotate(${f+i*20}deg)`}}><SparkleIcon size={30+(i%2)*22}/></div>)}
 </AbsoluteFill>;
};
