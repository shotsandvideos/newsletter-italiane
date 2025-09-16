'use client'

import { useState } from 'react'
import { createSupabaseClient } from '../../lib/supabase'

export default function TestSimpleLogin() {
  const [status, setStatus] = useState<string>('Ready')
  const supabase = createSupabaseClient()
  
  const testDirectLogin = async () => {
    setStatus('Testing...')
    
    try {
      // 1. Check current session
      console.log('1️⃣ Checking current session...')
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      console.log('Current session:', currentSession ? 'EXISTS' : 'NONE')
      
      if (currentSession) {
        setStatus(`Already logged in as: ${currentSession.user.email}`)
        return
      }
      
      // 2. Try to sign in
      console.log('2️⃣ Attempting sign in...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo@frames.it',
        password: 'Demo123456!'
      })
      
      console.log('Sign in result:', {
        success: !error,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        error: error?.message
      })
      
      if (error) {
        setStatus(`Login failed: ${error.message}`)
        return
      }
      
      if (data?.session) {
        setStatus(`✅ Logged in as: ${data.user?.email}`)
        
        // 3. Verify session is saved
        console.log('3️⃣ Verifying session...')
        setTimeout(async () => {
          const { data: { session: newSession } } = await supabase.auth.getSession()
          console.log('Session after login:', newSession ? 'EXISTS' : 'NONE')
          
          if (newSession) {
            console.log('🎉 Session persisted successfully!')
            window.location.href = '/dashboard'
          } else {
            console.log('❌ Session not persisted')
            setStatus('Session not persisted - check Supabase config')
          }
        }, 1000)
      }
    } catch (err: any) {
      console.error('Test error:', err)
      setStatus(`Error: ${err.message}`)
    }
  }
  
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      setStatus(`Session exists: ${session.user.email}`)
      console.log('Full session:', session)
    } else {
      setStatus('No session found')
    }
  }
  
  const signOut = async () => {
    await supabase.auth.signOut()
    setStatus('Signed out')
  }
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Simple Login Test</h1>
        
        <div className="bg-slate-800 rounded-lg p-6 mb-4">
          <p className="text-lg mb-4">Status: <span className="text-yellow-400">{status}</span></p>
          
          <div className="space-y-3">
            <button
              onClick={testDirectLogin}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              Test Login (demo@frames.it)
            </button>
            
            <button
              onClick={checkSession}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Check Session
            </button>
            
            <button
              onClick={signOut}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-400">
          <p>Open console (F12) to see detailed logs</p>
        </div>
      </div>
    </div>
  )
}