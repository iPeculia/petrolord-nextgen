import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

class WellPlanningErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Well Planning Module Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#0F172A] p-4">
          <Card className="w-full max-w-md bg-[#1E293B] border-red-900/50 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <CardTitle className="text-xl text-white">Module Stability Alert</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-slate-300 text-sm">
                The Well Planning & Design module encountered an unexpected critical error. 
                Our diagnostic systems have logged this event.
              </p>
              
              {this.state.error && (
                <div className="bg-black/30 p-3 rounded text-left overflow-auto max-h-32 border border-slate-800">
                  <code className="text-xs text-red-400 font-mono block">
                    {this.state.error.toString()}
                  </code>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-3 justify-center pt-2">
              <Button 
                variant="outline" 
                onClick={this.handleGoHome}
                className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200"
              >
                <Home className="mr-2 h-4 w-4" /> Dashboard
              </Button>
              <Button 
                onClick={this.handleReset}
                className="bg-red-600 hover:bg-red-700 text-white border-none"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Reload Module
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WellPlanningErrorBoundary;