import React from 'react';
import { FileText, Download, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { RESUME_METADATA } from '@/data/contactData';

/**
 * ResumeCard Component
 * Displays a PDF metadata preview card with 1-click ATS resume download.
 */
export const ResumeCard = () => {
  return (
    <GlassCard className="p-6 space-y-4 border-white/10 hover:border-nebula-cyan/40 transition-colors">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs">
        <span className="flex items-center gap-1.5 font-bold text-starlight">
          <FileText className="w-4 h-4 text-nebula-cyan" />
          <span>{RESUME_METADATA.version}</span>
        </span>
        <span className="text-dim text-[11px]">{RESUME_METADATA.lastUpdated}</span>
      </div>

      <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted">Filename:</span>
          <span className="text-starlight font-semibold text-[11px] truncate max-w-[200px]">{RESUME_METADATA.filename}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">File Format & Size:</span>
          <span className="text-nebula-cyan font-bold">PDF ({RESUME_METADATA.size})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Parsing Compatibility:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% ATS Ready
          </span>
        </div>
      </div>

      <MagneticButton className="w-full">
        <PrimaryButton
          onClick={() => window.open(RESUME_METADATA.url, '_blank')}
          className="w-full justify-center"
          aria-label="Download ATS-Optimized Resume PDF"
        >
          <Download className="w-4 h-4" />
          <span>Download Resume PDF</span>
        </PrimaryButton>
      </MagneticButton>
    </GlassCard>
  );
};
