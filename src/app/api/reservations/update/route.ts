import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { writeFile, readFile } from 'fs/promises';
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

    const { id, updates }: { id: string; updates: Partial<Reservation> } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID de réservation requis' },
        { status: 400 }
      );
    }

    const dataFile = join(process.cwd(), 'src', 'app', 'reservations', 'reservations-data.ts');
    let content = await readFile(dataFile, 'utf-8');

    // Parser les réservations existantes
    const reservationsMatch = content.match(/export const reservations: Reservation\[\] = (\[[\s\S]*?\]);/);
    if (!reservationsMatch) {
      throw new Error('Impossible de trouver le tableau reservations');
    }

    let reservations: Reservation[] = eval(reservationsMatch[1]);

    // Trouver et mettre à jour la réservation
    const index = reservations.findIndex(r => r.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    const oldReservation = reservations[index];
    const wasConfirmed = oldReservation.status === 'confirmed';
    const isNowConfirmed = updates.status === 'confirmed';

    reservations[index] = { ...reservations[index], ...updates };
    const updatedReservation = reservations[index];

    // Envoyer un email de confirmation si le statut passe à "confirmed"
    if (!wasConfirmed && isNowConfirmed && updatedReservation.email) {
      try {
        // Formater la date
        let dateDisplay = updatedReservation.date;
        if (dateDisplay && dateDisplay !== 'À définir sur RDV') {
          try {
            const dateObj = new Date(dateDisplay + 'T00:00:00');
            dateDisplay = dateObj.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });
          } catch (e) {
            // Garder la date telle quelle si erreur de parsing
          }
        }

        // Formater l'heure
        let timeDisplay = '';
        if (updatedReservation.startTime) {
          const [hours, minutes] = updatedReservation.startTime.split(':');
          const startHour = parseInt(hours);
          const duration = updatedReservation.duration || 3;
          const endHour = startHour + duration;
          timeDisplay = `${updatedReservation.startTime} - ${endHour.toString().padStart(2, '0')}:00 (${duration}h)`;
        }

        // Créer le contenu de l'email de confirmation
        const emailContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                h1 { color: #6366f1; }
                .confirmation-box { background-color: #f0f9ff; border-left: 4px solid #6366f1; padding: 20px; margin: 20px 0; border-radius: 5px; }
                .detail-row { margin: 10px 0; padding: 10px; background-color: white; border-radius: 5px; }
                .detail-label { font-weight: bold; color: #6366f1; }
                .detail-value { color: #333; margin-left: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>✅ Votre réservation est confirmée !</h1>
                <p>Bonjour ${updatedReservation.firstName},</p>
                <p>Nous avons le plaisir de vous confirmer votre réservation de shooting photo.</p>
                
                <div class="confirmation-box">
                  <h2 style="margin-top: 0; color: #6366f1;">Détails de votre réservation</h2>
                  
                  <div class="detail-row">
                    <span class="detail-label">📅 Date :</span>
                    <span class="detail-value">${dateDisplay || 'À définir sur RDV'}</span>
                  </div>
                  
                  ${timeDisplay ? `
                  <div class="detail-row">
                    <span class="detail-label">🕐 Heure :</span>
                    <span class="detail-value">${timeDisplay}</span>
                  </div>
                  ` : ''}
                  
                  <div class="detail-row">
                    <span class="detail-label">📍 Lieu :</span>
                    <span class="detail-value">${updatedReservation.location || 'Non spécifié'}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">📸 Type de prestation :</span>
                    <span class="detail-value">${updatedReservation.prestationType || 'Non spécifié'}</span>
                  </div>
                </div>

                <p><strong>Important :</strong></p>
                <ul>
                  <li>Veuillez arriver à l'heure pour ne pas retarder le shooting</li>
                  <li>Si vous avez des questions ou besoin de modifier votre réservation, n'hésitez pas à nous contacter</li>
                </ul>

                <p>Nous avons hâte de réaliser votre shooting !</p>

                <p>Cordialement,<br>L'équipe LueurStudio</p>
              </div>
            </body>
          </html>
        `;

        const emailResult = await sendEmail({
          to: updatedReservation.email.trim(),
          subject: `Confirmation de votre réservation - LueurStudio`,
          html: emailContent,
          from: { name: 'LueurStudio', email: 'lueurstudio.contact@gmail.com' },
        });

        if (emailResult.success) {
          console.log(`✅ Email de confirmation envoyé à ${updatedReservation.email}`);
        } else {
          console.error(`❌ Erreur lors de l'envoi de l'email de confirmation: ${emailResult.error}`);
        }
      } catch (emailError: any) {
        console.error('❌ Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
        // On continue quand même la mise à jour même si l'email échoue
      }
    }

    // Reconstruire le contenu du fichier
    const newReservationsContent = `export const reservations: Reservation[] = ${JSON.stringify(reservations, null, 2)};`;
    const newContent = content.replace(/export const reservations: Reservation\[\] = (\[[\s\S]*?\]);/, newReservationsContent);

    await writeFile(dataFile, newContent, 'utf-8');

    return NextResponse.json({ 
      success: true, 
      reservation: reservations[index]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la réservation' },
      { status: 500 }
    );
  }
}

