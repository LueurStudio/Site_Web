import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, reservations: data });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ success: false, reservations: [] });
  }
}