import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { GradientButton } from './GradientButton.js';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="glass-panel p-8 rounded-2xl max-w-md text-center border-status-danger/30">
            <div className="w-14 h-14 rounded-full bg-status-danger/10 text-status-danger flex items-center justify-center mx-auto mb-4 border border-status-danger/20">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-display font-bold text-text-primary mb-2">
              Telemetry Rendering Interrupted
            </h3>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              An unexpected interface anomaly was detected. The platform safety subsystem has caught the error safely.
            </p>
            <GradientButton
              variant="outline"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
            >
              Reset Interface
            </GradientButton>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
