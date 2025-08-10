export default function Learn() {
  const stages = [
    { id: "0", title: "Основи ринку, інфраструктура" },
    { id: "1", title: "Свічки, тренди, рівні" },
    { id: "2", title: "Стратегії + R/R" },
    { id: "3", title: "Журнал, дисципліна" },
  ]
  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Дорожня карта</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {stages.map(s=>(
          <div key={s.id} className="rounded-lg bg-card p-4 border border-border">
            <div className="font-medium">{s.title}</div>
            <div className="text-xs opacity-70 mt-1">уроки + мікро-тести</div>
            <button className="mt-3 px-3 py-1.5 rounded-md bg-muted text-sm">Відкрити</button>
          </div>
        ))}
      </div>
    </div>
  )
}
