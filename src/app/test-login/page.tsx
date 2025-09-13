'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function TestLoginPage() {
  const [email, setEmail] = useState('test.user@gmail.com')
  const [password, setPassword] = useState('Test123456!')
  const [status, setStatus] = useState<any>({ message: 'Ready to test' })
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    'https://uaixwbiyttghmtesjdsx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaXh3Yml5dHRnaG10ZXNqZHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDgzMTEsImV4cCI6MjA3MTg4NDMxMX0.rChVsxz_Cq7blmf2hOQ0PXsI3T34icDrWZCF-3vqjPU'
  )

  const testSignUp = async () => {
    setLoading(true)
    setStatus({ message: 'Signing up...' })
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            first_name: 'Test',
            last_name: 'User'
          }
        }
      })
      
      if (error) {
        setStatus({ 
          error: error.message,
          code: error.status,
          details: error,
          hint: error.message.includes('not confirmed') 
            ? 'Go to Supabase Dashboard → Authentication → Users → Confirm email manually' 
            : undefined
        })
      } else {
        setStatus({ 
          success: true,
          message: 'Sign up successful! Email confirmation required.',
          user: data.user?.email,
          note: 'Go to Supabase Dashboard to confirm email manually, or check your inbox'
        })
      }
    } catch (e: any) {
      setStatus({ 
        error: e.message,
        stack: e.stack
      })
    } finally {
      setLoading(false)
    }
  }

  const testSignIn = async () => {
    setLoading(true)
    setStatus({ message: 'Signing in...' })
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setStatus({ 
          error: error.message,
          code: error.status,
          details: error,
          solution: error.message.includes('not confirmed') 
            ? '📌 SOLUZIONE: Vai su https://supabase.com → Il tuo progetto → Authentication → Users → Trova test.user@gmail.com → Click (...) → Confirm email' 
            : undefined
        })
      } else {
        setStatus({ 
          success: true,
          message: 'Sign in successful!',
          user: data.user?.email,
          session: !!data.session
        })
        
        // After successful login, check session
        setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession()
          setStatus(prev => ({
            ...prev,
            sessionCheck: session ? 'Session exists' : 'No session',
            sessionUser: session?.user?.email
          }))
        }, 1000)
      }
    } catch (e: any) {
      setStatus({ 
        error: e.message,
        stack: e.stack
      })
    } finally {
      setLoading(false)
    }
  }

  const checkSession = async () => {
    setLoading(true)
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        setStatus({ 
          error: error.message,
          details: error
        })
      } else {
        setStatus({ 
          session: session ? 'Session exists' : 'No session',
          user: session?.user?.email || 'No user',
          expiresAt: session?.expires_at,
          accessToken: session?.access_token ? 'Present' : 'Missing'
        })
      }
    } catch (e: any) {
      setStatus({ 
        error: e.message,
        stack: e.stack
      })
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        setStatus({ error: error.message })
      } else {
        setStatus({ message: 'Signed out successfully' })
      }
    } catch (e: any) {
      setStatus({ error: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f7f7f5' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Direct Login Test</h1>
        <p className="text-sm text-gray-600 mb-6">Using hardcoded Supabase credentials to test authentication</p>
        
        <div className="bg-white p-6 rounded-lg border mb-6">
          <h2 className="text-lg font-semibold mb-4">Test Credentials</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                disabled={loading}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border mb-6">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={testSignUp}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              1. Sign Up
            </button>
            <button
              onClick={testSignIn}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              2. Sign In
            </button>
            <button
              onClick={checkSession}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Check Session
            </button>
            <button
              onClick={signOut}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
        
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm font-semibold mb-2">Instructions:</p>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>First click "Sign Up" to create the test user</li>
            <li>Then click "Sign In" to login</li>
            <li>Click "Check Session" to verify the session exists</li>
            <li>If session exists, try navigating to <a href="/dashboard" className="text-blue-600 underline">/dashboard</a></li>
          </ol>
        </div>
      </div>
    </div>
  )
}