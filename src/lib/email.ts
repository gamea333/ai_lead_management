import { Resend } from "resend";

export type SendLeadEmailResult = {
  id: string;
};

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY");
  return new Resend(apiKey);
}

function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL || "LeadFlow <onboarding@resend.dev>";
}

/** Resend's test domain only delivers to the account owner's email. */
export function isSandboxSender(from = getFromAddress()) {
  return /@resend\.dev/i.test(from);
}

export function getSandboxSenderWarning() {
  if (!isSandboxSender()) return null;
  return (
    "RESEND_FROM_EMAIL uses onboarding@resend.dev (test mode). " +
    "Resend only delivers to the email on your Resend account. " +
    "To email all leads, verify a domain at resend.com/domains and set " +
    "RESEND_FROM_EMAIL to e.g. LeadFlow <noreply@yourdomain.com>."
  );
}

export function formatResendErrorMessage(message: string) {
  if (
    message.includes("only send testing emails") ||
    message.includes("verify a domain")
  ) {
    return (
      "Confirmation email could not be sent to this address. " +
      "Your Resend account is in test mode (onboarding@resend.dev) and can only " +
      "email the address registered on your Resend account. Verify a custom domain " +
      "at resend.com/domains and update RESEND_FROM_EMAIL in your .env file."
    );
  }
  return `Confirmation email could not be sent: ${message}`;
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

export function buildTrackingUrls(leadId: string) {
  const baseUrl = getBaseUrl();
  const redirect = encodeURIComponent("https://example.com");

  return {
    openPixelUrl: `${baseUrl}/api/track/open?lead_id=${leadId}`,
    clickUrl: `${baseUrl}/api/track/click?lead_id=${leadId}&redirect=${redirect}`,
  };
}

export function buildLeadEmailHtml(params: {
  name: string;
  requirement: string;
  leadId: string;
}) {
  const { openPixelUrl, clickUrl } = buildTrackingUrls(params.leadId);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:600;">Thank You, ${params.name}!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6;">
                We've received your inquiry and our team is reviewing it. Here's a summary of what you shared:
              </p>
              <div style="background:#f9fafb;border-left:4px solid #2563eb;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
                <p style="margin:0;color:#4b5563;font-size:15px;line-height:1.6;font-style:italic;">
                  "${params.requirement}"
                </p>
              </div>
              <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">
                A member of our team will reach out to you shortly. In the meantime, explore what we can do for you.
              </p>
              <a href="${clickUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:16px;font-weight:600;">
                Learn More About Our Services
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;">
                This email was sent in response to your inquiry. If you didn't submit a request, please ignore this message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <img src="${openPixelUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;" />
</body>
</html>
  `.trim();
}

export async function sendLeadEmail(params: {
  to: string;
  name: string;
  requirement: string;
  leadId: string;
}): Promise<SendLeadEmailResult> {
  const from = getFromAddress();
  const sandboxWarning = getSandboxSenderWarning();

  if (sandboxWarning) {
    console.warn("[Resend]", sandboxWarning);
  }

  const resend = getResend();
  const html = buildLeadEmailHtml(params);

  const { data, error } = await resend.emails.send({
    from,
    to: [params.to.trim().toLowerCase()],
    subject: `Thanks for reaching out, ${params.name}!`,
    html,
  });

  if (error) {
    console.error("[Resend] Send failed:", {
      to: params.to,
      from,
      error,
    });
    throw new Error(formatResendErrorMessage(error.message));
  }

  if (!data?.id) {
    throw new Error("Confirmation email could not be sent: no message id returned.");
  }

  return { id: data.id };
}
