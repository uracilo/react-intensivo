import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './auth'

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('ana')
  const [password, setPassword] = useState('ana123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(username.trim(), password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrap">
      <section className="panel login-card">
        <div className="brand" style={{ marginBottom: '1rem' }}>
          <span className="brand-mark">TF</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.35rem' }}>TaskFlow</h1>
            <p className="tagline">Iniciá sesión (JWT o demo)</p>
          </div>
        </div>
        <form className="form" data-testid="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-box">{error}</div>}
          <label>
            Usuario
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <p className="meta" style={{ marginTop: '1rem' }}>
          Demo: ana / ana123 · luis / luis123 · admin / admin123
        </p>
      </section>
    </div>
  )
}
