# MemeForge Roadmap

1. **Product surface and wallet connection** ✅
   Branded launchpad UI: Create Coin wizard, Copy Trending Coins, X Tracker, and Manage Liquidity. Real Solana wallet connection (Phantom, Solflare, Backpack), which is required to use the X Tracker and Manage Liquidity and to launch a coin. Sample data lives in `src/data/fixtures.ts`.

2. **On-chain token creation**
   Upload the token image and metadata JSON (Netlify Blobs, or IPFS/Arweave via a function). Build the mint, metadata, and optional mint/freeze-revoke transaction with `@solana/web3.js`, `@solana/spl-token`, and Metaplex. The user signs it in their wallet. The creation fee is a clearly itemized transfer in the same transaction. Show the mint address and explorer link on success.

3. **Persistence: launched coins and drafts**
   Netlify Database tables for coins launched through MemeForge (mint, creator wallet, metadata, created_at) and wizard drafts keyed by wallet. Add a "My Coins" view.

4. **Live trending data**
   A server function that pulls trending Solana tokens (for example DexScreener or Birdeye APIs) and caches the results. Replaces the `trendingCoins` fixture with real market cap, last buy, and reply counts.

5. **Real X Tracker**
   A scheduled or background function that polls the X API for tracked handles and extracts `$TICKERS` and contract addresses. Persist per-wallet watchlists (Netlify Database). Stream new posts to the client over SSE or polling. Verify wallet ownership with a sign-in-with-Solana message so watchlists are tied to a wallet.

6. **Raydium liquidity management**
   Create CPMM pools, add/remove liquidity, and lock or burn LP using the Raydium SDK. Load real positions for the connected wallet.

7. **Polish**
   Language switcher (US EN dropdown), notifications for tracker alerts, SEO/OG images, and analytics.
