import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useUI, hydrateSidebarFromStorage } from "@/store/ui"
import { useAuth } from "@/components/auth/AuthProvider"
import { Sidebar } from "./Sidebar"   // <- додай імпорт

export function Shell() {
  const { sidebarOpen } = useUI()
  const { user } = useAuth()
  const W = 260

  useEffect(() => {
    hydrateSidebarFromStorage()
  }, [])

  return (
    <div className="relative">
      {user && <Sidebar />} {/* <- обов’язково рендеримо сам сайдбар, тільки для залогінених */}

      <div
        className="min-h-[calc(100dvh-56px)] transition-[margin] duration-200"
        style={{ marginLeft: user ? (sidebarOpen ? W : 0) : 0 }}
      >
        <main className="container mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
