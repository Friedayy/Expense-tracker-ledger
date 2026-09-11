import { useAuth } from './context/AuthContext'
import AuthScreen from './components/AuthScreen'
import Dashboard from './components/Dashboard'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <p className="text-sm text-slate">Loading…</p>
      </div>
    )
  }

  return user ? <Dashboard /> : <AuthScreen />
}
