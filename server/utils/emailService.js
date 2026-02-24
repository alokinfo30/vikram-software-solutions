// server/utils/emailService.js
import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(options) {
    const mailOptions = {
      from: `"Vikram Software Solutions" <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await this.sendEmail({
      email,
      subject: 'Password Reset Request',
      html: message
    });
  }

  async sendWelcomeEmail(user) {
    const message = `
      <h1>Welcome to Vikram Software Solutions!</h1>
      <p>Hello ${user.firstName},</p>
      <p>Your account has been created successfully.</p>
      <p>You can now log in with your email: ${user.email}</p>
      <p>Please change your password after first login.</p>
    `;

    await this.sendEmail({
      email: user.email,
      subject: 'Welcome to Vikram Software Solutions',
      html: message
    });
  }

  async sendProjectAssignmentEmail(employee, project) {
    const message = `
      <h1>New Project Assignment</h1>
      <p>Hello ${employee.firstName},</p>
      <p>You have been assigned to a new project:</p>
      <h3>${project.name}</h3>
      <p>${project.description}</p>
      <p>Please log in to view the project details.</p>
    `;

    await this.sendEmail({
      email: employee.email,
      subject: 'New Project Assignment',
      html: message
    });
  }
}

const emailService = new EmailService();
export default emailService;