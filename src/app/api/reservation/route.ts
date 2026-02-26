import { NextRequest, NextResponse } from 'next/server';
import { CONTACT_EMAIL } from '@/config/contact';
import { join } from 'path';
import { sendEmail } from '@/lib/email';
import { isDateAvailable } from '@/app/availability/availability-data';
import { supabaseServer } from "@/lib/supabaseServer";
import { writeFile, mkdir } from 'fs/promises';
import sharp from 'sharp';

// Sauvegarder aussi la réservation dans le système de gestion
async function saveReservation(
  lastName: string,
  firstName: string,
  email: string,
  prestationType: string,
  date: string,
  location: string,
  eventType: string | undefined,
  eventDetails: string | undefined,
  contactPreference: string | undefined,
  specialRetouches: string | undefined,
  savedPhotos: string[],
  startTime?: string,
  duration?: number
) {
  try {
    const reservationRow = {
      last_name: lastName,
      first_name: firstName,
      email,
      prestation_type: prestationType,
      date,
      start_time: startTime || null,
      duration: duration ?? null,
      location: location || null,
      event_type: eventType || null,
      event_details: eventDetails || null,
      contact_preference: contactPreference || null,
      special_retouches: specialRetouches || null,
      inspiration_photos: savedPhotos.length ? savedPhotos : null,
      status: "pending",
    };

    const { error } = await supabaseServer
      .from("reservations")
      .insert(reservationRow);

    if (error) throw error;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la réservation:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const lastName = formData.get('lastName') as string;
    const firstName = formData.get('firstName') as string;
    const email = formData.get('email') as string;
    const prestationType = formData.get('prestationType') as string;
    const date = formData.get('date') as string;
    const startTime = formData.get('startTime') as string;
    const durationValue = formData.get('duration') as string | null;
    const parsedDuration = durationValue ? parseFloat(durationValue) : NaN;
    const duration = durationValue && Number.isFinite(parsedDuration) ? parsedDuration : undefined;
    const location = formData.get('location') as string;
    const specialRetouches = formData.get('specialRetouches') as string;
    const eventType = formData.get('eventType') as string;
    const eventDetails = formData.get('eventDetails') as string;
    const contactPreference = formData.get('contactPreference') as string;
    const inspirationPhotos = formData.getAll('inspirationPhotos') as File[];

    // Validation des champs obligatoires
    if (!lastName || !firstName || !email || !prestationType || (prestationType !== 'Événement' && !location)) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    if (prestationType === 'Événement') {
      if (!eventType || !eventDetails || !contactPreference) {
        return NextResponse.json(
          { error: 'Veuillez compléter les informations de l’événement' },
          { status: 400 }
        );
      }
    }

    // La date peut être soit une date valide, soit "À définir sur RDV"
    if (!date) {
      return NextResponse.json(
        { error: 'Veuillez sélectionner une date ou cliquer sur "À définir sur RDV"' },
        { status: 400 }
      );
    }

    // Vérifier la disponibilité de la date (si ce n'est pas "À définir sur RDV")
    if (date !== 'À définir sur RDV') {
      const availability = isDateAvailable(date);
      if (!availability.available) {
        return NextResponse.json(
          { error: availability.reason || 'Cette date n\'est pas disponible' },
          { status: 400 }
        );
      }
    }

    // Sauvegarder les photos d'inspiration (conversion JPG/JPEG → WebP automatique)
    const WEBP_QUALITY = 82;
    const CONVERT_TO_WEBP_TYPES = ['image/jpeg', 'image/jpg'];
    let savedPhotos: string[] = [];
    if (inspirationPhotos.length > 0) {
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'inspirations');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        // Le répertoire existe peut-être déjà
      }

      for (const photo of inspirationPhotos) {
        if (photo.size > 0) {
          const bytes = await photo.arrayBuffer();
          const inputBuffer = Buffer.from(bytes);
          const timestamp = Date.now();
          const safeName = photo.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.(jpe?g|png|webp)$/i, '') || 'image';
          const isJpeg = CONVERT_TO_WEBP_TYPES.includes(photo.type);

          const outputBuffer: Buffer = isJpeg
            ? await sharp(inputBuffer).webp({ quality: WEBP_QUALITY }).toBuffer()
            : inputBuffer;

          const filename = isJpeg ? `${timestamp}-${safeName}.webp` : `${timestamp}-${photo.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const filepath = join(uploadDir, filename);

          await writeFile(filepath, outputBuffer);
          savedPhotos.push(`/uploads/inspirations/${filename}`);
        }
      }
    }

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
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; padding: 10px; background-color: #f5f5f5; border-radius: 5px; }
            .photos { margin-top: 10px; }
            .photo { margin: 5px 0; }
            .photo img { max-width: 200px; height: auto; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Nouvelle réservation de shooting</h1>
            
            <div class="field">
              <div class="label">Nom :</div>
              <div class="value">${lastName}</div>
            </div>
            
            <div class="field">
              <div class="label">Prénom :</div>
              <div class="value">${firstName}</div>
            </div>
            
            <div class="field">
              <div class="label">Email :</div>
              <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            
            <div class="field">
              <div class="label">Type de prestation :</div>
              <div class="value">${prestationType}</div>
            </div>

            ${prestationType === 'Événement' ? `
            <div class="field">
              <div class="label">Type d’événement :</div>
              <div class="value">${eventType}</div>
            </div>
            <div class="field">
              <div class="label">Description de l’événement :</div>
              <div class="value">${eventDetails}</div>
            </div>
            <div class="field">
              <div class="label">Mode de contact préféré :</div>
              <div class="value">${contactPreference}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">Date :</div>
              <div class="value">${date}</div>
            </div>
            
            ${startTime ? `
            <div class="field">
              <div class="label">Heure de début :</div>
              <div class="value">${startTime} (durée demandée: ${duration}h)</div>
            </div>
            ` : ''}
            
            ${prestationType !== 'Événement' ? `
            <div class="field">
              <div class="label">Lieu :</div>
              <div class="value">${location}</div>
            </div>
            ` : ''}
            
            ${specialRetouches ? `
            <div class="field">
              <div class="label">Retouches spéciales :</div>
              <div class="value">${specialRetouches}</div>
            </div>
            ` : ''}
            
            ${savedPhotos.length > 0 ? `
            <div class="field">
              <div class="label">Photos d'inspiration (${savedPhotos.length}) :</div>
              <div class="photos">
                ${savedPhotos.map((photo, index) => {
      const photoUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lueurstudio'}${photo}`;
      return `
                    <div class="photo">
                      <p>Photo ${index + 1}:</p>
                      <a href="${photoUrl}" target="_blank">${photoUrl}</a>
                    </div>
                  `;
    }).join('')}
              </div>
            </div>
            ` : ''}
          </div>
        </body>
      </html>
    `;

    // Logger les informations de réservation
    console.log('=== NOUVELLE RÉSERVATION ===');
    console.log(`Nom: ${lastName}`);
    console.log(`Prénom: ${firstName}`);
    console.log(`Email: ${email}`);
    console.log(`Type: ${prestationType}`);
    console.log(`Date: ${date}`);
    if (prestationType !== 'Événement') {
      console.log(`Lieu: ${location}`);
    }
    if (prestationType === 'Événement') {
      console.log(`Type d'événement: ${eventType}`);
      console.log(`Description: ${eventDetails}`);
      console.log(`Contact préféré: ${contactPreference}`);
    }
    if (specialRetouches) console.log(`Retouches: ${specialRetouches}`);
    if (savedPhotos.length > 0) console.log(`Photos: ${savedPhotos.join(', ')}`);
    console.log('===========================');

    // Vérifier le créneau horaire si une heure est spécifiée
    if (date !== 'À définir sur RDV' && startTime) {
      try {
        const timeCheckRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/reservations/check-time`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date,
            startTime,
            duration,
          }),
        });
        const timeCheckData = await timeCheckRes.json();
        if (!timeCheckData.available) {
          return NextResponse.json(
            { error: timeCheckData.reason || 'Ce créneau horaire n\'est pas disponible' },
            { status: 400 }
          );
        }
      } catch (err) {
        console.error('Erreur lors de la vérification du créneau:', err);
        // On continue quand même, la vérification côté client devrait suffire
      }
    }

    // Sauvegarder la réservation dans le système de gestion
    await saveReservation(
      lastName,
      firstName,
      email,
      prestationType,
      date,
      location,
      eventType || undefined,
      eventDetails || undefined,
      contactPreference || undefined,
      specialRetouches || undefined,
      savedPhotos,
      startTime || undefined,
      duration
    );

    // Créer le contenu de l'email de confirmation pour le client
    const confirmationEmailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #6366f1; }
            .message { background-color: #f0f9ff; border-left: 4px solid #6366f1; padding: 15px; margin: 20px 0; }
            .details { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #555; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Confirmation de votre réservation</h1>
            <p>Bonjour ${firstName},</p>
            <p>Nous avons bien reçu votre demande ${prestationType === 'Événement' ? 'de devis événementiel' : 'de réservation'} pour un shooting photo. Merci pour votre confiance !</p>
            
            <div class="message">
              <p><strong>Récapitulatif de votre réservation :</strong></p>
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">Type de prestation :</span> ${prestationType}
              </div>
              <div class="detail-row">
                <span class="label">Date :</span> ${date}${startTime && prestationType !== 'Événement' ? ` à ${startTime} (durée: ${duration}h)` : ''}
              </div>
              ${prestationType === 'Événement' ? `
              <div class="detail-row">
                <span class="label">Type d’événement :</span> ${eventType}
              </div>
              <div class="detail-row">
                <span class="label">Description :</span> ${eventDetails}
              </div>
              <div class="detail-row">
                <span class="label">Contact préféré :</span> ${contactPreference}
              </div>
              ` : ''}
              ${prestationType !== 'Événement' ? `
              <div class="detail-row">
                <span class="label">Lieu :</span> ${location}
              </div>
              ` : ''}
              ${specialRetouches ? `
              <div class="detail-row">
                <span class="label">Retouches spéciales :</span> ${specialRetouches}
              </div>
              ` : ''}
            </div>
            
            <p>Nous vous répondrons rapidement avec une proposition sur mesure et un devis détaillé.</p>
            
            <p>En cas de questions, n'hésitez pas à nous contacter à <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>
            
            <p>Cordialement,<br>L'équipe LueurStudio</p>
          </div>
        </body>
      </html>
    `;

    // Envoyer les emails via SMTP Brevo
    try {
      // Email à l'admin
      const adminEmailResult = await sendEmail({
        to: CONTACT_EMAIL,
        subject: `Nouvelle réservation - ${firstName} ${lastName}`,
        html: emailContent,
        replyTo: email,
        from: { name: 'LueurStudio', email: CONTACT_EMAIL },
      });

      if (!adminEmailResult.success) {
        console.error('❌ Erreur lors de l\'envoi de l\'email admin:', adminEmailResult.error);
      } else {
        console.log('✅ Email admin envoyé avec succès:', adminEmailResult.messageId);
      }

      // Email de confirmation au client
      const clientEmailResult = await sendEmail({
        to: email,
        subject: `Confirmation de votre réservation - LueurStudio`,
        html: confirmationEmailContent,
        from: { name: 'LueurStudio', email: CONTACT_EMAIL },
      });

      if (!clientEmailResult.success) {
        console.error('❌ Erreur lors de l\'envoi de l\'email client:', clientEmailResult.error);
        // Retourner une réponse avec un avertissement
        return NextResponse.json({
          success: true,
          message: 'Réservation enregistrée, mais une erreur est survenue lors de l\'envoi de l\'email de confirmation au client.',
          warning: `Erreur email: ${clientEmailResult.error}`,
        }, { status: 200 }); // On retourne 200 car la réservation est quand même enregistrée
      } else {
        console.log('✅ Email de confirmation client envoyé avec succès:', clientEmailResult.messageId);
      }

    } catch (emailError: any) {
      console.error('❌ Erreur lors de l\'envoi des emails:', emailError);
      console.error('Détails:', JSON.stringify(emailError, null, 2));

      // Retourner une réponse avec un avertissement
      return NextResponse.json({
        success: true,
        message: 'Réservation enregistrée, mais une erreur est survenue lors de l\'envoi des emails.',
        warning: `Erreur email: ${emailError?.message || 'Erreur inconnue'}`,
        error: emailError?.message
      }, { status: 200 }); // On retourne 200 car la réservation est quand même enregistrée
    }

    return NextResponse.json({
      success: true,
      message: 'Réservation enregistrée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors du traitement de la réservation:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la réservation' },
      { status: 500 }
    );
  }
}

