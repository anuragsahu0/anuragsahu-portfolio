import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RoadmapNode } from './RoadmapNode';
import { ROADMAP_PROJECTS, ROADMAP_SUMMARY } from '@/data/roadmapData';
import { GlassCard } from '@/components/ui/GlassCard';
import { GitBranch, Cpu, Clock, CheckCircle2 } from 'lucide-react';

/**
 * RoadmapSection Component
 * Master container for the Engineering & Project Roadmap section.
 */
export const RoadmapSection = () => {
  return (
    <section id="roadmap" className="py-24 relative">
      <div className="w-full max-w-6xl mx-auto px-4 space-y-16">
        
        {/* Section Header */}
        <SectionHeader
          badgeText="ENGINEERING JOURNEY & BUILDS"
          title="Project & Engineering Roadmap"
          subtitle="Explore the active development status of current builds, planned architecture modules, and upcoming system milestones in my engineering pipeline."
        />

        {/* Summary Telemetry Metrics Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <GlassCard className="p-4 space-y-1 bg-black/40 border-white/10">
            <div className="text-dim text-[10px] uppercase font-bold flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-nebula-cyan" />
              <span>Active Builds</span>
            </div>
            <div className="text-2xl font-bold text-starlight">{ROADMAP_SUMMARY.activeBuilds} Project</div>
            <div className="text-[10px] text-emerald-400">🟢 Status: Working</div>
          </GlassCard>

          <GlassCard className="p-4 space-y-1 bg-black/40 border-white/10">
            <div className="text-dim text-[10px] uppercase font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Upcoming Systems</span>
            </div>
            <div className="text-2xl font-bold text-starlight">{ROADMAP_SUMMARY.upcomingProjects} Projects</div>
            <div className="text-[10px] text-amber-400">🟡 Status: Coming Soon</div>
          </GlassCard>

          <GlassCard className="p-4 space-y-1 bg-black/40 border-white/10">
            <div className="text-dim text-[10px] uppercase font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-quantum-violet" />
              <span>Target Release</span>
            </div>
            <div className="text-base font-bold text-starlight truncate">{ROADMAP_SUMMARY.targetQuarter}</div>
            <div className="text-[10px] text-quantum-violet">Production Pipeline</div>
          </GlassCard>

          <GlassCard className="p-4 space-y-1 bg-black/40 border-white/10">
            <div className="text-dim text-[10px] uppercase font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Progress Rate</span>
            </div>
            <div className="text-2xl font-bold text-starlight">{ROADMAP_SUMMARY.completionRate}</div>
            <div className="text-[10px] text-emerald-400">Continuous Sprints</div>
          </GlassCard>
        </div>

        {/* Vertical Timeline Nodes */}
        <div className="relative pt-4">
          {ROADMAP_PROJECTS.map((project, index) => (
            <RoadmapNode
              key={project.id}
              project={project}
              isLast={index === ROADMAP_PROJECTS.length - 1}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
