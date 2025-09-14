'use client'

import { useEffect, useState, useRef } from 'react'

interface StaggeredContainerProps {
  children: React.ReactNode[]
  staggerDelay?: number
  className?: string
  threshold?: number
}

export default function StaggeredContainer({ 
  children, 
  staggerDelay = 200, 
  className = '',
  threshold = 0.1 
}: StaggeredContainerProps) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(children.length).fill(false))
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems(prev => {
                const newState = [...prev]
                newState[index] = true
                return newState
              })
            }, index * staggerDelay)
          })
        }
      },
      { threshold }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [children.length, staggerDelay, threshold])

  return (
    <div ref={containerRef} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`transition-all duration-700 ease-out ${
            visibleItems[index] 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  )
}