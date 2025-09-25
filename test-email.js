// Test script per verificare l'invio email
// Esegui con: node test-email.js

const testEmailAPI = async () => {
  const testData = {
    to: 'test@example.com',
    subject: 'Test Email from Admin',
    text: 'Questo è un test di invio email dal pannello admin.',
    from: 'Frames <support@meetframes.com>'
  }

  console.log('🧪 Testing email API...')
  console.log('📧 Test data:', testData)

  try {
    const response = await fetch('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Nota: in un test reale, dovresti includere i cookie di autenticazione
      },
      body: JSON.stringify(testData)
    })

    const result = await response.json()

    console.log('📊 Response status:', response.status)
    console.log('📊 Response data:', result)

    if (response.ok) {
      console.log('✅ Email API test passed!')
    } else {
      console.log('❌ Email API test failed:', result.error)
      
      // Analisi degli errori comuni
      if (response.status === 401) {
        console.log('🔑 Problema: Utente non autenticato')
      } else if (response.status === 403) {
        console.log('🚫 Problema: Utente non ha privilegi admin')
      } else if (response.status === 500 && result.error.includes('Email service not configured')) {
        console.log('⚙️ Problema: RESEND_API_KEY non configurata')
      }
    }

  } catch (error) {
    console.log('❌ Network error:', error.message)
  }
}

// Esegui il test se chiamato direttamente
if (require.main === module) {
  testEmailAPI()
}

module.exports = { testEmailAPI }