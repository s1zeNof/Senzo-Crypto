import { create } from "zustand"

type UIState = {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebar: (open: boolean) => void
}

const KEY = "senzo-ui:sidebar"

export const useUI = create<UIState>((set, get) => ({
  // дефолт: відкритий
  sidebarOpen: true,
  toggleSidebar: () => {
    const next = !get().sidebarOpen
    try { localStorage.setItem(KEY, next ? "1" : "0") } catch {}
    set({ sidebarOpen: next })
  },
  setSidebar: (open) => {
    try { localStorage.setItem(KEY, open ? "1" : "0") } catch {}
    set({ sidebarOpen: open })
  }
}))

// helper щоб підтягнути стан після mount (у браузері)
export function hydrateSidebarFromStorage() {
  try {
    const v = localStorage.getItem(KEY)
    if (v) useUI.getState().setSidebar(v === "1")
  } catch {}
}
