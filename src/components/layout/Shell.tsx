// src/components/layout/Shell.tsx
import { useEffect } from "react"
import { Outlet, Link } from "react-router-dom"
import { useUI, hydrateSidebarFromStorage } from "@/store/ui"
import { useAuth } from "@/components/auth/AuthProvider"
import { Sidebar } from "./Sidebar"
import { cn } from "@/lib/utils"
import { BookOpen, BarChart3, Bot, Microscope, Network, Star, X } from "lucide-react"

const items = [
  { to: "/learn", label: "Навчання", Icon: BookOpen },
  { to: "/practice", label: "Практика", Icon: BarChart3 },
  { to: "/sim", label: "Симулятор", Icon: Bot },
  { to: "/backtest", label: "Бектест", Icon: Microscope },
  { to: "/web3", label: "Web3", Icon: Network },
  { to: "/pro", label: "Pro", Icon: Star }
];

function MobileSidebar() {
  const { sidebarOpen, setSidebar } = useUI();
  
  return (
    <>
      {/* Затемнення фону */}
      <div
        onClick={() => setSidebar(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />
      {/* Саме меню */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 md:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link to="/" onClick={() => setSidebar(false)} className="font-semibold tracking-wide">Senzo</Link>
          <button onClick={() => setSidebar(false)} className="rounded-md p-1.5 hover:bg-muted">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-grow p-2 space-y-1">
          {items.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebar(false)}
              className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted"
            >
              <Icon size={20} className="shrink-0" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}


export function Shell() {
  const { sidebarOpen } = useUI()
  const { user } = useAuth()

  useEffect(() => {
    hydrateSidebarFromStorage()
  }, [])

  return (
    <div className="relative">
      {user && (
        <>
          <Sidebar />       {/* Сайдбар для десктопу */}
          <MobileSidebar /> {/* Сайдбар-оверлей для мобільних */}
        </>
      )}

      {/* --- КЛЮЧОВА ЗМІНА ТУТ --- */}
      {/* Замість style, використовуються адаптивні класи Tailwind */}
      <div
        className={cn(
          "min-h-[calc(100dvh-56px)] transition-[margin-left] duration-300",
          // Відступ зліва ТІЛЬКИ для десктопу (md і більше)
          user && (sidebarOpen ? "md:ml-64" : "md:ml-20")
        )}
      >
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}