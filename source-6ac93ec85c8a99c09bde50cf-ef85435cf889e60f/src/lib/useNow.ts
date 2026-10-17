import { useEffect, useState } from 'react'

/** Seconds elapsed since mount, ticking every second (for live "x s ago" labels). */
export function useElapsed() {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setElapsed((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return elapsed
}
