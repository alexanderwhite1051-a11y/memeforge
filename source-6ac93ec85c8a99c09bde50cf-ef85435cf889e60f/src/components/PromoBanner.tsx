import { TriangleAlert } from 'lucide-react'

export function PromoBanner() {
  return (
    <div className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-600 px-4 py-2 text-center text-xs font-bold tracking-wide uppercase sm:text-sm">
      <TriangleAlert size={14} className="mr-1.5 inline -translate-y-px text-amber-300" />
      Launch week: 0.1 SOL create coin fee
    </div>
  )
}
