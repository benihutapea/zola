import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallbackComponent || (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <Card className="p-6 bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/20">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-1 text-red-700 dark:text-red-300">
                  Something went wrong
                </h3>
                
                <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4 max-w-md">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
                
                <Button 
                  variant="outline" 
                  onClick={this.resetErrorBoundary}
                  className="border-red-300 hover:bg-red-100 dark:border-red-700 dark:hover:bg-red-900/40"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try again
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;