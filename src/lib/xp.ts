import { doc, increment, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { StatusTier, TRADER_TIERS, WEB3_TIERS } from "@/data/statuses"

export type XPKinds = "trader" | "web3"

export function getTierForXP(kind: XPKinds, xp: number): StatusTier {
  const tiers = kind === "trader" ? TRADER_TIERS : WEB3_TIERS
  let current = tiers[0]
  for (const t of tiers) if (xp >= t.xpFrom) current = t
  return current
}
export function getNextTier(kind: XPKinds, xp: number): StatusTier | null {
  const tiers = kind === "trader" ? TRADER_TIERS : WEB3_TIERS
  for (const t of tiers) if (t.xpFrom > xp) return t
  return null
}

// атомарне нарахування XP
export async function addXP(uid: string, kind: XPKinds, amount: number) {
  const ref = doc(db, "users", uid)
  await setDoc(ref, { xp: { trader: 0, web3: 0 }, updatedAt: serverTimestamp() }, { merge: true })
  await updateDoc(ref, { [`xp.${kind}`]: increment(amount), updatedAt: serverTimestamp() })
}
