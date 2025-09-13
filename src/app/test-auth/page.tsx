'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '../../lib/supabase'

export default function TestAuthPage() {
  const [status, setStatus] = useState<any>({
    initial: 'Starting...',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      console.log('TestAuth: Starting auth check...')
      
      try {
        // First check if env vars are set
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          setStatus({
            error: 'Missing Supabase environment variables',
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
            anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
          })
          setLoading(false)
          return
        }

        const supabase = createSupabaseClient()
        console.log('TestAuth: Supabase client created')
        
        // Test 1: Check if Supabase is connected with timeout
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), 5000)
        )
        
        const { data: { session }, error: sessionError } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]).catch(err => ({ data: { session: null }, error: err })) as any
        
        console.log('TestAuth: Session check complete', { session: !!session, error: sessionError })
        
        // Test 2: Try to get user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        console.log('TestAuth: User check complete', { user: !!user, error: userError })
        
        setStatus({
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          session: session ? 'Session found' : 'No session',
          sessionError: sessionError?.message || sessionError || 'No error',
          user: user ? user.email : 'No user',
          userError: userError?.message || 'No error',
          timestamp: new Date().toISOString()
        })
      } catch (error: any) {
        console.error('TestAuth: Error during check', error)
        setStatus({
          error: error.message || 'Unknown error',
          stack: error.stack,
          timestamp: new Date().toISOString()
        })
      } finally {
        console.log('TestAuth: Check complete, setting loading to false')
        setLoading(false)
      }
    }
    
    // Add timeout fallback
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('TestAuth: Timeout reached, forcing completion')
        setStatus(prev => ({ ...prev, timeout: 'Auth check timed out after 10 seconds' }))
        setLoading(false)
      }
    }, 10000)
    
    checkAuth()
    
    return () => clearTimeout(timeout)
  }, [])

  const testLogin = async () => {
    setLoading(true)
    const supabase = createSupabaseClient()
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'test123456'
      })
      
      if (error) {
        alert('Login error: ' + error.message)
      } else {
        alert('Login success! User: ' + data.user?.email)
        window.location.reload()
      }
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const testSignUp = async () => {
    setLoading(true)
    const supabase = createSupabaseClient()
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'test123456'
      })
      
      if (error) {
        alert('Signup error: ' + error.message)
      } else {
        alert('Signup success! Check email for confirmation')
      }
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const testLogout = async () => {
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f7f7f5' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Test Auth Page</h1>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Current Status</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(status, null, 2)}
              </pre>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Test Actions</h2>
              <div className="space-x-4">
                <button
                  onClick={testSignUp}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  Test Sign Up
                </button>
                <button
                  onClick={testLogin}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={loading}
                >
                  Test Login
                </button>
                <button
                  onClick={testLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={loading}
                >
                  Test Logout
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Refresh
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Instructions</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Click "Test Sign Up" to create a test user (test@example.com / test123456)</li>
                <li>Check your Supabase dashboard to confirm the user was created</li>
                <li>Click "Test Login" to log in with the test user</li>
                <li>Check if session and user appear in the status</li>
                <li>Navigate to /dashboard to see if it works</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}