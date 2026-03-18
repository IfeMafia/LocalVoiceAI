import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a verification OTP email.
 */
export async function sendVerificationEmail(email, name, otp) {
  const mailOptions = {
    from: `"Voxy AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your account',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #00D18F; text-align: center;">Welcome to Voxy!</h2>
        <p>Hi ${name || 'there'},</p>
        <p>Thank you for signing up for Voxy. To complete your registration, please verify your email address using the 4-digit code below:</p>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 12px; color: #1e293b;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="text-align: center; font-size: 12px; color: #94a3b8;">© ${new Date().getFullYear()} Voxy AI. All rights reserved.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Sends a welcome email after successful verification.
 */
export async function sendWelcomeEmail(email, name) {
  const mailOptions = {
    from: `"Voxy AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Voxy 🎉',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #00D18F; text-align: center;">Account Verified!</h2>
        <p>Hi ${name || 'there'},</p>
        <p>Your account has been successfully verified. Welcome to Voxy!</p>
        <p>Voxy is your powerful AI-driven business assistant designed to automate customer interactions and streamline your workflow.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="background-color: #00D18F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login to Your Dashboard</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="text-align: center; font-size: 12px; color: #94a3b8;">© ${new Date().getFullYear()} Voxy AI. All rights reserved.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
