import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Droplets, Lock, LockOpen, Minus, Plus } from 'lucide-react'
import { ConnectGate } from '@/components/ConnectGate'
import { CoinAvatar } from '@/components/CoinCard'
import { liquidityPositions, type LiquidityPosition } from '@/data/fixtures'

export const Route = createFileRoute('/liquidity')({
  head: () => ({ meta: [{ title: 'Manage Liquidity — MemeForge' }] }),
  component: LiquidityPage,
})

function LiquidityPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-8">
      <div className="mb-10 text-center">
        <h1 className="flex items-center justify-center gap-3 text-4xl font-bold sm:text-5xl">
          Manage Liquidity <Droplets className="text-sky-400" size={40} />
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Create Raydium pools, add or remove liquidity, and lock LP for your coins.
        </p>
      </div>

      <ConnectGate
        title="Connect your wallet to manage liquidity"
        description="We'll load the pools and LP positions owned by your wallet."
        preview={<Positions positions={liquidityPositions} />}
      >
        <Positions positions={liquidityPositions} interactive />
      </ConnectGate>
    </div>
  )
}

function Positions({ positions, interactive }: { positions: Array<LiquidityPosition>; interactive?: boolean }) {
  const [active, setActive] = useState<string | null>(null)
  return (
    <div className="space-y-5">
      {positions.map((p) => (
        <article key={p.id} className="rounded-xl border border-white/10 bg-forge-card p-6">
          <div className="flex flex-wrap items-center gap-5">
            <CoinAvatar emoji={p.emoji} gradient={p.gradient} size="h-14 w-14 text-2xl" />
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold">{p.symbol} / SOL</h3>
              <p className="text-sm text-zinc-400">{p.name} · {p.pool}</p>
            </div>
            <Stat label="SOL deposited" value={`${p.solDeposited} SOL`} />
            <Stat label="Tokens" value={p.tokenDeposited.toLocaleString('en-US')} />
            <Stat label="APR" value={`${p.apr}%`} accent />
            <span
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold ${
                p.lpLocked ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
              }`}
            >
              {p.lpLocked ? <Lock size={13} /> : <LockOpen size={13} />}
              {p.lpLocked ? 'LP locked' : 'LP unlocked'}
            </span>
          </div>
          {interactive && (
            <div className="mt-5 flex flex-wrap gap-3 border-t border-white/5 pt-5">
              <ActionButton icon={<Plus size={16} />} label="Add liquidity" onClick={() => setActive(`${p.id}-add`)} />
              <ActionButton icon={<Minus size={16} />} label="Remove" onClick={() => setActive(`${p.id}-remove`)} />
              {!p.lpLocked && <ActionButton icon={<Lock size={16} />} label="Lock LP" onClick={() => setActive(`${p.id}-lock`)} />}
              {active?.startsWith(p.id) && (
                <p className="animate-slide-in self-center text-sm text-zinc-400">
                  Pool actions are signed in your wallet — this flow opens with on-chain launch.
                </p>
              )}
            </div>
          )}
        </article>
      ))}
      {interactive && (
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 py-6 font-semibold text-zinc-400 transition hover:border-forge-indigo hover:text-white">
          <Plus size={18} /> Create a new pool
        </button>
      )}
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="min-w-24">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`font-bold ${accent ? 'text-emerald-400' : ''}`}>{value}</p>
    </div>
  )
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 rounded-lg bg-forge-panel px-4 py-2.5 text-sm font-semibold hover:bg-forge-input">
      {icon} {label}
    </button>
  )
}
