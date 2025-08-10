// src/pages/Profile.tsx
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore"
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { cn } from "@/lib/utils"
import { TRADER_TIERS, WEB3_TIERS, type StatusTier } from "@/data/statuses"

/* ---------- helpers ---------- */
function getTierForXP(tiers: StatusTier[], xp: number): StatusTier {
  let current = tiers[0]
  for (const t of tiers) if (xp >= t.xpFrom) current = t
  return current
}
function getNextTier(tiers: StatusTier[], xp: number): StatusTier | null {
  for (const t of tiers) if (t.xpFrom > xp) return t
  return null
}

function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-xl border border-border bg-card/70 p-4 backdrop-blur min-w-0", // важливо: min-w-0
        props.className
      )}
    />
  )
}

function Roadmap({ tiers, xp }: { tiers: StatusTier[]; xp: number }) {
  return (
    <div className="overflow-x-auto">                 {/* скрол лише всередині картки */}
      <div className="w-max">                         {/* ширина дорівнює контенту */}
        <div className="flex items-stretch gap-3">
          {tiers.map(t => {
            const unlocked = xp >= t.xpFrom
            return (
              <div
                key={t.id}
                className={cn(
                  "relative w-44 shrink-0 rounded-lg border p-3 transition-transform",
                  unlocked
                    ? "border-cyan-400/40 bg-cyan-400/10 hover:-translate-y-0.5"
                    : "border-border bg-card/60 opacity-70"
                )}
                title={t.desc}
              >
                <div className="text-xs opacity-70">LV {t.level}</div>
                <div className="mt-1 flex items-center gap-2 font-medium">
                  <span>{t.emoji}</span> <span>{t.title}</span>
                </div>
                <div className="mt-2 text-xs opacity-70">{t.xpFrom} XP</div>
                {!unlocked && <div className="absolute right-2 top-2 text-xs opacity-60">🔒</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ---------- main ---------- */
export default function Profile() {
  const user = auth.currentUser
  const uid = user?.uid
  const [loadingInit, setLoadingInit] = useState(false)
  const [missingDoc, setMissingDoc] = useState(false)

  const [streak, setStreak] = useState(0)
  const [xp, setXP] = useState<{ trader: number; web3: number }>({ trader: 0, web3: 0 })

  // live: читаємо users/{uid}; якщо документа нема — показуємо кнопку ініціалізації
  useEffect(() => {
    if (!uid) return
    let unsub: (() => void) | undefined

    ;(async () => {
      const ref = doc(db, "users", uid)
      const snap = await getDoc(ref)
      if (!snap.exists()) setMissingDoc(true)

      unsub = onSnapshot(ref, s => {
        const d = s.data() as any
        if (!d) { setMissingDoc(true); return }
        setMissingDoc(false)
        setXP({ trader: d?.xp?.trader ?? 0, web3: d?.xp?.web3 ?? 0 })
        setStreak(d?.streak ?? 0)
      })
    })()

    return () => { if (unsub) unsub() }
  }, [uid])

  const initProfile = async () => {
    if (!uid) return
    setLoadingInit(true)
    const ref = doc(db, "users", uid)
    await setDoc(ref, {
      email: user?.email ?? null,
      displayName: user?.displayName ?? null,
      photoURL: user?.photoURL ?? null,
      plan: "free",
      xp: { trader: 0, web3: 0 },
      streak: 0,
      lastActiveAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true })
    setLoadingInit(false)
  }

  // демо-активність для графіка (UI)
  const chartData = useMemo(
    () => Array.from({ length: 14 }).map((_, i) => ({
      d: `D${i + 1}`,
      v: Math.max(0, Math.round(30 + Math.sin(i / 2) * 20 + (i * 2))),
    })),
    []
  )

  // умовний візуальний прогрес (замінимо на реальні метрики)
  const progress = {
    learn: Math.min(100, Math.round(xp.trader / 150 * 10)),
    practice: Math.min(100, Math.round(xp.trader / 150 * 8)),
    web3: Math.min(100, Math.round(xp.web3 / 150 * 6)),
  }

  const curT = getTierForXP(TRADER_TIERS, xp.trader)
  const nextT = getNextTier(TRADER_TIERS, xp.trader)
  const curW = getTierForXP(WEB3_TIERS, xp.web3)
  const nextW = getNextTier(WEB3_TIERS, xp.web3)

  useEffect(() => {
    document.body.classList.add("profile-fade")
    return () => document.body.classList.remove("profile-fade")
  }, [])

  return (
    <div className="grid gap-6 lg:grid-cols-3 min-w-0">            {/* важливо: min-w-0 */}
      {/* left column */}
      <div className="lg:col-span-2 grid gap-6 min-w-0">          {/* важливо: min-w-0 */}
        <Card className="overflow-hidden">
          <div className="relative">
            <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full opacity-25 blur-3xl bg-cyan-400/40 animate-float" />
            <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full opacity-20 blur-3xl bg-cyan-700/30 animate-float [animation-delay:-1.2s]" />
          </div>

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Профіль</h2>
              <div className="mt-1 text-sm opacity-80">{user?.displayName || user?.email}</div>
              {missingDoc && (
                <div className="mt-3">
                  <button
                    onClick={initProfile}
                    disabled={loadingInit}
                    className="rounded-md border border-border bg-muted/60 px-3 py-1.5 text-sm hover:bg-muted"
                  >
                    {loadingInit ? "Створюємо…" : "Ініціалізувати профіль"}
                  </button>
                </div>
              )}
            </div>
            <Link to="/settings" className="rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm hover:bg-muted">
              Налаштування
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card/70 p-4">
              <div className="text-xs opacity-70">Прогрес навчання</div>
              <div className="mt-1 text-2xl font-semibold">{progress.learn}%</div>
              <div className="mt-2 h-2 w-full rounded bg-muted">
                <div className="h-2 rounded bg-cyan-400 transition-all" style={{ width: `${progress.learn}%` }} />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card/70 p-4">
              <div className="text-xs opacity-70">Практика</div>
              <div className="mt-1 text-2xl font-semibold">{progress.practice}%</div>
              <div className="mt-2 h-2 w-full rounded bg-muted">
                <div className="h-2 rounded bg-cyan-400 transition-all" style={{ width: `${progress.practice}%` }} />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card/70 p-4">
              <div className="text-xs opacity-70">Web3</div>
              <div className="mt-1 text-2xl font-semibold">{progress.web3}%</div>
              <div className="mt-2 h-2 w-full rounded bg-muted">
                <div className="h-2 rounded bg-cyan-400 transition-all" style={{ width: `${progress.web3}%` }} />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="font-medium">Активність (14 днів)</div>
            <div className="text-xs opacity-70">тести/практика/сим</div>
          </div>
          <div className="h-48 min-w-0">                          {/* важливо: min-w-0 */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
                <XAxis dataKey="d" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "rgba(18,20,24,.9)", border: "1px solid #2a2f37" }} />
                <Line type="monotone" dataKey="v" stroke="#22d3ee" strokeWidth={2} dot={false} animationDuration={800} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-3 font-medium">Trader Roadmap — {xp.trader} XP</div>
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold">
              {getTierForXP(TRADER_TIERS, xp.trader).emoji} {getTierForXP(TRADER_TIERS, xp.trader).title}
            </div>
            {getNextTier(TRADER_TIERS, xp.trader) && (
              <div className="text-xs opacity-70">
                → {getNextTier(TRADER_TIERS, xp.trader)!.title} за {getNextTier(TRADER_TIERS, xp.trader)!.xpFrom - xp.trader} XP
              </div>
            )}
          </div>
          <div className="mt-4">
            <Roadmap tiers={TRADER_TIERS} xp={xp.trader} />
          </div>
        </Card>

        <Card>
          <div className="mb-3 font-medium">Web3 Roadmap — {xp.web3} XP</div>
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold">
              {getTierForXP(WEB3_TIERS, xp.web3).emoji} {getTierForXP(WEB3_TIERS, xp.web3).title}
            </div>
            {getNextTier(WEB3_TIERS, xp.web3) && (
              <div className="text-xs opacity-70">
                → {getNextTier(WEB3_TIERS, xp.web3)!.title} за {getNextTier(WEB3_TIERS, xp.web3)!.xpFrom - xp.web3} XP
              </div>
            )}
          </div>
          <div className="mt-4">
            <Roadmap tiers={WEB3_TIERS} xp={xp.web3} />
          </div>
        </Card>

        <Card>
          <div className="mb-3 font-medium">Налаштування швидко</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs opacity-70">Ризик на угоду (%)</span>
              <input className="rounded-md border border-border bg-muted/60 p-2 outline-none focus:ring-2 focus:ring-cyan-400/40" defaultValue={1} />
            </label>
            <label className="grid gap-1">
              <span className="text-xs opacity-70">Стиль трейдингу</span>
              <select className="rounded-md border border-border bg-muted/60 p-2 outline-none focus:ring-2 focus:ring-cyan-400/40" defaultValue="day">
                <option value="scalp">Скальп</option>
                <option value="day">Дей</option>
                <option value="swing">Свінг</option>
              </select>
            </label>
          </div>
          <button className="mt-4 h-10 rounded-md bg-cyan-400 px-4 text-sm font-medium text-black hover:opacity-90">Зберегти</button>
        </Card>
      </div>

      {/* right column */}
      <div className="grid gap-6 min-w-0">                         {/* важливо: min-w-0 */}
        <Card className="relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-400/30 blur-2xl" />
          <div className="mb-2 text-xs opacity-70">Streak</div>
          <div className="mb-3 text-4xl font-semibold">{streak} дні</div>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={cn("h-2 flex-1 rounded", i < streak ? "bg-cyan-400" : "bg-muted")} />
            ))}
          </div>
          <div className="mt-3 text-xs opacity-70">Тримай серію! +1 за будь-яку активність.</div>
        </Card>

        <Card>
          <div className="mb-3 font-medium">Бейджі</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "streak5", label: "Streak 5", earned: streak >= 5 },
              { id: "quiz100", label: "100 правильних", earned: xp.trader >= 1200 },
              { id: "bt10", label: "10 бектестів", earned: xp.trader >= 2000 },
              { id: "sim100", label: "100 симуляцій", earned: xp.trader >= 3000 },
            ].map(b => (
              <div
                key={b.id}
                className={cn(
                  "rounded-lg border border-border p-3 text-sm transition-transform hover:-translate-y-0.5",
                  b.earned ? "bg-cyan-400/10" : "opacity-60"
                )}
              >
                <div className="text-xs opacity-70">{b.earned ? "Отримано" : "Заблоковано"}</div>
                <div className="mt-1 font-medium">{b.label}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-2 font-medium">Швидкі дії</div>
          <div className="grid gap-2">
            <Link to="/learn" className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm hover:bg-muted">Продовжити навчання</Link>
            <Link to="/practice" className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm hover:bg-muted">Відкрити тренажери</Link>
            <Link to="/sim" className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm hover:bg-muted">Почати симулятор</Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
