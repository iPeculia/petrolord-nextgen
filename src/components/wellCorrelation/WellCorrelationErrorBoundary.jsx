import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class WellCorrelationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("WellCorrelation Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-slate-950 text-center">
          <div className="bg-red-500/10 p-4 rounded-full mb-6">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-slate-400 max-w-md mb-6">
            The Well Correlation Tool encountered an unexpected error. 
            {this.state.error && <span className="block mt-2 text-xs font-mono bg-slate-900 p-2 rounded text-red-400">{this.state.error.toString()}</span>}
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="border-slate-700 hover:bg-slate-800 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default WellCorrelationErrorBoundary;