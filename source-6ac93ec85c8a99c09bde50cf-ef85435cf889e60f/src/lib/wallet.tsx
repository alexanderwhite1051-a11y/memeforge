import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { WalletModal } from '@/components/WalletModal'

/**
 * Lightweight Solana wallet connection using the providers that browser
 * extensions inject into `window`. We only ever request the public key —
 * no transactions or message signatures are requested here.
 */

type PublicKeyLike = { toString(): string }

interface InjectedSolanaProvider {
  publicKey?: PublicKeyLike | null
  isConnected?: boolean
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<unknown>
  disconnect: () => Promise<void>
  on?: (event: string, handler: (...args: Array<any>) => void) => void
  off?: (event: string, handler: (...args: Array<any>) => void) => void
  removeListener?: (event: string, handler: (...args: Array<any>) => void) => void
}

export type WalletId = 'phantom' | 'solflare' | 'backpack'

export interface WalletOption {
  id: WalletId
  name: string
  installUrl: string
  /** Deep link that opens this site inside the wallet's in-app browser (mobile). */
  mobileBrowseUrl: (url: string) => string
  accent: string
}

export const WALLETS: Array<WalletOption> = [
  {
    id: 'phantom',
    name: 'Phantom',
    installUrl: 'https://phantom.app/download',
    mobileBrowseUrl: (url) =>
      `https://phantom.app/ul/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(url)}`,
    accent: 'from-[#ab9ff2] to-[#534bb1]',
  },
  {
    id: 'solflare',
    name: 'Solflare',
    installUrl: 'https://solflare.com/download',
    mobileBrowseUrl: (url) =>
      `https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(url)}`,
    accent: 'from-[#fc7227] to-[#ffc10b]',
  },
  {
    id: 'backpack',
    name: 'Backpack',
    installUrl: 'https://backpack.app/download',
    mobileBrowseUrl: () => 'https://backpack.app/download',
    accent: 'from-[#e33e3f] to-[#a3232c]',
  },
]

function getProvider(id: WalletId): InjectedSolanaProvider | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as any
  switch (id) {
    case 'phantom': {
      const p = w.phantom?.solana ?? (w.solana?.isPhantom ? w.solana : undefined)
      return p?.isPhantom ? p : undefined
    }
    case 'solflare':
      return w.solflare?.isSolflare ? w.solflare : undefined
    case 'backpack':
      return w.backpack?.isBackpack ? w.backpack : undefined
  }
}

const STORAGE_KEY = 'memeforge:wallet'

interface WalletContextValue {
  address: string | null
  walletId: WalletId | null
  connected: boolean
  connecting: WalletId | null
  error: string | null
  isInstalled: (id: WalletId) => boolean
  connect: (id: WalletId) => Promise<void>
  disconnect: () => Promise<void>
  openModal: () => void
  closeModal: () => void
}

const WalletContext = createContext<WalletContextValue | null>(null)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [walletId, setWalletId] = useState<WalletId | null>(null)
  const [connecting, setConnecting] = useState<WalletId | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  // Extensions inject after load, so re-check installs once mounted.
  const [, setTick] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setTick((n) => n + 1), 400)
    return () => clearTimeout(t)
  }, [])

  const isInstalled = useCallback((id: WalletId) => !!getProvider(id), [])

  const connect = useCallback(async (id: WalletId) => {
    setError(null)
    const provider = getProvider(id)
    if (!provider) {
      setError(`${WALLETS.find((w) => w.id === id)?.name} is not installed.`)
      return
    }
    setConnecting(id)
    try {
      const res: any = await provider.connect()
      const key: PublicKeyLike | null | undefined = res?.publicKey ?? provider.publicKey
      if (!key) throw new Error('Wallet did not return an address.')
      setAddress(key.toString())
      setWalletId(id)
      localStorage.setItem(STORAGE_KEY, id)
      setModalOpen(false)
    } catch (e: any) {
      setError(
        e?.code === 4001 ? 'Connection request was rejected.' : e?.message || 'Could not connect wallet.',
      )
    } finally {
      setConnecting(null)
    }
  }, [])

  const disconnect = useCallback(async () => {
    const provider = walletId ? getProvider(walletId) : undefined
    try {
      await provider?.disconnect()
    } catch {
      // ignore — we clear local state regardless
    }
    setAddress(null)
    setWalletId(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [walletId])

  // Silently restore a previously approved connection.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as WalletId | null
    if (!saved) return
    const t = setTimeout(async () => {
      const provider = getProvider(saved)
      if (!provider) return
      try {
        const res: any = await provider.connect(saved === 'phantom' ? { onlyIfTrusted: true } : undefined)
        const key = res?.publicKey ?? provider.publicKey
        if (key) {
          setAddress(key.toString())
          setWalletId(saved)
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }, 500)
    return () => clearTimeout(t)
  }, [])

  // Keep in sync with account switches / disconnects made inside the wallet.
  useEffect(() => {
    if (!walletId) return
    const provider = getProvider(walletId)
    if (!provider?.on) return
    const onDisconnect = () => {
      setAddress(null)
      setWalletId(null)
      localStorage.removeItem(STORAGE_KEY)
    }
    const onAccountChanged = (key: PublicKeyLike | null) => {
      if (key) setAddress(key.toString())
      else onDisconnect()
    }
    provider.on('disconnect', onDisconnect)
    provider.on('accountChanged', onAccountChanged)
    return () => {
      const off = provider.off ?? provider.removeListener
      off?.call(provider, 'disconnect', onDisconnect)
      off?.call(provider, 'accountChanged', onAccountChanged)
    }
  }, [walletId])

  const value = useMemo<WalletContextValue>(
    () => ({
      address,
      walletId,
      connected: !!address,
      connecting,
      error,
      isInstalled,
      connect,
      disconnect,
      openModal: () => {
        setError(null)
        setModalOpen(true)
      },
      closeModal: () => setModalOpen(false),
    }),
    [address, walletId, connecting, error, isInstalled, connect, disconnect],
  )

  return (
    <WalletContext.Provider value={value}>
      {children}
      {modalOpen && <WalletModal />}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside <WalletProvider>')
  return ctx
}

export function shortAddress(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`
}
