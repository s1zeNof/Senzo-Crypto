import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom"
import { Shell } from "@/components/layout/Shell"
import { Header } from "@/components/layout/Header"
import AuthProvider from "@/components/auth/AuthProvider"
import RequireAuth from "@/components/auth/RequireAuth"

import Home from "@/pages/Home"
import Onboarding from "@/pages/Onboarding"
import Learn from "@/pages/Learn"
import Practice from "@/pages/Practice"
import Sim from "@/pages/Sim"
import Backtest from "@/pages/Backtest"
import Profile from "@/pages/Profile"
import Web3 from "@/pages/Web3"
import Pro from "@/pages/Pro"
import AuthPage from "@/pages/Auth"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Header />
        <Shell />
      </AuthProvider>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "auth", element: <AuthPage /> },
      { path: "login", element: <Navigate to="/auth" replace /> },

      { path: "onboarding", element: <RequireAuth><Onboarding /></RequireAuth> },
      { path: "learn", element: <RequireAuth><Learn /></RequireAuth> },
      { path: "practice", element: <RequireAuth><Practice /></RequireAuth> },
      { path: "sim", element: <RequireAuth><Sim /></RequireAuth> },
      { path: "backtest", element: <RequireAuth><Backtest /></RequireAuth> },
      { path: "profile", element: <RequireAuth><Profile /></RequireAuth> },
      { path: "web3", element: <RequireAuth><Web3 /></RequireAuth> },
      { path: "pro", element: <RequireAuth><Pro /></RequireAuth> }
    ]
  }
])

export default function App() { return <RouterProvider router={router} /> }
