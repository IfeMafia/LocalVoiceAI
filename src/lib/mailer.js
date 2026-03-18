import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Standard Email Wrapper
 */
const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Voxy" <support@voxy.com>`,
    to,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #00D18F; text-align: center;">Voxy AI</h2>
        ${html}
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="text-align: center; font-size: 12px; color: #94a3b8;">© ${new Date().getFullYear()} Voxy AI. All rights reserved.</p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

/**
 * 1. Verification Email
 */
export async function sendVerificationEmail(email, name, otp) {
  return sendMail({
    to: email,
    subject: 'Verify your Voxy account',
    html: `
      <p>Hi ${name || 'there'},</p>
      <p>Please use the 4-digit code below to verify your account:</p>
      <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 12px; color: #1e293b;">${otp}</span>
      </div>
      <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes.</p>
    `,
  });
}

/**
 * 2. Password Reset Email
 * Using Link (Option A)
 */
export async function sendPasswordResetEmail(email, name, tokenIdentifier) {
  const resetLink = `${BASE_URL}/reset-password?token=${tokenIdentifier}`;
  return sendMail({
    to: email,
    subject: 'Reset your password',
    html: `
      <p>Hi ${name || 'there'},</p>
      <p>We received a request to reset your password. Click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #00D18F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #64748b; font-size: 14px;">This link will expire in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
      <p style="font-size: 12px; color: #94a3b8; word-break: break-all;">Link: ${resetLink}</p>
    `,
  });
}

/**
 * 3. Welcome Email
 */
export async function sendWelcomeEmail(email, name) {
  return sendMail({
    to: email,
    subject: 'Welcome to Voxy 🎉',
    html: `
      <p>Hi ${name || 'there'},</p>
      <p>Your account is now verified. Welcome to Voxy! You can now start automating your business communication with AI.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${BASE_URL}/login" style="background-color: #00D18F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Login to Dashboard</a>
      </div>
    `,
  });
}

/**
 * 4. Change Email Verification
 */
export async function sendEmailChangeOTP(email, name, otp) {
  return sendMail({
    to: email,
    subject: 'Verify your new email',
    html: `
      <p>Hi ${name || 'there'},</p>
      <p>You requested to change your account email. Please use the code below to verify your new email address:</p>
      <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 12px; color: #1e293b;">${otp}</span>
      </div>
      <p style="color: #64748b; font-size: 14px;">Expires in 10 minutes.</p>
    `,
  });
}
