import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  Coins,
  Copy,
  Droplets,
  LogOut,
  Menu,
  Rocket,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react'
import { shortAddress, useWallet } from '@/lib/wallet'

function XLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export { XLogo }

const NAV = [
  { to: '/', label: 'Create Coin', icon: <Coins size={17} /> },
  { to: '/liquidity', label: 'Manage Liquidity', icon: <Droplets size={17} /> },
  {
    to: '/trending',
    label: 'Copy Trending Coins',
    icon: <TrendingUp size={17} />,
    badge: <span className="rounded-md bg-emerald-500 px-1.5 py-0.5 text-[11px] font-bold">NEW</span>,
  },
  {
    to: '/tracker',
    label: 'Tracker',
    icon: <XLogo size={15} />,
    badge: (
      <span className="animate-live rounded-md bg-red-600 px-1.5 py-0.5 text-[11px] font-bold">LIVE</span>
    ),
  },
] as const

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-forge-bg/95 backdrop-blur">
      <div className="mx-auto flex h-[88px] max-w-[1400px] items-center gap-6 px-4 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-2xl font-bold sm:text-[28px]">
          <Rocket className="text-indigo-400" size={26} />
          <span>
            Meme<span className="text-indigo-400">Forge</span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-7 xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              className="flex items-center gap-2 text-[17px] font-medium text-zinc-200 transition hover:text-white"
              activeProps={{ className: 'text-white underline decoration-indigo-500 decoration-2 underline-offset-8' }}
            >
              {item.icon}
              {item.label}
              {'badge' in item && item.badge}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 xl:ml-0">
          <span className="hidden items-center gap-1 rounded-full border border-white/10 px-3 py-2 text-sm font-semibold sm:flex">
            <span className="text-xs text-zinc-400">US</span> EN <ChevronDown size={14} className="text-zinc-400" />
          </span>
          <WalletButton />
          <button
            className="rounded-lg p-2 hover:bg-white/5 xl:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="animate-slide-in border-t border-white/10 px-4 py-3 xl:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-medium hover:bg-white/5"
            >
              {item.icon}
              {item.label}
              {'badge' in item && item.badge}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

function WalletButton() {
  const { address, connected, openModal, disconnect } = useWallet()
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  if (!connected || !address) {
    return (
      <button
        onClick={openModal}
        className="rounded-lg bg-forge-violet px-4 py-3 text-[15px] font-bold transition hover:bg-violet-600 sm:px-7 sm:text-[17px]"
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-violet-500/40 bg-violet-500/15 px-4 py-3 font-bold transition hover:bg-violet-500/25"
      >
        <Wallet size={17} className="text-violet-300" />
        {shortAddress(address)}
        <ChevronDown size={15} />
      </button>
      {menuOpen && (
        <div className="animate-slide-in absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-forge-card shadow-xl">
          <button
            onClick={() => {
              navigator.clipboard.writeText(address)
              setCopied(true)
              setTimeout(() => setCopied(false), 1200)
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-white/5"
          >
            <Copy size={15} /> {copied ? 'Copied!' : 'Copy address'}
          </button>
          <button
            onClick={() => {
              setMenuOpen(false)
              disconnect()
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/5"
          >
            <LogOut size={15} /> Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
