import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const planningBufferHours = 0.5;

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "Date requise" }, { status: 400 });

  const { data, error } = await supabaseServer
    .from("reservations")
    .select("start_time, duration, status")
    .eq("date", date)
    .in("status", ["pending", "confirmed"]);

  if (error) return NextResponse.json({ success: false, bookedTimes: [] });

  const bookedSlots = (data || [])
    .filter(r => r.start_time)
    .map(r => {
      const [h, m] = r.start_time.split(":");
      const startMinutes = parseInt(h) * 60 + parseInt(m || "0");
      const duration = Number(r.duration || 0);
      const endMinutes = startMinutes + Math.round((duration + planningBufferHours) * 60);
      const endHour = Math.floor(endMinutes / 60);
      const endMin = endMinutes % 60;

      return {
        startTime: r.start_time,
        endTime: `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`,
        duration: r.duration || null,
      };
    });

  return NextResponse.json({ success: true, bookedTimes: bookedSlots });
}