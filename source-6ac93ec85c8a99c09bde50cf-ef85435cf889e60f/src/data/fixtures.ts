/**
 * Stubbed data for the product surface. A later milestone replaces these
 * with live on-chain / X data (see PLAN.md).
 */

export interface TrendingCoin {
  id: string
  name: string
  symbol: string
  description: string
  emoji: string
  gradient: string
  marketCap: number
  replies: number
  /** Seconds since the last buy, at page load. */
  lastBuySecondsAgo: number
  hasX: boolean
  mint: string
}

export const trendingCoins: Array<TrendingCoin> = [
  { id: 'rktdog', name: 'Rocket Doge', symbol: 'RKTDOG', description: 'The first dog to fly to the moon, one candle at a time.', emoji: '🐕', gradient: 'from-amber-400 to-orange-600', marketCap: 351555, replies: 1753, lastBuySecondsAgo: 4, hasX: false, mint: 'RKTd8sQ3vU1mZ4Lp9wXyNcJ2bTe7fGhA6kPq5rDoGe' },
  { id: 'sap', name: 'Strategic American Protocol', symbol: 'SAP', description: 'Strategic American Protocol', emoji: '🦅', gradient: 'from-red-600 to-blue-800', marketCap: 4609130, replies: 0, lastBuySecondsAgo: 2, hasX: false, mint: 'SAPm3Kq7Zx2vW9yL4nB8cT1fR6hJ5dGpE0aUiOsXy' },
  { id: 'apezcat', name: 'apeonzcat', symbol: 'APEZCAT', description: 'apeonzcat', emoji: '🐒', gradient: 'from-yellow-600 to-amber-900', marketCap: 27212, replies: 0, lastBuySecondsAgo: 7, hasX: true, mint: 'APZc4tN8mQ1wE6rY3uI9oP2aS5dF7gH0jK4lZxCvB' },
  { id: 'qi', name: 'Quantum Inu', symbol: 'QI', description: 'Quantum Inu', emoji: '⚛️', gradient: 'from-sky-400 to-indigo-800', marketCap: 2325739, replies: 0, lastBuySecondsAgo: 1, hasX: true, mint: 'QInu7vB2nM5qW8eR1tY4uI6oP9aS3dF0gH2jK5lZx' },
  { id: 'baton', name: 'baton pqc', symbol: 'BATONPQC', description: 'baton pqc', emoji: '🐶', gradient: 'from-zinc-100 to-amber-300', marketCap: 118236, replies: 0, lastBuySecondsAgo: 12, hasX: false, mint: 'BTNp1qA4sD7fG0hJ3kL6zX9cV2bN5mQ8wE1rT4yUi' },
  { id: 'gptai', name: 'Agent GPT', symbol: 'AGPT', description: 'Autonomous meme agent that never sleeps.', emoji: '🤖', gradient: 'from-zinc-600 to-zinc-900', marketCap: 765449, replies: 0, lastBuySecondsAgo: 3, hasX: true, mint: 'AGPTt6yU9iO2pA5sD8fG1hJ4kL7zX0cV3bN6mQ9wE' },
  { id: 'frogz', name: 'Frog Kingdom', symbol: 'FROGZ', description: 'Ribbit your way to the top of the charts.', emoji: '🐸', gradient: 'from-lime-400 to-emerald-700', marketCap: 1489120, replies: 312, lastBuySecondsAgo: 5, hasX: true, mint: 'FRGz2wE5rT8yU1iO4pA7sD0fG3hJ6kL9zX2cV5bN8m' },
  { id: 'moonpie', name: 'Moon Pie', symbol: 'MPIE', description: 'Sweet, round, and headed straight for orbit.', emoji: '🥧', gradient: 'from-pink-400 to-fuchsia-700', marketCap: 64320, replies: 48, lastBuySecondsAgo: 9, hasX: false, mint: 'MPie9oP2aS5dF8gH1jK4lZ7xC0vB3nM6qW9eR2tY5u' },
]

export interface TrackedAccount {
  handle: string
  name: string
  followers: string
  avatar: string
  gradient: string
}

