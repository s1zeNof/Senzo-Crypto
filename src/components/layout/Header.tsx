import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useUI } from "@/store/ui"
import { useAuth } from "@/components/auth/AuthProvider"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { cn } from "@/lib/utils"

export function Header() {
  const { toggleSidebar } = useUI()
  const { user } = useAuth()
  const nav = useNavigate()
  const [q,setQ] = useState("")

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/70 backdrop-blur">
      <div className="mx-auto grid h-14 grid-cols-[auto,1fr,auto] items-center gap-3 px-3 md:px-6">
        {/* logo + toggle */}
        <div className="flex items-center gap-2">
          {user && (
            <button onClick={toggleSidebar} className="rounded-md border border-border bg-muted/60 p-1.5 hover:bg-muted">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 6h18v2H3zm0 5h12v2H3zm0 5h18v2H3z"/></svg>
            </button>
          )}
          <div onClick={()=>nav("/")} className="cursor-pointer select-none font-[var(--font-title)] text-lg tracking-wide">
            Senzo <span className="text-cyan-400">Crypto</span>
          </div>
        </div>

        {/* centered search */}
        <form
          onSubmit={(e)=>{e.preventDefault(); if(q.trim()) nav(`/learn?search=${encodeURIComponent(q.trim())}`)}}
          className="mx-auto w-full max-w-xl"
        >
          <input
            className={cn(
              "w-full rounded-md border border-border bg-muted/60 px-3 py-1.5 text-sm outline-none",
              "focus:ring-2 focus:ring-cyan-400/40"
            )}
            placeholder="Пошук по статтях, треках, інструментах…"
            value={q} onChange={e=>setQ(e.target.value)}
          />
        </form>

        {/* avatar */}
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <button
              onClick={()=>nav("/profile")}
              className="h-8 w-8 overflow-hidden rounded-full ring-1 ring-border hover:ring-cyan-400/50 transition"
              title="Профіль"
            >
              {user.photoURL
                ? <img src={user.photoURL} className="h-full w-full object-cover" />
                : <div className="flex h-full w-full items-center justify-center text-sm">{(user.displayName||user.email||"U").slice(0,1).toUpperCase()}</div>}
            </button>
          ) : (
            <button onClick={()=>nav("/auth")} className="rounded-md border border-border bg-muted/60 px-3 py-1.5 text-sm hover:bg-muted">
              Увійти
            </button>
          )}
          {user && (
            <button onClick={()=>signOut(auth)} className="hidden md:block rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted/60">
              Вийти
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
