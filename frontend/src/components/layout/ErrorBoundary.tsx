import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem("portfolio-chat-history");
    localStorage.removeItem("portfolio-theme");
    localStorage.removeItem("portfolio_chat_session_id");
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-[#0d110f] text-[#8b949e] font-sans">
          <div className="w-full max-w-2xl bg-[#0d110f] border-4 border-[#1a1f1d] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] p-6 md:p-8 flex flex-col space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3 text-red-500">
              <AlertTriangle className="w-8 h-8 flex-none" />
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#f1f5f9]">
                Application Crash Detected
              </h1>
            </div>

            {/* Explainer */}
            <p className="text-sm leading-relaxed">
              A runtime exception crashed the React tree. This is usually caused by connection failures, dynamic import issues, or local storage corruption in your development/local environment.
            </p>

            {/* Error Details */}
            <div className="bg-[#161b22] border-2 border-[#1a1f1d] p-4 font-mono text-xs overflow-auto max-h-60 custom-scrollbar space-y-2">
              <div className="text-red-400 font-bold">
                {this.state.error?.name}: {this.state.error?.message}
              </div>
              {this.state.error?.stack && (
                <pre className="text-text-muted leading-tight whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-3 bg-[#60a5fa] text-white border-2 border-[#1a1f1d] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-0 active:translate-x-0 transition-all font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 text-black"
              >
                <RefreshCw className="w-4 h-4 animate-spin-reverse" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-3 bg-red-500/10 border-2 border-red-500/30 hover:border-red-500 text-red-400 font-bold uppercase tracking-widest text-xs hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-0 active:translate-x-0 transition-all shadow-[4px_4px_0px_0px_rgba(239,68,68,0.1)]"
              >
                Reset Local Storage & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
