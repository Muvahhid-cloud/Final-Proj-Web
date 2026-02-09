const nodemailer = require("nodemailer");

/**
 * Email Service using Nodemailer
 * Supports SendGrid, Gmail, or any SMTP service via environment variables
 */

// Initialize transporter based on environment variables
const createTransporter = () => {
  // If using SendGrid or other SMTP service with custom host
  if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Default: Gmail configuration (or other common SMTP)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

const transporter = createTransporter();

/**
 * Send Welcome Email on User Registration
 * @param {String} email - User's email
 * @param {String} username - User's username
 */
exports.sendWelcomeEmail = async (email, username) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn("Email service not configured. Skipping welcome email.");
      return;
    }

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #8B4513;">☕ Welcome to Coffee Shop!</h2>
            <p>Hi <strong>${username}</strong>,</p>
            <p>Thank you for registering with us! We're excited to have you on board.</p>
            <p>You can now:</p>
            <ul>
              <li>Browse our exclusive coffee collection</li>
              <li>Add items to your cart</li>
              <li>Place orders and track them in real-time</li>
              <li>Manage your profile and preferences</li>
            </ul>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <br>
            <p>Happy brewing! ☕</p>
            <p>
              <em>Best regards,<br>
              The Coffee Shop Team</em>
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin-top: 30px;">
            <p style="font-size: 12px; color: #666;">
              This is an automated email. Please do not reply directly to this email.
            </p>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME || process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Coffee Shop - Registration Successful! ☕",
      html: htmlContent,
      text: `Welcome to Coffee Shop, ${username}! Thank you for registering.`
    });

    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
    // Don't throw - allow registration to continue even if email fails
  }
};

/**
 * Send Order Confirmation Email
 * @param {String} email - User's email
 * @param {String} username - User's username
 * @param {Object} order - Order details with items and totalPrice
 * @param {String} orderId - Order ID
 */
exports.sendOrderConfirmationEmail = async (email, username, order, orderId) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn("Email service not configured. Skipping order confirmation email.");
      return;
    }

    // Build items list HTML
    let itemsHtml = "";
    if (order.items && Array.isArray(order.items)) {
      itemsHtml = order.items
        .map(
          (item) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px; text-align: left;">${item.nameSnapshot}</td>
          <td style="padding: 10px; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; text-align: right;">$${(item.priceSnapshot * item.quantity).toFixed(2)}</td>
        </tr>
      `
        )
        .join("");
    }

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #8B4513;">☕ Order Confirmation</h2>
            <p>Hi <strong>${username}</strong>,</p>
            <p>Thank you for your order! We're preparing your delicious coffee.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Order Status:</strong> <span style="color: #ff9800; font-weight: bold;">Pending</span></p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <h3 style="color: #8B4513; margin-top: 20px;">Order Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #8B4513; color: white;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: center;">Quantity</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="text-align: right; margin-top: 20px; padding-top: 10px; border-top: 2px solid #8B4513;">
              <p><strong>Total Price: $${(order.totalPrice || 0).toFixed(2)}</strong></p>
            </div>

            <p style="margin-top: 20px;">
              You can track your order status anytime by visiting your account dashboard.
            </p>

            <p>
              <em>Thank you for your business!<br>
              The Coffee Shop Team</em>
            </p>

            <hr style="border: none; border-top: 1px solid #ddd; margin-top: 30px;">
            <p style="font-size: 12px; color: #666;">
              This is an automated email. Please do not reply directly to this email.
            </p>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME || process.env.EMAIL_USER,
      to: email,
      subject: `Order Confirmation - Order #${orderId} ☕`,
      html: htmlContent,
      text: `Order Confirmation for ${username}. Order ID: ${orderId}. Total: $${order.totalPrice}`
    });

    console.log(`Order confirmation email sent to ${email}`);
  } catch (error) {
    console.error("Error sending order confirmation email:", error.message);
    // Don't throw - allow order to be created even if email fails
  }
};

/**
 * Send Password Reset Email
 * @param {String} email - User's email
 * @param {String} username - User's username
 * @param {String} resetToken - Reset token or link
 */
exports.sendPasswordResetEmail = async (email, username, resetToken) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn("Email service not configured. Skipping password reset email.");
      return;
    }

    const resetLink = `${process.env.APP_URL || "http://localhost:5000"}/reset-password?token=${resetToken}`;

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #8B4513;">☕ Password Reset Request</h2>
            <p>Hi <strong>${username}</strong>,</p>
            <p>We received a request to reset your password. Click the button below to proceed:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="display: inline-block; background-color: #8B4513; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reset Password
              </a>
            </div>

            <p style="font-size: 12px; color: #666;">
              Or copy and paste this link in your browser:<br>
              <code>${resetLink}</code>
            </p>

            <p style="color: #d32f2f; margin-top: 30px;">
              <strong>Note:</strong> This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </p>

            <p>
              <em>Best regards,<br>
              The Coffee Shop Team</em>
            </p>

            <hr style="border: none; border-top: 1px solid #ddd; margin-top: 30px;">
            <p style="font-size: 12px; color: #666;">
              This is an automated email. Please do not reply directly to this email.
            </p>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME || process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request - Coffee Shop ☕",
      html: htmlContent,
      text: `Click here to reset your password: ${resetLink}`
    });

    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
  }
};

/**
 * Test email configuration
 */
exports.testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email service is properly configured and connected");
    return true;
  } catch (error) {
    console.error(
      "❌ Email service configuration issue:",
      error.message
    );
    return false;
  }
};

module.exports = exports;
