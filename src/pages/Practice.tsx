export default function Practice() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-lg bg-card p-4">
        <h3 className="mb-3 font-semibold">Risk Trainer</h3>
        <div className="text-sm opacity-70">Калькулятор позиції, R/R, SL/TP — додамо далі.</div>
      </div>
      <div className="rounded-lg bg-card p-4">
        <h3 className="mb-3 font-semibold">Candles Trainer</h3>
        <div className="text-sm opacity-70">Квіз по патернах — додамо інтерактив.</div>
      </div>
    </div>
  )
}
