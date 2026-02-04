import { useState } from 'react';
import { format } from 'date-fns';

export default function RoundsTable({ rounds, onDelete, onEdit }) {
  const [editingRound, setEditingRound] = useState(null);
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleEditClick = (round) => {
    const dateStr = format(round.date, 'yyyy-MM-dd');
    setEditingRound(round.id);
    setFormData({
      date: dateStr,
      time: round.time || '',
      course: round.course,
      green_fee: round.green_fee,
      caddy_fee: round.caddy_fee,
      wagers: round.wagers,
      score: round.score,
    });
  };

  const handleCancelEdit = () => {
    setEditingRound(null);
    setFormData(null);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await onEdit(editingRound, formData);
    setSaving(false);
    if (result.success) {
      setEditingRound(null);
      setFormData(null);
    }
  };

  if (rounds.length === 0) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-lg shadow-xl p-8 text-center">
        <p className="text-gray-400 text-lg">No rounds recorded yet. Add your first round above!</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg shadow-xl overflow-hidden">
      <div className="px-6 py-4 bg-dark-bg border-b border-dark-border">
        <h2 className="text-2xl font-bold text-gray-100">Round History</h2>
        <p className="text-sm text-gray-400 mt-1">Total Rounds: {rounds.length}</p>
      </div>

      {/* Edit Modal */}
      {editingRound && formData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-100 mb-4">Edit Round</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:ring-2 focus:ring-golf-green focus:border-transparent text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:ring-2 focus:ring-golf-green focus:border-transparent text-gray-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Course
                  </label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => handleChange('course', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:ring-2 focus:ring-golf-green focus:border-transparent text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Green Fee (¥)
                  </label>
                  <input
                    type="number"
                    value={formData.green_fee}
                    onChange={(e) => handleChange('green_fee', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:ring-2 focus:ring-golf-green focus:border-transparent text-gray-100"
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Caddy Fee (¥)
                  </label>
                  <input
                    type="number"
                    value={formData.caddy_fee}
                    onChange={(e) => handleChange('caddy_fee', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:ring-2 focus:ring-golf-green focus:border-transparent text-gray-100"
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Wagers (¥)
                  </label>
                  <input
                    type="number"
                    value={formData.wagers}
                    onChange={(e) => handleChange('wagers', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:ring-2 focus:ring-golf-green focus:border-transparent text-gray-100"
                    step="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Positive for win, negative for loss</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Score
                  </label>
                  <input
                    type="number"
                    value={formData.score}
                    onChange={(e) => handleChange('score', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:ring-2 focus:ring-golf-green focus:border-transparent text-gray-100"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-golf-green hover:bg-golf-lightgreen disabled:opacity-50 text-black font-bold py-2 px-6 rounded text-sm transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="bg-transparent border border-dark-border hover:bg-dark-hover disabled:opacity-50 text-gray-300 font-bold py-2 px-6 rounded text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-bg">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Green Fee
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Caddy Fee
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Wagers
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-dark-card divide-y divide-dark-border">
            {rounds.map((round) => (
              <tr key={round.id} className="hover:bg-dark-hover transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {format(round.date, 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {round.time || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {round.course}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400 text-right">
                  - ¥ {round.green_fee.toFixed(0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400 text-right">
                  - ¥ {round.caddy_fee.toFixed(0)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                  round.wagers > 0 ? 'text-golf-green' : round.wagers < 0 ? 'text-red-400' : 'text-gray-300'
                }`}>
                  {round.wagers >= 0 ? '+ ' : '- '}¥ {Math.abs(round.wagers).toFixed(0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-100 text-right">
                  {round.score}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm space-x-3">
                  <button
                    onClick={() => handleEditClick(round)}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(round.id)}
                    className="text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
