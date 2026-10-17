import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CloudUpload,
  Globe,
  Rocket,
  Send,
  ShieldCheck,
  Timer,
  Wallet,
  Zap,
} from 'lucide-react'
import { XLogo } from '@/components/Header'
import { shortAddress, useWallet } from '@/lib/wallet'
import { trendingCoins } from '@/data/fixtures'
import { CoinCard } from '@/components/CoinCard'

export const Route = createFileRoute('/')({
  // Pre-fill from "Copy to Raydium" on a trending coin.
  validateSearch: (
    search: Record<string, unknown>,
  ): { name?: string; symbol?: string; description?: string } => ({
    name: typeof search.name === 'string' ? search.name : undefined,
    symbol: typeof search.symbol === 'string' ? search.symbol : undefined,
    description: typeof search.description === 'string' ? search.description : undefined,
  }),
  component: CreateCoin,
})

interface Draft {
  name: string
  symbol: string
  description: string
  image: string | null
  supply: string
  decimals: string
  website: string
  x: string
  telegram: string
  revokeMint: boolean
  revokeFreeze: boolean
}

const EMPTY: Draft = {
  name: '',
  symbol: '',
  description: '',
  image: null,
  supply: '1000000000',
  decimals: '6',
  website: '',
  x: '',
  telegram: '',
  revokeMint: true,
  revokeFreeze: true,
}

const BASE_FEE = 0.1
const REVOKE_FEE = 0.05

