import { ExternalLink, Loader2, ShieldCheck, X } from 'lucide-react'
import { WALLETS, useWallet } from '@/lib/wallet'

export function WalletModal() {
  const { closeModal, connect, connecting, error, isInstalled } = useWallet()
  const isMobile =
    typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
        className="animate-slide-in w-full max-w-md rounded-2xl border border-white/10 bg-forge-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="wallet-modal-title" className="text-xl font-bold">
            Connect a wallet
          </h2>
          <button
            onClick={closeModal}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <ul className="space-y-2.5">
          {WALLETS.map((w) => {
            const installed = isInstalled(w.id)
            const busy = connecting === w.id
            const href = isMobile
              ? w.mobileBrowseUrl(window.location.href)
              : w.installUrl
            return (
              <li key={w.id}>
                {installed ? (
                  <button
                    onClick={() => connect(w.id)}
                    disabled={!!connecting}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-forge-panel px-4 py-3 text-left transition hover:border-forge-indigo hover:bg-forge-input disabled:opacity-60"
                  >
                    <WalletIcon name={w.name} accent={w.accent} />
                    <span className="flex-1 font-semibold">{w.name}</span>
                    {busy ? (
                      <Loader2 size={18} className="animate-spin text-forge-indigo" />
                    ) : (
                      <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                        Detected
                      </span>
                    )}
                  </button>
                ) : (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-forge-panel/60 px-4 py-3 transition hover:bg-forge-panel"
                  >
                    <WalletIcon name={w.name} accent={w.accent} />
                    <span className="flex-1 font-semibold text-zinc-300">{w.name}</span>
                    <span className="flex items-center gap-1 text-xs text-zinc-400">
                      {isMobile ? 'Open in app' : 'Install'} <ExternalLink size={12} />
                    </span>
                  </a>
                )}
              </li>
            )
          })}
        </ul>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
        )}

        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-zinc-500">
          <ShieldCheck size={16} className="mt-px shrink-0 text-emerald-500" />
          Connecting only shares your public wallet address. MemeForge never asks for your seed
          phrase or private key.
        </p>
      </div>
    </div>
  )
}

function WalletIcon({ name, accent }: { name: string; accent: string }) {
  return (
    <span
      className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${accent} text-sm font-bold`}
    >
      {name[0]}
    </span>
  )
}
