import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthScreen() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setSubmitting(true)

   const action = mode === 'signin' ? signIn : signUp

   const result = await action(email, password)

    console.log('SUPABASE RESULT:', result)

    if (result.error) {
     setError(result.error.message)
    } else if (mode === 'signup') {
      setNotice('Account created successfully. You can now start tracking your finances.')
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <p className="font-display text-3xl">Ledger</p>
          <p className="mt-2 text-sm text-slate">
            {mode === 'signin' ? 'Sign in to see where your money went.' : 'Set up an account to start tracking.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line bg-white px-3.5 py-2.5 text-sm focus:border-ink transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line bg-white px-3.5 py-2.5 text-sm focus:border-ink transition-colors"
              placeholder="At least 6 characters"
            />
          </div>

          {error ? (
            <p className="text-sm text-red-600 bg-red-100 px-4 py-3 rounded">
             {String(error)}
           </p>
          ) : null}
          {notice && (
            <p className="text-sm text-teal bg-teal-soft px-3.5 py-2.5">{notice}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-paper py-2.5 text-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError(null)
            setNotice(null)
          }}
          className="mt-6 text-sm text-slate hover:text-ink transition-colors"
        >
          {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
