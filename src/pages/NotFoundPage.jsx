import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { SITE_CONFIG } from '@/constants/config';

/**
 * NotFoundPage (404 Error Page)
 * Displays a zero-gravity 404 error state matching the space obsidian design system.
 */
export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-24 text-center">
      <GlassCard className="max-w-md w-full p-8 space-y-6 border-nebula-cyan/40 shadow-2xl relative">
        <div className="w-16 h-16 rounded-2xl bg-nebula-cyan/10 border border-nebula-cyan/30 flex items-center justify-center mx-auto text-nebula-cyan">
          <AlertCircle className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2 font-mono">
          <span className="text-xs text-nebula-cyan font-bold uppercase tracking-widest">[ ERROR_CODE: 404 ]</span>
          <h1 className="text-3xl font-display font-extrabold text-starlight">Trajectory Lost</h1>
          <p className="text-xs text-muted leading-relaxed font-body">
            The requested telemetry coordinate does not exist in Anurag Sahu's Anti Gravity environment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <MagneticButton className="w-full sm:w-auto">
            <PrimaryButton onClick={() => navigate('/')} className="w-full justify-center">
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </PrimaryButton>
          </MagneticButton>

          <MagneticButton className="w-full sm:w-auto">
            <SecondaryButton onClick={() => navigate(-1)} className="w-full justify-center">
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </SecondaryButton>
          </MagneticButton>
        </div>
      </GlassCard>
    </div>
  );
};
