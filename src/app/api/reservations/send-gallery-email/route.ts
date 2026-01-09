import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type { Reservation } from '@/app/reservations/reservations-data';

export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { reservationId, galleryUrl }: { reservationId: string; galleryUrl: string } = await request.json();

    if (!reservationId || !galleryUrl) {
      return NextResponse.json(
        { error: 'ID de réservation et URL de galerie requis' },
        { status: 400 }
      );
    }

    // Les identifiants SMTP sont dans src/lib/email.ts

    // Charger la réservation
    const dataFile = join(process.cwd(), 'src', 'app', 'reservations', 'reservations-data.ts');
    let content = await readFile(dataFile, 'utf-8');
    
    console.log('📄 Lecture du fichier reservations-data.ts');
    
    // Essayer plusieurs formats de matching
    let reservationsMatch = content.match(/export const reservations: Reservation\[\] = (\[[\s\S]*?\]);/);
    
    if (!reservationsMatch) {
      console.error('❌ Impossible de trouver le tableau reservations dans le fichier');
      throw new Error('Impossible de trouver le tableau reservations');
    }

    let reservations: Reservation[] = [];
    try {
      // Essayer d'abord avec JSON.parse (si le format est JSON pur)
      reservations = JSON.parse(reservationsMatch[1]);
      console.log('✅ Réservations parsées avec JSON.parse');
    } catch (parseError) {
      try {
        // Si ça ne marche pas, utiliser eval (pour le format TypeScript/JavaScript)
        reservations = eval(reservationsMatch[1]);
        console.log('✅ Réservations parsées avec eval');
      } catch (evalError) {
        console.error('❌ Erreur lors du parsing des réservations:', parseError, evalError);
        throw new Error('Impossible de parser les réservations');
      }
    }
    
    // Filtrer les valeurs null
    reservations = reservations.filter((r: any) => r !== null && r !== undefined && r.id);
    console.log(`📋 ${reservations.length} réservation(s) trouvée(s)`);
    
    const reservation = reservations.find((r: any) => r.id === reservationId);
    
    if (!reservation) {
      console.error(`❌ Réservation avec ID ${reservationId} non trouvée`);
    } else {
      console.log(`✅ Réservation trouvée: ${reservation.firstName} ${reservation.lastName} (${reservation.email})`);
    }

    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    // Générer un code d'accès unique si pas déjà généré
    let galleryCode = reservation.galleryCode;
    if (!galleryCode) {
      galleryCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    // Définir la date d'expiration (2 mois à partir de maintenant)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 2);
    const galleryExpiresAt = expiresAt.toISOString();

    // Créer le contenu de l'email
    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #6366f1; }
            .message { background-color: #f0f9ff; border-left: 4px solid #6366f1; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; background-color: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .code { background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 18px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Vos photos sont prêtes ! 📸</h1>
            <p>Bonjour ${reservation.firstName},</p>
            <p>Nous avons le plaisir de vous informer que vos photos sont maintenant disponibles en ligne.</p>
            
            <div class="message">
              <p><strong>Votre galerie photo est prête !</strong></p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${galleryUrl}" class="button">Accéder à ma galerie</a>
            </div>

            <p><strong>Code d'accès :</strong></p>
            <div class="code">${galleryCode}</div>
            <p style="font-size: 12px; color: #666;">Vous devrez entrer ce code pour accéder à votre galerie.</p>

            <div class="message" style="background-color: #fff3cd; border-left-color: #ffc107;">
              <p><strong>⏰ Important :</strong> Votre galerie sera accessible pendant 2 mois à partir d'aujourd'hui.</p>
              <p style="font-size: 12px; color: #666; margin-top: 5px;">Date d'expiration : ${new Date(galleryExpiresAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            <p>Vous pourrez également laisser un avis sur votre expérience avec LueurStudio directement depuis la galerie.</p>

            <p>Nous espérons que vous serez satisfait(e) du résultat !</p>

            <p>Cordialement,<br>L'équipe LueurStudio</p>
          </div>
        </body>
      </html>
    `;

    // Envoyer l'email
    const emailToSend = reservation.email.trim();
    console.log(`📧 Tentative d'envoi d'email à: ${emailToSend}`);
    console.log(`📧 URL de la galerie: ${galleryUrl}`);
    console.log(`📧 Code d'accès: ${galleryCode}`);
    
    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToSend)) {
      throw new Error(`Format d'email invalide: ${emailToSend}`);
    }
    
    try {
      const emailResult = await sendEmail({
        to: emailToSend,
        subject: `Vos photos sont prêtes - LueurStudio`,
        html: emailContent,
        from: { name: 'LueurStudio', email: 'lueurstudio.contact@gmail.com' },
      });
      
      if (!emailResult.success) {
        throw new Error(emailResult.error || 'Erreur lors de l\'envoi de l\'email');
      }
      
      console.log(`✅ Email envoyé avec succès via SMTP, messageId: ${emailResult.messageId}`);
    } catch (emailError: any) {
      console.error('❌ Erreur lors de l\'envoi de l\'email via SMTP:', emailError);
      throw new Error(`Erreur lors de l'envoi de l'email: ${emailError?.message || 'Erreur inconnue'}`);
    }

    // Mettre à jour la réservation pour marquer l'email comme envoyé
    const index = reservations.findIndex(r => r.id === reservationId);
    reservations[index] = {
      ...reservations[index],
      galleryCode,
      galleryCreated: true,
      galleryExpiresAt: reservation.galleryExpiresAt || galleryExpiresAt, // Garder la date existante si déjà définie
      emailSent: true,
    };

    // Sauvegarder les modifications
    const newReservationsContent = `export const reservations: Reservation[] = ${JSON.stringify(reservations, null, 2)};`;
    const newContent = content.replace(/export const reservations: Reservation\[\] = (\[[\s\S]*?\]);/, newReservationsContent);
    await writeFile(dataFile, newContent, 'utf-8');

    console.log('✅ Réservation mise à jour avec galleryCode et emailSent = true');

    return NextResponse.json({
      success: true,
      message: 'Email envoyé avec succès',
      galleryCode,
      emailSent: true,
      recipient: reservation.email,
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de l\'email de galerie:', error);
    return NextResponse.json(
      { error: `Erreur lors de l'envoi de l'email: ${error?.message || 'Erreur inconnue'}` },
      { status: 500 }
    );
  }
}

