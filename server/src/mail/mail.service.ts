import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, // ✅ Port 587 use karein
      secure: false, // ✅ 587 ke liye False
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      // 👇 YE HAI MAGIC LINE (Iske bina Render par Timeout aata hai)
      family: 4,
    } as any);
  }

  async sendRejectionEmail(to: string, name: string) {
    const subject = 'Update regarding your project inquiry';
    const html = `
    <p> Hi ${name},</p>
    <p>Thank you for reaching out to us.</p>
      <p>Unfortunately, based on your current budget, we are unable to take this project forward at this time. Our minimum engagement starts at higher packages.</p>
      <p>We wish you the best in your search.</p>
      <p>Regards,<br/>Sales Team</p>`;

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject,
        html,
      });
      console.log(`Rejection email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendQualificationEmail(to: string, name: string) {
    const subject = 'Good News! Your Project is Qualified';
    // Jab Frontend ban jayega, ye link actual booking page ka hoga
    const bookingLink = 'http://localhost:3000/booking';

    const html = `
      <p>Hi ${name},</p>
      <p>Thanks for sharing your project details. We are excited to tell you that your requirements match our expertise!</p>
      <p><b>Next Step:</b> Please schedule a quick discovery call with our team using the link below:</p>
      <p>
        <a href="${bookingLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Book Your Meeting
        </a>
      </p>
      <p>Or click here: <a href="${bookingLink}">${bookingLink}</a></p>
      <p>Looking forward to speaking with you.</p>
      <p>Regards,<br/>Sales Team</p>
    `;

    try {
      await this.transporter.sendMail({
        from: '"My CRM Team" <your-email@gmail.com>',
        to,
        subject,
        html,
      });
      console.log(`Qualification email sent to ${to}`);
    } catch (error) {
      console.error('Error sending qualification email:', error);
    }
  }

  async sendBookingReminder(to: string, name: string) {
    const subject = 'Reminder: Let’s schedule your project discussion';
    const bookingLink = 'http://localhost:3001/booking'; // Dummy link

    const html = `
      <p>Hi ${name},</p>
      <p>We noticed that you qualified for our project program but haven't booked your meeting yet.</p>
      <p>Slots are filling up fast. Please select a time that works for you:</p>
      <p>
        <a href="${bookingLink}" style="background-color: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Book Now
        </a>
      </p>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Regards,<br/>Sales Team</p>
    `;

    try {
      await this.transporter.sendMail({
        from: '"My CRM Team" <your-email@gmail.com>',
        to,
        subject,
        html,
      });
      console.log(`Reminder email sent to ${to}`);
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  }

  async sendAcknowledgementEmail(to: string, name: string) {
    const subject = 'We have received your project inquiry';
    const html = `
      <p>Hi ${name},</p>
      <p>Thank you for your interest. We have received your project details.</p>
      <p>Our team is currently reviewing your requirements and budget. We will get back to you within 24 hours to discuss the possibilities.</p>
      <p>Regards,<br/>Sales Team</p>
    `;

    try {
      await this.transporter.sendMail({
        from: '"My CRM Team" <your-email@gmail.com>',
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Error sending ack email:', error);
    }
  }

  async sendProposalEmail(to: string, name: string, pdfBuffer: Buffer) {
    const subject = 'Project Proposal - SalesPilot';
    const html = `
      <p>Hi ${name},</p>
      <p>Please find attached the proposal for your project.</p>
      <p>Let us know if you have any questions.</p>
      <p>Regards,<br/>Sales Team</p>
    `;

    try {
      await this.transporter.sendMail({
        from: `"My CRM Team" <${process.env.MAIL_USER}>`,
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
      });
      console.log(`Proposal PDF sent to ${to}`);
    } catch (error) {
      console.error('Error sending proposal:', error);
    }
  }
}
