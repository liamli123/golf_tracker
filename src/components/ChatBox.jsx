import { useState } from 'react';
import { extractGolfData } from '../services/deepseek';
import DataConfirmation from './DataConfirmation';

export default function ChatBox({ onSave }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    const result = await extractGolfData(input);

    if (result.success) {
      setExtractedData(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleConfirm = async (data) => {
    await onSave(data);
    setInput('');
    setExtractedData(null);
    setError(null);
  };

  const handleCancel = () => {
    setExtractedData(null);
    setError(null);
  };

  return (
    <div className="bg-dark-card rounded-lg border border-dark-border p-6 mb-8">
      <h2 className="text-lg font-mono text-gray-300 mb-4">ADD NEW ROUND</h2>
      <p className="text-sm text-gray-500 mb-4">
        Describe your golf round in natural language. For example: "Played at Pebble Beach today, paid ¥400 green fee, ¥50 caddy tip, shot 85, won ¥200"
      </p>

      {!extractedData ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me about your golf round..."
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:ring-2 focus:ring-golf-green focus:border-transparent resize-none text-gray-100 placeholder-gray-500"
              rows="4"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-golf-green hover:bg-golf-lightgreen text-black font-mono font-bold py-2 px-6 rounded text-sm transition-colors disabled:bg-dark-hover disabled:cursor-not-allowed disabled:text-gray-500"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                PROCESSING...
              </span>
            ) : (
              'EXTRACT DATA'
            )}
          </button>
        </form>
      ) : (
        <DataConfirmation
          data={extractedData}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
