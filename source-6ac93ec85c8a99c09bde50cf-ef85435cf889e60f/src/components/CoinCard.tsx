import { useNavigate } from '@tanstack/react-router'
import { Clock, MessageCircle, Pill, Zap } from 'lucide-react'
import { XLogo } from '@/components/Header'
import { formatUsd, timeAgo, type TrendingCoin } from '@/data/fixtures'
import { useWallet } from '@/lib/wallet'

export function CoinAvatar({ emoji, gradient, size = 'h-[60px] w-[60px] text-3xl' }: { emoji: string; gradient: string; size?: string }) {
  return (
    <span className={`${size} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient}`}>
      {emoji}
    </span>
  )
}

export function CoinCard({ coin, elapsed = 0 }: { coin: TrendingCoin; elapsed?: number }) {
  const { connected, openModal } = useWallet()
  const navigate = useNavigate()

  const copy = () => {
    if (!connected) return openModal()
    navigate({
      to: '/',
      search: { name: coin.name, symbol: coin.symbol, description: coin.description },
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <article className="rounded-md border border-white/10 bg-forge-card p-6 transition hover:border-white/20 sm:p-8">
      <div className="flex items-start gap-5">
        <CoinAvatar emoji={coin.emoji} gradient={coin.gradient} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-xl font-bold sm:text-2xl">{coin.name}</h3>
          <p className="mt-1 flex items-center gap-2 text-zinc-300">
            ${coin.symbol}
            <span className="text-zinc-500">•</span>
            <MessageCircle size={16} className="text-zinc-400" />
            {coin.replies.toLocaleString('en-US')} replies
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-zinc-400">Market Cap:</p>
          <p className="text-xl font-bold text-emerald-400 sm:text-2xl">{formatUsd(coin.marketCap)}</p>
        </div>
      </div>

      <p className="mt-6 line-clamp-2 text-zinc-400">{coin.description}</p>
      <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-amber-500">
        <Clock size={14} /> Last buy: {timeAgo(coin.lastBuySecondsAgo + (elapsed % 30))}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-3 text-zinc-300">
          <span title="Launched on a bonding curve">
            <Pill size={20} className="rotate-45 text-emerald-400" />
          </span>
          {coin.hasX && <XLogo size={18} />}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-2 rounded-md bg-forge-indigo px-5 py-3 font-semibold transition hover:bg-indigo-500"
        >
          <Zap size={18} /> Copy to Raydium
        </button>
      </div>
    </article>
  )
}
