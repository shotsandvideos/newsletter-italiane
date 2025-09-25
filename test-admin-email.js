// Test dell'API send-email dell'admin
// Esegui con: node test-admin-email.js

const testAdminEmail = async () => {
  console.log('🧪 Testing Admin Email API...');

  try {
    const response = await fetch('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'antoniobellu@icloud.com',
        subject: 'Test Admin Communication',
        text: 'Questo è un test del sistema di messaggistica admin.',
        from: 'Frames <onboarding@resend.dev>'
      })
    });

    const result = await response.json();
    
    console.log('📊 Status:', response.status);
    console.log('📊 Response:', result);

    if (response.ok) {
      console.log('✅ Admin email API working correctly!');
    } else {
      console.log('❌ Admin email API failed:');
      console.log('Error:', result.error);
      
      if (response.status === 401) {
        console.log('🔑 Issue: Not authenticated - you need to be logged in as admin');
        console.log('💡 Solution: Login to admin panel first, then try the test again');
      } else if (response.status === 403) {
        console.log('🚫 Issue: Not authorized - you need admin privileges');
      }
    }

  } catch (error) {
    console.log('❌ Network/Parse error:', error.message);
  }
};

console.log('📝 Note: This test requires you to be logged in as admin in the browser');
console.log('🌐 Make sure you have accessed /admin in your browser first');
console.log('---');

testAdminEmail();