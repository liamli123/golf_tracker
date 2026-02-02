import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, startOfYear, isAfter } from 'date-fns';

export default function Statistics({ rounds }) {
  const currentMonth = format(new Date(), 'yyyy-MM');
  const [timePeriod, setTimePeriod] = useState(currentMonth);

  const availableMonths = useMemo(() => {
    if (rounds.length === 0) return [];
    const months = new Set();
    rounds.forEach(r => {
      months.add(format(r.date, 'yyyy-MM'));
    });
    return Array.from(months).sort().reverse();
  }, [rounds]);

  const filteredRounds = useMemo(() => {
    if (timePeriod === 'all') return rounds;

    if (timePeriod === 'ytd') {
      const yearStart = startOfYear(new Date());
      return rounds.filter(r => isAfter(r.date, yearStart) || r.date.getTime() === yearStart.getTime());
    }

    const [year, month] = timePeriod.split('-').map(Number);
    return rounds.filter(r => {
      return r.date.getFullYear() === year && r.date.getMonth() + 1 === month;
    });
  }, [rounds, timePeriod]);

  const stats = useMemo(() => {
    if (filteredRounds.length === 0) {
      return {
        totalRounds: 0,
        averageScore: 0,
        bestScore: 0,
        totalSpending: 0,
        avgMonthlySpending: 0,
        totalWagers: 0,
        avgMonthlyWagers: 0,
        totalGreenFee: 0,
        totalCaddyFee: 0,
        avgGreenFee: 0,
        avgCaddyFee: 0,
        scoreData: [],
        monthlyData: []
      };
    }

    const totalRounds = filteredRounds.length;
    const averageScore = filteredRounds.reduce((sum, r) => sum + r.score, 0) / totalRounds;
    const bestScore = Math.min(...filteredRounds.map(r => r.score));

    const totalGreenFee = filteredRounds.reduce((sum, r) => sum + r.green_fee, 0);
    const totalCaddyFee = filteredRounds.reduce((sum, r) => sum + r.caddy_fee, 0);
    const totalSpending = totalGreenFee + totalCaddyFee;
    const totalWagers = filteredRounds.reduce((sum, r) => sum + r.wagers, 0);

    const avgGreenFee = totalGreenFee / totalRounds;
    const avgCaddyFee = totalCaddyFee / totalRounds;

    const monthsMap = {};
    filteredRounds.forEach(r => {
      const monthKey = format(startOfMonth(r.date), 'yyyy-MM');
      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = {
          spending: 0,
          wagers: 0,
          count: 0
        };
      }
      monthsMap[monthKey].spending += r.green_fee + r.caddy_fee;
      monthsMap[monthKey].wagers += r.wagers;
      monthsMap[monthKey].count++;
    });

    const monthsCount = Object.keys(monthsMap).length || 1;
    const avgMonthlySpending = totalSpending / monthsCount;
    const avgMonthlyWagers = totalWagers / monthsCount;

    const scoreData = filteredRounds
      .slice()
      .sort((a, b) => a.date - b.date)
      .map(r => ({
        date: format(r.date, 'MMM dd'),
        score: r.score
      }));

    const monthlyData = Object.entries(monthsMap).map(([month, data]) => ({
      month: format(new Date(month), 'MMM yy'),
      spending: data.spending,
      wagers: data.wagers,
      avgScore: filteredRounds
        .filter(r => format(startOfMonth(r.date), 'yyyy-MM') === month)
        .reduce((sum, r) => sum + r.score, 0) / data.count
    })).sort((a, b) => a.month.localeCompare(b.month));

    return {
      totalRounds,
      averageScore,
      bestScore,
      totalSpending,
      avgMonthlySpending,
      totalWagers,
      avgMonthlyWagers,
      totalGreenFee,
      totalCaddyFee,
      avgGreenFee,
      avgCaddyFee,
      scoreData,
      monthlyData
    };
  }, [filteredRounds]);

  if (rounds.length === 0) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-lg p-8 mb-8">
        <h2 className="text-lg font-mono text-gray-100 mb-4">Dashboard</h2>
        <p className="text-sm text-gray-500">No data available yet. Add some rounds to see statistics!</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Single Container */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-8">
        {/* Header with Time Period Selector */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-6 border-b border-dark-border">
          <h1 className="text-2xl font-mono text-gray-100">DASHBOARD</h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTimePeriod('all')}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
                timePeriod === 'all'
                  ? 'bg-gray-100 text-black'
                  : 'bg-transparent text-gray-500 hover:text-gray-300 border border-dark-border'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setTimePeriod('ytd')}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
                timePeriod === 'ytd'
                  ? 'bg-gray-100 text-black'
                  : 'bg-transparent text-gray-500 hover:text-gray-300 border border-dark-border'
              }`}
            >
              YTD
            </button>
            {availableMonths.slice(0, 6).map(month => (
              <button
                key={month}
                onClick={() => setTimePeriod(month)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
                  timePeriod === month
                    ? 'bg-gray-100 text-black'
                    : 'bg-transparent text-gray-500 hover:text-gray-300 border border-dark-border'
                }`}
              >
                {format(new Date(month), 'MMM yy').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="mb-8">
          <h2 className="text-lg font-mono text-gray-300 mb-6">OVERVIEW</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-sm font-mono font-bold text-gray-100 mb-2">ROUNDS</div>
              <div className="text-3xl font-mono font-bold text-gray-100">{stats.totalRounds}</div>
            </div>
            <div>
              <div className="text-sm font-mono font-bold text-gray-100 mb-2">AVG SCORE</div>
              <div className="text-3xl font-mono font-bold text-gray-100">{stats.averageScore.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-sm font-mono font-bold text-gray-100 mb-2">BEST</div>
              <div className="text-3xl font-mono font-bold text-golf-green">{stats.bestScore}</div>
            </div>
            <div>
              <div className="text-sm font-mono font-bold text-gray-100 mb-2">TOTAL SPENT</div>
              <div className="text-3xl font-mono font-bold text-gray-100">¥{stats.totalSpending.toFixed(0)}</div>
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="mb-8 pb-8 border-b border-dark-border">
          <h2 className="text-lg font-mono text-gray-300 mb-6">EXPENSES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-sm font-mono font-bold text-gray-100 mb-3">TOTAL</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-mono text-gray-300">Green Fees</span>
                  <span className="font-mono text-gray-100">¥{stats.totalGreenFee.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-mono text-gray-300">Caddy Fees</span>
                  <span className="font-mono text-gray-100">¥{stats.totalCaddyFee.toFixed(0)}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-mono font-bold text-gray-100 mb-3">PER ROUND</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-mono text-gray-300">Green Fee</span>
                  <span className="font-mono text-gray-100">¥{stats.avgGreenFee.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-mono text-gray-300">Caddy Fee</span>
                  <span className="font-mono text-gray-100">¥{stats.avgCaddyFee.toFixed(0)}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-mono font-bold text-gray-100 mb-3">MONTHLY AVG</div>
              <div className="text-2xl font-mono font-bold text-gray-100">¥{stats.avgMonthlySpending.toFixed(0)}</div>
            </div>
          </div>
        </div>

        {/* Wagers */}
        <div className="mb-8 pb-8 border-b border-dark-border">
          <h2 className="text-lg font-mono text-gray-300 mb-6">WAGERS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-sm font-mono font-bold text-gray-100 mb-2">TOTAL</div>
              <div className={`text-3xl font-mono font-bold ${stats.totalWagers >= 0 ? 'text-golf-green' : 'text-red-400'}`}>
                {stats.totalWagers >= 0 ? '+' : ''}¥{stats.totalWagers.toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-sm font-mono font-bold text-gray-100 mb-2">PER ROUND</div>
              <div className={`text-2xl font-mono font-bold ${(stats.totalWagers / stats.totalRounds) >= 0 ? 'text-golf-green' : 'text-red-400'}`}>
                {(stats.totalWagers / stats.totalRounds) >= 0 ? '+' : ''}¥{(stats.totalWagers / stats.totalRounds).toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-sm font-mono font-bold text-gray-100 mb-2">MONTHLY AVG</div>
              <div className={`text-2xl font-mono font-bold ${stats.avgMonthlyWagers >= 0 ? 'text-golf-green' : 'text-red-400'}`}>
                {stats.avgMonthlyWagers >= 0 ? '+' : ''}¥{stats.avgMonthlyWagers.toFixed(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        {stats.scoreData.length > 1 && (
          <div className="mb-8 pb-8 border-b border-dark-border">
            <h2 className="text-lg font-mono text-gray-300 mb-6">SCORE TREND</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="date" stroke="#555555" style={{ fontSize: '11px' }} />
                <YAxis stroke="#555555" style={{ fontSize: '11px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#000000',
                    border: '1px solid #1f1f1f',
                    borderRadius: '4px',
                    color: '#f3f4f6',
                    fontSize: '11px'
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {stats.monthlyData.length > 0 && (
          <>
            <div className="mb-8 pb-8 border-b border-dark-border">
              <h2 className="text-lg font-mono text-gray-300 mb-6">MONTHLY SPENDING</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis dataKey="month" stroke="#555555" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#555555" style={{ fontSize: '11px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#000000',
                      border: '1px solid #1f1f1f',
                      borderRadius: '4px',
                      color: '#f3f4f6',
                      fontSize: '11px'
                    }}
                    formatter={(value) => `¥${value.toFixed(0)}`}
                  />
                  <Line type="monotone" dataKey="spending" stroke="#666666" strokeWidth={2} dot={{ fill: '#666666', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h2 className="text-lg font-mono text-gray-300 mb-6">MONTHLY WAGERS</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis dataKey="month" stroke="#555555" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#555555" style={{ fontSize: '11px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#000000',
                      border: '1px solid #1f1f1f',
                      borderRadius: '4px',
                      color: '#f3f4f6',
                      fontSize: '11px'
                    }}
                    formatter={(value) => `¥${value.toFixed(0)}`}
                  />
                  <Line type="monotone" dataKey="wagers" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
