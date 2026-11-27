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
    subject: "Seu código para redefinir a senha",
    text: `Seu código para redefinir a senha é ${code}. Ele expira em 10 minutos. Se você não pediu, ignore este e-mail.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:420px">
        <p>Use este código para redefinir sua senha:</p>
        <p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p>
        <p style="color:#666;font-size:13px">Ele expira em 10 minutos. Se você não pediu, ignore este e-mail.</p>
      </div>`,
  });
}
