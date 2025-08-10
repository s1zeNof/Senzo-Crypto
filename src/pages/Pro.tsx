import { Link } from "react-router-dom"

export default function Pro() {
  return (
    <div className="grid gap-3 max-w-xl">
      <h2 className="text-xl font-semibold">Pro доступ</h2>
      <ul className="text-sm list-disc pl-5 opacity-90">
        <li>Симулятор ф’ючерсів</li>
        <li>Backtest Lite</li>
        <li>Авторські треки/стратегії</li>
      </ul>
      <Link to="#" className="mt-2 px-4 py-2 rounded-md bg-primary text-black w-max">Активувати</Link>
    </div>
  )
}
