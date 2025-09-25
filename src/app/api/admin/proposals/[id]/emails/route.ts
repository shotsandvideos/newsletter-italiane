import { NextResponse } from 'next/server'
import { getCurrentUser, createSupabaseServiceClient } from '../../../../../../lib/supabase-server'
import { logger, devLog } from '../../../../../../lib/logger'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUserData = await getCurrentUser()

    if (!currentUserData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (currentUserData.profile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const proposalId = params.id
    const supabase = createSupabaseServiceClient()

    // First get the proposal with its newsletter relationships
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        id,
        proposal_newsletters (
          id,
          user_id,
          newsletter_id,
          newsletters (
            id,
            title,
            author_email,
            author_first_name,
            author_last_name
          )
        )
      `)
      .eq('id', proposalId)
      .single()

    if (proposalError) {
      logger.error('Error fetching proposal:', proposalError)
      return NextResponse.json({ success: false, error: 'Proposal not found' }, { status: 404 })
    }

    // Extract user IDs and get their emails from profiles
    const userIds = proposal.proposal_newsletters?.map(pn => pn.user_id).filter(Boolean) || []
    
    let authorEmails: Array<{
      email: string
      name: string
      newsletter_title?: string
    }> = []

    if (userIds.length > 0) {
      // Get emails from profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .in('id', userIds)

      if (!profilesError && profiles) {
        // Map profiles to proposal newsletters
        authorEmails = proposal.proposal_newsletters?.map(pn => {
          const profile = profiles.find(p => p.id === pn.user_id)
          const newsletter = pn.newsletters
          
          if (profile?.email) {
            return {
              email: profile.email,
              name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Author',
              newsletter_title: newsletter?.title
            }
          }
          
          // Fallback to newsletter author_email if profile email not found
          if (newsletter?.author_email) {
            return {
              email: newsletter.author_email,
              name: `${newsletter.author_first_name || ''} ${newsletter.author_last_name || ''}`.trim() || 'Author',
              newsletter_title: newsletter.title
            }
          }
          
          return null
        }).filter(Boolean) || []
      }
    }

    // If no emails found from profiles, try to get from auth.users (requires service role)
    if (authorEmails.length === 0 && userIds.length > 0) {
      try {
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
        
        if (!authError && authUsers?.users) {
          const matchingUsers = authUsers.users.filter(user => userIds.includes(user.id))
          
          authorEmails = matchingUsers.map(user => {
            const pn = proposal.proposal_newsletters?.find(pn => pn.user_id === user.id)
            return {
              email: user.email || '',
              name: user.user_metadata?.first_name && user.user_metadata?.last_name 
                ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                : 'Author',
              newsletter_title: pn?.newsletters?.title
            }
          }).filter(author => author.email)
        }
      } catch (authError) {
        logger.error('Error fetching auth users:', authError)
      }
    }

    devLog(`Found ${authorEmails.length} author emails for proposal ${proposalId}`)

    return NextResponse.json({
      success: true,
      data: {
        proposal_id: proposalId,
        authors: authorEmails
      }
    })

  } catch (error) {
    logger.error('Error in proposal emails API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
