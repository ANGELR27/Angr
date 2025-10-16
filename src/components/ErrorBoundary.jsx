import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Error Boundary para capturar errores de React
 * Evita que toda la aplicación se rompa por un error en un componente
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Actualizar el estado para mostrar la UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Registrar el error en la consola
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Si hay muchos errores seguidos, puede ser un loop infinito
    if (this.state.errorCount > 5) {
      console.error('⚠️ Demasiados errores detectados. Posible loop infinito.');
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{
          backgroundColor: 'var(--theme-background)',
          color: 'var(--theme-text)'
        }}>
          <div className="max-w-2xl w-full rounded-lg p-6" style={{
            backgroundColor: 'var(--theme-background-secondary)',
            border: '1px solid var(--theme-border)',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)'
          }}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-xl font-bold text-red-500">
                  ¡Oops! Algo salió mal
                </h1>
                <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                  Se produjo un error inesperado en la aplicación
                </p>
              </div>
            </div>

            {isDevelopment && error && (
              <div className="mb-4">
                <details className="cursor-pointer">
                  <summary className="font-semibold mb-2 text-orange-400">
                    📋 Detalles del error (modo desarrollo)
                  </summary>
                  <div className="bg-black/30 p-3 rounded text-xs font-mono overflow-auto max-h-60">
                    <div className="text-red-400 mb-2">
                      <strong>Error:</strong> {error.toString()}
                    </div>
                    {errorInfo && (
                      <div className="text-gray-400">
                        <strong>Stack trace:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                <strong>¿Qué puedes hacer?</strong>
              </p>
              <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--theme-text-secondary)' }}>
                <li>Intenta recargar la página</li>
                <li>Verifica tu conexión a internet</li>
                <li>Borra la caché del navegador</li>
                <li>Si el problema persiste, reporta el error</li>
              </ul>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded transition-all"
                style={{
                  backgroundColor: 'var(--theme-primary)',
                  color: 'white'
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Reintentar
              </button>
              <button
                onClick={this.handleReload}
                className="px-4 py-2 rounded transition-all"
                style={{
                  backgroundColor: 'var(--theme-surface)',
                  color: 'var(--theme-text)',
                  border: '1px solid var(--theme-border)'
                }}
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
