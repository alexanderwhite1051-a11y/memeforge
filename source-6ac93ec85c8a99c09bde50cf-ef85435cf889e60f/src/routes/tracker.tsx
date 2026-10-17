import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Bell, BellOff, Copy, Heart, Plus, Repeat2, X as XIcon } from 'lucide-react'
import { ConnectGate } from '@/components/ConnectGate'
import { XLogo } from '@/components/Header'
import {
  incomingPosts,
  timeAgo,
  trackedAccounts,
  trackerPosts,
  type TrackedAccount,
  type TrackerPost,
} from '@/data/fixtures'
import { useElapsed } from '@/lib/useNow'

export const Route = createFileRoute('/tracker')({
  head: () => ({ meta: [{ title: 'X Tracker — MemeForge' }] }),
  component: TrackerPage,
})

function TrackerPage() {
  return (
    <div className="mx-auto max-w-[1300px] px-4 py-12 sm:px-8">
      <div className="mb-10 text-center">
        <h1 className="flex items-center justify-center gap-3 text-4xl font-bold sm:text-5xl">
          <XLogo size={38} /> Tracker
          <span className="animate-live rounded-md bg-red-600 px-2 py-1 text-sm font-bold">LIVE</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Follow the biggest Solana callers on X and catch every ticker the second it's posted.
        </p>
      </div>

      <ConnectGate
        title="Connect your wallet to use the X Tracker"
        description="The live X Tracker is available to connected wallets only. Connect Phantom, Solflare or Backpack to start tracking."
        preview={<TrackerView accounts={trackedAccounts} posts={trackerPosts} elapsed={0} readOnly />}
      >
        <LiveTracker />
      </ConnectGate>
    </div>
  )
}

function LiveTracker() {
  const elapsed = useElapsed()
  const [accounts, setAccounts] = useState<Array<TrackedAccount>>(trackedAccounts)
  const [posts, setPosts] = useState<Array<TrackerPost & { arrivedAt?: number }>>(trackerPosts)

  // Simulate new posts streaming in while the page is open.
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      const next = incomingPosts[i % incomingPosts.length]
      setPosts((p) => [
        { ...next, id: `${next.id}-${i}`, postedSecondsAgo: 0, arrivedAt: Date.now() },
        ...p,
      ].slice(0, 40))
      i++
    }, 9000)
    return () => clearInterval(id)
  }, [])

  return (
    <TrackerView
      accounts={accounts}
      posts={posts}
      elapsed={elapsed}
      onAdd={(handle) =>
        setAccounts((a) =>
          a.some((x) => x.handle === handle)
            ? a
            : [...a, { handle, name: handle, followers: '—', avatar: '👤', gradient: 'from-zinc-500 to-zinc-800' }],
        )
      }
      onRemove={(handle) => setAccounts((a) => a.filter((x) => x.handle !== handle))}
    />
  )
}

