import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import axios from 'axios';

import { MailService as SendGridClient } from '@sendgrid/mail';

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
  constructor(
  ) {}

  private readonly crmApiKey = process.env.SENDGRID_SMTP_PASS;
  private readonly crmFromEmail = process.env.MAIL_FROM;

  async sendRejectionEmail(
    to: string,
    name: string,
    companyConfig?: { apiKey: string; fromEmail: string },
  ): Promise<void> {
    const sgClient = new SendGridClient();
    let apiKey = this.crmApiKey;
    let fromEmail = this.crmFromEmail;

    if (companyConfig && companyConfig.apiKey) {
      apiKey = companyConfig.apiKey;
      fromEmail = companyConfig.fromEmail;
    }

    if (!apiKey) {
      throw new BadRequestException('SendGrid API Key is missing');
    }
    if (!fromEmail) {
      throw new BadRequestException('From Email is missing');
    }

    sgClient.setApiKey(apiKey);

    try {
      await sgClient.send({
        to,
        from: fromEmail,
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
    companyConfig?: { apiKey: string; fromEmail: string },
  ): Promise<void> {
    const sgClient = new SendGridClient();
    let apiKey = this.crmApiKey;
    let fromEmail = this.crmFromEmail;

    if (companyConfig && companyConfig.apiKey) {
      apiKey = companyConfig.apiKey;
      fromEmail = companyConfig.fromEmail;
    }

    if (!apiKey) {
      throw new BadRequestException('SendGrid API Key is missing');
    }
    if (!fromEmail) {
      throw new BadRequestException('From Email is missing');
    }

    sgClient.setApiKey(apiKey);
    try {
      await sgClient.send({
        to,
        from: fromEmail,
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
    companyConfig?: { apiKey: string; fromEmail: string },
  ): Promise<void> {
    const sgClient = new SendGridClient();
    let apiKey = this.crmApiKey;
    let fromEmail = this.crmFromEmail;

    if (companyConfig && companyConfig.apiKey) {
      apiKey = companyConfig.apiKey;
      fromEmail = companyConfig.fromEmail;
    }

    if (!apiKey) {
      throw new BadRequestException('SendGrid API Key is missing');
    }
    if (!fromEmail) {
      throw new BadRequestException('From Email is missing');
    }

    sgClient.setApiKey(apiKey);
    try {
      await sgClient.send({
        to,
        from: fromEmail,
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

  async sendAcknowledgementEmail(
    to: string,
    name: string,
    companyConfig?: { apiKey: string; fromEmail: string },
  ): Promise<void> {
    const sgClient = new SendGridClient();
    let apiKey = this.crmApiKey;
    let fromEmail = this.crmFromEmail;

    if (companyConfig && companyConfig.apiKey) {
      apiKey = companyConfig.apiKey;
      fromEmail = companyConfig.fromEmail;
    }

    if (!apiKey) {
      throw new BadRequestException('SendGrid API Key is missing');
    }
    if (!fromEmail) {
      throw new BadRequestException('From Email is missing');
    }

    sgClient.setApiKey(apiKey);
    try {
      await sgClient.send({
        to,
        from: fromEmail,
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
    companyConfig?: { apiKey: string; fromEmail: string },
  ): Promise<void> {
    const sgClient = new SendGridClient();
    let apiKey = this.crmApiKey;
    let fromEmail = this.crmFromEmail;

    if (companyConfig && companyConfig.apiKey) {
      apiKey = companyConfig.apiKey;
      fromEmail = companyConfig.fromEmail;
    }

    if (!apiKey) {
      throw new BadRequestException('SendGrid API Key is missing');
    }
    if (!fromEmail) {
      throw new BadRequestException('From Email is missing');
    }

    sgClient.setApiKey(apiKey);
    try {
      await sgClient.send({
        to,
        from: fromEmail,
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

  async sendInviteEmail(
    to: string,
    name: string,
    token: string, // Invite Token yahan aayega
    companyConfig?: { apiKey: string; fromEmail: string },
  ): Promise<boolean> {
    const sgClient = new SendGridClient();
    let apiKey = this.crmApiKey;
    let fromEmail = this.crmFromEmail;

    if (companyConfig && companyConfig.apiKey) {
      apiKey = companyConfig.apiKey;
      fromEmail = companyConfig.fromEmail;
    }

    if (!apiKey) {
      throw new BadRequestException('SendGrid API Key is missing');
    }
    if (!fromEmail) {
      throw new BadRequestException('From Email is missing');
    }

    sgClient.setApiKey(apiKey);
    // 1. Link Generate karo (Env se Frontend URL uthao)
    // Example Link: http://localhost:3000/setup-account?token=abc123xyz
    const frontendUrl = process.env.FRONTEND_URL || 'https://salse-crm.vercel.app/';
    const actionLink = `${frontendUrl}/setup-account?token=${token}`;

    try {
      await sgClient.send({
        to,
        from: fromEmail,
        subject: 'Welcome to SalesPilot - Setup your Account 🚀',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to SalesPilot!</h2>
            
            <p>Hi ${name},</p>
            
            <p>You have been invited to join the <strong>SalesPilot</strong> workspace by your administrator.</p>
            
            <p>To get started, please click the button below to set your password and activate your account:</p>
            
            <div style="margin: 30px 0;">
              <a href="${actionLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Setup My Account
              </a>
            </div>

            <p style="color: #555;">Or copy-paste this link in your browser:</p>
            <p><a href="${actionLink}" style="color: #007bff;">${actionLink}</a></p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            
            <p style="color: #999; font-size: 12px;">This link is valid for 24 hours. If you didn't ask for this invite, please ignore this email.</p>
            
            <p>Regards,<br/><strong>SalesPilot Team</strong></p>
          </div>
        `,
      });

      console.log(`Invite email sent to ${to}`);
      return true;
    } catch (error: unknown) {
      // Tumhara existing error handler reuse kar rahe hain
      handleSendGridError(error);
      return false;
    }
  }

  async sendPasswordResetEmail(
    to: string,
    name: string,
    token: string, // Reset Token yahan aayega,
    companyConfig?: { apiKey: string; fromEmail: string },
  ): Promise<void> {
    const sgClient = new SendGridClient();
    let apiKey = this.crmApiKey;
    let fromEmail = this.crmFromEmail;

    if (companyConfig && companyConfig.apiKey) {
      apiKey = companyConfig.apiKey;
      fromEmail = companyConfig.fromEmail;
    }

    if (!apiKey) {
      throw new BadRequestException('SendGrid API Key is missing');
    }
    if (!fromEmail) {
      throw new BadRequestException('From Email is missing');
    }

    sgClient.setApiKey(apiKey);
    // 1. Link Generate (Frontend route 'reset-password' hona chahiye)
    // Example Link: http://localhost:3000/reset-password?token=xyz...
    const frontendUrl = 'https://salse-crm.vercel.app/';
    const actionLink = `${frontendUrl}/reset-password?token=${token}`;

    try {
      const response = await sgClient.send({
        to,
        from: fromEmail,
        subject: 'Reset your SalesPilot Password 🔐', // Subject thoda urgent/secure lagna chahiye
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Reset Your Password</h2>
            
            <p>Hi ${name},</p>
            
            <p>We received a request to reset the password for your <strong>SalesPilot</strong> account.</p>
            
            <p>If you made this request, please click the button below to choose a new password:</p>
            
            <div style="margin: 30px 0;">
              <a href="${actionLink}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>

            <p style="color: #555;">Or copy-paste this link in your browser:</p>
            <p><a href="${actionLink}" style="color: #dc3545;">${actionLink}</a></p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            
            <p style="color: #999; font-size: 12px;">
              <strong>Security Notice:</strong> This link is valid for <strong>1 hour</strong> only. 
              If you did not request a password reset, please ignore this email or contact support if you have concerns.
            </p>
            
            <p>Regards,<br/><strong>SalesPilot Security Team</strong></p>
          </div>
        `,
      });
      if (response) {
        console.log(`Password reset email sent to ${to}`);
      }
    } catch (error: unknown) {
      handleSendGridError(error);
    }
  }
}
