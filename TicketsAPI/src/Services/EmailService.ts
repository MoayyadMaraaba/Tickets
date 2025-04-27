import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.smtpServer,
    port: 25,
    auth: {
        user: process.env.smtpUser,
        pass: process.env.smtpPass,
    },
});



let email = {
    send: function (to: Array<any>, subject: string, id: string, html: string, type: string) {

        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready");
            }
        });

        for (let i = 0; i < to.length; i++) {
            if (type == "Ticket") {
                html = `
                    <html>
                      <head>
                        <meta charset="UTF-8" />
                        <title>Ticket Created</title>
                      </head>
                      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                        <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                          <tr>
                            <td style="background-color: #007BFF; padding: 20px; color: white; text-align: center;">
                              <h2 style="margin: 0;">Support Ticket Created</h2>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 20px;">
                              <p>Hi ${to[i].FullName},</p>
                              <p>Thank you for reaching out! Your support ticket has been successfully created.</p>
                              <p><strong>Ticket ID:</strong> #${id}<br />
                                 <strong>Subject:</strong> ${subject}<br />
                                 <strong>Status:</strong> Open</p>
                              <p>Our support team will get back to you as soon as possible. In the meantime, you can track your ticket's status using the link below:</p>
                              <p style="text-align: center;">
                                <a href="${process.env.url}/Ticket/${id}" style="display: inline-block; background-color: #007BFF; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">View Ticket</a>
                              </p>
                              <p>If you have additional information to add, simply reply to this email.</p>
                              <p>Best regards,<br />
                              The Support Team</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #777;">
                              <small>Please do not reply to this email directly. This message was sent from an unmonitored address.</small>
                            </td>
                          </tr>
                        </table>
                      </body>
                    </html>
                `;
            } else if (type == "Message") {
                html = `
                <html>
                  <head>
                    <meta charset="UTF-8" />
                    <title>New Message Sent</title>
                  </head>
                  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                      <tr>
                        <td style="background-color: #007BFF; padding: 20px; color: white; text-align: center;">
                          <h2 style="margin: 0;">New Message Sent</h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px;">
                          <p>Hi ${to[i].FullName},</p>
                          <p>New Message Sent</p>

                          <p>
                            <strong>Ticket ID: </strong> #${id}<br />
                            <strong>Subject: </strong> ${subject}<br />
                          </p>

                          <p>Our support team will get back to you as soon as possible. In the meantime, you can track your ticket's status using the link below:</p>
                          <p style="text-align: center;">
                            <a href="${process.env.url}/Ticket/${id}" style="display: inline-block; background-color: #007BFF; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">View Ticket</a>
                          </p>
                          <p>If you have additional information to add, simply reply to this email.</p>
                          <p>Best regards,<br />
                          The Support Team</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #777;">
                          <small>Please do not reply to this email directly. This message was sent from an unmonitored address.</small>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
            `;
            } else if (type == "Password") {
                html = `
                <!DOCTYPE html>
                    <html lang="en">
                      <head>
                        <meta charset="UTF-8" />
                        <title>Reset Your Password</title>
                      </head>
                      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                          <tr>
                            <td style="background-color: #007BFF; padding: 20px; color: #ffffff; text-align: center;">
                              <h2 style="margin: 0;">Password Reset Request</h2>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 30px;">
                              <p>Hi</p>
                              <p>We received a request to reset your password. If you made this request, click the button below to reset your password:</p>

                              <p style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.url}/en/Confirmation/${id}" style="background-color: #007BFF; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                  Reset Password
                                </a>
                              </p>

                              <p>If you didn’t request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                              <p>This link will expire in 30 minutes for your security.</p>

                              <p>Best regards,<br />Your Support Team</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #888;">
                              If you have any questions, contact us at <a href="mailto:support@example.com">support@example.com</a>.
                            </td>
                          </tr>
                        </table>
                      </body>
                    </html>
                `;
            }



            const mailOptions = {
                from: process.env.smtpUser,
                to: to[i].Email,
                subject: subject,
                html: html
            };

            const info = transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
            });
        }
    }
}

export default email;