function TrackerView({
  accounts,
  posts,
  elapsed,
  readOnly,
  onAdd,
  onRemove,
}: {
  accounts: Array<TrackedAccount>
  posts: Array<TrackerPost & { arrivedAt?: number }>
  elapsed: number
  readOnly?: boolean
  onAdd?: (handle: string) => void
  onRemove?: (handle: string) => void
}) {
  const [handle, setHandle] = useState('')
  const [alerts, setAlerts] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)
  const byHandle = useMemo(() => new Map(accounts.map((a) => [a.handle, a])), [accounts])
  const visible = posts.filter((p) => byHandle.has(p.handle) && (!filter || p.handle === filter))

  const tickerCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const p of visible) for (const t of p.tickers) m.set(t, (m.get(t) ?? 0) + 1)
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  }, [visible])

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="space-y-6">
        <section className="rounded-xl border border-white/10 bg-forge-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Tracked accounts</h2>
            <button
              onClick={() => setAlerts((v) => !v)}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
              title={alerts ? 'Mute alerts' : 'Enable alerts'}
            >
              {alerts ? <Bell size={17} /> : <BellOff size={17} />}
            </button>
          </div>
          {!readOnly && (
            <form
              className="mb-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                const h = handle.trim().replace(/^@/, '')
                if (/^\w{1,15}$/.test(h)) onAdd?.(h)
                setHandle('')
              }}
            >
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@handle"
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-forge-panel px-3 py-2 text-sm outline-none focus:border-forge-indigo"
              />
              <button className="rounded-lg bg-forge-violet px-3 hover:bg-violet-600" aria-label="Track account">
                <Plus size={18} />
              </button>
            </form>
          )}
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setFilter(null)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${!filter ? 'bg-white/5' : 'text-zinc-400 hover:bg-white/5'}`}
              >
                All accounts
              </button>
            </li>
            {accounts.map((a) => (
              <li key={a.handle} className="group flex items-center">
                <button
                  onClick={() => setFilter(a.handle)}
                  className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-left ${filter === a.handle ? 'bg-white/5' : 'hover:bg-white/5'}`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${a.gradient}`}>{a.avatar}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{a.name}</span>
                    <span className="block text-xs text-zinc-500">@{a.handle} · {a.followers}</span>
                  </span>
                </button>
                {!readOnly && (
                  <button
                    onClick={() => onRemove?.(a.handle)}
                    className="rounded p-1 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400"
                    aria-label={`Stop tracking @${a.handle}`}
                  >
                    <XIcon size={15} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-forge-card p-5">
          <h2 className="mb-4 font-bold">Most mentioned</h2>
          {tickerCounts.length === 0 ? (
            <p className="text-sm text-zinc-500">No tickers yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {tickerCounts.map(([t, n]) => (
                <li key={t} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-indigo-300">${t}</span>
                  <span className="text-zinc-400">{n} {n === 1 ? 'mention' : 'mentions'}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>

      <section className="space-y-4">
        {visible.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-forge-card p-10 text-center text-zinc-500">
            No posts yet from tracked accounts.
          </p>
        )}
        {visible.map((p) => (
          <PostCard key={p.id} post={p} account={byHandle.get(p.handle)!} elapsed={elapsed} />
        ))}
      </section>
    </div>
  )
}

function PostCard({
  post,
  account,
  elapsed,
}: {
  post: TrackerPost & { arrivedAt?: number }
  account: TrackedAccount
  elapsed: number
}) {
  const [copied, setCopied] = useState(false)
  const age = post.arrivedAt
    ? (Date.now() - post.arrivedAt) / 1000
    : post.postedSecondsAgo + elapsed
  const fresh = age < 15

  return (
    <article
      className={`animate-slide-in rounded-xl border bg-forge-card p-5 transition ${fresh ? 'border-emerald-500/50' : 'border-white/10'}`}
    >
      <header className="mb-3 flex items-center gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-xl ${account.gradient}`}>{account.avatar}</span>
        <div className="min-w-0 flex-1">
          <p className="font-bold">{account.name}</p>
          <p className="text-sm text-zinc-500">@{account.handle} · {timeAgo(age)}</p>
        </div>
        {fresh && <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-400">NEW</span>}
        <XLogo size={16} />
      </header>
      <p className="text-[17px] leading-relaxed">{highlight(post.text)}</p>
      {post.contract && (
        <button
          onClick={() => {
            navigator.clipboard.writeText(post.contract!)
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
          }}
          className="mt-3 flex items-center gap-2 rounded-lg bg-forge-panel px-3 py-2 font-mono text-xs text-zinc-300 hover:bg-forge-input"
        >
          <Copy size={13} /> {copied ? 'Copied!' : `CA: ${post.contract.slice(0, 6)}…${post.contract.slice(-6)}`}
        </button>
      )}
      <footer className="mt-4 flex gap-6 text-sm text-zinc-500">
        <span className="flex items-center gap-1.5"><Heart size={15} /> {post.likes.toLocaleString('en-US')}</span>
        <span className="flex items-center gap-1.5"><Repeat2 size={15} /> {post.reposts.toLocaleString('en-US')}</span>
      </footer>
    </article>
  )
}

function highlight(text: string) {
  return text.split(/(\$[A-Za-z0-9]+)/g).map((part, i) =>
    part.startsWith('$') && part.length > 1 ? (
      <span key={i} className="font-semibold text-indigo-300">{part}</span>
    ) : (
      part
    ),
  )
}
