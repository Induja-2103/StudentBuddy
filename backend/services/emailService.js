const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send password reset email
const sendPasswordResetEmail = async (email, code) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'StudentBuddy - Password Reset Code',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
          <p>You have requested to reset your password. Use the code below:</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #4F46E5; letter-spacing: 4px; margin: 0;">${code}</h1>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', email);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

// Send mentor activation email
const sendMentorActivationEmail = async (email, mentorName, code) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'StudentBuddy - Mentor Activation Code',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Activate Your AI Mentor</h2>
          <p>You have requested to activate <strong>${mentorName}</strong> as your mentor.</p>
          <p>Use the activation code below:</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #4F46E5; letter-spacing: 4px; margin: 0;">${code}</h1>
          </div>
          <p>This code will expire in 30 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log('Mentor activation email sent to:', email);
    } catch (error) {
        console.error('Error sending mentor activation email:', error);
        throw error;
    }
};

// Send test notification email
const sendTestNotificationEmail = async (email, testTitle, dueDate) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'StudentBuddy - New Test Available',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">New Test Available</h2>
          <p>A new test has been assigned to you:</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">${testTitle}</h3>
            <p style="margin: 0;">Due: ${new Date(dueDate).toLocaleDateString()}</p>
          </div>
          <p>Log in to StudentBuddy to take the test.</p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log('Test notification email sent to:', email);
    } catch (error) {
        console.error('Error sending test notification email:', error);
        // Don't throw - notification emails are not critical
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendMentorActivationEmail,
    sendTestNotificationEmail
};
