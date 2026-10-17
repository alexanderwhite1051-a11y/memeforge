import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Flame, Search } from 'lucide-react'
import { CoinCard } from '@/components/CoinCard'
import { trendingCoins } from '@/data/fixtures'
import { useElapsed } from '@/lib/useNow'

export const Route = createFileRoute('/trending')({
  head: () => ({ meta: [{ title: 'Copy Trending Coins — MemeForge' }] }),
  component: Trending,
})

const SORTS = {
  mcap: { label: 'Market cap', fn: (a: any, b: any) => b.marketCap - a.marketCap },
  active: { label: 'Last buy', fn: (a: any, b: any) => a.lastBuySecondsAgo - b.lastBuySecondsAgo },
  replies: { label: 'Replies', fn: (a: any, b: any) => b.replies - a.replies },
} as const

function Trending() {
  const elapsed = useElapsed()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<keyof typeof SORTS>('mcap')

  const coins = useMemo(() => {
    const q = query.trim().toLowerCase()
    return trendingCoins
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
      .sort(SORTS[sort].fn)
  }, [query, sort])

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-8">
      <div className="mb-10 text-center">
        <h1 className="flex items-center justify-center gap-3 text-4xl font-bold sm:text-5xl">
          Copy Trending Coins <Flame className="fill-orange-500 text-amber-400" size={40} />
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Spot what's pumping, then launch your own version on Raydium in one click.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search size={18} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or ticker"
            className="w-full rounded-lg border border-white/10 bg-forge-card py-3 pr-4 pl-10 outline-none focus:border-forge-indigo"
          />
        </div>
        <div className="flex gap-2">
          {(Object.keys(SORTS) as Array<keyof typeof SORTS>).map((k) => (
            <button
              key={k}
              onClick={() => setSort(k)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                sort === k ? 'bg-forge-violet' : 'bg-forge-card text-zinc-300 hover:bg-white/5'
              }`}
            >
              {SORTS[k].label}
            </button>
          ))}
        </div>
      </div>

      {coins.length === 0 ? (
        <p className="py-20 text-center text-zinc-500">No coins match “{query}”.</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {coins.map((c) => (
            <CoinCard key={c.id} coin={c} elapsed={elapsed} />
          ))}
        </div>
      )}
    </div>
  )
}
