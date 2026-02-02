import { useState } from 'react';

export default function DataConfirmation({ data, onConfirm, onCancel }) {
  const [formData, setFormData] = useState(data);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData);
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Extracted Data</h3>
      <p className="text-sm text-gray-600 mb-4">Review and edit the extracted information before saving</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-golf-lightgreen focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time (optional)
            </label>
            <input
              type="time"
              value={formData.time || ''}
              onChange={(e) => handleChange('time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-golf-lightgreen focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => handleChange('course', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-golf-lightgreen focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Green Fee ($)
            </label>
            <input
              type="number"
              value={formData.green_fee}
              onChange={(e) => handleChange('green_fee', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-golf-lightgreen focus:border-transparent"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caddy Fee ($)
            </label>
            <input
              type="number"
              value={formData.caddy_fee}
              onChange={(e) => handleChange('caddy_fee', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-golf-lightgreen focus:border-transparent"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wagers ($ - positive for win, negative for loss)
            </label>
            <input
              type="number"
              value={formData.wagers}
              onChange={(e) => handleChange('wagers', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-golf-lightgreen focus:border-transparent"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Score
            </label>
            <input
              type="number"
              value={formData.score}
              onChange={(e) => handleChange('score', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-golf-lightgreen focus:border-transparent"
              min="0"
              required
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-golf-green hover:bg-golf-lightgreen text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Confirm & Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
