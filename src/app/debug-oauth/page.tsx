'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '../../lib/supabase'

export default function DebugOAuth() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    setDebugInfo({
      origin: window.location.origin,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      redirectUrl: `${window.location.origin}/auth/callback`,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    })
  }, [])

  const testGoogleAuth = async () => {
    try {
      console.log('Testing Google OAuth with debug info:', debugInfo)
      
      const supabase = createSupabaseClient()
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      console.log('OAuth response:', { data, error })
      
      if (error) {
        alert(`OAuth Error: ${error.message}`)
      }
    } catch (err) {
      console.error('OAuth test error:', err)
      alert(`Test Error: ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">OAuth Debug Info</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Environment Info</h2>
          <pre className="text-sm bg-slate-100 p-4 rounded overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Test OAuth</h2>
          <button
            onClick={testGoogleAuth}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test Google OAuth
          </button>
        </div>
      </div>
    </div>
  )
}
