import { useState } from 'react';
import { extractGolfData } from '../services/deepseek';
import DataConfirmation from './DataConfirmation';

export default function ChatBox({ onSave }) {
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [bulkData, setBulkData] = useState(null);
  const [error, setError] = useState(null);

  const parseDate = (dateStr) => {
    // Try to parse date like "November 3, 2025" or "2025-11-03"
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return new Date().toISOString().split('T')[0]; // Default to today
  };

  const parseBulkData = (text) => {
    try {
      const lines = text.trim().split('\n');
      const rounds = [];

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('**') || trimmedLine.startsWith('#') || trimmedLine.includes('Total:') || trimmedLine === '') {
          continue;
        }

        // Parse format like: "November 3, 2025, 牧马山, 440, 200, -700, 85"
        // Or: "2025-11-03, home, 440, 200, -700, 85"
        const parts = trimmedLine.split(',').map(p => p.trim());

        if (parts.length >= 5) {
          const dateStr = parts[0];
          const course = parts[1];
          const greenFee = Math.abs(parseFloat(parts[2]) || 0);
          const caddyFee = Math.abs(parseFloat(parts[3]) || 0);
          const wagers = parseFloat(parts[4]) || 0;
          const score = parts.length >= 6 ? parseInt(parts[5]) || 0 : 0;

          const round = {
            date: parseDate(dateStr),
            course: course,
            green_fee: greenFee,
            caddy_fee: caddyFee,
            wagers: wagers,
            score: score,
            time: '12:00',
            raw_input: trimmedLine
          };
          rounds.push(round);
        }
      }

      return rounds;
    } catch (err) {
      throw new Error('Failed to parse bulk data. Please check the format.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    if (mode === 'bulk') {
      try {
        const rounds = parseBulkData(input);
        if (rounds.length === 0) {
          setError('No valid rounds found. Please check the format.');
        } else {
          setBulkData(rounds);
        }
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    } else {
      const result = await extractGolfData(input);

      if (result.success) {
        setExtractedData(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
  };

  const handleConfirm = async (data) => {
    await onSave(data);
    setInput('');
    setExtractedData(null);
    setError(null);
  };

  const handleBulkConfirm = async () => {
    setLoading(true);
    for (const round of bulkData) {
      await onSave(round);
    }
    setInput('');
    setBulkData(null);
    setLoading(false);
  };

  const handleCancel = () => {
    setExtractedData(null);
    setBulkData(null);
    setError(null);
  };

  return (
    <div className="bg-dark-card rounded-lg border border-dark-border p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-mono text-gray-300">ADD NEW ROUND</h2>
        <div className="flex gap-2">
          <button
            onClick={() => { setMode('single'); setInput(''); setError(null); setBulkData(null); }}
            className={`px-3 py-1 text-xs font-mono rounded transition-all ${
              mode === 'single'
                ? 'bg-golf-green text-black'
                : 'bg-transparent text-gray-500 hover:text-gray-300 border border-dark-border'
            }`}
          >
            SINGLE
          </button>
          <button
            onClick={() => { setMode('bulk'); setInput(''); setError(null); setExtractedData(null); }}
            className={`px-3 py-1 text-xs font-mono rounded transition-all ${
              mode === 'bulk'
                ? 'bg-golf-green text-black'
                : 'bg-transparent text-gray-500 hover:text-gray-300 border border-dark-border'
            }`}
          >
            BULK
          </button>
        </div>
      </div>

      {!extractedData && !bulkData ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'bulk' && (
            <div className="bg-dark-bg border border-dark-border rounded p-3 mb-2">
              <p className="text-xs text-gray-400 font-mono">
                Format: date, course, green_fee, caddy_fee, wagers, score
                <br />
                Example: November 3 2025, 牧马山, 440, 200, -700, 85
              </p>
            </div>
          )}
          <div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'bulk' ? "Paste multiple rounds (one per line)..." : ""}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:ring-2 focus:ring-golf-green focus:border-transparent resize-none text-gray-100 placeholder-gray-500"
              rows={mode === 'bulk' ? '10' : '4'}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
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
            ) : mode === 'bulk' ? (
              'PARSE BULK DATA'
            ) : (
              'EXTRACT DATA'
            )}
          </button>
        </form>
      ) : bulkData ? (
        <div className="space-y-4">
          <div className="bg-dark-bg border border-dark-border rounded p-4">
            <h3 className="text-sm font-mono text-gray-300 mb-3">PREVIEW ({bulkData.length} rounds)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead className="text-gray-400 border-b border-dark-border">
                  <tr>
                    <th className="text-left py-2 px-2">DATE</th>
                    <th className="text-left py-2 px-2">COURSE</th>
                    <th className="text-right py-2 px-2">GREEN</th>
                    <th className="text-right py-2 px-2">CADDY</th>
                    <th className="text-right py-2 px-2">WAGERS</th>
                    <th className="text-right py-2 px-2">SCORE</th>
                  </tr>
                </thead>
                <tbody className="text-gray-200">
                  {bulkData.map((round, idx) => (
                    <tr key={idx} className="border-b border-dark-border">
                      <td className="py-2 px-2">{round.date}</td>
                      <td className="py-2 px-2">{round.course}</td>
                      <td className="py-2 px-2 text-right text-red-400">- ¥ {round.green_fee}</td>
                      <td className="py-2 px-2 text-right text-red-400">- ¥ {round.caddy_fee}</td>
                      <td className={`py-2 px-2 text-right ${round.wagers >= 0 ? 'text-golf-green' : 'text-red-400'}`}>
                        {round.wagers >= 0 ? '+ ' : '- '}¥ {Math.abs(round.wagers)}
                      </td>
                      <td className="py-2 px-2 text-right">{round.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBulkConfirm}
              disabled={loading}
              className="bg-golf-green hover:bg-golf-lightgreen text-black font-mono font-bold py-2 px-6 rounded text-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'SAVING...' : 'SAVE ALL'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="bg-transparent border border-dark-border text-gray-300 hover:text-gray-100 font-mono font-bold py-2 px-6 rounded text-sm transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
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
