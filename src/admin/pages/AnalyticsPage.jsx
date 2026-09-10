import { BarChart3, RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { ChartContainer } from '../components/ChartContainer';

export const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Telemetry Analytics"
        description="Comprehensive engagement insights, visitor traffic metrics, and resume access logs."
        badge="Phase 0 Ready"
        actions={
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070B16] border border-slate-800 text-slate-300 hover:text-slate-100 text-xs font-medium transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Telemetry Tracking"
          value="Active"
          trend="up"
          change="Real-Time"
          description="Integrated via privacy-preserving event bus"
          icon={BarChart3}
        />
        <StatCard
          label="Event Storage"
          value="MongoDB"
          description="Encrypted serverless collection"
        />
        <StatCard
          label="API Latency"
          value="< 45ms"
          trend="up"
          change="Optimal"
          description="Edge network response times"
        />
      </div>

      <ChartContainer
        title="Visitor Activity & Traffic Ingestion"
        subtitle="Live production traffic logs will chart dynamically here once Phase 01 telemetry models bind."
      >
        <div className="h-48 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-500">
          Telemetry Chart Container Initialized (Phase 01 Real Ingestion Binding)
        </div>
      </ChartContainer>
    </div>
  );
};
