import { NavLink } from "react-router-dom"

export function Topbar() {
  const link = "px-3 py-2 rounded-md text-sm"
  const active = "bg-muted/60"
  return (
    <div className="sticky top-0 z-50 border-b border-border bg-card/60 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center gap-4">
        <NavLink to="/" className="font-semibold tracking-wide">Senzo Crypto</NavLink>
        <nav className="hidden md:flex gap-1">
          <NavLink to="/learn" className={({isActive})=>`${link} ${isActive?active:""}`}>Навчання</NavLink>
          <NavLink to="/practice" className={({isActive})=>`${link} ${isActive?active:""}`}>Практика</NavLink>
          <NavLink to="/sim" className={({isActive})=>`${link} ${isActive?active:""}`}>Симулятор</NavLink>
          <NavLink to="/backtest" className={({isActive})=>`${link} ${isActive?active:""}`}>Бектест</NavLink>
          <NavLink to="/web3" className={({isActive})=>`${link} ${isActive?active:""}`}>Web3</NavLink>
          <NavLink to="/pro" className={({isActive})=>`${link} ${isActive?active:""}`}>Pro</NavLink>
        </nav>
        <div className="ml-auto text-xs opacity-70">alpha</div>
      </div>
    </div>
  )
}
