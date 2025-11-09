import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendVerificationEmail({
  email,
  url,
  userName,
}: {
  email: string;
  url: string;
  userName: string;
}) {
  try {
    await resend.emails.send({
      from: "ClarifAI <onboarding@resend.dev>", // Update this with your verified domain
      to: email,
      subject: "Verify your email address",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <h1 style="color: #2c3e50; margin-top: 0;">Welcome to ClarifAI!</h1>
              <p style="font-size: 16px; color: #555;">Hi ${userName},</p>
              <p style="font-size: 16px; color: #555;">
                Thank you for signing up! Please verify your email address to get started.
              </p>
            </div>
            
            <div style="background-color: #fff; padding: 30px; border: 1px solid #e9ecef; border-radius: 10px; margin-bottom: 20px;">
              <p style="font-size: 16px; color: #555; margin-bottom: 25px;">
                Click the button below to verify your email address:
              </p>
              <a href="${url}" 
                 style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: 600; font-size: 16px;">
                Verify Email Address
              </a>
              <p style="font-size: 14px; color: #888; margin-top: 25px;">
                Or copy and paste this link into your browser:
              </p>
              <p style="font-size: 14px; color: #007bff; word-break: break-all;">
                ${url}
              </p>
            </div>
            
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107;">
              <p style="font-size: 14px; color: #856404; margin: 0;">
                <strong>Note:</strong> This link will expire in 1 hour for security reasons.
              </p>
            </div>
            
            <p style="font-size: 12px; color: #888; margin-top: 30px; text-align: center;">
              If you didn't create an account with ClarifAI, please ignore this email.
            </p>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
