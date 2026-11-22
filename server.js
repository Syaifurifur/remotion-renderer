const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');

const app = express();
app.use(express.json({ limit: '50mb' }));

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`).replace(/\/+$/, '');
const OUTPUT_DIR = path.join(__dirname, 'outputs');
const ASSETS_DIR = path.join(OUTPUT_DIR, 'assets');
const WORK_DIR = path.join(__dirname, 'work');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(ASSETS_DIR, { recursive: true });
fs.mkdirSync(WORK_DIR, { recursive: true });

app.use('/outputs', express.static(OUTPUT_DIR));

let bundleLocationPromise = null;
function getBundleLocation() {
  if (!bundleLocationPromise) {
    bundleLocationPromise = bundle({
      entryPoint: path.join(__dirname, 'src', 'index.ts'),
    });
  }
  return bundleLocationPromise;
}

function writeImageFile(jobId, suffix, imageBase64, imageMimeType) {
  if (!imageBase64) return '';
  const mime = String(imageMimeType || 'image/jpeg').toLowerCase();
  const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
  const filename = `${jobId}_${suffix}.${ext}`;
  const outPath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(outPath, Buffer.from(imageBase64, 'base64'));
  return `http://127.0.0.1:${PORT}/outputs/${filename}`;
}

function writeAndConvertAudio(jobId, audioBase64, audioMimeType) {
  if (!audioBase64) return { audioFile: null, durationSec: 20 };

  const rawBuf = Buffer.from(audioBase64, 'base64');
  const mp3Path = path.join(OUTPUT_DIR, `${jobId}.mp3`);
  const mime = String(audioMimeType || '').toLowerCase();

  if (mime.includes('l16') || mime.includes('pcm')) {
    const rateMatch = mime.match(/rate=(\d+)/);
    const sampleRate = rateMatch ? rateMatch[1] : '24000';
    const pcmPath = path.join(WORK_DIR, `${jobId}.pcm`);
    fs.writeFileSync(pcmPath, rawBuf);
    execFileSync('ffmpeg', [
      '-y',
      '-f', 's16le',
      '-ar', sampleRate,
      '-ac', '1',
      '-i', pcmPath,
      '-codec:a', 'libmp3lame',
      '-b:a', '192k',
      mp3Path,
    ]);
    fs.unlinkSync(pcmPath);
  } else {
    const rawExt = mime.includes('wav') ? 'wav' : mime.includes('ogg') ? 'ogg' : 'mp3';
    const tmpAudio = path.join(WORK_DIR, `${jobId}.${rawExt}`);
    fs.writeFileSync(tmpAudio, rawBuf);
    execFileSync('ffmpeg', ['-y', '-i', tmpAudio, '-codec:a', 'libmp3lame', '-b:a', '192k', mp3Path]);
    fs.unlinkSync(tmpAudio);
  }

  const probe = execFileSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    mp3Path,
  ]).toString().trim();

  const durationSec = Math.max(5, Math.ceil(parseFloat(probe) || 20));
  return { audioFile: mp3Path, durationSec };
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'remotion-renderer' });
});

app.get('/templates', (_req, res) => {
  res.json({
    presets: [
      { id: 'editorial-motion', label: '✨ Editorial Motion (Paper Grid)', compositionId: 'MotionGraphic' },
      { id: 'social-reel', label: '📱 Social Reel Frame', compositionId: 'MotionGraphic' },
      { id: 'kinetic-word-stack', label: '⚡ Kinetic Word Stack', compositionId: 'MotionGraphic' },
      { id: 'neon-sign', label: '💡 Neon Glow Promo', compositionId: 'MotionGraphic' },
      { id: 'glitch-text', label: '🔥 Glitch Dynamic', compositionId: 'MotionGraphic' },
      { id: 'community-chat', label: '💬 Chat Conversation (9:16)', compositionId: 'community-chat' },
    ],
    totalCompositions: 51,
  });
});

