import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoggingService } from '@/services/common/LoggingService';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    LoggingService.error("Uncaught Exception in UI", { error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] h-full w-full flex flex-col items-center justify-center bg-slate-950 text-slate-200 p-6 border border-slate-800 rounded-lg">
          <div className="bg-red-500/10 p-4 rounded-full mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-slate-400 text-center max-w-md mb-6">
            An unexpected error occurred in this component. Our team has been notified.
          </p>
          
          {import.meta.env.MODE !== 'production' && this.state.error && (
              <div className="w-full max-w-lg bg-black/50 p-4 rounded border border-slate-800 font-mono text-xs text-red-300 mb-6 overflow-auto max-h-40">
                  {this.state.error.toString()}
              </div>
          )}

          <Button onClick={this.handleReset} variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300">
            <RefreshCw className="w-4 h-4 mr-2" /> Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;