import { Lock, Wallet } from 'lucide-react'
import { useWallet } from '@/lib/wallet'

/**
 * Renders children only when a wallet is connected. Otherwise shows a
 * blurred preview with a "connect wallet to use" prompt on top.
 */
export function ConnectGate({
  title,
  description,
  preview,
  children,
}: {
  title: string
  description: string
  preview?: React.ReactNode
  children: React.ReactNode
}) {
  const { connected, openModal } = useWallet()
  if (connected) return <>{children}</>

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {preview && (
        <div aria-hidden="true" className="pointer-events-none select-none opacity-50 blur-[6px]">
          {preview}
        </div>
      )}
      <div
        className={`${preview ? 'absolute inset-0' : 'py-24'} flex items-center justify-center bg-forge-bg/40 p-4`}
      >
        <div className="animate-slide-in w-full max-w-md rounded-2xl border border-white/10 bg-forge-card/95 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/15">
            <Lock className="text-violet-300" size={26} />
          </div>
          <h2 className="mb-2 text-2xl font-bold">{title}</h2>
          <p className="mb-6 text-zinc-400">{description}</p>
          <button
            onClick={openModal}
            className="inline-flex items-center gap-2 rounded-lg bg-forge-violet px-7 py-3 font-bold transition hover:bg-violet-600"
          >
            <Wallet size={18} /> Connect Wallet
          </button>
        </div>
      </div>
    </div>
  )
}
