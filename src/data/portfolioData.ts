// src/data/portfolioData.ts

export const ASSET_LOCATIONS = {
  binance: { name: 'Binance', logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png' },
  bybit: { name: 'Bybit', logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/537.png' },
  whitebit: { name: 'WhiteBIT', logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/1628.png' },
  metamask: { name: 'MetaMask', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg' },
  trustwallet: { name: 'Trust Wallet', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5974.png' },
  ledger: { name: 'Ledger', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21304.png' },
  other: { name: 'Інше', logo: '' },
};

export type AssetLocation = keyof typeof ASSET_LOCATIONS;