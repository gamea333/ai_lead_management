import { NextResponse } from "next/server";
import { classifyLead } from "@/lib/groq";
import { sendLeadEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase";
import type { LeadFormData } from "@/lib/types";

function validateLeadData(data: LeadFormData): string | null {
  if (!data.name?.trim()) return "Full name is required";
  if (!data.email?.trim()) return "Email address is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return "Invalid email address";
  if (!data.phone?.trim()) return "Phone number is required";
  if (!data.requirement?.trim()) return "Requirement/message is required";
  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadFormData;
    const validationError = validateLeadData(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: lead, error: insertError } = await supabase
      .from("leads")
      .insert({
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone.trim(),
        company: body.company?.trim() || null,
        requirement: body.requirement.trim(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Lead insert error:", insertError);
      return NextResponse.json(
        { error: "We couldn't save your inquiry. Please try again." },
        { status: 500 }
      );
    }

    const classification = await classifyLead(body.requirement.trim());
    if (classification) {
      await supabase
        .from("leads")
        .update({
          ai_category: classification.category,
          ai_priority: classification.priority,
        })
        .eq("id", lead.id);
    }

    try {
      await sendLeadEmail({
        to: lead.email,
        name: lead.name,
        requirement: lead.requirement,
        leadId: lead.id,
      });

      await supabase.from("email_events").insert({
        lead_id: lead.id,
        event_type: "sent",
      });
    } catch (emailError) {
      console.error("Email send error:", emailError);
    }

    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        ai_category: classification?.category ?? null,
        ai_priority: classification?.priority ?? null,
      },
    });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
