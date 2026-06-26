import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const leadId = request.nextUrl.searchParams.get("lead_id");
  const redirect = request.nextUrl.searchParams.get("redirect");

  if (!leadId) {
    return new NextResponse("Missing lead_id", { status: 400 });
  }

  if (!redirect) {
    return new NextResponse("Missing redirect URL", { status: 400 });
  }

  let redirectUrl: string;
  try {
    redirectUrl = decodeURIComponent(redirect);
    new URL(redirectUrl);
  } catch {
    return new NextResponse("Invalid redirect URL", { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    await supabase.from("email_events").insert({
      lead_id: leadId,
      event_type: "clicked",
    });
  } catch (error) {
    console.error("Track click error:", error);
  }

  return NextResponse.redirect(redirectUrl);
}
