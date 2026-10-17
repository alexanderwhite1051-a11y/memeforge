import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'


import '../styles.css'
import { WalletProvider } from '@/lib/wallet'
import { Header } from '@/components/Header'
import { PromoBanner } from '@/components/PromoBanner'

const siteName = 'MemeForge — Launch Your Own Solana Coin FAST'
const siteDescription =
  'Launch your own token on Solana in seconds. Copy trending coins, manage liquidity and track X in real time.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <WalletProvider>
          <PromoBanner />
          <Header />
          <main className="min-h-[calc(100vh-128px)]">{children}</main>
          <footer className="border-t border-white/5 py-8 text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} MemeForge · Built for Solana · Trading memecoins is risky — only spend what you can afford to lose.
          </footer>
        </WalletProvider>
        <Scripts />
      </body>
    </html>
  )
}
