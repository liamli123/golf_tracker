import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, isAfter, subMonths } from 'date-fns';

export default function Statistics({ rounds }) {
  const stats = useMemo(() => {
    if (rounds.length === 0) {
      return {
        totalRounds: 0,
        averageScore: 0,
        bestScore: 0,
        totalSpending: 0,
        totalWagers: 0,
        scoreData: [],
        monthlyData: []
      };
    }

    const totalRounds = rounds.length;
    const averageScore = rounds.reduce((sum, r) => sum + r.score, 0) / totalRounds;
    const bestScore = Math.min(...rounds.map(r => r.score));
    const totalSpending = rounds.reduce((sum, r) => sum + r.green_fee + r.caddy_fee, 0);
    const totalWagers = rounds.reduce((sum, r) => sum + r.wagers, 0);

    const scoreData = rounds
      .slice()
      .sort((a, b) => a.date - b.date)
      .map(r => ({
        date: format(r.date, 'MMM dd'),
        score: r.score
      }));

    const monthlyMap = {};
    rounds.forEach(r => {
      const monthKey = format(startOfMonth(r.date), 'MMM yyyy');
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = {
          month: monthKey,
          spending: 0,
          wagers: 0,
          scores: []
        };
      }
      monthlyMap[monthKey].spending += r.green_fee + r.caddy_fee;
      monthlyMap[monthKey].wagers += r.wagers;
      monthlyMap[monthKey].scores.push(r.score);
    });

    const monthlyData = Object.values(monthlyMap).map(m => ({
      month: m.month,
      spending: m.spending,
      wagers: m.wagers,
      avgScore: m.scores.reduce((a, b) => a + b, 0) / m.scores.length
    }));

    return {
      totalRounds,
      averageScore,
      bestScore,
      totalSpending,
      totalWagers,
      scoreData,
      monthlyData
    };
  }, [rounds]);

  if (rounds.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Statistics</h2>
        <p className="text-gray-500">No data available yet. Add some rounds to see statistics!</p>
      </div>
    );
  }

  return (
    <div className="mb-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Rounds</h3>
          <p className="text-3xl font-bold text-golf-green">{stats.totalRounds}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Average Score</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.averageScore.toFixed(1)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Best Score</h3>
          <p className="text-3xl font-bold text-green-600">{stats.bestScore}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Spending</h3>
          <p className="text-3xl font-bold text-red-600">${stats.totalSpending.toFixed(0)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Net Wagers</h3>
          <p className={`text-3xl font-bold ${stats.totalWagers >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.totalWagers >= 0 ? '+' : ''}${stats.totalWagers.toFixed(0)}
          </p>
        </div>
      </div>

      {stats.scoreData.length > 1 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Score Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.scoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#2d5016" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {stats.monthlyData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Spending</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="spending" fill="#ef4444" name="Spending ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Wagers</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="wagers" fill="#10b981" name="Wagers ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
