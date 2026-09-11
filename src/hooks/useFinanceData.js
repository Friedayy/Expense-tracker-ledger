import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useFinanceData() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [monthlyBudget, setMonthlyBudget] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    const [txRes, profileRes] = await Promise.all([
      supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false }),
      supabase.from('profiles').select('monthly_budget').eq('id', user.id).single(),
    ])

    if (txRes.error) setError(txRes.error.message)
    else setTransactions(txRes.data)

    // A missing profile row (edge case if the trigger hasn't run yet) isn't fatal.
    if (!profileRes.error && profileRes.data) {
      setMonthlyBudget(Number(profileRes.data.monthly_budget) || 0)
    }

    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const addTransaction = useCallback(
    async ({ title, amount, category, type, date }) => {
      if (!user) return { error: 'Not authenticated' }

      // Optimistic insert: build a temp row so the UI updates instantly,
      // then reconcile with the row Supabase actually created.
      const optimisticId = `optimistic-${Date.now()}`
      const optimisticRow = {
        id: optimisticId,
        user_id: user.id,
        title,
        amount,
        category,
        type,
        date,
      }
      setTransactions((prev) => [optimisticRow, ...prev])

      const { data, error } = await supabase
        .from('transactions')
        .insert({ user_id: user.id, title, amount, category, type, date })
        .select()
        .single()

      if (error) {
        setTransactions((prev) => prev.filter((t) => t.id !== optimisticId))
        return { error: error.message }
      }

      setTransactions((prev) => prev.map((t) => (t.id === optimisticId ? data : t)))
      return { data }
    },
    [user]
  )

  const deleteTransaction = useCallback(async (id) => {
    // Capture the removed row (via functional update) so we can restore it
    // on failure without needing `transactions` in the dependency array.
    let removed = null
    setTransactions((prev) => {
      removed = prev.find((t) => t.id === id) ?? null
      return prev.filter((t) => t.id !== id)
    })

    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) {
      if (removed) {
        setTransactions((prev) =>
          [...prev, removed].sort((a, b) => (a.date < b.date ? 1 : -1))
        )
      }
      return { error: error.message }
    }
    return { data: true }
  }, [])

  const updateBudget = useCallback(
    async (newBudget) => {
      if (!user) return { error: 'Not authenticated' }
      const previous = monthlyBudget
      setMonthlyBudget(newBudget)

      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, monthly_budget: newBudget })

      if (error) {
        setMonthlyBudget(previous)
        return { error: error.message }
      }
      return { data: true }
    },
    [user, monthlyBudget]
  )

  return {
    transactions,
    monthlyBudget,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    updateBudget,
    refresh: fetchAll,
  }
}
