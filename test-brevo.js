/**
 * Script de test pour vérifier que l'API Brevo fonctionne
 * Utilisation: node test-brevo.js
 */

require('dotenv').config({ path: '.env.local' });
const brevo = require('@getbrevo/brevo');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const TEST_EMAIL = 'lueurstudio.contact@gmail.com'; // Votre email de contact

if (!BREVO_API_KEY) {
  console.error('❌ BREVO_API_KEY n\'est pas définie dans .env.local');
  process.exit(1);
}

console.log('🔑 Clé API trouvée:', BREVO_API_KEY.substring(0, 10) + '...');
console.log('📧 Test d\'envoi à:', TEST_EMAIL);
console.log('');

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);

const emailData = new brevo.SendSmtpEmail();
emailData.sender = { name: 'LueurStudio Test', email: TEST_EMAIL };
emailData.to = [{ email: TEST_EMAIL }];
emailData.subject = 'Test API Brevo - LueurStudio';
emailData.htmlContent = `
  <h1>Test de l'API Brevo</h1>
  <p>Si vous recevez cet email, cela signifie que l'API Brevo fonctionne correctement ! ✅</p>
  <p>Date du test: ${new Date().toLocaleString('fr-FR')}</p>
`;

console.log('📤 Tentative d\'envoi de l\'email...');

apiInstance.sendTransacEmail(emailData)
  .then((result) => {
    console.log('✅ Email envoyé avec succès !');
    console.log('📧 Message ID:', result.messageId);
    console.log('');
    console.log('Vérifiez votre boîte mail pour confirmer la réception.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur lors de l\'envoi:');
    console.error('Message:', error.message);
    
    if (error.response) {
      console.error('Réponse:', JSON.stringify(error.response.body, null, 2));
    }
    
    if (error.message && error.message.includes('unauthorized')) {
      console.error('');
      console.error('💡 Vérifiez que:');
      console.error('   1. La clé API est correcte');
      console.error('   2. L\'email ' + TEST_EMAIL + ' est vérifié dans votre compte Brevo');
    }
    
    process.exit(1);
  });

