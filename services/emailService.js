// services/emailService.js
const nodemailer = require('nodemailer');
const VerificationCode = require('../models/VerificationCode'); // Import the model

// Function to generate a random verification code
exports.generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
};

// Function to send an invitation email
exports.sendInvitationEmail = async (email, verificationCode, userId) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - SyncIt',
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .email-container {
              max-width: 600px;
              margin: auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              color: #333;
              font-size: 24px;
            }
            .content {
              margin-top: 20px;
              font-size: 16px;
              color: #555;
            }
            .code {
              font-size: 28px;
              color: #28a745;
              font-weight: bold;
            }
            .footer {
              margin-top: 20px;
              font-size: 14px;
              color: #888;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h2 class="header">Welcome to SyncIt!</h2>
            <div class="content">
              <p>Hi there,</p>
              <p>Thank you for signing up with SyncIt. Please verify your email address by using the verification code below:</p>
              <div class="code">${verificationCode}</div>
              <p>If you did not create an account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>If you have any questions, feel free to contact our support team.</p>
              <p>Best regards,<br>SyncIt Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);

    // Save verification code to the database
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Set expiration time for 10 minutes

    const verification = new VerificationCode({
      userId,
      verificationCode,
      expiresAt,
    });

    await verification.save();
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