app.post('/assets/upload', (req, res) => {
  try {
    const { imageBase64, mimeType, filename } = req.body || {};
    if (!imageBase64) {
      return res.status(400).json({ ok: false, error: 'imageBase64 is required' });
    }
    const mime = String(mimeType || 'image/jpeg').toLowerCase();
    const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
    const safeBase = String(filename || `asset_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`)
      .replace(/[^a-zA-Z0-9_-]/g, '');
    const outName = `${safeBase}.${ext}`;
    const outPath = path.join(ASSETS_DIR, outName);
    fs.writeFileSync(outPath, Buffer.from(imageBase64, 'base64'));
    return res.json({
      ok: true,
      filename: outName,
      localUrl: `http://127.0.0.1:${PORT}/outputs/assets/${outName}`,
      publicUrl: `${PUBLIC_BASE_URL}/outputs/assets/${outName}`,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/jobs/pending', (req, res) => {
  const jobId = String(req.body.jobId || `job_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '');
  const metaPath = path.join(OUTPUT_DIR, `${jobId}.pending.json`);
  fs.writeFileSync(metaPath, JSON.stringify({ ...req.body, jobId }, null, 2));
  res.json({ ok: true, jobId });
});

app.get('/jobs/pending/:jobId', (req, res) => {
  const metaPath = path.join(OUTPUT_DIR, `${req.params.jobId}.pending.json`);
  if (!fs.existsSync(metaPath)) {
    return res.status(404).json({ error: 'Pending job not found' });
  }
  return res.json(JSON.parse(fs.readFileSync(metaPath, 'utf8')));
});

app.get('/jobs/:jobId', (req, res) => {
  const metaPath = path.join(OUTPUT_DIR, `${req.params.jobId}.json`);
  if (!fs.existsSync(metaPath)) {
    return res.status(404).json({ error: 'Job not found' });
  }
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  return res.json(meta);
});

app.post('/render', async (req, res) => {
  const jobId = String(req.body.jobId || `job_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '');
  const title = String(req.body.title || 'Tryout League');
  const caption = String(req.body.caption || '');
  const themeColor = String(req.body.themeColor || '#0b63ce');
  const branding = req.body.branding && typeof req.body.branding === 'object' ? req.body.branding : undefined;
  const compositionId = String(req.body.compositionId || 'MotionGraphic');
  const templateStyle = String(req.body.templateStyle || 'luxury-editorial');
  const scenes = Array.isArray(req.body.scenes) ? req.body.scenes : [];
  const audioBase64 = req.body.audioBase64 || '';
  const audioMimeType = req.body.audioMimeType || 'audio/L16;rate=24000';
  const productImageBase64 = req.body.productImageBase64 || '';
  const productImageMimeType = req.body.productImageMimeType || 'image/jpeg';
  const bgImageBase64 = req.body.bgImageBase64 || '';
  const bgImageMimeType = req.body.bgImageMimeType || 'image/png';

  try {
    const { audioFile, durationSec } = writeAndConvertAudio(jobId, audioBase64, audioMimeType);
    const productImageUrl = writeImageFile(jobId, 'product', productImageBase64, productImageMimeType);
    const bgImageUrl = writeImageFile(jobId, 'bg', bgImageBase64, bgImageMimeType);
    const preparedScenes = scenes.map((scene, idx) => {
      const next = { ...scene };
      if (next.imageBase64) {
        next.imageUrl = writeImageFile(jobId, `scene_${idx}`, next.imageBase64, next.imageMimeType || 'image/png');
        delete next.imageBase64;
        delete next.imageMimeType;
      } else if (next.imageUrl && String(next.imageUrl).includes('/outputs/')) {
        const relMatch = String(next.imageUrl).match(/\/outputs\/.+$/);
        if (relMatch) {
          next.imageUrl = `http://127.0.0.1:${PORT}${relMatch[0]}`;
        }
      }
      return next;
    });
    const fps = 24;
    const durationInFrames = Math.max(72, durationSec * fps);
    const audioUrl = audioFile ? `http://127.0.0.1:${PORT}/outputs/${jobId}.mp3` : '';
    const browserExecutable = fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined;

    console.log(`[${jobId}] Starting render (${compositionId}/${templateStyle}, ${durationSec}s, ${durationInFrames} frames, scenes=${preparedScenes.length}, browser=${browserExecutable || 'default'})`);
    const serveUrl = await getBundleLocation();
    const inputProps = compositionId === 'MotionGraphic'
      ? { title, themeColor, audioUrl, productImageUrl, bgImageUrl, branding, templateStyle, fps, durationInFrames, scenes: preparedScenes }
      : { ...(req.body.props || {}), title, headline: title };

    const composition = await selectComposition({
      serveUrl,
      id: compositionId,
      inputProps,
      browserExecutable,
    });

    const outMp4 = path.join(OUTPUT_DIR, `${jobId}.mp4`);
    let lastPct = -1;
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation: outMp4,
      inputProps,
      browserExecutable,
      concurrency: 2,
      chromiumOptions: {
        headless: 'new',
        gl: 'swiftshader',
      },
      onProgress: ({ progress }) => {
        const pct = Math.floor(progress * 5) * 20;
        if (pct > lastPct) {
          lastPct = pct;
          console.log(`[${jobId}] Render progress: ${pct}%`);
        }
      },
    });
    console.log(`[${jobId}] Render complete -> ${outMp4}`);

    const videoUrl = `${PUBLIC_BASE_URL}/outputs/${jobId}.mp4`;
    const meta = { ok: true, jobId, title, caption, videoUrl, durationSec };
    fs.writeFileSync(path.join(OUTPUT_DIR, `${jobId}.json`), JSON.stringify(meta, null, 2));

    res.json(meta);
  } catch (err) {
    console.error('Render error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

function writeAssSubtitles(jobId, scenes, totalDurationSec) {
  const assPath = path.join(WORK_DIR, `${jobId}.ass`);
  const safeScenes = scenes.length
    ? scenes
    : [{ badge: 'PROMO', headline: 'Rekomendasi Produk', subtext: 'Cek link di bio sekarang!', durationSec: totalDurationSec }];
  const sumSec = safeScenes.reduce((acc, s) => acc + Math.max(2, Number(s.durationSec) || 5), 0);

  const fmtTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = (sec % 60).toFixed(2).padStart(5, '0');
    return `${h}:${String(m).padStart(2, '0')}:${s}`;
  };

  let events = '';
  let cursor = 0;
  safeScenes.forEach((sc, idx) => {
    const ratio = Math.max(2, Number(sc.durationSec) || 5) / Math.max(1, sumSec);
    const dur = idx === safeScenes.length - 1 ? Math.max(2, totalDurationSec - cursor) : Math.max(2, totalDurationSec * ratio);
    const start = fmtTime(cursor);
    const end = fmtTime(cursor + dur);
    cursor += dur;

    const clean = (txt) => String(txt || '').replace(/[\r\n]+/g, ' ').replace(/[{}]/g, '');
    const badge = clean(sc.badge || `POIN ${idx + 1}`).toUpperCase();
    const headline = clean(sc.headline);
    const subtext = clean(sc.subtext);

    events += `Dialogue: 0,${start},${end},Badge,,0,0,0,,{\\fad(180,180)}${badge}\n`;
    events += `Dialogue: 0,${start},${end},Headline,,0,0,0,,{\\fad(200,180)}${headline}\\N{\\rSubtext}${subtext}\n`;
  });

  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Badge,Liberation Sans,34,&H00FFFFFF,&H000000FF,&H00CE630B,&H80000000,-1,0,0,0,100,100,2,0,3,10,0,8,60,60,110,1
Style: Headline,Liberation Sans,64,&H00FFFFFF,&H000000FF,&H00000000,&H99000000,-1,0,0,0,100,100,0,0,1,4,3,2,70,70,150,1
Style: Subtext,Liberation Sans,38,&H00E2E8F0,&H000000FF,&H00000000,&H80000000,0,0,0,0,100,100,0,0,1,3,2,2,70,70,150,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${events}`;

  fs.writeFileSync(assPath, header, 'utf8');
  return assPath;
}

app.post('/render-ffmpeg', async (req, res) => {
  const startedAt = Date.now();
  const jobId = String(req.body.jobId || `ff_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '');
  const title = String(req.body.title || 'Promo Produk Affiliate');
  const caption = String(req.body.caption || '');
  const scenes = Array.isArray(req.body.scenes) ? req.body.scenes : [];
  const audioBase64 = req.body.audioBase64 || '';
  const audioMimeType = req.body.audioMimeType || 'audio/L16;rate=24000';
  const productImageBase64 = req.body.productImageBase64 || '';
  const productImageMimeType = req.body.productImageMimeType || 'image/jpeg';

  try {
    const { audioFile, durationSec } = writeAndConvertAudio(jobId, audioBase64, audioMimeType);
    const fallbackImgPath = productImageBase64
      ? path.join(OUTPUT_DIR, `${jobId}_product.${String(productImageMimeType).includes('png') ? 'png' : 'jpg'}`)
      : null;
    if (fallbackImgPath) {
      fs.writeFileSync(fallbackImgPath, Buffer.from(productImageBase64, 'base64'));
    }

    const safeScenes = scenes.length
      ? scenes
      : [{ badge: 'PROMO', headline: title, subtext: 'Cek link produk sekarang!', durationSec, motion: 'zoomIn' }];

    const sumSec = safeScenes.reduce((acc, s) => acc + Math.max(2, Number(s.durationSec) || 5), 0);
    const fps = 24;
    const xfadeDur = 0.5;
    const clipPaths = [];
    const clipDurations = [];
    let cursor = 0;

    for (let i = 0; i < safeScenes.length; i++) {
      const sc = safeScenes[i];
      const ratio = Math.max(2, Number(sc.durationSec) || 5) / Math.max(1, sumSec);
      const baseDur = i === safeScenes.length - 1 ? Math.max(2, durationSec - cursor) : Math.max(2, durationSec * ratio);
      cursor += baseDur;
      const clipDur = baseDur + (i < safeScenes.length - 1 ? xfadeDur : 0);
      clipDurations.push(clipDur);

      let imgPath = fallbackImgPath;
      if (sc.imageBase64) {
        const ext = String(sc.imageMimeType || 'image/png').includes('png') ? 'png' : 'jpg';
        imgPath = path.join(WORK_DIR, `${jobId}_sc_${i}.${ext}`);
        fs.writeFileSync(imgPath, Buffer.from(sc.imageBase64, 'base64'));
      }
      if (!imgPath) {
        throw new Error(`No image provided for scene ${i}`);
      }

      const frames = Math.max(24, Math.round(clipDur * fps));
      const motion = sc.motion || ['zoomIn', 'panRight', 'zoomOut', 'panLeft'][i % 4];
      let zpExpr = `zoompan=z='min(zoom+0.0012,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=${fps}`;
      if (motion === 'zoomOut') {
        zpExpr = `zoompan=z='if(lte(zoom,1.0),1.15,max(1.001,zoom-0.0012))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=${fps}`;
      } else if (motion === 'panRight') {
        zpExpr = `zoompan=z='1.12':x='(iw-iw/zoom)*(on/${frames})':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=${fps}`;
      } else if (motion === 'panLeft') {
        zpExpr = `zoompan=z='1.12':x='(iw-iw/zoom)*(1-on/${frames})':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=${fps}`;
      }

      const clipPath = path.join(WORK_DIR, `${jobId}_clip_${i}.mp4`);
      execFileSync('ffmpeg', [
        '-y',
        '-loop', '1',
        '-i', imgPath,
        '-vf', `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,${zpExpr},format=yuv420p`,
        '-t', clipDur.toFixed(2),
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-pix_fmt', 'yuv420p',
        clipPath,
      ]);
      clipPaths.push(clipPath);
    }

    const assPath = writeAssSubtitles(jobId, safeScenes, durationSec);
    const outMp4 = path.join(OUTPUT_DIR, `${jobId}.mp4`);

    const ffArgs = ['-y'];
    clipPaths.forEach((cp) => ffArgs.push('-i', cp));
    if (audioFile) {
      ffArgs.push('-i', audioFile);
    }

    const transitions = ['fade', 'slideleft', 'smoothleft', 'wipeleft'];
    let filterComplex = '';
    if (clipPaths.length === 1) {
      filterComplex = `[0:v]drawbox=x=0:y=ih*0.72:w=iw:h=ih*0.28:color=black@0.55:t=fill,ass='${assPath.replace(/\\/g, '/')}'[vout]`;
    } else {
      let prevLabel = '0:v';
      let offset = clipDurations[0] - xfadeDur;
      for (let i = 1; i < clipPaths.length; i++) {
        const nextLabel = i === clipPaths.length - 1 ? 'vmerged' : `vx${i}`;
        const tr = transitions[(i - 1) % transitions.length];
        filterComplex += `[${prevLabel}][${i}:v]xfade=transition=${tr}:duration=${xfadeDur}:offset=${offset.toFixed(2)}[${nextLabel}];`;
        prevLabel = nextLabel;
        offset += clipDurations[i] - xfadeDur;
      }
      filterComplex += `[vmerged]drawbox=x=0:y=ih*0.72:w=iw:h=ih*0.28:color=black@0.55:t=fill,ass='${assPath.replace(/\\/g, '/')}'[vout]`;
    }

    ffArgs.push('-filter_complex', filterComplex, '-map', '[vout]');
    if (audioFile) {
      ffArgs.push('-map', `${clipPaths.length}:a`, '-c:a', 'aac', '-b:a', '192k', '-shortest');
    }
    ffArgs.push('-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outMp4);

    execFileSync('ffmpeg', ffArgs);

    clipPaths.forEach((cp) => fs.existsSync(cp) && fs.unlinkSync(cp));
    if (fs.existsSync(assPath)) fs.unlinkSync(assPath);

    const renderTimeSec = Number(((Date.now() - startedAt) / 1000).toFixed(2));
    const videoUrl = `${PUBLIC_BASE_URL}/outputs/${jobId}.mp4`;
    const meta = { ok: true, engine: 'ffmpeg', jobId, title, caption, videoUrl, durationSec, renderTimeSec };
    fs.writeFileSync(path.join(OUTPUT_DIR, `${jobId}.json`), JSON.stringify(meta, null, 2));
    console.log(`[${jobId}] FFmpeg render complete in ${renderTimeSec}s -> ${outMp4}`);

    res.json(meta);
  } catch (err) {
    console.error('FFmpeg render error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Remotion renderer listening on port ${PORT}`);
  getBundleLocation().catch((err) => console.error('Pre-bundle warning:', err));
});