export const trackedAccounts: Array<TrackedAccount> = [
  { handle: 'solana_whale', name: 'Solana Whale', followers: '412K', avatar: '🐋', gradient: 'from-cyan-400 to-blue-700' },
  { handle: 'degenalpha', name: 'Degen Alpha', followers: '186K', avatar: '🎯', gradient: 'from-rose-500 to-red-800' },
  { handle: 'memecaller', name: 'The Meme Caller', followers: '97K', avatar: '📣', gradient: 'from-amber-400 to-orange-700' },
  { handle: 'chartwizard', name: 'Chart Wizard', followers: '254K', avatar: '🧙', gradient: 'from-violet-400 to-purple-800' },
]

export interface TrackerPost {
  id: string
  handle: string
  text: string
  /** Seconds before page load the post was made. */
  postedSecondsAgo: number
  likes: number
  reposts: number
  /** Token tickers detected in the post. */
  tickers: Array<string>
  contract?: string
}

export const trackerPosts: Array<TrackerPost> = [
  { id: 'p1', handle: 'solana_whale', text: 'Just aped a fat bag of $FROGZ. Chart looks ready to send 🐸🚀', postedSecondsAgo: 14, likes: 1840, reposts: 322, tickers: ['FROGZ'], contract: 'FRGz2wE5rT8yU1iO4pA7sD0fG3hJ6kL9zX2cV5bN8m' },
  { id: 'p2', handle: 'chartwizard', text: '$QI holding the breakout level beautifully. Next leg up incoming if volume keeps coming.', postedSecondsAgo: 52, likes: 932, reposts: 140, tickers: ['QI'] },
  { id: 'p3', handle: 'degenalpha', text: 'New launch alert 👀 $MPIE just migrated, devs locked LP. DYOR.', postedSecondsAgo: 128, likes: 611, reposts: 98, tickers: ['MPIE'], contract: 'MPie9oP2aS5dF8gH1jK4lZ7xC0vB3nM6qW9eR2tY5u' },
  { id: 'p4', handle: 'memecaller', text: 'Watching $AGPT and $APEZCAT closely today. Both have communities growing fast.', postedSecondsAgo: 305, likes: 455, reposts: 61, tickers: ['AGPT', 'APEZCAT'] },
  { id: 'p5', handle: 'solana_whale', text: 'Solana fees still basically free. Perfect time to launch your own coin.', postedSecondsAgo: 690, likes: 2210, reposts: 401, tickers: [] },
  { id: 'p6', handle: 'chartwizard', text: '$SAP market cap flipping $4.5M. Strategic indeed.', postedSecondsAgo: 1220, likes: 780, reposts: 115, tickers: ['SAP'] },
]

/** Posts that "arrive" while the tracker page is open, to demo the live feed. */
export const incomingPosts: Array<Omit<TrackerPost, 'postedSecondsAgo'>> = [
  { id: 'n1', handle: 'degenalpha', text: '$RKTDOG volume spiking hard right now 🔥', likes: 120, reposts: 18, tickers: ['RKTDOG'] },
  { id: 'n2', handle: 'memecaller', text: 'Calling it: $FROGZ to $5M by the weekend.', likes: 304, reposts: 47, tickers: ['FROGZ'] },
  { id: 'n3', handle: 'solana_whale', text: 'Added more $QI on the dip. Not selling.', likes: 980, reposts: 133, tickers: ['QI'] },
  { id: 'n4', handle: 'chartwizard', text: '$BATONPQC forming a clean cup and handle. Eyes on it.', likes: 211, reposts: 29, tickers: ['BATONPQC'] },
]

export interface LiquidityPosition {
  id: string
  symbol: string
  name: string
  emoji: string
  gradient: string
  pool: string
  solDeposited: number
  tokenDeposited: number
  lpLocked: boolean
  apr: number
}

export const liquidityPositions: Array<LiquidityPosition> = [
  { id: 'lp1', symbol: 'FROGZ', name: 'Frog Kingdom', emoji: '🐸', gradient: 'from-lime-400 to-emerald-700', pool: 'Raydium CPMM', solDeposited: 12.5, tokenDeposited: 48_000_000, lpLocked: true, apr: 184.2 },
  { id: 'lp2', symbol: 'MPIE', name: 'Moon Pie', emoji: '🥧', gradient: 'from-pink-400 to-fuchsia-700', pool: 'Raydium AMM v4', solDeposited: 3.2, tokenDeposited: 125_000_000, lpLocked: false, apr: 92.7 },
]

export function formatUsd(n: number) {
  return '$' + Math.round(n).toLocaleString('en-US')
}

export function timeAgo(seconds: number) {
  const s = Math.max(0, Math.floor(seconds))
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}
