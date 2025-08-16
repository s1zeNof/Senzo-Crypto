// src/components/layout/Sidebar.tsx
import { Link, NavLink } from "react-router-dom"; // <-- ОСЬ ЦЕЙ РЯДОК БУЛО ПРОПУЩЕНО
import { useUI } from "@/store/ui";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";
import { BookOpen, BarChart3, Bot, Microscope, Network, Star, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "../ui/button";

const items = [
  { to: "/learn", label: "Навчання", Icon: BookOpen },
  { to: "/practice", label: "Практика", Icon: BarChart3 },
  { to: "/sim", label: "Симулятор", Icon: Bot },
  { to: "/backtest", label: "Бектест", Icon: Microscope },
  { to: "/web3", label: "Web3", Icon: Network },
  { to: "/pro", label: "Pro", Icon: Star }
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUI();
  const { user } = useAuth();
  if (!user) return null;

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 hidden md:flex flex-col border-r border-border bg-card/95 backdrop-blur-sm transition-[width] duration-300",
      sidebarOpen ? "w-64" : "w-20 items-center"
    )}>
      <div className="flex h-14 items-center border-b border-border px-4 w-full">
        <Link to="/" className={cn("font-semibold tracking-wide flex items-center gap-2", !sidebarOpen && "justify-center")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {sidebarOpen && <span className="transition-opacity duration-300">Senzo</span>}
        </Link>
      </div>

      <nav className="flex-grow p-2 space-y-1 w-full">
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200",
              "hover:bg-muted",
              isActive ? "bg-muted text-primary" : "text-foreground/80 hover:text-foreground",
              !sidebarOpen && "justify-center"
            )}
            title={label}
          >
            <Icon size={20} className="shrink-0" />
            {sidebarOpen && <span className="transition-opacity duration-300">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-2 w-full">
        <Button onClick={toggleSidebar} variant="ghost" size="sm" className="w-full justify-start gap-3 px-3">
          {sidebarOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
          {sidebarOpen && <span>Згорнути</span>}
        </Button>
      </div>
    </aside>
  );
}