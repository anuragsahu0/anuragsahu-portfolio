import React from 'react';
import { Award, Clock } from 'lucide-react';
import { CertificationCard } from './CertificationCard';
import { CERTIFICATIONS_DATA } from '@/data/educationData';
import { GlassCard } from '@/components/ui/GlassCard';

/**
 * CertificationsSection Component
 * Displays certification cards or a polished placeholder card if empty.
 */
export const CertificationsSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 font-mono text-xs font-bold text-nebula-cyan uppercase tracking-wider">
        <Award className="w-4 h-4 text-nebula-cyan" />
        <span>CERTIFICATIONS & CREDENTIALS</span>
      </div>

      {CERTIFICATIONS_DATA.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CERTIFICATIONS_DATA.map((cert) => (
            <CertificationCard key={cert.id} cert={cert} />
          ))}
        </div>
      ) : (
        <GlassCard className="p-6 text-center space-y-2 border-white/10 bg-black/40">
          <Clock className="w-8 h-8 text-nebula-cyan mx-auto animate-pulse" />
          <div className="font-display font-bold text-starlight text-sm">Additional Credentials In Progress</div>
          <p className="text-xs text-muted max-w-md mx-auto font-body">
            Currently working towards industry certifications in PyTorch deep learning and AWS cloud fundamentals.
          </p>
        </GlassCard>
      )}
    </div>
  );
};
