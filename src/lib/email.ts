import nodemailer from 'nodemailer';

// Configuration SMTP Brevo
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // true pour 465, false pour les autres ports
    auth: {
      user: process.env.BREVO_SMTP_USER || '9fa62c001@smtp-brevo.com',
      pass: process.env.BREVO_SMTP_PASS || 'p4OBTF9aEdwYhcD6',
    },
  });
};

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  from?: { name: string; email: string };
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = createTransporter();

    // Formater le from pour nodemailer
    const fromAddress = options.from 
      ? `${options.from.name} <${options.from.email}>`
      : 'LueurStudio <lueurstudio.contact@gmail.com>';

    const mailOptions = {
      from: fromAddress,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      html: options.html,
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email envoyé avec succès via SMTP');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 Réponse:', result.response);

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'envoi de l\'email via SMTP:');
    console.error('❌ Erreur:', error.message);
    console.error('❌ Détails:', JSON.stringify(error, null, 2));

    return {
      success: false,
      error: error.message || 'Erreur inconnue lors de l\'envoi de l\'email',
    };
  }
}

