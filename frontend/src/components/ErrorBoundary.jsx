import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary atrapó un error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6">
          <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 border border-red-100 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Algo salió mal</h2>
            <p className="text-gray-600 mb-6">Detectamos un error inesperado al cargar esta pantalla.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              Volver al Inicio
            </button>
            {this.props.debug && this.state.error && (
              <details className="mt-6 text-left text-xs bg-gray-100 p-3 rounded-lg overflow-auto max-h-40">
                <summary className="text-gray-500 cursor-pointer font-semibold">Detalles técnicos</summary>
                <pre className="mt-2 text-red-600">{this.state.error.toString()}</pre>
                <pre className="mt-2 text-gray-600">{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
