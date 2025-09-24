import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, email, azienda, messaggio, tipo } = body

    // Validate required fields
    if (!nome || !email || !messaggio) {
      return NextResponse.json(
        { success: false, error: 'Campi obbligatori mancanti' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Formato email non valido' },
        { status: 400 }
      )
    }

    // Create email content
    const emailSubject = `[Frames] ${tipo} - ${nome}`
    const emailBody = `
Nuovo messaggio ricevuto dal modulo di contatto di Frames:

MITTENTE:
Nome: ${nome}
Email: ${email}
Azienda/Newsletter: ${azienda || 'Non specificata'}

RICHIESTA:
Tipo: ${tipo}

MESSAGGIO:
${messaggio}

---
Inviato tramite meetframes.com il ${new Date().toLocaleString('it-IT')}
    `.trim()

    // Send email using Resend API directly with fetch
    if (process.env.RESEND_API_KEY) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Frames <noreply@meetframes.com>',
            to: ['support@meetframes.com'],
            subject: emailSubject,
            text: emailBody,
            reply_to: email,
            headers: {
              'X-Entity-Ref-ID': `contact-${Date.now()}`,
              'List-Unsubscribe': '<mailto:noreply@meetframes.com>',
              'X-Priority': '3'
            }
          }),
        })

        if (emailResponse.ok) {
          const emailResult = await emailResponse.json()
          console.log('Email sent successfully:', emailResult)
        } else {
          const errorText = await emailResponse.text()
          console.error('Error sending email:', errorText)
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError)
        // Continue anyway - we don't want to fail the form submission if email fails
      }
    } else {
      // Fallback: log email content if no API key is configured
      console.log('Email to send to support@meetframes.com:')
      console.log('Subject:', emailSubject)
      console.log('Body:', emailBody)
      console.log('Note: RESEND_API_KEY not configured, email not sent')
    }

    return NextResponse.json({
      success: true,
      message: 'Messaggio inviato con successo. Ti risponderemo entro 24 ore.'
    })

  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}