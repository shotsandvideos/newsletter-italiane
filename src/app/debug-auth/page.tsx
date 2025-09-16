'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

export default function DebugAuthPage() {
  const [status, setStatus] = useState<any>({})
  const [email, setEmail] = useState('demo@frames.it')
  const [password, setPassword] = useState('Demo123456!')
  const { user, profile, session, loading: authLoading } = useAuth()
  const supabase = createSupabaseClient()

  useEffect(() => {
    checkEverything()
  }, [])

  const checkEverything = async () => {
    console.log('🔍 Starting checkEverything...')
    const checks = {}
    
    // Check Supabase connection
    try {
      console.log('📡 Getting Supabase session...')
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('📡 Session result:', { session: !!session, error: error?.message })
      checks['supabase_session'] = session ? 'Found' : 'None'
      checks['session_user'] = session?.user?.email || 'No user'
      checks['session_error'] = error?.message || 'None'
    } catch (e: any) {
      console.error('❌ Supabase error:', e.message)
      checks['supabase_error'] = e.message
    }

    // Check auth hook
    console.log('🪝 Checking useAuth hook...')
    checks['useAuth_user'] = user?.email || 'None'
    checks['useAuth_profile'] = profile ? 'Found' : 'None'
    checks['useAuth_session'] = session ? 'Found' : 'None'
    checks['useAuth_loading'] = authLoading

    // Check localStorage
    console.log('💾 Checking localStorage...')
    checks['localStorage_adminSession'] = localStorage.getItem('adminSession') ? 'Found' : 'None'
    
    // Check Supabase URL
    console.log('🔗 Checking environment variables...')
    checks['supabase_url'] = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'
    checks['supabase_anon_key'] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'

    console.log('✅ Status update:', checks)
    setStatus(checks)
  }

  const testSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: 'Test',
            last_name: 'User'
          }
        }
      })
      
      setStatus(prev => ({
        ...prev,
        signup_result: error ? error.message : 'Success',
        signup_user: data?.user?.email
      }))
      
      if (!error) {
        // Auto confirm user for testing
        setTimeout(() => checkEverything(), 1000)
      }
    } catch (e) {
      setStatus(prev => ({
        ...prev,
        signup_error: e.message
      }))
    }
  }

  const testSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      setStatus(prev => ({
        ...prev,
        signin_result: error ? error.message : 'Success',
        signin_user: data?.user?.email,
        signin_session: data?.session ? 'Created' : 'None'
      }))
      
      if (!error && data.session) {
        // Refresh everything after login
        setTimeout(() => {
          checkEverything()
          window.location.href = '/dashboard'
        }, 1500)
      }
    } catch (e) {
      setStatus(prev => ({
        ...prev,
        signin_error: e.message
      }))
    }
  }

  const clearSession = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    sessionStorage.clear()
    setStatus({ message: 'All sessions cleared' })
    setTimeout(() => checkEverything(), 500)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-yellow-400">🔍 Auth Debug Panel</h1>
        
        {/* Status Display */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">Current Status</h2>
          <div className="font-mono text-sm">
            {Object.entries(status).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 border-b border-slate-700">
                <span className="text-gray-400">{key}:</span>
                <span className={
                  value === 'None' || value === 'NOT SET' ? 'text-red-400' :
                  value === 'Found' || value === 'SET' || value === 'Success' ? 'text-green-400' :
                  'text-yellow-400'
                }>
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Test Credentials */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">Test Credentials</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 rounded border border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 rounded border border-slate-600 text-white"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={testSignUp}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded font-medium transition"
            >
              Create Test Account
            </button>
            <button
              onClick={testSignIn}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 rounded font-medium transition"
            >
              Sign In
            </button>
            <button
              onClick={checkEverything}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded font-medium transition"
            >
              Refresh Status
            </button>
            <button
              onClick={clearSession}
              className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded font-medium transition"
            >
              Clear All Sessions
            </button>
          </div>
        </div>

        {/* Help */}
        <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-6">
          <h3 className="text-yellow-400 font-bold mb-2">🚨 Troubleshooting Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Check if Supabase URL and Anon Key are set (should show "SET")</li>
            <li>Click "Create Test Account" to create a new user</li>
            <li>Click "Sign In" to login with the test credentials</li>
            <li>If signin_session shows "Created", you should be redirected to dashboard</li>
            <li>If still not working, check browser console for errors</li>
          </ol>
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex gap-4">
          <a href="/dashboard" className="text-cyan-400 hover:underline">→ Dashboard</a>
          <a href="/auth/sign-in" className="text-cyan-400 hover:underline">→ Sign In</a>
          <a href="/test-login" className="text-cyan-400 hover:underline">→ Test Login</a>
          <a href="/" className="text-cyan-400 hover:underline">→ Home</a>
        </div>
      </div>
    </div>
  )
}