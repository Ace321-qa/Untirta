import nodemailer from "nodemailer";

// Wraps Gmail SMTP behind a small internal module so swapping providers
// later (per docs/PROJECT-VISION.md §8) doesn't touch call sites. Sending
// is best-effort: a delivery failure is logged, not thrown, since the
// caller (the contact form action) has already persisted the message to
// the database — that's the source of truth, not the email.
export async function sendContactNotification({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string | null;
  message: string;
}): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, CONTACT_TO_EMAIL } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !CONTACT_TO_EMAIL) {
    console.warn(
      "Contact notification email skipped: SMTP environment variables are not configured.",
    );
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT ? Number(SMTP_PORT) : 587,
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });

    await transporter.sendMail({
      from: SMTP_USER,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `[Kontak Website] ${subject || "Pesan baru dari " + name}`,
      text: `Nama: ${name}\nEmail: ${email}\n\n${message}`,
    });
  } catch (error) {
    console.error("Failed to send contact notification email:", error);
  }
}
