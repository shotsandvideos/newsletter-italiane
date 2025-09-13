'use client'

import { useState } from 'react'

export default function TestSimplePage() {
  const [testResults, setTestResults] = useState<string[]>([])

  const runTests = async () => {
    const results: string[] = []
    
    // Test 1: Check environment variables
    results.push('=== Environment Variables ===')
    results.push(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'}`)
    results.push(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET (hidden)' : 'NOT SET'}`)
    
    // Test 2: Try to import and create Supabase client
    try {
      results.push('\n=== Supabase Client Test ===')
      const { createBrowserClient } = await import('@supabase/ssr')
      results.push('✅ @supabase/ssr imported successfully')
      
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const client = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        )
        results.push('✅ Supabase client created')
        
        // Try a simple operation
        try {
          const { data, error } = await client.auth.getSession()
          if (error) {
            results.push(`❌ Get session error: ${error.message}`)
          } else {
            results.push(`✅ Get session successful: ${data.session ? 'Session exists' : 'No session'}`)
          }
        } catch (e: any) {
          results.push(`❌ Session check failed: ${e.message}`)
        }
      } else {
        results.push('❌ Cannot create client - missing env vars')
      }
    } catch (error: any) {
      results.push(`❌ Failed to import/create Supabase: ${error.message}`)
    }
    
    // Test 3: Check if we can reach Supabase URL
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      results.push('\n=== Network Test ===')
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/health`, {
          method: 'GET',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Content-Type': 'application/json'
          }
        })
        results.push(`✅ Health check status: ${response.status}`)
      } catch (error: any) {
        results.push(`❌ Network error: ${error.message}`)
      }
    }
    
    setTestResults(results)
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f7f7f5' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Simple Test Page</h1>
        <p className="mb-4">This page tests basic functionality without using hooks.</p>
        
        <button
          onClick={runTests}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
        >
          Run Tests
        </button>
        
        {testResults.length > 0 && (
          <div className="bg-white p-6 rounded-lg border">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {testResults.join('\n')}
            </pre>
          </div>
        )}
        
        <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm">
            <strong>If tests fail:</strong> Check that your .env.local file exists and contains:
          </p>
          <pre className="mt-2 bg-yellow-100 p-2 rounded text-xs">
{`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key`}
          </pre>
        </div>
      </div>
    </div>
  )
}