function CreateCoin() {
  const search = Route.useSearch()
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<Draft>(EMPTY)

  useEffect(() => {
    if (!search.name && !search.symbol) return
    setDraft({
      ...EMPTY,
      name: search.name ?? '',
      symbol: (search.symbol ?? '').toUpperCase().slice(0, 10),
      description: search.description ?? '',
    })
    setStep(1)
    setSubmitted(false)
  }, [search.name, search.symbol, search.description])
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const { connected, address, openModal } = useWallet()

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const fee =
    BASE_FEE + (draft.revokeMint ? REVOKE_FEE : 0) + (draft.revokeFreeze ? REVOKE_FEE : 0)

  const validateStep = () => {
    const e: typeof errors = {}
    if (step === 1) {
      if (!draft.name.trim()) e.name = 'Give your coin a name'
      if (!/^[A-Za-z0-9]{2,10}$/.test(draft.symbol)) e.symbol = '2–10 letters or numbers'
    }
    if (step === 2) {
      const supply = Number(draft.supply)
      if (!Number.isInteger(supply) || supply <= 0) e.supply = 'Enter a whole number above 0'
      const dec = Number(draft.decimals)
      if (!Number.isInteger(dec) || dec < 0 || dec > 9) e.decimals = '0 to 9'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => validateStep() && setStep((s) => Math.min(3, s + 1))

  const launch = () => {
    if (!connected) return openModal()
    localStorage.setItem(
      'memeforge:draft',
      JSON.stringify({ ...draft, image: null, creator: address, savedAt: Date.now() }),
    )
    setSubmitted(true)
  }

  return (
    <div className="px-4 pb-24">
      <section className="mx-auto max-w-5xl pt-12 text-center sm:pt-14">
        <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Launch Your Own Coin FAST{' '}
          <Zap className="inline -translate-y-1 fill-amber-400 text-orange-500" size={56} />
        </h1>
        <p className="mt-6 text-lg text-zinc-400 sm:text-xl">
          Launch your own token on Solana in seconds. No coding required.
        </p>
      </section>

      <Stepper step={step} />

      <div className="mx-auto max-w-[1080px] rounded-xl border border-white/10 bg-forge-panel p-5 sm:p-8">
        {submitted ? (
          <Submitted draft={draft} onReset={() => {
            setDraft(EMPTY)
            setStep(1)
            setSubmitted(false)
          }} />
        ) : (
          <>
            {step === 1 && <StepDetails draft={draft} set={set} errors={errors} />}
            {step === 2 && <StepSupply draft={draft} set={set} errors={errors} />}
            {step === 3 && <StepReview draft={draft} fee={fee} />}

            <div className="mt-8 flex items-center justify-between gap-4">
              {step > 1 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 rounded-lg px-5 py-3 font-semibold text-zinc-300 hover:bg-white/5"
                >
                  <ArrowLeft size={18} /> Back
                </button>
              ) : (
                <span />
              )}
              {step < 3 ? (
                <button
                  onClick={next}
                  className="flex items-center gap-2 rounded-lg bg-forge-violet px-8 py-3 font-bold transition hover:bg-violet-600"
                >
                  Next <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={launch}
                  className="flex items-center gap-2 rounded-lg bg-forge-violet px-8 py-3 font-bold transition hover:bg-violet-600"
                >
                  {connected ? (
                    <>
                      <Rocket size={18} /> Launch Coin · {fee.toFixed(2)} SOL
                    </>
                  ) : (
                    <>
                      <Wallet size={18} /> Connect Wallet to Launch
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <Features />

      <section className="mx-auto mt-20 max-w-[1500px]">
        <div className="mb-6 flex items-end justify-between px-1">
          <h2 className="text-2xl font-bold sm:text-3xl">Trending right now</h2>
          <Link to="/trending" className="flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300">
            See all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {trendingCoins.slice(0, 2).map((c) => (
            <CoinCard key={c.id} coin={c} />
          ))}
        </div>
      </section>
    </div>
  )
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="my-14 flex items-center justify-center sm:my-20">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold transition ${
              n < step
                ? 'bg-emerald-500'
                : n === step
                  ? 'bg-forge-violet'
                  : 'bg-zinc-700 text-zinc-300'
            }`}
          >
            {n < step ? <Check size={20} /> : n}
          </span>
          {n < 3 && (
            <span className={`mx-2.5 h-[3px] w-16 rounded sm:w-28 ${n < step ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

type StepProps = {
  draft: Draft
  set: <K extends keyof Draft>(key: K, value: Draft[K]) => void
  errors: Partial<Record<keyof Draft, string>>
}

const inputCls =
  'w-full rounded-md border border-white/5 bg-forge-input px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-forge-indigo'

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-3 block font-semibold">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-sm text-red-400">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-sm text-zinc-500">{hint}</span>
      ) : null}
    </label>
  )
}

function StepDetails({ draft, set, errors }: StepProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const onFile = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return
    if (draft.image) URL.revokeObjectURL(draft.image)
    set('image', URL.createObjectURL(file))
  }

  return (
    <div className="space-y-7">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Token Name" error={errors.name}>
          <input
            className={inputCls}
            placeholder="Meme Coin"
            maxLength={32}
            value={draft.name}
            onChange={(e) => set('name', e.target.value)}
          />
        </Field>
        <Field label="Token Symbol" error={errors.symbol}>
          <input
            className={`${inputCls} uppercase`}
            placeholder="MEME"
            maxLength={10}
            value={draft.symbol}
            onChange={(e) => set('symbol', e.target.value.toUpperCase().replace(/\s/g, ''))}
          />
        </Field>
      </div>

      <div>
        <span className="mb-3 block font-semibold">Token Image</span>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            onFile(e.dataTransfer.files[0])
          }}
          className={`flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-10 transition ${
            dragging ? 'border-forge-indigo bg-indigo-500/10' : 'border-zinc-600 bg-forge-input/60 hover:bg-forge-input'
          }`}
        >
          {draft.image ? (
            <img src={draft.image} alt="Token preview" className="mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-violet-500/40" />
          ) : (
            <span className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-700/80">
              <CloudUpload size={34} className="text-zinc-300" />
            </span>
          )}
          <span className="text-lg">
            <strong>{draft.image ? 'Change image' : 'Click to upload'}</strong>{' '}
            <span className="text-zinc-400">or drag and drop</span>
          </span>
          <span className="mt-1 text-sm text-zinc-500">PNG, JPG or GIF · square works best</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>

      <Field label="Description" hint="Optional — tell people what your coin is about.">
        <textarea
          className={`${inputCls} min-h-28 resize-y`}
          placeholder="The most legendary meme on Solana…"
          maxLength={500}
          value={draft.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </Field>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  title,
  body,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  title: string
  body: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-start gap-4 rounded-lg border p-4 text-left transition ${
        checked ? 'border-violet-500/60 bg-violet-500/10' : 'border-white/5 bg-forge-input/60'
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition ${checked ? 'bg-forge-violet' : 'bg-zinc-600'}`}
      >
        <span className={`h-5 w-5 rounded-full bg-white transition ${checked ? 'translate-x-5' : ''}`} />
      </span>
      <span>
        <span className="block font-semibold">
          {title} <span className="ml-1 text-sm font-normal text-zinc-400">+{REVOKE_FEE} SOL</span>
        </span>
        <span className="text-sm text-zinc-400">{body}</span>
      </span>
    </button>
  )
}

function StepSupply({ draft, set, errors }: StepProps) {
  return (
    <div className="space-y-7">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Total Supply" error={errors.supply} hint="Most memecoins use 1,000,000,000.">
          <input
            className={inputCls}
            inputMode="numeric"
            value={draft.supply}
            onChange={(e) => set('supply', e.target.value.replace(/[^\d]/g, ''))}
          />
        </Field>
        <Field label="Decimals" error={errors.decimals} hint="6 is the Solana standard.">
          <input
            className={inputCls}
            inputMode="numeric"
            value={draft.decimals}
            onChange={(e) => set('decimals', e.target.value.replace(/[^\d]/g, ''))}
          />
        </Field>
      </div>

      <div>
        <span className="mb-3 block font-semibold">Social Links <span className="font-normal text-zinc-500">(optional)</span></span>
        <div className="grid gap-4 md:grid-cols-3">
          <IconInput icon={<Globe size={17} />} placeholder="https://yourcoin.com" value={draft.website} onChange={(v) => set('website', v)} />
          <IconInput icon={<XLogo size={15} />} placeholder="https://x.com/yourcoin" value={draft.x} onChange={(v) => set('x', v)} />
          <IconInput icon={<Send size={17} />} placeholder="https://t.me/yourcoin" value={draft.telegram} onChange={(v) => set('telegram', v)} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Toggle
          checked={draft.revokeMint}
          onChange={(v) => set('revokeMint', v)}
          title="Revoke Mint Authority"
          body="No one can ever mint more tokens. Buyers trust fixed supply."
        />
        <Toggle
          checked={draft.revokeFreeze}
          onChange={(v) => set('revokeFreeze', v)}
          title="Revoke Freeze Authority"
          body="Holders' wallets can never be frozen. Required by most DEXs."
        />
      </div>
    </div>
  )
}

function IconInput({
  icon,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400">{icon}</span>
      <input
        className={`${inputCls} pl-10`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function TokenAvatar({ draft, size = 'h-20 w-20' }: { draft: Draft; size?: string }) {
  return draft.image ? (
    <img src={draft.image} alt="" className={`${size} rounded-full object-cover`} />
  ) : (
    <span className={`${size} flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-700 text-2xl font-bold`}>
      {draft.symbol.slice(0, 2) || '?'}
    </span>
  )
}

function StepReview({ draft, fee }: { draft: Draft; fee: number }) {
  const { connected, address } = useWallet()
  const rows: Array<[string, string]> = [
    ['Total supply', Number(draft.supply).toLocaleString('en-US')],
    ['Decimals', draft.decimals],
    ['Mint authority', draft.revokeMint ? 'Revoked' : 'Kept by you'],
    ['Freeze authority', draft.revokeFreeze ? 'Revoked' : 'Kept by you'],
    ['Creator wallet', connected && address ? shortAddress(address) : 'Not connected'],
  ]
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <div>
        <div className="mb-6 flex items-center gap-5">
          <TokenAvatar draft={draft} />
          <div>
            <h3 className="text-2xl font-bold">{draft.name}</h3>
            <p className="text-lg text-zinc-400">${draft.symbol}</p>
          </div>
        </div>
        {draft.description && <p className="mb-6 text-zinc-300">{draft.description}</p>}
        <dl className="divide-y divide-white/5 rounded-lg bg-forge-input/50">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between px-4 py-3">
              <dt className="text-zinc-400">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <aside className="h-fit rounded-lg border border-white/10 bg-forge-card p-5">
        <h4 className="mb-4 font-bold">Fee summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-zinc-400">Create coin</span><span>{BASE_FEE} SOL</span></div>
          {draft.revokeMint && <div className="flex justify-between"><span className="text-zinc-400">Revoke mint</span><span>{REVOKE_FEE} SOL</span></div>}
          {draft.revokeFreeze && <div className="flex justify-between"><span className="text-zinc-400">Revoke freeze</span><span>{REVOKE_FEE} SOL</span></div>}
          <div className="flex justify-between border-t border-white/10 pt-3 text-base font-bold">
            <span>Total</span><span className="text-emerald-400">{fee.toFixed(2)} SOL</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-zinc-500">Plus standard Solana network fees. You'll review every transaction in your wallet before it's sent.</p>
      </aside>
    </div>
  )
}

function Submitted({ draft, onReset }: { draft: Draft; onReset: () => void }) {
  return (
    <div className="animate-slide-in py-8 text-center">
      <div className="mb-5 flex justify-center">
        <TokenAvatar draft={draft} size="h-24 w-24" />
      </div>
      <h3 className="text-3xl font-bold">${draft.symbol} is ready to launch</h3>
      <p className="mx-auto mt-3 max-w-lg text-zinc-400">
        Your coin's details are saved to this wallet. On-chain minting opens shortly — we'll pick up right here so you can sign and go live.
      </p>
      <button onClick={onReset} className="mt-8 rounded-lg bg-forge-violet px-7 py-3 font-bold hover:bg-violet-600">
        Create another coin
      </button>
    </div>
  )
}

function Features() {
  const items = [
    { icon: <Timer className="text-amber-400" />, title: 'Live in seconds', body: 'Fill three short steps and your SPL token is ready to trade.' },
    { icon: <ShieldCheck className="text-emerald-400" />, title: 'Trust built in', body: 'Revoke mint and freeze authority with one toggle.' },
    { icon: <Zap className="text-indigo-400" />, title: 'Copy what’s trending', body: 'Clone the metadata of hot coins and ride the wave.' },
  ]
  return (
    <section className="mx-auto mt-20 grid max-w-[1080px] gap-5 md:grid-cols-3">
      {items.map((f) => (
        <div key={f.title} className="rounded-xl border border-white/5 bg-forge-card p-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white/5">{f.icon}</div>
          <h3 className="mb-1.5 text-lg font-bold">{f.title}</h3>
          <p className="text-zinc-400">{f.body}</p>
        </div>
      ))}
    </section>
  )
}
