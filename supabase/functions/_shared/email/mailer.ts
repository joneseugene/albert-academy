// @ts-ignore
import nodemailer from "npm:nodemailer@10.0.16";
import { createEmailTemplate } from "./templates.ts";
import type { SendEmailOptions } from "./types.ts";


declare const Deno: {
  serve(handler: (request: Request) => Response | Promise<Response>): void;

  env: {
    get(name: string): string | undefined;
  };
};

function getTransporter() {
  const smtpHost =
    Deno.env.get("SMTP_HOST") ?? "smtp.gmail.com";

  const smtpPort = Number(
    Deno.env.get("SMTP_PORT") ?? "587",
  );

  const smtpUser = Deno.env.get("SMTP_USER");
  const smtpPassword = Deno.env.get("SMTP_PASSWORD");
  const smtpFrom =
    Deno.env.get("SMTP_FROM") ?? smtpUser;

  if (!smtpUser || !smtpPassword || !smtpFrom) {
    throw new Error("SMTP configuration is missing.");
  }

  if (!Number.isInteger(smtpPort) || smtpPort <= 0) {
    throw new Error("Invalid SMTP port.");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  return {
    transporter,
    smtpFrom,
  };
}

export async function sendEmail({
  to,
  subject,
  template,
}: SendEmailOptions) {
  const { transporter, smtpFrom } = getTransporter();

  const { html, text } = createEmailTemplate(template);

  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject,
    text,
    html,
  });
}