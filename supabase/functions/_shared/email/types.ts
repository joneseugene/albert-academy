export interface EmailTemplateData {
  recipientName?: string;
  title: string;
  message: string;
  buttonText?: string;
  actionUrl?: string;
  footerMessage?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  template: EmailTemplateData;
}