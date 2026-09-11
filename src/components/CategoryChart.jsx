import { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { CATEGORY_COLORS } from '../lib/supabaseClient'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function CategoryChart({ transactions }) {
  const { labels, data, colors } = useMemo(() => {
    const totals = {}
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        totals[t.category] = (totals[t.category] || 0) + Number(t.amount)
      })

    const labels = Object.keys(totals)
    return {
      labels,
      data: labels.map((l) => totals[l]),
      colors: labels.map((l) => CATEGORY_COLORS[l] || '#9C8F7A'),
    }
  }, [transactions])

  const hasData = data.length > 0

  return (
    <div className="border border-line p-6">
      <p className="text-xs uppercase tracking-wide text-slate mb-6">Expenses by category</p>
      {hasData ? (
        <div className="max-w-[260px] mx-auto">
          <Doughnut
            data={{
              labels,
              datasets: [
                {
                  data,
                  backgroundColor: colors,
                  borderColor: '#F7F5F0',
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    boxWidth: 10,
                    boxHeight: 10,
                    padding: 16,
                    font: { family: 'Inter', size: 12 },
                    color: '#14181F',
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (ctx) =>
                      ` ${ctx.label}: ${new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                      }).format(ctx.raw)}`,
                  },
                },
              },
              cutout: '65%',
            }}
          />
        </div>
      ) : (
        <p className="text-sm text-slate py-16 text-center">
          No expenses yet — add one to see the breakdown.
        </p>
      )}
    </div>
  )
}
