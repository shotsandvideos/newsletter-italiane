'use client'

import { useEffect, useState, useRef } from 'react'

interface FadeInOnScrollProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  threshold?: number
  className?: string
}

export default function FadeInOnScroll({ 
  children, 
  delay = 0, 
  direction = 'up',
  threshold = 0.1,
  className = ''
}: FadeInOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [delay, threshold])

  const getTransformClass = () => {
    if (isVisible) return 'translate-x-0 translate-y-0'
    
    switch (direction) {
      case 'up': return 'translate-y-8'
      case 'down': return '-translate-y-8'
      case 'left': return 'translate-x-8'
      case 'right': return '-translate-x-8'
      default: return ''
    }
  }

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${getTransformClass()} ${className}`}
    >
      {children}
    </div>
  )
}