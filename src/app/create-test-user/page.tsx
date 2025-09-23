'use client'

import { useState } from 'react'
import { createSupabaseClient } from '../../lib/supabase'

export default function CreateTestUserPage() {
  const [status, setStatus] = useState<any>({ step: 'ready' })
  const [email] = useState('demo@frames.it')
  const [password] = useState('Demo123456!')
  const supabase = createSupabaseClient()

  const createTestUser = async () => {
    console.log('🚀 createTestUser started')
    setStatus({ step: 'creating', message: 'Creating test user...' })
    
    try {
      // Step 1: Sign up the user
      console.log('Step 1: Creating user account...', { email, password })
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: 'Demo',
            last_name: 'User',
            role: 'creator'
          }
        }
      })

      console.log('📧 SignUp result:', { signUpData: !!signUpData, signUpError: signUpError?.message })

      if (signUpError) {
        // Check if user already exists
        if (signUpError.message.includes('already registered')) {
          setStatus({ 
            step: 'exists', 
            message: 'User already exists, trying to sign in...',
            email
          })
          
          // Try to sign in
          console.log('🔑 Attempting existing user sign in...')
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          })
          console.log('🔑 Existing user sign in result:', { signInData: !!signInData, signInError: signInError?.message })
          
          if (signInError) {
            setStatus({ 
              step: 'error', 
              message: 'User exists but login failed',
              error: signInError.message,
              solution: 'Try resetting the password or creating a different user'
            })
            return
          }
          
          setStatus({ 
            step: 'success', 
            message: 'Logged in successfully!',
            email,
            redirecting: true
          })
          
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 2000)
          return
        }
        
        setStatus({ 
          step: 'error', 
          message: 'Failed to create user',
          error: signUpError.message 
        })
        return
      }

      // Step 2: Auto-confirm the user (for development)
      if (signUpData.user) {
        console.log('Step 2: User created, attempting to sign in...')
        setStatus({ 
          step: 'signing_in', 
          message: 'User created! Signing in...',
          userId: signUpData.user.id
        })
        
        // Step 3: Create profile directly with signUpData.user (with timeout)
        console.log('📝 Creating profile with signup user data...')
        try {
          const profilePromise = supabase
            .from('profiles')
            .upsert({
              id: signUpData.user.id,
              email: signUpData.user.email,
              first_name: 'Demo',
              last_name: 'User',
              role: 'creator',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile creation timeout')), 5000)
          )
          
          const result = await Promise.race([profilePromise, timeoutPromise]) as any
          
          if (result?.error) {
            console.error('Profile creation error:', result.error)
            console.log('⚠️ Continuing without profile...')
          } else {
            console.log('✅ Profile created successfully')
          }
        } catch (profileException: any) {
          console.error('Profile creation exception:', profileException?.message || profileException)
          console.log('⚠️ Continuing without profile...')
        }
        
        // Try to sign in immediately (but don't wait for response)
        console.log('🔑 Attempting new user sign in...')
        supabase.auth.signInWithPassword({
          email,
          password
        }).then(({ data: signInData, error: signInError }) => {
          console.log('🔑 Sign in completed:', { 
            hasData: !!signInData, 
            error: signInError?.message 
          })
        }).catch(err => {
          console.log('🔑 Sign in promise error:', err.message)
        })
        
        console.log('🎉 Setting success status and preparing redirect...')
        setStatus({ 
          step: 'success', 
          message: 'Test user created and logged in successfully!',
          email,
          password,
          redirecting: true
        })
        
        console.log('⏰ Setting redirect timer for 3 seconds...')
        setTimeout(() => {
          console.log('🚀 Redirecting to dashboard now...')
          window.location.href = '/dashboard'
        }, 3000)
      }
    } catch (error: any) {
      console.error('Error:', error)
      setStatus({ 
        step: 'error', 
        message: 'Unexpected error',
        error: error.message 
      })
    }
  }

  const tryLogin = async () => {
    setStatus({ step: 'logging_in', message: 'Attempting to sign in...' })
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setStatus({ 
          step: 'error', 
          message: 'Login failed',
          error: error.message
        })
        return
      }
      
      setStatus({ 
        step: 'success', 
        message: 'Logged in successfully!',
        email,
        redirecting: true
      })
      
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    } catch (error: any) {
      setStatus({ 
        step: 'error', 
        message: 'Login error',
        error: error.message 
      })
    }
  }

  const clearAndReset = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    sessionStorage.clear()
    setStatus({ step: 'ready', message: 'Cleared all sessions' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          <span className="text-red-500">🚀</span> Quick Setup
        </h1>
        
        <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold mb-6">Test Account Creation</h2>
          
          <div className="bg-black/30 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Test Credentials:</h3>
            <div className="space-y-2 font-mono">
              <div>Email: <span className="text-green-400">{email}</span></div>
              <div>Password: <span className="text-green-400">{password}</span></div>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <button
              onClick={() => {
                console.log('🔥 Button clicked!')
                createTestUser()
              }}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg font-bold text-lg transition transform hover:scale-105"
            >
              🎯 Create Test User & Auto Login
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={tryLogin}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
              >
                🔑 Try Login Only
              </button>
              
              <button
                onClick={clearAndReset}
                className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
              >
                🗑️ Clear Sessions
              </button>
            </div>
          </div>
          
          {/* Status Display */}
          <div className="bg-black/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Status:</h3>
            
            {status.step === 'ready' && (
              <div className="text-gray-300">
                Ready to create test user. Click the button above to start.
              </div>
            )}
            
            {status.step === 'creating' && (
              <div className="text-yellow-400 animate-pulse">
                {status.message}
              </div>
            )}
            
            {status.step === 'exists' && (
              <div className="text-orange-400">
                <p>{status.message}</p>
                <p className="text-sm mt-2">Email: {status.email}</p>
              </div>
            )}
            
            {status.step === 'signing_in' && (
              <div className="text-blue-400 animate-pulse">
                {status.message}
              </div>
            )}
            
            {status.step === 'success' && (
              <div className="text-green-400">
                <p className="text-xl mb-2">✅ {status.message}</p>
                {status.email && <p>Email: {status.email}</p>}
                {status.password && <p>Password: {status.password}</p>}
                {status.redirecting && (
                  <p className="mt-4 animate-pulse">Redirecting to dashboard...</p>
                )}
              </div>
            )}
            
            {status.step === 'needs_confirmation' && (
              <div className="text-yellow-400">
                <p className="mb-3">{status.message}</p>
                <div className="text-sm space-y-1">
                  {status.instructions?.map((instruction: string, i: number) => (
                    <p key={i}>{instruction}</p>
                  ))}
                </div>
              </div>
            )}
            
            {status.step === 'error' && (
              <div className="text-red-400">
                <p className="text-xl mb-2">❌ {status.message}</p>
                <p className="text-sm bg-red-900/30 p-3 rounded mt-2">{status.error}</p>
                {status.solution && (
                  <p className="text-yellow-400 text-sm mt-2">💡 {status.solution}</p>
                )}
              </div>
            )}
            
            {status.step === 'logging_in' && (
              <div className="text-blue-400 animate-pulse">
                {status.message}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center space-x-4 text-sm">
          <a href="/dashboard" className="text-cyan-400 hover:underline">Dashboard</a>
          <span className="text-gray-500">•</span>
          <a href="/auth/sign-in" className="text-cyan-400 hover:underline">Normal Login</a>
          <span className="text-gray-500">•</span>
          <a href="/debug-auth" className="text-cyan-400 hover:underline">Debug Panel</a>
        </div>
      </div>
    </div>
  )
}
