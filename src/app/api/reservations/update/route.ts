import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id, updates } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID de réservation requis" }, { status: 400 });
    }

    // Récupérer la réservation avant update
    const { data: existing, error: readError } = await supabaseServer
      .from("reservations")
      .select("*")
      .eq("id", id)
      .single();

    if (readError || !existing) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 });
    }

    const wasConfirmed = existing.status === "confirmed";

    const getColumnKey = (record: Record<string, any>, snake: string, camel: string) => {
      if (Object.prototype.hasOwnProperty.call(record, snake)) return snake;
      if (Object.prototype.hasOwnProperty.call(record, camel)) return camel;
      return null;
    };

    const galleryPhotosKey = getColumnKey(existing, "gallery_photos", "galleryPhotos");

    const normalizeUpdates = (rawUpdates: Record<string, any> | null | undefined) => {
      if (!rawUpdates || typeof rawUpdates !== "object") return {};
      const normalized: Record<string, any> = {};
      for (const [key, value] of Object.entries(rawUpdates)) {
        if (value === undefined) continue;
        switch (key) {
          case "galleryPhotos":
          case "gallery_photos":
            if (!galleryPhotosKey) {
              normalized.__error = "La colonne galerie n'existe pas (gallery_photos / galleryPhotos).";
            } else {
              normalized[galleryPhotosKey] = value;
            }
            break;
          case "galleryCreated":
            normalized.gallery_created = value;
            break;
          case "galleryCode":
            normalized.gallery_code = value;
            break;
          case "galleryExpiresAt":
            normalized.gallery_expires_at = value;
            break;
          case "emailSent":
            normalized.email_sent = value;
            break;
          case "startTime":
            normalized.start_time = value;
            break;
          case "eventType":
            normalized.event_type = value;
            break;
          case "eventDetails":
            normalized.event_details = value;
            break;
          case "contactPreference":
            normalized.contact_preference = value;
            break;
          case "specialRetouches":
            normalized.special_retouches = value;
            break;
          default:
            normalized[key] = value;
        }
      }
      return normalized;
    };

    const normalizedUpdates = normalizeUpdates(updates);
    if (normalizedUpdates.__error) {
      return NextResponse.json(
        { error: normalizedUpdates.__error },
        { status: 400 }
      );
    }
    if (Object.keys(normalizedUpdates).length === 0) {
      return NextResponse.json(
        { error: "Aucune mise à jour valide fournie" },
        { status: 400 }
      );
    }
    const isNowConfirmed = normalizedUpdates?.status === "confirmed";

    // Update
    const { data: updatedReservation, error: updateError } = await supabaseServer
      .from("reservations")
      .update(normalizedUpdates)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError || !updatedReservation) {
      console.error("Erreur Supabase update:", updateError);
      return NextResponse.json(
        {
          error: "Erreur lors de la mise à jour",
          details: updateError?.message,
          hint: updateError?.hint,
          code: updateError?.code,
        },
        { status: 500 }
      );
    }

    // Email de confirmation si passage à "confirmed"
    if (!wasConfirmed && isNowConfirmed && updatedReservation.email) {
      try {
        let dateDisplay = updatedReservation.date;
        if (dateDisplay && dateDisplay !== "À définir sur RDV") {
          try {
            const dateObj = new Date(dateDisplay + "T00:00:00");
            dateDisplay = dateObj.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          } catch {}
        }

        let timeDisplay = "";
        if (updatedReservation.start_time) {
          const [hours, minutes] = updatedReservation.start_time.split(":");
          const startHour = parseInt(hours);
          const startMinutes = startHour * 60 + parseInt(minutes || "0");
          const duration = updatedReservation.duration || 0;
          const endMinutes = startMinutes + Math.round(duration * 60);
          const endHour = Math.floor(endMinutes / 60);
          const endMin = endMinutes % 60;
          timeDisplay = `${updatedReservation.start_time} - ${endHour.toString().padStart(2, "0")}:${endMin
            .toString()
            .padStart(2, "0")} (${duration}h)`;
        }

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
                <p>Bonjour ${updatedReservation.first_name},</p>
                <p>Nous avons le plaisir de vous confirmer votre réservation de shooting photo.</p>

                <div class="confirmation-box">
                  <h2 style="margin-top: 0; color: #6366f1;">Détails de votre réservation</h2>

                  <div class="detail-row">
                    <span class="detail-label">📅 Date :</span>
                    <span class="detail-value">${dateDisplay || "À définir sur RDV"}</span>
                  </div>

                  ${timeDisplay ? `
                  <div class="detail-row">
                    <span class="detail-label">🕐 Heure :</span>
                    <span class="detail-value">${timeDisplay}</span>
                  </div>` : ""}

                  <div class="detail-row">
                    <span class="detail-label">📍 Lieu :</span>
                    <span class="detail-value">${updatedReservation.location || "Non spécifié"}</span>
                  </div>

                  <div class="detail-row">
                    <span class="detail-label">📸 Type de prestation :</span>
                    <span class="detail-value">${updatedReservation.prestation_type || "Non spécifié"}</span>
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

        await sendEmail({
          to: updatedReservation.email,
          subject: "✅ Confirmation de votre réservation - LueurStudio",
          html: emailContent,
          from: { name: "LueurStudio", email: process.env.CONTACT_EMAIL || "" },
        });
      } catch (err) {
        console.error("Erreur lors de l'envoi de l'email:", err);
      }
    }

    return NextResponse.json({ success: true, reservation: updatedReservation });
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la réservation" }, { status: 500 });
  }
}