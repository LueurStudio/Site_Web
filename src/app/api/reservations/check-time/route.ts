import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const planningBufferHours = 0.5;

export async function POST(request: NextRequest) {
  try {
    const { date, startTime, duration = 3 }: { date: string; startTime: string; duration?: number } = await request.json();

    if (!date || !startTime) {
      return NextResponse.json({ error: "Date et heure requises" }, { status: 400 });
    }

    // Heures autorisées
    const hour = parseInt(startTime.split(":")[0]);
    if (hour < 10 || hour > 20) {
      return NextResponse.json({ available: false, reason: "Les réservations sont disponibles uniquement entre 10h et 20h" });
    }

    // Vérifier que le créneau ne dépasse pas 20h (durée + buffer)
    const startMinutes = hour * 60 + parseInt(startTime.split(":")[1] || "0");
    const endMinutes = startMinutes + Math.round((Number(duration) + planningBufferHours) * 60);
    if (endMinutes > 20 * 60) {
      return NextResponse.json({ available: false, reason: "Ce créneau dépasse 20h. Veuillez choisir une heure plus tôt." });
    }

    // Lire réservations existantes
    const { data, error } = await supabaseServer
      .from("reservations")
      .select("start_time, duration, status")
      .eq("date", date)
      .in("status", ["pending", "confirmed"]);

    if (error) {
      return NextResponse.json({ available: false, reason: "Erreur lors de la vérification" }, { status: 500 });
    }

    for (const reservation of data || []) {
      if (!reservation.start_time) continue;

      const [h, m] = reservation.start_time.split(":");
      const resStartMinutes = parseInt(h) * 60 + parseInt(m || "0");
      const resDuration = Number(reservation.duration || 0);
      const resEndMinutes = resStartMinutes + Math.round((resDuration + planningBufferHours) * 60);

      if (startMinutes < resEndMinutes && endMinutes > resStartMinutes) {
        return NextResponse.json({
          available: false,
          reason: `Ce créneau chevauche une réservation existante de ${reservation.start_time} à ${Math.floor(resEndMinutes / 60)
            .toString()
            .padStart(2, "0")}:${(resEndMinutes % 60).toString().padStart(2, "0")}`,
        });
      }
    }

    return NextResponse.json({ available: true });
  } catch (error) {
    console.error("Erreur lors de la vérification du créneau:", error);
    return NextResponse.json({ available: false, reason: "Erreur lors de la vérification" }, { status: 500 });
  }
}