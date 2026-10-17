# MemeForge

MemeForge is a Solana memecoin launchpad. Visitors connect a Solana wallet (Phantom, Solflare, or Backpack), launch their own SPL token through a 3-step wizard, copy the details of trending coins, manage Raydium liquidity, and follow a live X (Twitter) tracker of top Solana callers. The X Tracker and Manage Liquidity screens only unlock once a wallet is connected.

## Screens

| Route | Screen |
|-------|--------|
| `/` | **Create Coin**: 3-step token wizard (details and image → supply, socials, authority revokes → review and fee summary) |
| `/trending` | **Copy Trending Coins**: searchable, sortable coin cards with "Copy to Raydium", which pre-fills the wizard |
| `/tracker` | **X Tracker (LIVE)**: requires a connected wallet. Tracked accounts, a live post feed, most-mentioned tickers, contract address copy |
| `/liquidity` | **Manage Liquidity**: requires a connected wallet. LP positions, add/remove/lock actions |

## Tech

- TanStack Start (React 19, TanStack Router), Vite 7
- Tailwind CSS 4, lucide-react icons, Outfit font
- Wallet connection through the providers that wallet extensions inject into the page. Only the public key is requested; there are no extra SDK dependencies.
- Deployed on Netlify

## Running locally

```bash
pnpm install
netlify dev   # or: pnpm dev
```

Use a desktop browser with Phantom, Solflare, or Backpack installed to test wallet connection. On mobile, the connect dialog opens the site inside the wallet's own browser.

## Roadmap

Coin data, the X feed, and LP positions are currently sample data in `src/data/fixtures.ts`. See [PLAN.md](./PLAN.md) for the remaining milestones: on-chain token minting, live trending data, a real X feed, and Raydium pool management.
