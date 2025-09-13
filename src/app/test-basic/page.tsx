'use client'

import { useState } from 'react'

export default function TestBasicPage() {
  const [counter, setCounter] = useState(0)
  const [message, setMessage] = useState('Click the button to test')

  const handleClick = () => {
    setCounter(counter + 1)
    setMessage(`Button clicked ${counter + 1} times`)
    console.log('Button clicked!')
    
    // Show environment variables
    const envInfo = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
    console.log('Environment:', envInfo)
    alert('Environment:\n' + JSON.stringify(envInfo, null, 2))
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f7f7f5' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Basic Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg border mb-4">
          <p className="mb-4">{message}</p>
          <button
            onClick={handleClick}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Button (Counter: {counter})
          </button>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h2 className="font-bold mb-2">Debug Info (Rendered):</h2>
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'}</p>
          <p>Has Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'YES' : 'NO'}</p>
        </div>
      </div>
    </div>
  )
}