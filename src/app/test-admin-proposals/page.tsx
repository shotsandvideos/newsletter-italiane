'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function TestAdminProposals() {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/admin/proposals', {
        headers: {
          'x-admin-auth': 'admin-panel'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Admin proposals data:', data)
        setProposals(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching proposals:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProposals()
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Test Admin Proposals Data</h1>
        <Link 
          href="/admin/proposte"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Go to Admin Proposte
        </Link>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Found {proposals.length} proposals
          </h2>
          
          {proposals.map((proposal) => (
            <div key={proposal.id} className="bg-white p-4 rounded border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">
                  {proposal.brand_name} - {proposal.sponsorship_type}
                </h3>
                <span className="text-sm text-gray-500">
                  {proposal.proposal_newsletters?.length || 0} newsletters
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                <strong>Campaign:</strong> {new Date(proposal.campaign_start_date).toLocaleDateString()} - {new Date(proposal.campaign_end_date).toLocaleDateString()}
              </div>
              
              <div className="text-sm">
                <strong>Target newsletters:</strong>
                <div className="mt-1 space-y-1">
                  {proposal.proposal_newsletters?.map((pn) => (
                    <div key={pn.id} className="flex items-center gap-2 text-xs">
                      <span className="font-medium">{pn.newsletters?.title}</span>
                      <span className={`px-2 py-1 rounded ${
                        pn.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        pn.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {pn.status}
                      </span>
                      {pn.selected_run_date && (
                        <span className="text-gray-500">
                          Run: {new Date(pn.selected_run_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )) || <span className="text-gray-400">No newsletters linked</span>}
                </div>
              </div>
            </div>
          ))}
          
          {proposals.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No proposals found. Create one in the admin panel first.
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Enhanced Features Added:</h3>
        <ul className="text-sm space-y-1">
          <li>✅ Newsletter acceptance status display with visual indicators</li>
          <li>✅ Accepted dates shown for each newsletter-proposal pairing</li>
          <li>✅ Pending/accepted/rejected newsletters clearly displayed</li>
          <li>✅ Chat functionality with newsletter authors</li>
          <li>✅ Individual status tracking per newsletter</li>
          <li>✅ Visual badges showing overall proposal status</li>
        </ul>
      </div>
    </div>
  )
}