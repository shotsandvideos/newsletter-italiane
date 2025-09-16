'use client'

import { useState } from 'react'
import { createSupabaseClient } from '../../lib/supabase'

export default function CreateAdminUser() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const supabase = createSupabaseClient()
  
  const createAdmin = async () => {
    setLoading(true)
    setStatus('Creating admin user...')
    
    try {
      // Check if admin already exists
      const { data: existingSession } = await supabase.auth.getSession()
      if (existingSession.session) {
        await supabase.auth.signOut()
      }
      
      // Try to sign in first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'admin@frames.it',
        password: 'Admin123456!'
      })
      
      if (!signInError) {
        setStatus('Admin user already exists and logged in!')
        
        // Update profile to admin role
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              email: user.email,
              first_name: 'Admin',
              last_name: 'User',
              role: 'admin',
              is_active: true
            })
          
          setStatus('✅ Admin user ready! Redirecting to admin panel...')
          setTimeout(() => {
            window.location.href = '/admin/newsletters'
          }, 2000)
        }
        return
      }
      
      // Create new admin user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@frames.it',
        password: 'Admin123456!',
        options: {
          data: {
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin'
          }
        }
      })
      
      if (signUpError) {
        setStatus(`Error: ${signUpError.message}`)
        return
      }
      
      if (signUpData.user) {
        // Create admin profile
        await supabase
          .from('profiles')
          .upsert({
            id: signUpData.user.id,
            email: signUpData.user.email,
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin',
            is_active: true
          })
        
        // Sign in
        await supabase.auth.signInWithPassword({
          email: 'admin@frames.it',
          password: 'Admin123456!'
        })
        
        setStatus('✅ Admin user created! Redirecting to admin panel...')
        setTimeout(() => {
          window.location.href = '/admin/newsletters'
        }, 2000)
      }
    } catch (error: any) {
      setStatus(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Create Admin User</h1>
        
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-4">Admin Credentials:</p>
            <code className="block bg-slate-900 p-3 rounded">
              Email: admin@frames.it<br/>
              Password: Admin123456!
            </code>
          </div>
          
          <button
            onClick={createAdmin}
            disabled={loading}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg font-medium"
          >
            {loading ? 'Creating...' : 'Create Admin User'}
          </button>
          
          {status && (
            <div className="mt-4 p-3 bg-slate-900 rounded text-sm">
              {status}
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          <a href="/dashboard" className="hover:text-white">← Back to Dashboard</a>
        </div>
      </div>
    </div>
  )
}