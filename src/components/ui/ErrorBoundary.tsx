import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    FallbackComponent?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { 
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { 
            hasError: true,
            error 
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    resetErrorBoundary = () => {
        this.setState({ 
            hasError: false,
            error: null 
        });
    };

    render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.FallbackComponent) {
                return <this.props.FallbackComponent 
                    error={this.state.error} 
                    resetErrorBoundary={this.resetErrorBoundary} 
                />;
            }
            return (
                <div className="p-4 text-red-500">
                    <h2>Something went wrong.</h2>
                    <button 
                        onClick={this.resetErrorBoundary}
                        className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded"
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;