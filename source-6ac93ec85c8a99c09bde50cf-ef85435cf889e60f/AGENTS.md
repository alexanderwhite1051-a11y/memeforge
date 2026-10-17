# AGENTS.md

## Project overview

MemeForge is a Solana memecoin launchpad built with TanStack Start on Netlify. **Read `PLAN.md` first.** It is the roadmap; continue from the first unfinished milestone.

## Tech stack

TanStack Start / Router (file-based routes), React 19, Vite 7, Tailwind CSS 4 (theme tokens in `src/styles.css` `@theme`, such as `bg-forge-card` and `bg-forge-violet`), lucide-react, TypeScript strict, `@/` alias → `src/`.

## Key directories

```
src/
  routes/
    __root.tsx      # Shell: WalletProvider, PromoBanner, Header, footer, fonts, SEO
    index.tsx       # Create Coin 3-step wizard (accepts ?name&symbol&description prefill)
    trending.tsx    # Copy Trending Coins grid
    tracker.tsx     # X Tracker, wrapped in <ConnectGate> (wallet required)
    liquidity.tsx   # Manage Liquidity, wrapped in <ConnectGate>
  components/
    Header.tsx      # Nav, XLogo, wallet button/menu
    WalletModal.tsx # Wallet picker (install / mobile deep links)
    ConnectGate.tsx # Blurred preview + "Connect Wallet" overlay until connected
    CoinCard.tsx    # Trending coin card + CoinAvatar
    PromoBanner.tsx
  lib/
    wallet.tsx      # WalletProvider/useWallet: injected-provider connect, auto-reconnect, account change
    useNow.ts       # useElapsed() ticking seconds for live "x s ago" labels
  data/
    fixtures.ts     # ALL stub data (coins, X accounts/posts, LP positions) + formatters
```

## Conventions and decisions

- **Wallet:** there is no wallet-adapter dependency. `lib/wallet.tsx` talks to `window.phantom.solana`, `window.solflare`, and `window.backpack` directly, and requests only the public key. Any transaction must be built transparently and signed by the user in their wallet. Never request seed phrases or private keys, and never request blanket approvals.
- **Gating:** use `<ConnectGate>` for any wallet-only feature. Use `useWallet().connected` / `openModal()` for wallet-only buttons.
- Stub data lives only in `src/data/fixtures.ts`, so later milestones can swap in real sources.
- Persistence must use Netlify primitives (Netlify Database for records, Blobs for images/metadata).
- Do not run build/dev commands for validation; the pipeline builds the site.
