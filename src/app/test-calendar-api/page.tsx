'use client'

import { useState } from 'react'

export default function TestCalendarAPI() {
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [createResponse, setCreateResponse] = useState<any>(null)

  const testCalendarAPI = async () => {
    setLoading(true)
    try {
      const month = new Date().getMonth() + 1
      const year = new Date().getFullYear()
      console.log('Testing calendar API for month:', month, 'year:', year)
      
      const res = await fetch(`/api/calendar?month=${month}&year=${year}`)
      const data = await res.json()
      
      console.log('Calendar API Response:', data)
      setResponse(data)
    } catch (error) {
      console.error('Error testing calendar API:', error)
      setResponse({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const createTestEvents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/calendar/test-events', { method: 'POST' })
      const data = await res.json()
      
      console.log('Create events response:', data)
      setCreateResponse(data)
    } catch (error) {
      console.error('Error creating test events:', error)
      setCreateResponse({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Test Calendar API</h1>
      
      <div className="flex gap-4">
        <button 
          onClick={createTestEvents}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Test Events'}
        </button>
        
        <button 
          onClick={testCalendarAPI}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Calendar API'}
        </button>
      </div>
      
      {createResponse && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Create Events Response:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(createResponse, null, 2)}
          </pre>
        </div>
      )}
      
      {response && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Calendar API Response:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}