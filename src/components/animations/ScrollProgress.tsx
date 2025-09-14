'use client'

import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentProgress = window.scrollY
      const scrollHeight = document.body.scrollHeight - window.innerHeight
      
      if (scrollHeight) {
        setScrollProgress((currentProgress / scrollHeight) * 100)
      }
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200/20 z-50 backdrop-blur-sm">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}