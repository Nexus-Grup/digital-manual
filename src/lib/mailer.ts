import "server-only";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true", // true para porta 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendResetCode(to: string, code: string) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Your password reset code",
    text: `Your password reset code is ${code}. It expires in 10 minutes. If you did not request it, ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:420px">
        <p>Use this code to reset your password:</p>
        <p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p>
        <p style="color:#666;font-size:13px">It expires in 10 minutes. If you did not request it, ignore this email.</p>
      </div>`,
  });
}
