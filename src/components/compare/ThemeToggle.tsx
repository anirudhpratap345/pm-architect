'use client'

import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('pmarch_theme')
    const isDark = saved ? saved === 'dark' : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('pmarch_theme', next ? 'dark' : 'light')
  }

  return (
    <button onClick={toggle} className="text-sm px-3 py-1 rounded border bg-white dark:bg-gray-800 dark:text-gray-100">
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}


