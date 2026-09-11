import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

// Groups transactions by month and produces a running net-cash-flow series.
function buildMonthlySeries(transactions) {
  const byMonth = {}

  transactions.forEach((t) => {
    const monthKey = t.date.slice(0, 7) // "YYYY-MM"
    if (!byMonth[monthKey]) byMonth[monthKey] = { income: 0, expense: 0 }
    if (t.type === 'income') byMonth[monthKey].income += Number(t.amount)
    else byMonth[monthKey].expense += Number(t.amount)
  })

  const sortedKeys = Object.keys(byMonth).sort()
  const labels = sortedKeys.map((key) => {
    const [year, month] = key.split('-')
    return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-IN', {
      month: 'short',
      year: '2-digit',
    })
  })
  const net = sortedKeys.map((key) => byMonth[key].income - byMonth[key].expense)

  return { labels, net }
}

export default function CashFlowChart({ transactions }) {
  const { labels, net } = useMemo(() => buildMonthlySeries(transactions), [transactions])
  const hasData = labels.length > 0

  return (
    <div className="border border-line p-6">
      <p className="text-xs uppercase tracking-wide text-slate mb-6">Cash flow trend</p>
      {hasData ? (
        <div className="h-[260px]">
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: 'Net cash flow',
                  data: net,
                  borderColor: '#1F6F5C',
                  backgroundColor: 'rgba(31, 111, 92, 0.08)',
                  fill: true,
                  tension: 0.35,
                  pointRadius: 3,
                  pointBackgroundColor: '#1F6F5C',
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (ctx) =>
                      ` ${new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                      }).format(ctx.raw)}`,
                  },
                },
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { font: { family: 'Inter', size: 11 }, color: '#6B7280' },
                },
                y: {
                  grid: { color: '#E4E0D6' },
                  ticks: {
                    font: { family: 'Inter', size: 11 },
                    color: '#6B7280',
                    callback: (v) => `₹${v}`,
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <p className="text-sm text-slate py-16 text-center">
          Add a few transactions to see your trend over time.
        </p>
      )}
    </div>
  )
}
