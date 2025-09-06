// Simple in-memory cache for API responses
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl: number = 300000) { // 5 minutes default TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  clear(key?: string) {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }
}

export const apiCache = new ApiCache()

// Cached fetch function
export async function cachedFetch(url: string, options?: RequestInit, ttl?: number) {
  const cacheKey = `${url}-${JSON.stringify(options || {})}`
  
  // Try to get from cache first
  const cached = apiCache.get(cacheKey)
  if (cached) {
    return cached
  }

  // Fetch from API
  try {
    const response = await fetch(url, options)
    const data = await response.json()
    
    // Cache successful responses
    if (response.ok) {
      apiCache.set(cacheKey, data, ttl)
    }
    
    return data
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}