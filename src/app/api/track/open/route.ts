import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(request: NextRequest) {
  const leadId = request.nextUrl.searchParams.get("lead_id");

  if (!leadId) {
    return new NextResponse("Missing lead_id", { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    await supabase.from("email_events").insert({
      lead_id: leadId,
      event_type: "opened",
    });
  } catch (error) {
    console.error("Track open error:", error);
  }

  return new NextResponse(TRANSPARENT_GIF, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
