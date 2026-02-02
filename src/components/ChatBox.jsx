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
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Round</h2>
      <p className="text-gray-600 mb-4">
        Describe your golf round in natural language. For example: "Played at Pebble Beach today, paid $400 green fee, $50 caddy tip, shot 85, won $200"
      </p>

      {!extractedData ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me about your golf round..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golf-lightgreen focus:border-transparent resize-none"
              rows="4"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-full bg-golf-green hover:bg-golf-lightgreen text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Extract Data'
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
