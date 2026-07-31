import React, { Component } from 'react';

/**
 * Global React Error Boundary Component
 * Catches JavaScript errors anywhere in child component tree and renders a zero-gravity recovery fallback UI.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log error to telemetry service in production
    console.error('[ErrorBoundary Captured Error]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-space-black text-starlight flex items-center justify-center p-6 font-body">
          <div className="glass-panel max-w-lg w-full p-8 rounded-2xl border border-red-500/30 shadow-2xl text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xl">
              ⚠️
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display heading-gradient">
                System Anomaly Intercepted
              </h2>
              <p className="text-sm text-gray-400">
                A telemetry render error occurred within the zero-gravity component tree.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-black/50 p-4 rounded-lg text-left text-xs font-mono text-red-300 overflow-x-auto border border-red-500/20 max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex gap-4 justify-center pt-2">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono border border-white/10 transition-all"
              >
                Attempt Recovery
              </button>
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-nebula-cyan to-quantum-violet text-xs font-mono font-semibold text-white hover:opacity-90 transition-all shadow-cyanGlow"
              >
                Reload Telemetry
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
