'use client'

import { useEffect, useState, useRef } from 'react'

interface TextRevealProps {
  text: string
  delay?: number
  className?: string
  threshold?: number
}

export default function TextReveal({ 
  text, 
  delay = 0, 
  className = '',
  threshold = 0.1 
}: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold }
    )

    if (textRef.current) {
      observer.observe(textRef.current)
    }

    return () => observer.disconnect()
  }, [delay, threshold])

  return (
    <div ref={textRef} className={`overflow-hidden ${className}`}>
      <div 
        className={`transition-transform duration-1000 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        } ${className}`}
      >
        {text}
      </div>
    </div>
  )
}
