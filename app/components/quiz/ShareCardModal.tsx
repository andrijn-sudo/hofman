import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Share2, MessageCircle, Check, Sparkles } from 'lucide-react';
import type { TestResult } from '~/types/quiz';
import { getRelationshipArchetype, type RelationshipArchetype } from '~/data/archetypes';
import { CATEGORIES_META } from '~/data/questions';

interface ShareCardModalProps {
  isOpen: boolean;
  result: TestResult;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ isOpen, result, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [partnerCopied, setPartnerCopied] = useState(false);
  const [imageGenerated, setImageGenerated] = useState<string | null>(null);

  const archetype: RelationshipArchetype = getRelationshipArchetype(result);

  // Render high-resolution Story Card on off-screen Canvas
  useEffect(() => {
    if (!isOpen) return;

    const renderCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // High resolution (800 x 1100 px)
      const w = 800;
      const h = 1100;
      canvas.width = w;
      canvas.height = h;

      // 1. Deep Obsidian Space Background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      // 2. Dual Glow Orbs: Emerald (top-left) and Crimson (bottom-right)
      const greenGlow = ctx.createRadialGradient(180, 260, 20, 180, 260, 360);
      greenGlow.addColorStop(0, '#10b98135');
      greenGlow.addColorStop(1, '#090d1600');
      ctx.fillStyle = greenGlow;
      ctx.fillRect(0, 0, w, h);

      const redGlow = ctx.createRadialGradient(620, 520, 20, 620, 520, 380);
      redGlow.addColorStop(0, '#f43f5e30');
      redGlow.addColorStop(1, '#090d1600');
      ctx.fillStyle = redGlow;
      ctx.fillRect(0, 0, w, h);

      // 3. Card Border
      ctx.strokeStyle = '#ffffff18';
      ctx.lineWidth = 3;
      ctx.roundRect(24, 24, w - 48, h - 48, 40);
      ctx.stroke();

      // 4. Header Badge (Green-Red accent)
      ctx.fillStyle = '#ffffff15';
      ctx.roundRect(w / 2 - 140, 60, 280, 38, 19);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px Inter, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '2px';
      ctx.fillText('GOTTMAN LAB • БАЛАНС ПАРИ', w / 2, 84);

      // 5. Archetype Title & Emoji
      ctx.font = '56px Inter, -apple-system, sans-serif';
      ctx.fillText(archetype.emoji, w / 2, 160);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Inter, -apple-system, sans-serif';
      ctx.fillText(archetype.name, w / 2, 215);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 17px Inter, -apple-system, sans-serif';
      ctx.fillText(archetype.tagline, w / 2, 248);

      // 6. Draw Radar Web Pentagon Chart
      const centerX = w / 2;
      const centerY = 490;
      const maxR = 165;
      const categories = [
        'contempt',
        'stonewalling',
        'positiveBalance',
        'loveMaps',
        'criticism',
      ] as const;
      const totalAxes = categories.length;

      // Concentric grid webs
      [0.25, 0.5, 0.75, 1.0].forEach((lvl) => {
        ctx.beginPath();
        categories.forEach((_, i) => {
          const angle = (i * 2 * Math.PI) / totalAxes - Math.PI / 2;
          const x = centerX + maxR * lvl * Math.cos(angle);
          const y = centerY + maxR * lvl * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.strokeStyle = lvl === 1.0 ? '#10b98140' : '#ffffff12';
        ctx.lineWidth = lvl === 1.0 ? 2 : 1;
        ctx.stroke();
      });

      // Radial Axis lines
      categories.forEach((_, i) => {
        const angle = (i * 2 * Math.PI) / totalAxes - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + maxR * Math.cos(angle), centerY + maxR * Math.sin(angle));
        ctx.strokeStyle = '#ffffff18';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Data filled polygon with Green-to-Red gradient
      ctx.beginPath();
      categories.forEach((catKey, i) => {
        const cat = result.categoryBreakdown[catKey];
        const pct = Math.max(15, cat ? cat.percentage : 15);
        const angle = (i * 2 * Math.PI) / totalAxes - Math.PI / 2;
        const r = (pct / 100) * maxR;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();

      // Polygon Green-to-Red gradient fill
      const polyGrad = ctx.createLinearGradient(
        centerX - maxR,
        centerY + maxR,
        centerX + maxR,
        centerY - maxR
      );
      polyGrad.addColorStop(0, '#10b981a0'); // Emerald
      polyGrad.addColorStop(0.5, '#05966980');
      polyGrad.addColorStop(1, '#f43f5ea0'); // Crimson
      ctx.fillStyle = polyGrad;
      ctx.fill();

      // Glowing Stroke
      const strokeGrad = ctx.createLinearGradient(
        centerX - maxR,
        centerY + maxR,
        centerX + maxR,
        centerY - maxR
      );
      strokeGrad.addColorStop(0, '#10b981');
      strokeGrad.addColorStop(1, '#f43f5e');
      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Node dots & labels
      categories.forEach((catKey, i) => {
        const cat = result.categoryBreakdown[catKey];
        const meta = CATEGORIES_META[catKey];
        const pct = cat ? cat.percentage : 0;
        const angle = (i * 2 * Math.PI) / totalAxes - Math.PI / 2;
        const r = (Math.max(15, pct) / 100) * maxR;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);

        const isGreenZone = catKey === 'loveMaps' || catKey === 'positiveBalance';

        // Dot
        ctx.beginPath();
        ctx.arc(x, y, 6.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = isGreenZone ? '#10b981' : '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Label
        const labelR = maxR + 42;
        const lx = centerX + labelR * Math.cos(angle);
        const ly = centerY + labelR * Math.sin(angle);

        ctx.fillStyle = isGreenZone ? '#6ee7b7' : '#fda4af';
        ctx.font = 'bold 15px Inter, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${meta?.shortName} ${pct}%`, lx, ly);
      });

      // Center circle indicator
      ctx.beginPath();
      ctx.arc(centerX, centerY, 28, 0, 2 * Math.PI);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#10b98150';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Inter, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${archetype.harmonyPercentage}%`, centerX, centerY + 5);

      // 7. Stat Pill Boxes (Emerald Green Harmony vs Crimson Red Risk)
      const pillY = 745;

      // Left Pill: РІВЕНЬ ГАРМОНІЇ (Emerald)
      ctx.fillStyle = '#064e3b35';
      ctx.roundRect(60, pillY, 320, 105, 24);
      ctx.fill();
      ctx.strokeStyle = '#10b98140';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#6ee7b7';
      ctx.font = '600 13px Inter, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('РІВЕНЬ ГАРМОНІЇ', 84, pillY + 36);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 36px Inter, -apple-system, sans-serif';
      ctx.fillText(`${archetype.harmonyPercentage}%`, 84, pillY + 78);

      // Right Pill: РИЗИК КРИЗИ (Crimson/Rose)
      ctx.fillStyle = '#88133735';
      ctx.roundRect(420, pillY, 320, 105, 24);
      ctx.fill();
      ctx.strokeStyle = '#f43f5e40';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#fda4af';
      ctx.font = '600 13px Inter, -apple-system, sans-serif';
      ctx.fillText('РИЗИК КРИЗИ', 444, pillY + 36);

      ctx.fillStyle =
        result.overallRiskPercentage >= 60
          ? '#f43f5e'
          : result.overallRiskPercentage >= 30
            ? '#fb923c'
            : '#34d399';
      ctx.font = 'bold 36px Inter, -apple-system, sans-serif';
      ctx.fillText(`${result.overallRiskPercentage}%`, 444, pillY + 78);

      // 8. Description quote
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'italic 16px Inter, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`«${archetype.vibe}»`, w / 2, 900);

      // 9. Call to action footer
      ctx.fillStyle = '#10b98118';
      ctx.roundRect(80, 950, w - 160, 62, 31);
      ctx.fill();
      ctx.strokeStyle = '#10b98160';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 16px Inter, -apple-system, sans-serif';
      ctx.fillText('Пройди безкоштовно ➔ gottman-test.app', w / 2, 988);

      try {
        const dataUrl = canvas.toDataURL('image/png');
        setImageGenerated(dataUrl);
      } catch {
        // Ignored
      }
    };

    const timer = setTimeout(renderCanvas, 80);
    return () => clearTimeout(timer);
  }, [isOpen, archetype, result]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    setIsGenerating(true);
    try {
      const link = document.createElement('a');
      link.download = `gottman-${archetype.id}-card.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    } catch {
      // Ignored
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNativeShare = async () => {
    if (!canvasRef.current) return;
    setIsGenerating(true);

    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `gottman-couple-card.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Наш архетип пари: ${archetype.name}`,
            text: `Пройшов(-ла) тест Ґоттмана! Наш архетип: ${archetype.name} (${archetype.harmonyPercentage}% гармонії). Перевір свою пару:`,
            url: window.location.href,
            files: [file],
          });
        } else {
          handleDownload();
        }
        setIsGenerating(false);
      }, 'image/png');
    } catch {
      handleDownload();
      setIsGenerating(false);
    }
  };

  const handleSendToPartner = async () => {
    const text = `Привіт! Я щойно пройшов(-ла) науковий тест Ґоттмана на міцність нашої пари 👀\nВийшов архетип: «${archetype.name}» (${archetype.harmonyPercentage}% гармонії).\n\nТвоя черга пройти, порівняємо результати! 👉 ${window.location.href}`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setPartnerCopied(true);
      setTimeout(() => setPartnerCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm max-h-[96vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Картка для Stories
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
          <canvas ref={canvasRef} className="hidden" />

          {imageGenerated ? (
            <img
              src={imageGenerated}
              alt="Story Card Preview"
              className="w-full max-w-[280px] rounded-2xl shadow-xl border border-white/10"
            />
          ) : (
            <div className="w-full max-w-[280px] aspect-[9/13] rounded-2xl bg-slate-800/60 animate-pulse flex items-center justify-center text-xs text-slate-400">
              Генерація картки...
            </div>
          )}
        </div>

        {/* Bottom Actions (Emerald Share + Crimson Partner challenge) */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/80">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleNativeShare}
              disabled={isGenerating}
              className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Поділитися</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating}
              className="py-3 px-3 rounded-2xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span>Зберегти PNG</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSendToPartner}
            className="w-full py-2.5 px-3 rounded-2xl border border-rose-500/40 bg-rose-950/30 hover:bg-rose-950/50 active:scale-95 text-rose-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {partnerCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Текст для партнера скопійовано!</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Надіслати партнеру виклик 💬</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
