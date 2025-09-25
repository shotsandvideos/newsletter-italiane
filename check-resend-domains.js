// Controlla domini verificati in Resend
require('dotenv').config({ path: '.env.local' });

const checkResendDomains = async () => {
  console.log('🔍 Checking Resend domains and configuration...');
  
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('❌ RESEND_API_KEY not found');
    return;
  }
  
  try {
    // Check domains
    const domainsResponse = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (domainsResponse.ok) {
      const domains = await domainsResponse.json();
      console.log('📧 Verified domains:', domains);
    } else {
      console.log('❌ Error fetching domains:', domainsResponse.status);
    }

    // Check API keys info
    const apiKeysResponse = await fetch('https://api.resend.com/api-keys', {
      method: 'GET', 
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (apiKeysResponse.ok) {
      const apiKeys = await apiKeysResponse.json();
      console.log('🔑 API Keys info:', apiKeys);
    } else {
      console.log('❌ Error fetching API keys:', apiKeysResponse.status);
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
};

checkResendDomains();