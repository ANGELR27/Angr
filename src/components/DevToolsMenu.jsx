import { useState } from 'react';
import { X, Send, FileJson, Copy, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const DevToolsMenu = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('api');
  const [apiUrl, setApiUrl] = useState('');
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonFormatted, setJsonFormatted] = useState('');

  const handleApiTest = async () => {
    if (!apiUrl) return;
    
    setApiLoading(true);
    try {
      const response = await fetch(apiUrl, {
        method: apiMethod,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      setApiResponse({
        status: response.status,
        statusText: response.statusText,
        data: JSON.stringify(data, null, 2)
      });
    } catch (error) {
      setApiResponse({
        status: 'Error',
        statusText: error.message,
        data: null
      });
    } finally {
      setApiLoading(false);
    }
  };

  const handleJsonFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonFormatted(JSON.stringify(parsed, null, 2));
    } catch (error) {
      setJsonFormatted(`Error: ${error.message}`);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-lg shadow-2xl overflow-hidden"
        style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #2a2a2a',
          width: '90%',
          maxWidth: '900px',
          maxHeight: '80vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: '#2a2a2a' }}
        >
          <h2 className="text-lg font-semibold" style={{ color: '#e4e4e7' }}>
            Herramientas de Desarrollador
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: '#71717a' }} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-4 pt-3 border-b" style={{ borderColor: '#2a2a2a' }}>
          <button
            onClick={() => setActiveTab('api')}
            className="px-4 py-2 text-sm font-medium rounded-t-lg transition-all"
            style={{
              backgroundColor: activeTab === 'api' ? '#2a2a2a' : 'transparent',
              color: activeTab === 'api' ? '#60a5fa' : '#71717a',
              borderBottom: activeTab === 'api' ? '2px solid #60a5fa' : 'none'
            }}
          >
            <Send className="w-4 h-4 inline mr-2" />
            API Tester
          </button>
          
          <button
            onClick={() => setActiveTab('json')}
            className="px-4 py-2 text-sm font-medium rounded-t-lg transition-all"
            style={{
              backgroundColor: activeTab === 'json' ? '#2a2a2a' : 'transparent',
              color: activeTab === 'json' ? '#fbbf24' : '#71717a',
              borderBottom: activeTab === 'json' ? '2px solid #fbbf24' : 'none'
            }}
          >
            <FileJson className="w-4 h-4 inline mr-2" />
            JSON Formatter
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <select
                  value={apiMethod}
                  onChange={(e) => setApiMethod(e.target.value)}
                  className="px-3 py-2 rounded text-sm font-medium"
                  style={{
                    backgroundColor: '#2a2a2a',
                    color: '#e4e4e7',
                    border: '1px solid #3f3f46'
                  }}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>

                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://api.example.com/endpoint"
                  className="flex-1 px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: '#2a2a2a',
                    color: '#e4e4e7',
                    border: '1px solid #3f3f46'
                  }}
                />

                <button
                  onClick={handleApiTest}
                  disabled={apiLoading || !apiUrl}
                  className="px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-all hover:scale-105"
                  style={{
                    backgroundColor: '#60a5fa',
                    color: '#000',
                    opacity: apiLoading || !apiUrl ? 0.5 : 1
                  }}
                >
                  {apiLoading ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar
                    </>
                  )}
                </button>
              </div>

              {apiResponse && (
                <div 
                  className="p-4 rounded text-sm"
                  style={{
                    backgroundColor: '#262626',
                    border: '1px solid #3f3f46'
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {apiResponse.status < 400 ? (
                        <CheckCircle className="w-5 h-5" style={{ color: '#4ade80' }} />
                      ) : (
                        <AlertCircle className="w-5 h-5" style={{ color: '#f87171' }} />
                      )}
                      <span style={{ color: '#e4e4e7', fontWeight: 'bold', fontSize: '16px' }}>
                        {apiResponse.status} {apiResponse.statusText}
                      </span>
                    </div>
                    {apiResponse.data && (
                      <button
                        onClick={() => copyToClipboard(apiResponse.data)}
                        className="p-2 rounded hover:bg-white/10"
                        title="Copiar"
                      >
                        <Copy className="w-4 h-4" style={{ color: '#71717a' }} />
                      </button>
                    )}
                  </div>
                  {apiResponse.data && (
                    <pre 
                      className="text-xs overflow-auto"
                      style={{ color: '#a1a1aa', maxHeight: '300px' }}
                    >
                      {apiResponse.data}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'json' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium" style={{ color: '#e4e4e7' }}>
                    Input JSON
                  </label>
                  <button
                    onClick={handleJsonFormat}
                    className="px-3 py-1 rounded text-xs font-medium transition-all hover:scale-105"
                    style={{
                      backgroundColor: '#fbbf24',
                      color: '#000'
                    }}
                  >
                    Formatear
                  </button>
                </div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="w-full h-80 px-3 py-2 rounded text-sm font-mono"
                  style={{
                    backgroundColor: '#2a2a2a',
                    color: '#e4e4e7',
                    border: '1px solid #3f3f46',
                    resize: 'none'
                  }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium" style={{ color: '#e4e4e7' }}>
                    Formatted JSON
                  </label>
                  {jsonFormatted && (
                    <button
                      onClick={() => copyToClipboard(jsonFormatted)}
                      className="p-1 rounded hover:bg-white/10"
                      title="Copiar"
                    >
                      <Copy className="w-4 h-4" style={{ color: '#71717a' }} />
                    </button>
                  )}
                </div>
                <pre 
                  className="w-full h-80 px-3 py-2 rounded text-sm font-mono overflow-auto"
                  style={{
                    backgroundColor: '#2a2a2a',
                    color: '#4ade80',
                    border: '1px solid #3f3f46'
                  }}
                >
                  {jsonFormatted || 'El JSON formateado aparecerá aquí...'}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevToolsMenu;
