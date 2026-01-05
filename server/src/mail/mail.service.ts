import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

function handleSendGridError(error: unknown): void {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    console.error(
      'SendGrid Error:',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      JSON.stringify((error as any).response?.body, null, 2),
    );
  } else {
    console.error('Unknown Email Error:', error);
  }
}

@Injectable()
export class MailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_SMTP_PASS ?? '');
  }

  async sendRejectionEmail(to: string, name: string): Promise<void> {
    try {
      await sgMail.send({
        to,
        from: process.env.MAIL_FROM!,
        subject: 'Update regarding your project inquiry',
        html: `
          <p>Hi ${name},</p>
          <p>Thank you for reaching out to us.</p>
          <p>Unfortunately, based on your current budget, we are unable to take this project forward.</p>
          <p>Regards,<br/>Sales Team</p>
        `,
      });

      console.log(`Rejection email sent to ${to}`);
    } catch (error: unknown) {
      handleSendGridError(error);
    }
  }

  async sendQualificationEmail(
    to: string,
    name: string,
    _id: string,
  ): Promise<void> {
    try {
      await sgMail.send({
        to,
        from: process.env.MAIL_FROM!,
        subject: 'Good News! Your Project is Qualified',
        html: `
          <p>Hi ${name},</p>
          <p>Your project matches our expertise.</p>
          <p>
            <a href="https://salse-crm.vercel.app/booking/${_id}"
              style="background:#4CAF50;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">
              Book Your Meeting
            </a>
          </p>
          <p>Regards,<br/>Sales Team</p>
        `,
      });

      console.log(`Qualification email sent to ${to}`);
    } catch (error: unknown) {
      handleSendGridError(error);
    }
  }

  async sendBookingReminder(
    to: string,
    name: string,
    _id: string,
  ): Promise<void> {
    try {
      await sgMail.send({
        to,
        from: process.env.MAIL_FROM!,
        subject: 'Reminder: Let’s schedule your project discussion',
        html: `
          <p>Hi ${name},</p>
          <p>You haven’t booked your meeting yet.</p>
          <p>
            <a href="https://salse-crm.vercel.app/booking/${_id}"
              style="background:#f59e0b;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">
              Book Now
            </a>
          </p>
          <p>Regards,<br/>Sales Team</p>
        `,
      });

      console.log(`Reminder email sent to ${to}`);
    } catch (error: unknown) {
      handleSendGridError(error);
    }
  }

  async sendAcknowledgementEmail(to: string, name: string): Promise<void> {
    try {
      await sgMail.send({
        to,
        from: process.env.MAIL_FROM!,
        subject: 'We have received your project inquiry',
        html: `
          <p>Hi ${name},</p>
          <p>We have received your project details.</p>
          <p>Our team will get back to you within 24 hours.</p>
          <p>Regards,<br/>Sales Team</p>
        `,
      });

      console.log(`Acknowledgement email sent to ${to}`);
    } catch (error: unknown) {
      handleSendGridError(error);
    }
  }

  async sendProposalEmail(
    to: string,
    name: string,
    pdfBuffer: Buffer,
  ): Promise<void> {
    try {
      await sgMail.send({
        to,
        from: process.env.MAIL_FROM!,
        subject: 'Project Proposal - SalesPilot',
        html: `
          <p>Hi ${name},</p>
          <p>Please find attached the proposal.</p>
          <p>Regards,<br/>Sales Team</p>
        `,
        attachments: [
          {
            content: pdfBuffer.toString('base64'),
            filename: 'Proposal.pdf',
            type: 'application/pdf',
            disposition: 'attachment',
          },
        ],
      });

      console.log(`Proposal PDF sent to ${to}`);
    } catch (error: unknown) {
      handleSendGridError(error);
    }
  }
}
