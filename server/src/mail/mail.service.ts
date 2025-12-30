import { Injectable } from '@nestjs/common';
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';

interface CustomSentMessageInfo {
  messageId?: string;
  accepted?: string[];
  rejected?: string[];
  response?: string;
}

@Injectable()
export class MailService {
  private transporter: Transporter<SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDGRID_SMTP_USER ?? 'apikey',
        pass: process.env.SENDGRID_SMTP_PASS ?? '',
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });
  }

  async sendRejectionEmail(to: string, name: string): Promise<void> {
    const subject = 'Update regarding your project inquiry';
    const html = `
      <p>Hi ${name},</p>
      <p>Thank you for reaching out to us.</p>
      <p>Unfortunately, based on your current budget, we are unable to take this project forward at this time.</p>
      <p>Regards,<br/>Sales Team</p>
    `;

    try {
      const info = (await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
      })) as CustomSentMessageInfo;

      console.log(`Rejection email sent to ${to}`, info.messageId);
    } catch (error) {
      console.error('Error sending rejection email:', error);
    }
  }

  async sendQualificationEmail(to: string, name: string): Promise<void> {
    const subject = 'Good News! Your Project is Qualified';
    const bookingLink = 'https://salse-crm.vercel.app/booking';

    const html = `
      <p>Hi ${name},</p>
      <p>Your project matches our expertise.</p>
      <p>
        <a href="${bookingLink}" style="background:#4CAF50;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">
          Book Your Meeting
        </a>
      </p>
      <p>Regards,<br/>Sales Team</p>
    `;

    try {
      const info = (await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
      })) as CustomSentMessageInfo;

      console.log(`Qualification email sent to ${to}`, info.messageId);
    } catch (error) {
      console.error('Error sending qualification email:', error);
    }
  }

  async sendBookingReminder(to: string, name: string): Promise<void> {
    const subject = 'Reminder: Let’s schedule your project discussion';
    const bookingLink = 'https://salse-crm.vercel.app/booking';

    const html = `
      <p>Hi ${name},</p>
      <p>You haven’t booked your meeting yet.</p>
      <p>
        <a href="${bookingLink}" style="background:#f59e0b;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">
          Book Now
        </a>
      </p>
      <p>Regards,<br/>Sales Team</p>
    `;

    try {
      const info = (await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
      })) as CustomSentMessageInfo;

      console.log(`Reminder email sent to ${to}`, info.messageId);
    } catch (error) {
      console.error('Error sending reminder email:', error);
    }
  }

  async sendAcknowledgementEmail(to: string, name: string): Promise<void> {
    const subject = 'We have received your project inquiry';

    const html = `
      <p>Hi ${name},</p>
      <p>We have received your project details.</p>
      <p>Our team will get back to you within 24 hours.</p>
      <p>Regards,<br/>Sales Team</p>
    `;

    try {
      const info = (await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
      })) as CustomSentMessageInfo;

      console.log(`Acknowledgement email sent to ${to}`, info.messageId);
    } catch (error) {
      console.error('Error sending acknowledgement email:', error);
    }
  }

  async sendProposalEmail(
    to: string,
    name: string,
    pdfBuffer: Buffer,
  ): Promise<void> {
    const subject = 'Project Proposal - SalesPilot';

    const html = `
      <p>Hi ${name},</p>
      <p>Please find the attached proposal.</p>
      <p>Regards,<br/>Sales Team</p>
    `;

    try {
      const info = (await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
        attachments: [
          {
            filename: 'Proposal.pdf',
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      })) as CustomSentMessageInfo;

      console.log(`Proposal PDF sent to ${to}`, info.messageId);
    } catch (error) {
      console.error('Error sending proposal email:', error);
    }
  }
}
