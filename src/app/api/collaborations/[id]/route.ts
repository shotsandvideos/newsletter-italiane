import { NextResponse } from 'next/server'
import { getCurrentUser, createSupabaseServerClient } from '../../../../lib/supabase-server'

type PreviewPayload = {
  type: 'preview'
  previewUrl: string
}

type ResultsPayload = {
  type: 'results'
  views?: number | null
  openRate: number
  ctr: number
  clicks: number
}

type RequestPayload = PreviewPayload | ResultsPayload

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUserData = await getCurrentUser()

    if (!currentUserData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as RequestPayload
    if (!body || !('type' in body)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    const supabase = await createSupabaseServerClient()

    const { data: existing, error: fetchError } = await supabase
      .from('proposal_newsletters')
      .select(`id, user_id, creator_preview_url, creator_results_views, creator_results_open_rate, creator_results_ctr, creator_results_clicks, proposals (campaign_end_date)`)
      .eq('id', params.id)
      .maybeSingle()

    if (fetchError) {
      console.error('Error fetching collaboration:', fetchError)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    if (!existing || existing.user_id !== currentUserData.user.id) {
      return NextResponse.json({ success: false, error: 'Collaboration not found' }, { status: 404 })
    }

    const updateData: Record<string, any> = {}

    if (body.type === 'preview') {
      const previewUrl = body.previewUrl?.trim()

      if (previewUrl && !/^https?:\/\//i.test(previewUrl)) {
        return NextResponse.json({ success: false, error: 'Il link deve iniziare con http:// o https://' }, { status: 400 })
      }

      updateData.creator_preview_url = previewUrl || null
    } else if (body.type === 'results') {
      const campaignEnd = existing.proposals?.campaign_end_date ? new Date(existing.proposals.campaign_end_date) : null
      const now = new Date()

      if (campaignEnd && now < campaignEnd) {
        return NextResponse.json({ success: false, error: 'Puoi inserire i risultati solo al termine della campagna' }, { status: 400 })
      }

      const parsesNumber = (value: number | null | undefined) => {
        if (value === null || value === undefined || Number.isNaN(Number(value))) {
          return null
        }
        return Number(value)
      }

      const openRate = parsesNumber(body.openRate)
      const ctr = parsesNumber(body.ctr)
      const clicks = parsesNumber(body.clicks)
      const views = body.views !== undefined ? parsesNumber(body.views) : null

      if (openRate === null || ctr === null || clicks === null) {
        return NextResponse.json({ success: false, error: 'Open rate, CTR e click sono obbligatori' }, { status: 400 })
      }

      if (openRate < 0 || openRate > 100 || ctr < 0 || ctr > 100) {
        return NextResponse.json({ success: false, error: 'Open rate e CTR devono essere compresi tra 0 e 100' }, { status: 400 })
      }

      if (clicks < 0) {
        return NextResponse.json({ success: false, error: 'I click devono essere un valore positivo' }, { status: 400 })
      }

      if (views !== null && views < 0) {
        return NextResponse.json({ success: false, error: 'Le visualizzazioni devono essere un valore positivo' }, { status: 400 })
      }

      updateData.creator_results_views = views
      updateData.creator_results_open_rate = openRate
      updateData.creator_results_ctr = ctr
      updateData.creator_results_clicks = clicks
      updateData.creator_results_submitted_at = new Date().toISOString()
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, error: 'Nessun dato da aggiornare' }, { status: 400 })
    }

    const { error: updateError, data: updatedRows } = await supabase
      .from('proposal_newsletters')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .maybeSingle()

    if (updateError) {
      console.error('Error updating collaboration data:', updateError)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: updatedRows })
  } catch (error) {
    console.error('Error updating collaboration info:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
