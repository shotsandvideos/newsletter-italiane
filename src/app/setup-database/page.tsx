'use client'

import { useState } from 'react'
import { createSupabaseClient } from '../../lib/supabase'

export default function SetupDatabase() {
  const [status, setStatus] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createSupabaseClient()
  
  const addStatus = (message: string) => {
    setStatus(prev => [...prev, message])
    console.log(message)
  }
  
  const setupDatabase = async () => {
    setLoading(true)
    setStatus([])
    
    try {
      // Test 1: Check if profiles table exists
      addStatus('🔍 Checking if profiles table exists...')
      const { error: tablesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
      
      if (tablesError?.message?.includes('relation "public.profiles" does not exist')) {
        addStatus('❌ Profiles table does not exist')
        addStatus('📝 Please create it in Supabase Dashboard:')
        addStatus('1. Go to SQL Editor in Supabase')
        addStatus('2. Copy the SQL from create-profiles-table.sql')
        addStatus('3. Run the SQL query')
      } else if (tablesError) {
        addStatus(`⚠️ Error checking table: ${tablesError.message}`)
      } else {
        addStatus('✅ Profiles table exists!')
        
        // Check current user's profile
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          addStatus(`👤 Current user: ${user.email}`)
          
          // Check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (profileError?.code === 'PGRST116') {
            addStatus('📝 No profile found, creating...')
            
            // Create profile
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                first_name: 'Demo',
                last_name: 'User',
                role: 'creator'
              })
            
            if (insertError) {
              addStatus(`❌ Error creating profile: ${insertError.message}`)
            } else {
              addStatus('✅ Profile created successfully!')
            }
          } else if (profile) {
            addStatus('✅ Profile already exists:')
            addStatus(`   Name: ${profile.first_name} ${profile.last_name}`)
            addStatus(`   Email: ${profile.email}`)
            addStatus(`   Role: ${profile.role}`)
          }
        } else {
          addStatus('⚠️ No user logged in')
        }
      }
      
      // Test 2: Check newsletters table
      addStatus('\n🔍 Checking newsletters table...')
      const { error: newslettersError } = await supabase
        .from('newsletters')
        .select('id')
        .limit(1)
      
      if (newslettersError?.message?.includes('relation "public.newsletters" does not exist')) {
        addStatus('❌ Newsletters table does not exist')
        addStatus('📝 Creating newsletters table...')
        
        // The table should be created via SQL in Supabase Dashboard
        addStatus('Please create it in Supabase Dashboard')
      } else if (newslettersError) {
        addStatus(`⚠️ Error: ${newslettersError.message}`)
      } else {
        addStatus('✅ Newsletters table exists!')
      }
      
    } catch (error: any) {
      addStatus(`❌ Unexpected error: ${error.message}`)
    } finally {
      setLoading(false)
      addStatus('\n✅ Setup check complete!')
    }
  }
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Setup</h1>
        
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <button
            onClick={setupDatabase}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-medium disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check & Setup Database'}
          </button>
        </div>
        
        {status.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Status:</h2>
            <div className="font-mono text-sm space-y-1">
              {status.map((msg, i) => (
                <div 
                  key={i} 
                  className={
                    msg.includes('✅') ? 'text-green-400' :
                    msg.includes('❌') ? 'text-red-400' :
                    msg.includes('⚠️') ? 'text-yellow-400' :
                    msg.includes('🔍') || msg.includes('📝') ? 'text-blue-400' :
                    'text-gray-300'
                  }
                >
                  {msg}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 space-y-4">
          <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">📋 SQL Script Location:</p>
            <code className="text-sm">create-profiles-table.sql</code>
          </div>
          
          <div className="flex gap-4">
            <a href="/dashboard" className="text-cyan-400 hover:underline">→ Dashboard</a>
            <a href="/debug-auth" className="text-cyan-400 hover:underline">→ Debug Auth</a>
          </div>
        </div>
      </div>
    </div>
  )
}
