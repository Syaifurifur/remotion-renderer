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
const WORK_DIR = path.join(__dirname, 'work');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
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
  const scenes = Array.isArray(req.body.scenes) ? req.body.scenes : [];
  const audioBase64 = req.body.audioBase64 || '';
  const audioMimeType = req.body.audioMimeType || 'audio/L16;rate=24000';

  try {
    const { audioFile, durationSec } = writeAndConvertAudio(jobId, audioBase64, audioMimeType);
    const fps = 30;
    const durationInFrames = Math.max(90, durationSec * fps);
    const audioUrl = audioFile ? `http://127.0.0.1:${PORT}/outputs/${jobId}.mp3` : '';

    const serveUrl = await getBundleLocation();
    const inputProps = { title, themeColor, audioUrl, fps, durationInFrames, scenes };

    const composition = await selectComposition({
      serveUrl,
      id: 'MotionGraphic',
      inputProps,
    });

    const outMp4 = path.join(OUTPUT_DIR, `${jobId}.mp4`);
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation: outMp4,
      inputProps,
      chromiumOptions: {
        headless: 'new',
      },
    });

    const videoUrl = `${PUBLIC_BASE_URL}/outputs/${jobId}.mp4`;
    const meta = { ok: true, jobId, title, caption, videoUrl, durationSec };
    fs.writeFileSync(path.join(OUTPUT_DIR, `${jobId}.json`), JSON.stringify(meta, null, 2));

    res.json(meta);
  } catch (err) {
    console.error('Render error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Remotion renderer listening on port ${PORT}`);
  getBundleLocation().catch((err) => console.error('Pre-bundle warning:', err));
});
