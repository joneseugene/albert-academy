import type { EmailTemplateData } from "./types.ts";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function createEmailTemplate(data: EmailTemplateData) {
  const recipientName = escapeHtml(data.recipientName || "there");
  const title = escapeHtml(data.title);
  const message = escapeHtml(data.message);

  const buttonText = data.buttonText
    ? escapeHtml(data.buttonText)
    : undefined;

  const footerMessage = escapeHtml(
    data.footerMessage ||
      "If you did not expect this email, you can safely ignore it.",
  );

  const button = data.actionUrl && buttonText
    ? `
      <p style="margin: 32px 0;">
        <a
          href="${data.actionUrl}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background: #7A1523;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
          "
        >
          ${buttonText}
        </a>
      </p>
    `
    : "";

  const html = `
    <div
      style="
        margin: 0;
        padding: 40px 20px;
        background: #f5f5f5;
        font-family: Arial, Helvetica, sans-serif;
      "
    >
      <div
        style="
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
        "
      >
        <div
          style="
            padding: 24px;
            background: #7A1523;
            color: #ffffff;
          "
        >
          <h1
            style="
              margin: 0;
              font-size: 24px;
            "
          >
            Albert Academy
          </h1>
        </div>

        <div style="padding: 32px 24px;">
          <p>
            Hello ${recipientName},
          </p>

          <h2
            style="
              margin: 0 0 16px;
              font-size: 20px;
              color: #222222;
            "
          >
            ${title}
          </h2>

          <p style="line-height: 1.6;">
            ${message}
          </p>

          ${button}

          <p style="line-height: 1.6;">
            ${footerMessage}
          </p>

          <p>
            Regards,<br />
            <strong>Albert Academy</strong>
          </p>
        </div>
      </div>
    </div>
  `;

  const text = `
Hello ${data.recipientName || "there"},

${data.title}

${data.message}

${data.actionUrl ? `${data.buttonText || "Continue"}: ${data.actionUrl}` : ""}

${data.footerMessage || "If you did not expect this email, you can safely ignore it."}

Regards,
Albert Academy
  `.trim();

  return {
    html,
    text,
  };
}