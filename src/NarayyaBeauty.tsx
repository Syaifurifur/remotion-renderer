import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { NarayyaFonts } from './branding/fonts';
import { narayyaTheme, NarayyaBranding } from './branding/theme';
import { AnimatedTitle, FloatingPetals, NarayyaCTA, NarayyaLowerThird, NarayyaProductCard, SparkleOverlay } from './components/NarayyaMotion';

type Scene = { headline:string; subtext?:string; badge?:string; durationSec?:number; imageUrl?:string; showProduct?:boolean };
export type NarayyaBeautyProps = {
 title:string; themeColor?:string; audioUrl?:string; productImageUrl?:string; bgImageUrl?:string;
 fps?:number; durationInFrames:number; scenes:Scene[]; branding?:NarayyaBranding;
};
export const NarayyaBeauty: React.FC<NarayyaBeautyProps> = ({title, audioUrl, productImageUrl, bgImageUrl, durationInFrames, scenes=[], branding={}}) => {
 const frame=useCurrentFrame();
 const primary=branding.primaryColor||narayyaTheme.colors.blush;
 const accent=branding.accentColor||narayyaTheme.colors.roseGold;
 const safe=scenes.length?scenes:[{headline:title,subtext:'Temukan rahasia kulit sehat dan bercahaya',badge:'BEAUTY TIPS',durationSec:6}];
 const total=safe.reduce((a,s)=>a+Math.max(2,Number(s.durationSec)||5),0);
 let cursor=0;
 return <AbsoluteFill style={{background:'linear-gradient(155deg,#FFF8F5 0%,#FCE8EF 52%,#F7DCE6 100%)',fontFamily:narayyaTheme.fonts.body,color:narayyaTheme.colors.deepRose,overflow:'hidden'}}>
  <NarayyaFonts/>
  {bgImageUrl?<AbsoluteFill style={{opacity:.13}}><Img src={bgImageUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/></AbsoluteFill>:null}
  <div style={{position:'absolute',inset:28,border:'2px solid '+primary,borderRadius:48,pointerEvents:'none'}}/>
  <div style={{position:'absolute',top:72,left:0,right:0,textAlign:'center',fontFamily:narayyaTheme.fonts.script,fontSize:58,color:accent}}>{branding.brandName||'NARAYYA BEAUTY'}</div>
  {safe.map((scene,i)=>{const dur=Math.max(2,Number(scene.durationSec)||5);const frames=i===safe.length-1?Math.max(24,durationInFrames-cursor):Math.max(24,Math.round(durationInFrames*dur/total));const from=cursor;cursor+=frames;return <Sequence key={i} from={from} durationInFrames={frames}>
   <NarayyaScene scene={scene} index={i} total={safe.length} productImageUrl={productImageUrl} primary={primary}/>
  </Sequence>;})}
  <FloatingPetals/><SparkleOverlay/>
  <div style={{position:'absolute',bottom:62,left:0,right:0,textAlign:'center',fontFamily:narayyaTheme.fonts.script,fontSize:42,color:accent}}>{branding.tagline||'Glow beautifully, every day'}</div>
  {audioUrl?<Audio src={audioUrl}/>:null}
 </AbsoluteFill>;
};

const NarayyaScene: React.FC<{scene:Scene;index:number;total:number;productImageUrl?:string;primary:string}> = ({scene,index,total,productImageUrl,primary}) => {
 const f=useCurrentFrame();
 const opacity=interpolate(f,[0,10],[0,1],{extrapolateRight:'clamp'});
 const showProduct=Boolean(productImageUrl)&&scene.showProduct!==false;
 return <AbsoluteFill style={{opacity,justifyContent:'center',alignItems:'center',padding:'190px 72px 220px'}}>
  <div style={{fontFamily:narayyaTheme.fonts.body,fontSize:22,letterSpacing:6,color:narayyaTheme.colors.roseGold,fontWeight:600,marginBottom:30}}>{scene.badge||'BEAUTY JOURNAL'} · {index+1}/{total}</div>
  {scene.imageUrl?<div style={{position:'absolute',inset:0,opacity:.16}}><Img src={scene.imageUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>:null}
  {showProduct?<div style={{width:600,height:660,borderRadius:44,overflow:'hidden',border:'3px solid '+primary,boxShadow:'0 30px 90px rgba(104,71,82,.18)',marginBottom:42}}><Img src={productImageUrl!} style={{width:'100%',height:'100%',objectFit:'contain'}}/></div>:null}
  <AnimatedTitle title={scene.headline} subtitle={scene.subtext}/>
  <div style={{marginTop:42}}><NarayyaCTA text="DISCOVER YOUR GLOW"/></div>
  <NarayyaLowerThird label="NARAYYA BEAUTY" text="Your daily beauty ritual"/>
 </AbsoluteFill>;
};
