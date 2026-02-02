import { useMemo, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
        monthlyData: [],
        perRoundData: []
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

    const monthlyData = Object.entries(monthsMap)
      .map(([month, data]) => {
        const total = Math.abs(data.wagers) + data.spending;
        const wagersPercent = total > 0 ? (Math.abs(data.wagers) / total) * 100 : 0;
        const expensesPercent = total > 0 ? (data.spending / total) * 100 : 0;
        return {
          month: format(new Date(month), 'MMM yy'),
          monthKey: month,
          spending: data.spending,
          wagers: data.wagers,
          pnl: data.wagers - data.spending,
          wagersPercent: wagersPercent,
          expensesPercent: expensesPercent,
          avgScore: filteredRounds
            .filter(r => format(startOfMonth(r.date), 'yyyy-MM') === month)
            .reduce((sum, r) => sum + r.score, 0) / data.count
        };
      })
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));

    // Per-round data for single month view
    const perRoundData = filteredRounds
      .slice()
      .sort((a, b) => a.date - b.date)
      .map(r => {
        const roundSpending = r.green_fee + r.caddy_fee;
        const total = Math.abs(r.wagers) + roundSpending;
        const wagersPercent = total > 0 ? (Math.abs(r.wagers) / total) * 100 : 0;
        const expensesPercent = total > 0 ? (roundSpending / total) * 100 : 0;
        return {
          date: format(r.date, 'MMM dd'),
          pnl: r.wagers - roundSpending,
          wagers: r.wagers,
          spending: roundSpending,
          wagersPercent: wagersPercent,
          expensesPercent: expensesPercent
        };
      });

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
      monthlyData,
      perRoundData
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
    <div className="mb-6">
      {/* Single Container */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-4">
        {/* Header with Time Period Selector */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-3 border-b border-dark-border">
          <h1 className="text-xl font-mono text-gray-100">DASHBOARD</h1>
          <div className="flex flex-wrap gap-2 items-center">
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
            <select
              value={timePeriod !== 'all' && timePeriod !== 'ytd' ? timePeriod : ''}
              onChange={(e) => e.target.value && setTimePeriod(e.target.value)}
              className="px-3 py-1.5 text-xs font-mono rounded bg-dark-bg border border-dark-border text-gray-300 hover:text-gray-100 focus:ring-2 focus:ring-golf-green focus:border-transparent"
            >
              <option value="">Select Month</option>
              {availableMonths.map(month => (
                <option key={month} value={month}>
                  {format(new Date(month), 'MMM yyyy').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="mb-4 pb-4 border-b border-dark-border">
          <h2 className="text-sm font-mono text-gray-300 mb-3">FINANCIAL OVERVIEW</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-xs font-mono font-bold text-gray-100 mb-1">TOTAL P&L</div>
              <div className={`text-xl font-mono font-bold ${(stats.totalWagers - stats.totalSpending) >= 0 ? 'text-golf-green' : 'text-red-400'}`}>
                {(stats.totalWagers - stats.totalSpending) >= 0 ? '+ ' : '- '}¥ {Math.abs(stats.totalWagers - stats.totalSpending).toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-gray-100 mb-1">WAGERS</div>
              <div className={`text-xl font-mono font-bold ${stats.totalWagers >= 0 ? 'text-golf-green' : 'text-red-400'}`}>
                {stats.totalWagers >= 0 ? '+ ' : '- '}¥ {Math.abs(stats.totalWagers).toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-gray-100 mb-1">EXPENSES</div>
              <div className="text-xl font-mono font-bold text-red-400">
                - ¥ {stats.totalSpending.toFixed(0)}
              </div>
            </div>
          </div>

          {/* Percentage Breakdown Bar */}
          <div className="mt-4">
            <div className="text-xs font-mono text-gray-400 mb-2">BREAKDOWN</div>
            <div className="flex h-8 rounded overflow-hidden">
              <div
                className={`flex items-center justify-center text-xs font-mono font-bold ${stats.totalWagers >= 0 ? 'bg-golf-green/80 text-black' : 'bg-red-500/80 text-white'}`}
                style={{ width: `${(Math.abs(stats.totalWagers) + stats.totalSpending) > 0 ? ((Math.abs(stats.totalWagers) / (Math.abs(stats.totalWagers) + stats.totalSpending)) * 100).toFixed(1) : 50}%` }}
              >
                {(Math.abs(stats.totalWagers) + stats.totalSpending) > 0 ? ((Math.abs(stats.totalWagers) / (Math.abs(stats.totalWagers) + stats.totalSpending)) * 100).toFixed(0) : 0}% WAGERS
              </div>
              <div
                className="flex items-center justify-center text-xs font-mono font-bold bg-red-400/80 text-white"
                style={{ width: `${(Math.abs(stats.totalWagers) + stats.totalSpending) > 0 ? ((stats.totalSpending / (Math.abs(stats.totalWagers) + stats.totalSpending)) * 100).toFixed(1) : 50}%` }}
              >
                {(Math.abs(stats.totalWagers) + stats.totalSpending) > 0 ? ((stats.totalSpending / (Math.abs(stats.totalWagers) + stats.totalSpending)) * 100).toFixed(0) : 0}% EXPENSES
              </div>
            </div>
          </div>
        </div>

        {/* Wagers */}
        <div className="mb-4 pb-4 border-b border-dark-border">
          <h2 className="text-sm font-mono text-gray-300 mb-3">WAGERS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-gray-100 mb-2">TOTAL</div>
              <div className={`text-xl font-mono font-bold ${stats.totalWagers >= 0 ? 'text-golf-green' : 'text-red-400'}`}>
                {stats.totalWagers >= 0 ? '+ ' : '- '}¥ {Math.abs(stats.totalWagers).toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-gray-100 mb-2">PER ROUND</div>
              <div className={`text-xl font-mono font-bold ${(stats.totalWagers / stats.totalRounds) >= 0 ? 'text-golf-green' : 'text-red-400'}`}>
                {(stats.totalWagers / stats.totalRounds) >= 0 ? '+ ' : '- '}¥ {Math.abs(stats.totalWagers / stats.totalRounds).toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-gray-100 mb-2">MONTHLY AVG</div>
              <div className={`text-xl font-mono font-bold ${stats.avgMonthlyWagers >= 0 ? 'text-golf-green' : 'text-red-400'}`}>
                {stats.avgMonthlyWagers >= 0 ? '+ ' : '- '}¥ {Math.abs(stats.avgMonthlyWagers).toFixed(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="mb-4 pb-4 border-b border-dark-border">
          <h2 className="text-sm font-mono text-gray-300 mb-3">EXPENSES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-gray-100 mb-2">TOTAL</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-gray-300">Green Fees</span>
                  <span className="font-mono text-red-400">- ¥ {stats.totalGreenFee.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-gray-300">Caddy Fees</span>
                  <span className="font-mono text-red-400">- ¥ {stats.totalCaddyFee.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-dark-border">
                  <span className="font-mono text-gray-100 font-bold">Subtotal</span>
                  <span className="font-mono text-red-400 font-bold">- ¥ {stats.totalSpending.toFixed(0)}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-gray-100 mb-2">PER ROUND</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-gray-300">Green Fee</span>
                  <span className="font-mono text-red-400">- ¥ {stats.avgGreenFee.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-gray-300">Caddy Fee</span>
                  <span className="font-mono text-red-400">- ¥ {stats.avgCaddyFee.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-dark-border">
                  <span className="font-mono text-gray-100 font-bold">Subtotal</span>
                  <span className="font-mono text-red-400 font-bold">- ¥ {(stats.totalSpending / stats.totalRounds).toFixed(0)}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-gray-100 mb-2">MONTHLY AVG</div>
              <div className="text-xl font-mono font-bold text-red-400">- ¥ {stats.avgMonthlySpending.toFixed(0)}</div>
            </div>
          </div>
        </div>

        {/* Charts - 2x2 Grid */}
        {(timePeriod === 'all' || timePeriod === 'ytd' ? stats.monthlyData.length > 0 : stats.perRoundData.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* P&L Line Chart */}
            <div className="pb-4">
              <h2 className="text-sm font-mono text-gray-300 mb-3">
                {timePeriod === 'all' ? 'ALL-TIME P&L' : timePeriod === 'ytd' ? 'YTD P&L' : 'P&L BY ROUND'}
              </h2>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={timePeriod === 'all' || timePeriod === 'ytd' ? stats.monthlyData : stats.perRoundData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis dataKey={timePeriod === 'all' || timePeriod === 'ytd' ? "month" : "date"} stroke="#555555" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#555555" style={{ fontSize: '11px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#000000',
                      border: '1px solid #1f1f1f',
                      borderRadius: '4px',
                      color: '#f3f4f6',
                      fontSize: '11px'
                    }}
                    formatter={(value) => `${value >= 0 ? '+ ' : '- '}¥ ${Math.abs(value).toFixed(0)}`}
                  />
                  <Line type="monotone" dataKey="pnl" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Wagers Line Chart */}
            <div className="pb-4">
              <h2 className="text-sm font-mono text-gray-300 mb-3">
                {timePeriod === 'all' ? 'ALL-TIME WAGERS' : timePeriod === 'ytd' ? 'YTD WAGERS' : 'WAGERS BY ROUND'}
              </h2>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={timePeriod === 'all' || timePeriod === 'ytd' ? stats.monthlyData : stats.perRoundData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis dataKey={timePeriod === 'all' || timePeriod === 'ytd' ? "month" : "date"} stroke="#555555" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#555555" style={{ fontSize: '11px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#000000',
                      border: '1px solid #1f1f1f',
                      borderRadius: '4px',
                      color: '#f3f4f6',
                      fontSize: '11px'
                    }}
                    formatter={(value) => `${value >= 0 ? '+ ' : '- '}¥ ${Math.abs(value).toFixed(0)}`}
                  />
                  <Line type="monotone" dataKey="wagers" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Expenses Bar Chart */}
            <div className="pb-4">
              <h2 className="text-sm font-mono text-gray-300 mb-3">
                {timePeriod === 'all' ? 'ALL-TIME EXPENSES' : timePeriod === 'ytd' ? 'YTD EXPENSES' : 'EXPENSES BY ROUND'}
              </h2>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={timePeriod === 'all' || timePeriod === 'ytd' ? stats.monthlyData : stats.perRoundData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis dataKey={timePeriod === 'all' || timePeriod === 'ytd' ? "month" : "date"} stroke="#555555" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#555555" style={{ fontSize: '11px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#000000',
                      border: '1px solid #1f1f1f',
                      borderRadius: '4px',
                      color: '#f3f4f6',
                      fontSize: '11px'
                    }}
                    cursor={{ fill: 'transparent' }}
                    formatter={(value) => `- ¥ ${Math.abs(value).toFixed(0)}`}
                  />
                  <Bar dataKey="spending" fill="#f87171" name="Expenses" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Percentage Breakdown Bar Chart */}
            <div className="pb-4">
              <h2 className="text-sm font-mono text-gray-300 mb-3">
                {timePeriod === 'all' ? 'ALL-TIME BREAKDOWN' : timePeriod === 'ytd' ? 'YTD BREAKDOWN' : 'BREAKDOWN BY ROUND'}
              </h2>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={timePeriod === 'all' || timePeriod === 'ytd' ? stats.monthlyData : stats.perRoundData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis dataKey={timePeriod === 'all' || timePeriod === 'ytd' ? "month" : "date"} stroke="#555555" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#555555" style={{ fontSize: '11px' }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#000000',
                      border: '1px solid #1f1f1f',
                      borderRadius: '4px',
                      color: '#f3f4f6',
                      fontSize: '11px'
                    }}
                    cursor={{ fill: 'transparent' }}
                    formatter={(value) => `${value.toFixed(1)}%`}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px' }}
                    formatter={(value) => value === 'wagersPercent' ? 'Wagers' : 'Expenses'}
                  />
                  <Bar dataKey="wagersPercent" stackId="a" fill="#10b981" name="Wagers" barSize={30} />
                  <Bar dataKey="expensesPercent" stackId="a" fill="#f87171" name="Expenses" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Golf Performance Stats - Last Row */}
        <div className="mt-4 pt-4 border-t border-dark-border">
          <h2 className="text-xs font-mono text-gray-400 mb-2">GOLF PERFORMANCE</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-xs font-mono text-gray-400 mb-1">ROUNDS</div>
              <div className="text-lg font-mono font-bold text-gray-300">{stats.totalRounds}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-gray-400 mb-1">AVG SCORE</div>
              <div className="text-lg font-mono font-bold text-gray-300">{stats.averageScore.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-gray-400 mb-1">BEST ROUND</div>
              <div className="text-lg font-mono font-bold text-gray-300">{stats.bestScore}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
