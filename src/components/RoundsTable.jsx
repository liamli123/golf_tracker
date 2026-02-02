import { format } from 'date-fns';

export default function RoundsTable({ rounds, onDelete }) {
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                  ¥{round.green_fee.toFixed(0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                  ¥{round.caddy_fee.toFixed(0)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                  round.wagers > 0 ? 'text-golf-green' : round.wagers < 0 ? 'text-red-400' : 'text-gray-300'
                }`}>
                  {round.wagers > 0 ? '+' : ''}¥{round.wagers.toFixed(0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-100 text-right">
                  {round.score}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
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
