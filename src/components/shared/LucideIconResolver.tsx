import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Code2,
  Droplets,
  Eye,
  Flame,
  Heart,
  Layers,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Sun,
  Wand2,
  Zap,
} from 'lucide-react';

export const LucideIconResolver: React.FC<{
  name?: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
}> = ({ name = 'sparkles', color = '#0F766E', size = 36, strokeWidth = 2.1 }) => {
  const key = String(name || 'sparkles').toLowerCase().trim();
  const props = { color, size, strokeWidth };

  if (/droplet|serum|toner|water|hydr|lembap/.test(key)) return <Droplets {...props} />;
  if (/sun|uv|spf|sunscreen|bright|cerah/.test(key)) return <Sun {...props} />;
  if (/shield|safe|aman|protect|bpom/.test(key)) return <ShieldCheck {...props} />;
  if (/alert|error|warning|masalah|bahaya/.test(key)) return <AlertCircle {...props} />;
  if (/check|done|ready|hasil|fix|sukses/.test(key)) return <CheckCircle2 {...props} />;
  if (/clock|time|menit|cepat|timing/.test(key)) return <Clock {...props} />;
  if (/code|script|ngoding|editor/.test(key)) return <Code2 {...props} />;
  if (/layer|step|urut|rutin/.test(key)) return <Layers {...props} />;
  if (/leaf|natural|alami|herbal|organic/.test(key)) return <Leaf {...props} />;
  if (/eye|lihat|review|periksa/.test(key)) return <Eye {...props} />;
  if (/heart|love|bestie|suka|fav/.test(key)) return <Heart {...props} />;
  if (/smile|happy|senang|cantik|wajah/.test(key)) return <Smile {...props} />;
  if (/star|rate|best|top/.test(key)) return <Star {...props} />;
  if (/wand|magic|glow|makeup/.test(key)) return <Wand2 {...props} />;
  if (/zap|fast|kilat|energi/.test(key)) return <Zap {...props} />;
  if (/flame|hot|viral|trend/.test(key)) return <Flame {...props} />;
  if (/chat|message|comment|tanya/.test(key)) return <MessageCircle {...props} />;
  return <Sparkles {...props} />;
};
