export default function TestStaticPage() {
  // This is a server component - no 'use client'
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f7f7f5' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Static Test Page (Server Component)</h1>
        
        <div className="bg-white p-6 rounded-lg border mb-4">
          <h2 className="text-lg font-semibold mb-2">Environment Variables:</h2>
          <p>Supabase URL: <code className="bg-gray-100 px-2 py-1 rounded">{supabaseUrl}</code></p>
          <p>Has Anon Key: <code className="bg-gray-100 px-2 py-1 rounded">{hasAnonKey ? 'YES' : 'NO'}</code></p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm">
            This is a server component. If you see the environment variables above, 
            they are loading correctly on the server.
          </p>
        </div>
        
        <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm font-bold">Next Steps:</p>
          <ol className="list-decimal list-inside text-sm mt-2">
            <li>If you see "NOT SET", check your .env.local file</li>
            <li>If you see the URL, the environment is configured correctly</li>
            <li>Try navigating to <a href="/auth/sign-in" className="text-blue-600 underline">/auth/sign-in</a></li>
          </ol>
        </div>
      </div>
    </div>
  )
}