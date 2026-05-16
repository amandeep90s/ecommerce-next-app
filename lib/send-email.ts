import nodemailer from 'nodemailer';

import {
  EMAIL_FROM,
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_SERVICE,
  EMAIL_USER,
} from '@/config/env';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465, // true for 465, false for other ports
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASSWORD,
  },
});

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    // Validate required credentials
    if (!EMAIL_FROM || !EMAIL_PASSWORD) {
      throw new Error(
        'Email configuration is incomplete. Please check EMAIL_FROM and EMAIL_PASSWORD environment variables.',
      );
    }

    const mailOptions = {
      from: `"${EMAIL_USER}" <${EMAIL_FROM}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    };

    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}
