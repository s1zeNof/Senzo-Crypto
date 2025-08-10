import { useState } from "react"

export default function Onboarding() {
  const [form, setForm] = useState({ displayName: "", experience: "newbie", style: "day", riskPercent: 1 })
  return (
    <div className="max-w-xl grid gap-4">
      <h2 className="text-xl font-semibold">Онбординг</h2>
      <label className="grid gap-1">
        <span className="text-sm">Імʼя</span>
        <input className="bg-muted rounded-md p-2" value={form.displayName}
               onChange={e=>setForm({...form, displayName: e.target.value})} />
      </label>
      <div className="grid grid-cols-3 gap-3">
        <label className="grid gap-1">
          <span className="text-sm">Досвід</span>
          <select className="bg-muted rounded-md p-2" value={form.experience}
                  onChange={e=>setForm({...form, experience: e.target.value})}>
            <option value="newbie">0 — старт</option>
            <option value="junior">базовий</option>
            <option value="mid">середній</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Стиль</span>
          <select className="bg-muted rounded-md p-2" value={form.style}
                  onChange={e=>setForm({...form, style: e.target.value})}>
            <option value="scalp">скальп</option>
            <option value="day">дей</option>
            <option value="swing">свінг</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Ризик %</span>
          <input type="number" step="0.1" className="bg-muted rounded-md p-2" value={form.riskPercent}
                 onChange={e=>setForm({...form, riskPercent: +e.target.value})}/>
        </label>
      </div>
      <button className="px-4 py-2 rounded-md bg-primary text-black w-max">Зберегти</button>
    </div>
  )
}
