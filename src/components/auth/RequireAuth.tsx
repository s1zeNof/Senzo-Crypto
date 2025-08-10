import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./AuthProvider"

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return null
  if (!user) {
    const next = encodeURIComponent(loc.pathname + loc.search)
    return <Navigate to={`/auth?next=${next}`} replace />
  }
  return children
}
