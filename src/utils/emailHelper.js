// utils/emailHelper.js
const transporter = require("../config/mailer.js");
require("dotenv").config();

// Pindahkan template email ke sini
const createConfirmationEmailTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Contacting Us</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #ef4444;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Thank You for Contacting Us!</h1>
        <p>CarRental</p>
      </div>
      
      <div class="content">
        <h2>Hello ${name},</h2>
        
        <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
        
        <p>Our team typically responds within 24 hours during business hours:</p>
        <ul>
          <li>Monday - Friday: 8:00 AM - 8:00 PM</li>
          <li>Saturday - Sunday: 9:00 AM - 6:00 PM</li>
        </ul>
        
        <p>If you need immediate assistance, please don't hesitate to call our emergency support line at <strong>+1 (555) 911-HELP</strong>.</p>
        
        <p>Best regards,<br>
        The CarRental Team</p>
      </div>
      
      <div class="footer">
        <p>CarRental | 123 Main Street, City, State 12345</p>
        <p>Phone: +1 (555) 123-4567 | Email: info@carrental.com</p>
      </div>
    </body>
    </html>
  `;
};

const createResetPasswordEmailTemplate = (resetUrl) => {
  return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You have requested to reset your password. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
          </p>
        </div>
      `;
};

const createContactEmailTemplate = (data) => {
  const serviceTypes = {
    rental: "Car Rental Inquiry",
    support: "Customer Support",
    feedback: "Feedback",
    other: "Other",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Form Submission</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #ef4444;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .field {
          margin-bottom: 15px;
          padding: 10px;
          background-color: white;
          border-radius: 5px;
          border-left: 4px solid #ef4444;
        }
        .field-label {
          font-weight: bold;
          color: #ef4444;
          margin-bottom: 5px;
        }
        .field-value {
          color: #333;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>New Contact Form Submission</h1>
        <p>CarRental Website</p>
      </div>
      
      <div class="content">
        <div class="field">
          <div class="field-label">Name:</div>
          <div class="field-value">${data.name}</div>
        </div>
        
        <div class="field">
          <div class="field-label">Email:</div>
          <div class="field-value">${data.email}</div>
        </div>
        
        <div class="field">
          <div class="field-label">Phone:</div>
          <div class="field-value">${data.phone}</div>
        </div>
        
        <div class="field">
          <div class="field-label">Service Type:</div>
          <div class="field-value">${serviceTypes[data.serviceType]}</div>
        </div>
        
        <div class="field">
          <div class="field-label">Subject:</div>
          <div class="field-value">${data.subject}</div>
        </div>
        
        <div class="field">
          <div class="field-label">Message:</div>
          <div class="field-value">${data.message}</div>
        </div>
        
        <div class="field">
          <div class="field-label">Submitted:</div>
          <div class="field-value">${new Date().toLocaleString()}</div>
        </div>
      </div>
      
      <div class="footer">
        <p>This email was sent from the CarRental website contact form.</p>
        <p>Please reply directly to the customer's email: ${data.email}</p>
      </div>
    </body>
    </html>
  `;
};

async function sendConfirmationEmailBlockchain(
  booking,
  car,
  transactionDetails
) {
  try {
    const mailOptions = {
      from: `"Turbo Rent" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: "Konfirmasi Pembayaran - Rental Mobil",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Pembayaran Berhasil Dikonfirmasi</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c5aa0;">Detail Booking</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Mobil:</strong> ${car.brand + " " + car.model}</p>
            <p><strong>Nama:</strong> ${booking.full_name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Nomor Telepon:</strong> ${booking.phone_number}</p>
            <p><strong>Tanggal Mulai:</strong> ${booking.start_date}</p>
            <p><strong>Tanggal Selesai:</strong> ${booking.end_date}</p>
          </div>
          
          <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c5aa0;">Detail Transaksi Blockchain</h3>
            <p><strong>Transaction Hash:</strong> ${
              transactionDetails.txHash
            }</p>
            <p><strong>Jumlah Pembayaran:</strong> ${
              transactionDetails.amount
            } ETH</p>
            <p><strong>Status:</strong> <span style="color: #4caf50; font-weight: bold;">Verified ✓</span></p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Catatan:</strong> Pembayaran Anda telah berhasil diverifikasi di blockchain Ethereum Sepolia. Booking Anda telah dikonfirmasi.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Terima kasih telah menggunakan layanan kami!</p>
            <p style="color: #666; font-size: 12px;">Email ini dikirim secara otomatis, mohon tidak membalas.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}

async function sendConfirmationEmailMidtrans(booking, car, transactionDetails) {
  try {
    const mailOptions = {
      from: `"Turbo Rent" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: "Konfirmasi Pembayaran - Rental Mobil",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Pembayaran Berhasil Dikonfirmasi</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c5aa0;">Detail Booking</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Mobil:</strong> ${car.brand + " " + car.model}</p>
            <p><strong>Nama:</strong> ${booking.full_name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Nomor Telepon:</strong> ${booking.phone_number}</p>
            <p><strong>Tanggal Mulai:</strong> ${booking.start_date}</p>
            <p><strong>Tanggal Selesai:</strong> ${booking.end_date}</p>
          </div>
          
          <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c5aa0;">Detail Transaksi Pembayaran</h3>
            <p><strong>Order ID:</strong> ${transactionDetails.orderId}</p>
            <p><strong>Transaction ID:</strong> ${
              transactionDetails.transactionId
            }</p>
            <p><strong>Metode Pembayaran:</strong> ${
              transactionDetails.paymentType
            }</p>
            <p><strong>Status Transaksi:</strong> ${
              transactionDetails.transactionStatus
            }</p>
            <p><strong>Status Pembayaran:</strong> <span style="color: #4caf50; font-weight: bold;">${
              transactionDetails.paymentStatus
            } ✓</span></p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Catatan:</strong> Pembayaran Anda telah berhasil diverifikasi melalui Midtrans. Booking Anda telah dikonfirmasi.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Terima kasih telah menggunakan layanan kami!</p>
            <p style="color: #666; font-size: 12px;">Email ini dikirim secara otomatis, mohon tidak membalas.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}

const sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  createConfirmationEmailTemplate,
  createResetPasswordEmailTemplate,
  createContactEmailTemplate,
  sendConfirmationEmailBlockchain,
  sendConfirmationEmailMidtrans,
};
