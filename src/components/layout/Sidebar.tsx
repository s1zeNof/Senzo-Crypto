import { NavLink } from "react-router-dom"
import { useUI } from "@/store/ui"
import { useAuth } from "@/components/auth/AuthProvider"
import { cn } from "@/lib/utils"
import { BookOpen, Wrench, CandlestickChart, History, Network, Star } from "lucide-react"

const items = [
  { to: "/learn", label: "Навчання", Icon: BookOpen },
  { to: "/practice", label: "Практика", Icon: Wrench },
  { to: "/sim", label: "Симулятор", Icon: CandlestickChart },
  { to: "/backtest", label: "Бектест", Icon: History },
  { to: "/web3", label: "Web3", Icon: Network },
  { to: "/pro", label: "Pro", Icon: Star }
]

export function Sidebar() {
  const { sidebarOpen } = useUI()
  const { user } = useAuth()
  if (!user) return null

  const W = 260
  return (
    <aside
      style={{ width: sidebarOpen ? W : 0 }}
      className={cn("fixed inset-y-0 left-0 z-40 overflow-hidden border-r border-border bg-card/70 backdrop-blur transition-[width] duration-200")}
    >
      <div className="flex h-14 items-center border-b border-border px-4 text-sm font-medium">Навігація</div>
      <nav className="p-2">
        {items.map(({to,label,Icon})=>(
          <NavLink key={to} to={to}
            className={({isActive})=>cn(
              "group flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted/60 transition",
              isActive && "bg-muted/60"
            )}
          >
            <Icon size={18} className="opacity-80 transition-transform group-hover:-translate-y-0.5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
