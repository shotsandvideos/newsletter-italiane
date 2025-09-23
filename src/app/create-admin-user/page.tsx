'use client'

import { useState } from 'react'
import { createSupabaseClient } from '../../lib/supabase'

export default function CreateAdminUser() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const supabase = createSupabaseClient()
  
  const createAdmin = async () => {
    setLoading(true)
    setStatus('Creating admin session...')
    
    try {
      // Create admin user and session directly via API
      const response = await fetch('/api/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'shotsandvideos@gmail.com',
          password: 'Admin123456!',
          first_name: 'Admin',
          last_name: 'User'
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        setStatus(`Error: ${result.error}`)
        return
      }
      
      if (result.success) {
        setStatus('✅ Admin user created! Now logging in...')
        
        // Get admin login magic link
        const loginResponse = await fetch('/api/admin-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'shotsandvideos@gmail.com'
          })
        })
        
        const loginResult = await loginResponse.json()
        
        if (loginResult.success && loginResult.magic_link) {
          setStatus('✅ Login magic link generated! Redirecting...')
          setTimeout(() => {
            window.location.href = loginResult.magic_link
          }, 1000)
        } else {
          setStatus('⚠️ Admin created but auto-login failed. Please try manual login.')
          console.error('Login error:', loginResult.error)
        }
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
              Email: shotsandvideos@gmail.com<br/>
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