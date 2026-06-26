import emailjs from "@emailjs/nodejs";

export type SendLeadEmailResult = {
  status: number;
  text: string;
};

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

function getCtaRedirectUrl() {
  return process.env.NEXT_PUBLIC_CTA_REDIRECT_URL || "https://example.com";
}

function getEmailJsConfig() {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId) throw new Error("Missing EMAILJS_SERVICE_ID");
  if (!templateId) throw new Error("Missing EMAILJS_TEMPLATE_ID");
  if (!publicKey) throw new Error("Missing EMAILJS_PUBLIC_KEY");
  if (!privateKey) throw new Error("Missing EMAILJS_PRIVATE_KEY");

  return { serviceId, templateId, publicKey, privateKey };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function buildTemplateParams(params: {
  to: string;
  name: string;
  phone: string;
  company: string | null;
  requirement: string;
  leadId: string;
}) {
  const baseUrl = getBaseUrl();
  const redirect = encodeURIComponent(getCtaRedirectUrl());
  const recipient = normalizeEmail(params.to);

  // EmailJS resolves the recipient from the template "To Email" field.
  // Send every common alias so it works regardless of which variable the template uses.
  const templateParams: Record<string, string> = {
    to_name: params.name,
    to_email: recipient,
    user_email: recipient,
    email: recipient,
    reply_to: recipient,
    from_name: params.name,
    user_name: params.name,
    name: params.name,
    message: params.requirement,
    requirement: params.requirement,
    company: params.company || "N/A",
    phone: params.phone,
    trackable_link: `${baseUrl}/api/track/click?lead_id=${params.leadId}&redirect=${redirect}`,
    tracking_pixel: `${baseUrl}/api/track/open?lead_id=${params.leadId}`,
  };

  const customRecipientField = process.env.EMAILJS_RECIPIENT_FIELD?.trim();
  if (customRecipientField) {
    templateParams[customRecipientField] = recipient;
  }

  return { recipient, templateParams };
}

function parseEmailJsError(error: unknown, recipient: string): Error {
  const err = error as { status?: number; text?: string };

  if (err?.status === 403) {
    return new Error(
      "EmailJS server access is disabled. Enable 'Allow EmailJS API for non-browser applications' " +
        "at https://dashboard.emailjs.com/admin/account/security"
    );
  }

  if (err?.status === 422) {
    return new Error(
      `EmailJS could not send to "${recipient}". Open your template at ` +
        `https://dashboard.emailjs.com/admin/templates and set the **To Email** field to ` +
        `{{to_email}} or {{user_email}} (must match a variable name in the code). ` +
        `Details: ${err.text || "recipient address invalid"}`
    );
  }

  if (err?.text) {
    return new Error(`Confirmation email could not be sent: ${err.text}`);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error("Confirmation email could not be sent.");
}

export async function sendLeadEmail(params: {
  to: string;
  name: string;
  phone: string;
  company: string | null;
  requirement: string;
  leadId: string;
}): Promise<SendLeadEmailResult> {
  const { serviceId, templateId, publicKey, privateKey } = getEmailJsConfig();
  const { recipient, templateParams } = buildTemplateParams(params);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    throw new Error(`Invalid recipient email: "${recipient}"`);
  }

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
      privateKey,
    });

    if (response.status !== 200) {
      throw { status: response.status, text: response.text };
    }

    return response;
  } catch (error) {
    console.error("[EmailJS] Send failed:", { recipient, error });
    throw parseEmailJsError(error, recipient);
  }
}
