'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, Eye, Edit, CheckCircle } from 'lucide-react'

export default function TestNewsletterDelete() {
  const [newsletters, setNewsletters] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNewsletters = async () => {
    try {
      const response = await fetch('/api/newsletters')
      
      if (response.ok) {
        const data = await response.json()
        console.log('User newsletters data:', data)
        setNewsletters(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error)
    } finally {
      setLoading(false)
    }
  }

  const testDelete = async (newsletterId: string, newsletterTitle: string) => {
    if (!confirm(`Sei sicuro di voler eliminare "${newsletterTitle}"?`)) return

    try {
      const response = await fetch(`/api/newsletters/${newsletterId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('Newsletter deleted successfully:', result)
        // Remove from local state
        setNewsletters(prev => prev.filter(n => n.id !== newsletterId))
      } else {
        console.error('Error deleting newsletter:', result.error)
        alert('Errore nell\'eliminazione: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting newsletter:', error)
      alert('Errore nell\'eliminazione della newsletter')
    }
  }

  useEffect(() => {
    fetchNewsletters()
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Test Newsletter Delete Functionality</h1>
        <Link 
          href="/dashboard/newsletters"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Newsletter Dashboard
        </Link>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="font-semibold text-green-800">Delete Functionality Added!</h2>
            </div>
            <ul className="mt-2 text-sm text-green-700 space-y-1">
              <li>✅ Delete API endpoint implemented</li>
              <li>✅ Delete confirmation modal added</li>
              <li>✅ Delete button added to all newsletters</li>
              <li>✅ Proper error handling implemented</li>
              <li>✅ Local state updates after deletion</li>
            </ul>
          </div>
          
          <h2 className="text-lg font-semibold">
            Found {newsletters.length} newsletters - Test delete functionality below:
          </h2>
          
          {newsletters.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No newsletters found. Create some newsletters first to test deletion.</p>
              <Link 
                href="/dashboard/newsletters/register"
                className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Create Newsletter
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {newsletters.map((newsletter) => (
                <div key={newsletter.id} className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{newsletter.title}</h3>
                      <p className="text-sm text-gray-500">{newsletter.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-gray-600">
                          Status: <span className={`font-medium ${
                            newsletter.review_status === 'approved' ? 'text-green-600' :
                            newsletter.review_status === 'rejected' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>
                            {newsletter.review_status === 'in_review' ? 'Pending' : 
                             newsletter.review_status === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                        </span>
                        <span className="text-gray-600">
                          Subscribers: {newsletter.audience_size?.toLocaleString() || 0}
                        </span>
                        <span className="text-gray-600">
                          Created: {new Date(newsletter.created_at).toLocaleDateString('it-IT')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <a
                        href={newsletter.signup_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      
                      <Link
                        href={`/dashboard/newsletters/edit/${newsletter.id}`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      
                      <button
                        onClick={() => testDelete(newsletter.id, newsletter.title)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}