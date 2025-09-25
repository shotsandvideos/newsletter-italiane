// Test diretto dell'API Resend
// Esegui con: node test-resend-direct.js
require('dotenv').config({ path: '.env.local' });

const testResendAPI = async () => {
  console.log('🧪 Testing Resend API directly...');
  
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('❌ RESEND_API_KEY not found in environment variables');
    return;
  }
  
  console.log('✅ RESEND_API_KEY found:', apiKey.substring(0, 10) + '...');
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Frames <support@meetframes.com>',
        to: ['antoniobellu@icloud.com'], // Usa il tuo email per il test
        subject: 'Test Email Resend API',
        text: 'Questo è un test diretto dell\'API Resend per diagnosticare il problema di invio email.',
        headers: {
          'X-Entity-Ref-ID': `test-${Date.now()}`,
          'X-Priority': '3'
        }
      }),
    });

    const responseText = await response.text();
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('📊 Response body:', responseText);

    if (response.ok) {
      const result = JSON.parse(responseText);
      console.log('✅ Email sent successfully! ID:', result.id);
      console.log('📧 Check your email inbox for the test message');
    } else {
      console.log('❌ Resend API error:');
      try {
        const errorData = JSON.parse(responseText);
        console.log('Error details:', errorData);
        
        // Analisi errori comuni
        if (response.status === 401) {
          console.log('🔑 Problema: API key non valida o mancante');
        } else if (response.status === 422) {
          console.log('📝 Problema: Dati della richiesta non validi (probabilmente dominio email)');
        } else if (response.status === 429) {
          console.log('🚦 Problema: Limite di rate superato');
        }
      } catch (parseError) {
        console.log('Raw error response:', responseText);
      }
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
};

// Esegui il test
testResendAPI();