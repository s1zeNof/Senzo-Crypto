export type StatusTier = {
  id: string
  level: number
  xpFrom: number
  title: string
  emoji?: string
  desc: string
}

export const TRADER_TIERS: StatusTier[] = [
  { id:"t1",  level:1,  xpFrom:0,    title:"Новачок (Чайник)", emoji:"🥚", desc:"Старт шляху. Базові поняття." },
  { id:"t2",  level:2,  xpFrom:100,  title:"Учень графіків", emoji:"📘", desc:"Свічки, тренди, рівні." },
  { id:"t3",  level:3,  xpFrom:300,  title:"Скаут сетапів", emoji:"🧭", desc:"Шукаєш точки входу." },
  { id:"t4",  level:4,  xpFrom:600,  title:"Активний трейдер", emoji:"⚡", desc:"Регулярні симуляції." },
  { id:"t5",  level:5,  xpFrom:1000, title:"Аналітик-початківець", emoji:"💡", desc:"R/R, плани, чеклісти." },
  { id:"t6",  level:6,  xpFrom:1500, title:"Аналітик", emoji:"📊", desc:"Журнал, статистика." },
  { id:"t7",  level:7,  xpFrom:2100, title:"Стратег", emoji:"🛠️", desc:"Правила входу/виходу." },
  { id:"t8",  level:8,  xpFrom:2800, title:"Технік", emoji:"🧩", desc:"Робота з рівнями/патернами." },
  { id:"t9",  level:9,  xpFrom:3600, title:"Ризик-менеджер", emoji:"🛡️", desc:"Сталий ризик-профіль." },
  { id:"t10", level:10, xpFrom:4500, title:"Тестувальник ідей", emoji:"🧪", desc:"Backtest Lite на потоці." },
  { id:"t11", level:11, xpFrom:5500, title:"Операційник", emoji:"🗂️", desc:"Рутина, дисципліна." },
  { id:"t12", level:12, xpFrom:6600, title:"Системний трейдер", emoji:"🔧", desc:"Система > емоції." },
  { id:"t13", level:13, xpFrom:7800, title:"Стратег PRO", emoji:"🚀", desc:"Оптимізація правил." },
  { id:"t14", level:14, xpFrom:9100, title:"Куратор ризиків", emoji:"📉", desc:"DD під контролем." },
  { id:"t15", level:15, xpFrom:10500,title:"Куратор стратегії", emoji:"🧠", desc:"A/B стратегій." },
  { id:"t16", level:16, xpFrom:12000,title:"Трейдер-ментор", emoji:"👑", desc:"Шериш знання." },
  { id:"t17", level:17, xpFrom:13600,title:"Керівник портфеля", emoji:"🏦", desc:"Когорта інструментів." },
  { id:"t18", level:18, xpFrom:15300,title:"Архітектор систем", emoji:"🏗️", desc:"Фреймворки рішень." },
  { id:"t19", level:19, xpFrom:17100,title:"Майстер ринку", emoji:"🐉", desc:"Висока стабільність." },
  { id:"t20", level:20, xpFrom:19000,title:"Сенсей трейдингу", emoji:"🏆", desc:"Пік дисципліни." },
]

export const WEB3_TIERS: StatusTier[] = [
  { id:"w1",  level:1,  xpFrom:0,    title:"Новачок Web3", emoji:"🌱", desc:"Гаманець, мережі, безпека." },
  { id:"w2",  level:2,  xpFrom:120,  title:"Початківець DeFi", emoji:"💧", desc:"Swap, LP, fee." },
  { id:"w3",  level:3,  xpFrom:320,  title:"Квестер", emoji:"🗺️", desc:"Quest-лерінг." },
  { id:"w4",  level:4,  xpFrom:650,  title:"Тестнет-хантер", emoji:"🧪", desc:"Тестові мережі." },
  { id:"w5",  level:5,  xpFrom:1050, title:"Airdrop-мисливець", emoji:"🎁", desc:"Системно фармиш." },
  { id:"w6",  level:6,  xpFrom:1600, title:"NFT-сканер", emoji:"🖼️", desc:"Mint/utility." },
  { id:"w7",  level:7,  xpFrom:2300, title:"Bridge-мастер", emoji:"🌉", desc:"Мости/ризики." },
  { id:"w8",  level:8,  xpFrom:3100, title:"L2-ентузіаст", emoji:"⚙️", desc:"Optimistic/ZK." },
  { id:"w9",  level:9,  xpFrom:4000, title:"DAO-учасник", emoji:"🏛️", desc:"Голосування/ролі." },
  { id:"w10", level:10, xpFrom:5000, title:"DeFi-навігатор", emoji:"🧭", desc:"Лендинг/перпети." },
  { id:"w11", level:11, xpFrom:6100, title:"MEV-aware", emoji:"🧠", desc:"Слої ризику/фрод." },
  { id:"w12", level:12, xpFrom:7300, title:"Екосистемник", emoji:"🪐", desc:"EVM/non-EVM." },
  { id:"w13", level:13, xpFrom:8600, title:"Інфраструктор", emoji:"🛰️", desc:"RPC/індексатори." },
  { id:"w14", level:14, xpFrom:10000,title:"Сек’юріті-сканер", emoji:"🛡️", desc:"Опекоди/фішинг." },
  { id:"w15", level:15, xpFrom:11500,title:"Агрегатор XP", emoji:"📈", desc:"Сюрвей кейсів." },
  { id:"w16", level:16, xpFrom:13100,title:"Інтегратор L1/L2", emoji:"🔗", desc:"Кросчейн патерни." },
  { id:"w17", level:17, xpFrom:14800,title:"Протокол-лід", emoji:"🧩", desc:"Продвинута участь." },
  { id:"w18", level:18, xpFrom:16600,title:"Архітектор DeFi", emoji:"🏗️", desc:"Складання примітивів." },
  { id:"w19", level:19, xpFrom:18500,title:"Web3-гуру", emoji:"🌌", desc:"Глибокі інтеграції." },
  { id:"w20", level:20, xpFrom:20500,title:"Сенсей Web3", emoji:"🏆", desc:"Вершина квестів." },
]
