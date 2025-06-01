
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <div className="text-center p-8 bg-gray-900 rounded-lg border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-4">
                Etwas ist schiefgelaufen
              </h2>
              <p className="text-gray-400 mb-6">
                Bitte laden Sie die Seite neu oder versuchen Sie es später erneut.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Seite neu laden
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
