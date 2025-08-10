import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"

type Ctx = { user: User|null; loading: boolean }
const AuthCtx = createContext<Ctx>({ user: null, loading: true })
export const useAuth = () => useContext(AuthCtx)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User|null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => onAuthStateChanged(auth, u => { setUser(u); setLoading(false) }), [])
  return <AuthCtx.Provider value={{ user, loading }}>{children}</AuthCtx.Provider>
}
