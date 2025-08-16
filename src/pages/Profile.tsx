// src/pages/Profile.tsx
import { useEffect, useMemo, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";
import { cn } from "@/lib/utils";
import { TRADER_TIERS, WEB3_TIERS, type StatusTier } from "@/data/statuses";
import { PlusCircle, Trash2, Search, Wallet, X as XIcon, MessageSquareText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ASSET_LOCATIONS, type AssetLocation } from "@/data/portfolioData";
import { useDebounce } from "@/hooks/useDebounce";

/* ---------- helpers ---------- */
const generateId = () => `id_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;
function getTierForXP(tiers: StatusTier[], xp: number): StatusTier { let current = tiers[0]; for (const t of tiers) if (xp >= t.xpFrom) current = t; return current; }
function getNextTier(tiers: StatusTier[], xp: number): StatusTier | null { for (const t of tiers) if (t.xpFrom > xp) return t; return null; }
function Card(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props} className={cn("rounded-xl border border-border bg-card/70 p-4 backdrop-blur min-w-0", props.className)} />; }
function Roadmap({ tiers, xp }: { tiers: StatusTier[]; xp: number }) { return ( <div className="overflow-x-auto"><div className="w-max"><div className="flex items-stretch gap-3">{tiers.map(t => { const unlocked = xp >= t.xpFrom; return ( <div key={t.id} className={cn("relative w-44 shrink-0 rounded-lg border p-3 transition-transform", unlocked ? "border-primary/40 bg-primary/10 hover:-translate-y-0.5" : "border-border bg-card/60 opacity-70")} title={t.desc}> <div className="text-xs opacity-70">LV {t.level}</div> <div className="mt-1 flex items-center gap-2 font-medium"><span>{t.emoji}</span> <span>{t.title}</span></div> <div className="mt-2 text-xs opacity-70">{t.xpFrom} XP</div> {!unlocked && <div className="absolute right-2 top-2 text-xs opacity-60">🔒</div>} </div> ) })}</div></div></div> ); }
const Portal = ({ children }: { children: ReactNode }) => { const [mounted, setMounted] = useState(false); useEffect(() => { setMounted(true); return () => setMounted(false); }, []); return mounted ? createPortal(children, document.body) : null; };

// +++ КОМПОНЕНТ ПОРТФЕЛЯ +++
type Asset = { id: string; symbol: string; name: string; coingeckoId: string; quantity: number; avgPrice: number; location: AssetLocation; image: string; notes?: string; };
type Prices = { [coingeckoId: string]: { usd: number, usd_24h_change: number } };
type Rates = { uah: number; eur: number };
type CoinSearchResult = { id: string; name: string; symbol: string; thumb: string };

const PortfolioCard = ({ uid }: { uid: string }) => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [prices, setPrices] = useState<Prices>({});
    const [rates, setRates] = useState<Rates>({ uah: 1, eur: 1 });
    const [currency, setCurrency] = useState<'USDT' | 'UAH' | 'EUR'>('USDT');
    const [isAdding, setIsAdding] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
    const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);

    const userDocRef = useMemo(() => doc(db, "users", uid), [uid]);

    useEffect(() => {
        const unsub = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) setAssets(docSnap.data()?.portfolioAssets || []);
        });
        return () => unsub();
    }, [userDocRef]);

    useEffect(() => {
        const fetchAllData = async () => {
            if (assets.length === 0) { setPrices({}); return; };
            try {
                const ids = assets.map(a => a.coingeckoId).join(',');
                const [priceRes, ratesRes] = await Promise.all([
                    fetch(`/coingecko-api/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`),
                    fetch(`/coingecko-api/api/v3/simple/price?ids=tether&vs_currencies=uah,eur`)
                ]);
                if (!priceRes.ok || !ratesRes.ok) throw new Error('CoinGecko rate limit or error');
                const priceData = await priceRes.json();
                const ratesData = await ratesRes.json();
                setPrices(priceData);
                if (ratesData.tether) setRates({ uah: ratesData.tether.uah, eur: ratesData.tether.eur });
            } catch (error) { console.error("Failed to fetch prices:", error); }
        };
        const timer = setTimeout(fetchAllData, 500);
        return () => clearTimeout(timer);
    }, [assets]);

    const handleAddAsset = async (newAsset: Omit<Asset, 'id'>) => {
        const newAssets = [...assets, { ...newAsset, id: generateId() }];
        await setDoc(userDocRef, { portfolioAssets: newAssets }, { merge: true });
        setIsAdding(false);
    };

    const handleDeleteAsset = async (id: string) => {
        const newAssets = assets.filter(a => a.id !== id);
        await updateDoc(userDocRef, { portfolioAssets: newAssets });
        setAssetToDelete(null);
    };

    const totalValue = useMemo(() => {
        const valueInUsd = assets.reduce((acc, asset) => (acc + asset.quantity * (prices[asset.coingeckoId]?.usd ?? 0)), 0);
        if (currency === 'UAH') return valueInUsd * rates.uah;
        if (currency === 'EUR') return valueInUsd * rates.eur;
        return valueInUsd;
    }, [assets, prices, currency, rates]);
    
    return (
        <Card>
            <div className="flex justify-between items-center mb-4"><h3 className="font-medium">Мій портфель</h3><div className="flex items-center gap-1 rounded-full border border-border p-0.5">{(['USDT', 'UAH', 'EUR'] as const).map(c => (<button key={c} onClick={() => setCurrency(c)} className={cn("text-xs px-2 py-0.5 rounded-full", currency === c && "bg-muted")}>{c}</button>))}</div></div>
            <div className="text-3xl font-bold mb-4">{totalValue.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</div>
            <div className="space-y-1">
                {assets.map(asset => {
                    const priceInfo = prices[asset.coingeckoId];
                    const currentPrice = priceInfo?.usd ?? 0;
                    const currentValue = asset.quantity * currentPrice;
                    const pnl = currentValue - asset.quantity * asset.avgPrice;
                    const pnlPercent = (asset.avgPrice > 0) ? (pnl / (asset.quantity * asset.avgPrice)) * 100 : 0;
                    return (
                        <div key={asset.id} onClick={() => setViewingAsset(asset)} className="group flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted/50 cursor-pointer">
                            <div className="flex items-center gap-3"><img src={asset.image} alt={asset.name} className="h-6 w-6 rounded-full" /><div><div className="font-bold flex items-center gap-1.5">{asset.symbol}</div><div className="text-xs text-foreground/60">{asset.quantity} @ ${asset.avgPrice.toLocaleString()}</div></div></div>
                            <div className="text-right flex items-center gap-3"><div><div className="font-medium">${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div className={cn("text-xs", pnl >= 0 ? 'text-green-400' : 'text-red-400')}>{pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)</div></div><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); setAssetToDelete(asset);}}><Trash2 className="h-4 w-4 text-red-400/80" /></Button></div>
                        </div>
                    );
                })}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-primary" onClick={() => setIsAdding(true)}><PlusCircle className="mr-2 h-4 w-4" /> Додати актив</Button>
            {isAdding && <AddAssetModal onAdd={handleAddAsset} onClose={() => setIsAdding(false)} />}
            {assetToDelete && <DeleteConfirmModal asset={assetToDelete} onConfirm={() => handleDeleteAsset(assetToDelete.id)} onCancel={() => setAssetToDelete(null)} />}
            {viewingAsset && <AssetDetailModal asset={viewingAsset} onClose={() => setViewingAsset(null)} />}
        </Card>
    );
};

const AddAssetModal = ({ onClose, onAdd }: { onClose: () => void, onAdd: (asset: Omit<Asset, 'id'>) => void }) => {
    const [step, setStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [searchResults, setSearchResults] = useState<CoinSearchResult[]>([]);
    const [selectedCoin, setSelectedCoin] = useState<CoinSearchResult | null>(null);
    const [formData, setFormData] = useState({ quantity: '', avgPrice: '', location: 'binance' as AssetLocation, notes: '' });
    const [useCurrentPrice, setUseCurrentPrice] = useState(false);

    useEffect(() => {
        if (debouncedSearch.length < 2) { setSearchResults([]); return; }
        const searchCoins = async () => {
            const res = await fetch(`/coingecko-api/api/v3/search?query=${debouncedSearch}`);
            const data = await res.json();
            setSearchResults(data.coins || []);
        };
        searchCoins();
    }, [debouncedSearch]);
    
    useEffect(() => {
        if (useCurrentPrice && selectedCoin) {
            const fetchCurrentPrice = async () => {
                const res = await fetch(`/coingecko-api/api/v3/simple/price?ids=${selectedCoin.id}&vs_currencies=usd`);
                const data = await res.json();
                if(data[selectedCoin.id]?.usd) {
                    setFormData(f => ({...f, avgPrice: data[selectedCoin.id].usd.toString()}));
                }
            };
            fetchCurrentPrice();
        }
    }, [useCurrentPrice, selectedCoin]);

    const handleSelectCoin = (coin: CoinSearchResult) => { setSelectedCoin(coin); setStep(2); };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCoin || !formData.quantity || !formData.avgPrice) return;
        onAdd({
            coingeckoId: selectedCoin.id,
            name: selectedCoin.name,
            symbol: selectedCoin.symbol.toUpperCase(),
            image: selectedCoin.thumb,
            quantity: parseFloat(formData.quantity),
            avgPrice: parseFloat(formData.avgPrice),
            location: formData.location,
            notes: formData.notes,
        });
    };

    return (
        <Portal><div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}><div className="bg-card border border-border rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">{step === 1 ? "Знайти актив" : `Додати ${selectedCoin?.name}`}</h3><Button variant="ghost" size="icon" onClick={onClose}><XIcon size={20} /></Button></div>{step === 1 ? (<div className="space-y-3"><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" /><Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Наприклад, Bitcoin або BTC" className="pl-10" /></div><div className="max-h-60 overflow-y-auto space-y-1">{searchResults.map(c => (<div key={c.id} onClick={() => handleSelectCoin(c)} className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted"><img src={c.thumb} alt={c.name} className="h-6 w-6 rounded-full"/><span>{c.name} ({c.symbol.toUpperCase()})</span></div>))}</div></div>) : (<form onSubmit={handleSubmit} className="space-y-4"><div className="flex items-center gap-3"><img src={selectedCoin!.thumb} alt={selectedCoin!.name} className="h-8 w-8 rounded-full"/><span className="text-lg font-bold">{selectedCoin!.name} ({selectedCoin!.symbol.toUpperCase()})</span></div><div><label className="text-xs text-foreground/70">Кількість</label><Input type="number" step="any" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required /></div><div><div className="flex items-center justify-between"><label className="text-xs text-foreground/70">Середня ціна покупки (USD)</label><div className="flex items-center gap-2"><input id="useMarket" type="checkbox" checked={useMarket} onChange={e => setUseMarket(e.target.checked)} /><label htmlFor="useMarket" className="text-xs text-foreground/70">Встановити ринкову</label></div></div><Input type="number" step="any" value={form.avgPrice} onChange={e => setForm(f => ({ ...f, avgPrice: e.target.value }))} disabled={useMarket} required /></div><div><label className="text-xs text-foreground/70">Розташування</label><select value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value as AssetLocation }))} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="" disabled>Оберіть…</option>{Object.entries(ASSET_LOCATIONS).map(([key, { name }]) => (<option key={key} value={key}>{name}</option>))}</select></div><div><label className="text-xs text-foreground/70">Нотатки (опціонально)</label><textarea className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div><Button type="submit" className="w-full">Додати в портфель</Button></form>)}</div></div></Portal>
    );
};

const DeleteConfirmModal = ({ asset, onConfirm, onCancel }: { asset: Asset; onConfirm: () => void; onCancel: () => void }) => (
    <Portal><div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onCancel}><div className="w-full max-w-sm rounded-lg border border-border bg-card p-6" onClick={e => e.stopPropagation()}><div className="text-center"><AlertTriangle className="mx-auto h-12 w-12 text-red-500/80" /><h3 className="mt-4 text-lg font-semibold">Видалити актив?</h3><p className="mt-2 text-sm text-foreground/70">Ви впевнені, що хочете видалити <b>{asset.quantity} {asset.symbol}</b>? Цю дію неможливо буде скасувати.</p></div><div className="mt-6 flex justify-end gap-3"><Button variant="secondary" onClick={onCancel}>Скасувати</Button><Button variant="destructive" onClick={onConfirm}>Видалити</Button></div></div></div></Portal>
);

const AssetDetailModal = ({ asset, onClose }: { asset: Asset, onClose: () => void }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const res = await fetch(`/coingecko-api/api/v3/coins/${asset.coingeckoId}/market_chart?vs_currency=usd&days=30&interval=daily`);
                if (!res.ok) return;
                const data = await res.json();
                const formattedData = data.prices.map((p: [number, number]) => ({ time: new Date(p[0]).toLocaleDateString(), value: p[1] }));
                setChartData(formattedData);
            } catch (error) { console.error("Failed to fetch chart data:", error); }
        };
        fetchChartData();
    }, [asset.coingeckoId]);

    const locationInfo = ASSET_LOCATIONS[asset.location];

    return (
        <Portal><div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <img src={asset.image} alt={asset.name} className="h-12 w-12 rounded-full" />
                        <div>
                            <h3 className="text-xl font-bold">{asset.name} ({asset.symbol})</h3>
                            <div className="text-sm text-foreground/70">Кількість: {asset.quantity}, Сер. ціна: ${asset.avgPrice.toLocaleString()}</div>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}><XIcon size={20} /></Button>
                </div>

                {asset.notes && <p className="text-sm bg-muted/50 p-3 rounded-md mb-4 border border-border"><b>Нотатки:</b> {asset.notes}</p>}
                
                <div className="flex items-center gap-2 text-sm mb-4">
                    <span>Зберігається в:</span>
                    {locationInfo?.logo ? <img src={locationInfo.logo} alt={locationInfo.name} className="h-5 w-5 rounded-full" /> : <Wallet size={18}/>}
                    <span className="font-medium">{locationInfo.name}</span>
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22eea2" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#22eea2" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis orientation="right" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ background: "rgba(18,20,24,.9)", border: "1px solid #2a2f37" }} />
                            <Area type="monotone" dataKey="value" stroke="#22eea2" fillOpacity={1} fill="url(#colorUv)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-center text-foreground/60 mt-2">Ціна за останні 30 днів (USD)</p>
            </div>
        </div></Portal>
    );
};

/* ---------- main ---------- */
export default function Profile() {
    const user = auth.currentUser;
    const uid = user?.uid;
    const [missingDoc, setMissingDoc] = useState(false);
    const [streak, setStreak] = useState(0);
    const [xp, setXP] = useState<{ trader: number; web3: number }>({ trader: 0, web3: 0 });

    useEffect(() => {
        if (!uid) return;
        let unsub: (() => void) | undefined;
        (async () => {
            const ref = doc(db, "users", uid);
            try {
                const snap = await getDoc(ref);
                if (!snap.exists()) setMissingDoc(true);
                unsub = onSnapshot(ref, s => {
                    const d = s.data();
                    if (!d) { setMissingDoc(true); return; }
                    setMissingDoc(false);
                    setXP({ trader: d?.xp?.trader ?? 0, web3: d?.xp?.web3 ?? 0 });
                    setStreak(d?.streak ?? 0);
                });
            } catch (e) { console.error(e); }
        })();
        return () => { if (unsub) unsub(); };
    }, [uid]);

    const initProfile = async () => {
        if (!uid) return;
        await setDoc(doc(db, "users", uid), {
            email: user?.email ?? null,
            displayName: user?.displayName ?? null,
            photoURL: user?.photoURL ?? null,
            plan: "free",
            xp: { trader: 0, web3: 0 },
            streak: 0,
            lastActiveAt: serverTimestamp(),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            portfolioAssets: [],
        }, { merge: true });
    };

    const chartData = useMemo(() => Array.from({ length: 14 }).map((_, i) => ({ d: `D${i + 1}`, v: Math.max(0, Math.round(30 + Math.sin(i / 2) * 20 + (i * 2))) })), []);
    const progress = {
        learn: Math.min(100, Math.round(xp.trader / 150 * 10)),
        practice: Math.min(100, Math.round(xp.trader / 150 * 8)),
        web3: Math.min(100, Math.round(xp.web3 / 150 * 6)),
    };

    if (!uid) return <div>Завантаження профілю…</div>;

    return (
        <div className="grid min-w-0 gap-6 lg:grid-cols-3">
            <div className="grid min-w-0 content-start gap-6 lg:col-span-2">
                <PortfolioCard uid={uid} />
                <Card className="overflow-hidden">
                    <div className="relative"><div className="absolute -top-24 -right-20 h-72 w-72 animate-float rounded-full bg-primary/40 opacity-25 blur-3xl" /><div className="absolute -bottom-16 -left-10 h-56 w-56 animate-float rounded-full bg-primary/20 opacity-20 blur-3xl [animation-delay:-1.2s]" /></div>
                    <div className="relative z-10 p-4"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-semibold">Профіль</h2><div className="mt-1 text-sm opacity-80">{user?.displayName || user?.email}</div>{missingDoc && (<div className="mt-3"><button onClick={initProfile} className="rounded-md border border-border bg-muted/60 px-3 py-1.5 text-sm hover:bg-muted">Ініціалізувати профіль</button></div>)}</div><Link to="/settings" className="rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm hover:bg-muted">Налаштування</Link></div><div className="mt-6 grid gap-4 sm:grid-cols-3">{[{ label: "Прогрес навчання", val: progress.learn },{ label: "Практика", val: progress.practice },{ label: "Web3", val: progress.web3 },].map((b) => (<div key={b.label} className="rounded-lg border border-border bg-card/70 p-4"><div className="text-xs opacity-70">{b.label}</div><div className="mt-1 text-2xl font-semibold">{b.val}%</div><div className="mt-2 h-2 w-full rounded bg-muted"><div className="h-2 rounded bg-primary transition-all" style={{ width: `${b.val}%` }} /></div></div>))}</div></div>
                </Card>
                <Card><div className="p-4"><div className="mb-3 flex items-center justify-between"><div className="font-medium">Активність (14 днів)</div><div className="text-xs opacity-70">тести/практика/сим</div></div><div className="h-48 min-w-0"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}><XAxis dataKey="d" hide /><YAxis hide /><Tooltip contentStyle={{ background: "rgba(18,20,24,.9)", border: "1px solid #2a2f37" }} /><Line type="monotone" dataKey="v" stroke="#22eea2" strokeWidth={2} dot={false} animationDuration={800} /></LineChart></ResponsiveContainer></div></div></Card>
                <Card><div className="p-4"><div className="mb-3 font-medium">Trader Roadmap — {xp.trader} XP</div><div className="flex items-center gap-3"><div className="text-lg font-semibold">{getTierForXP(TRADER_TIERS, xp.trader).emoji} {getTierForXP(TRADER_TIERS, xp.trader).title}</div>{getNextTier(TRADER_TIERS, xp.trader) && (<div className="text-xs opacity-70">→ {getNextTier(TRADER_TIERS, xp.trader)!.title} за {getNextTier(TRADER_TIERS, xp.trader)!.xpFrom - xp.trader} XP</div>)}</div><div className="mt-4"><Roadmap tiers={TRADER_TIERS} xp={xp.trader} /></div></div></Card>
                <Card><div className="p-4"><div className="mb-3 font-medium">Web3 Roadmap — {xp.web3} XP</div><div className="flex items-center gap-3"><div className="text-lg font-semibold">{getTierForXP(WEB3_TIERS, xp.web3).emoji} {getTierForXP(WEB3_TIERS, xp.web3).title}</div>{getNextTier(WEB3_TIERS, xp.web3) && (<div className="text-xs opacity-70">→ {getNextTier(WEB3_TIERS, xp.web3)!.title} за {getNextTier(WEB3_TIERS, xp.web3)!.xpFrom - xp.web3} XP</div>)}</div><div className="mt-4"><Roadmap tiers={WEB3_TIERS} xp={xp.web3} /></div></div></Card>
            </div>
            <div className="grid min-w-0 content-start gap-6">
                <Card className="relative overflow-hidden"><div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/30 blur-2xl" /><div className="mb-2 text-xs opacity-70">Streak</div><div className="mb-3 text-4xl font-semibold">{streak} дні</div><div className="flex gap-1">{Array.from({ length: 7 }).map((_, i) => (<div key={i} className={cn("h-2 flex-1 rounded", i < streak ? "bg-primary" : "bg-muted")} />))}</div><div className="mt-3 text-xs opacity-70">Тримай серію! +1 за будь-яку активність.</div></Card>
                <Card><div className="mb-3 p-4 font-medium">Бейджі</div><div className="grid grid-cols-2 gap-3 px-4 pb-4">{[{ id: "streak5", label: "Streak 5", earned: streak >= 5 },{ id: "quiz100", label: "100 правильних", earned: xp.trader >= 1200 },{ id: "bt10", label: "10 бектестів", earned: xp.trader >= 2000 },{ id: "sim100", label: "100 симуляцій", earned: xp.trader >= 3000 },].map(b => (<div key={b.id} className={cn("rounded-lg border border-border p-3 text-sm transition-transform hover:-translate-y-0.5", b.earned ? "bg-primary/10" : "opacity-60")}><div className="text-xs opacity-70">{b.earned ? "Отримано" : "Заблоковано"}</div><div className="mt-1 font-medium">{b.label}</div></div>))}</div></Card>
                <Card><div className="mb-2 p-4 font-medium">Швидкі дії</div><div className="grid gap-2 px-4 pb-4"><Link to="/learn" className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm hover:bg-muted">Продовжити навчання</Link><Link to="/practice" className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm hover:bg-muted">Відкрити тренажери</Link><Link to="/sim" className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm hover:bg-muted">Почати симулятор</Link></div></Card>
            </div>
        </div>
    );
}