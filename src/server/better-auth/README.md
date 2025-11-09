# Email Verification Setup

This directory contains the better-auth configuration and email verification implementation.

## Overview

Email verification is implemented using better-auth's built-in email verification feature with Resend as the email service provider.

## Configuration

### Environment Variables

Add the following to your `.env` file:

```env
RESEND_API_KEY="your_resend_api_key_here"
```

### Getting a Resend API Key

1. Sign up for a free account at [resend.com](https://resend.com)
2. Navigate to the API Keys section
3. Create a new API key
4. Copy the key and add it to your `.env` file

### Email Configuration

The email verification is configured in `config.ts` with the following options:

- **sendOnSignUp**: `true` - Automatically sends verification email when user signs up
- **autoSignInAfterVerification**: `true` - Automatically signs in the user after email verification
- **requireEmailVerification**: `true` - Requires users to verify their email before they can sign in

## How It Works

1. **User Signs Up**: When a user creates an account, better-auth automatically sends a verification email
2. **Verification Email**: The email contains a link with a verification token
3. **User Clicks Link**: When clicked, the link redirects to `/api/auth/verify-email?token=...`
4. **Verification**: Better-auth validates the token and marks the email as verified
5. **Auto Sign-In**: The user is automatically signed in and redirected to the callback URL (login page by default)

## Email Template

The verification email template is defined in `email.ts` and includes:

- Welcome message
- Verification button/link
- Security notice about link expiration (1 hour)
- Instructions for users who didn't sign up

## Customization

### Changing the Email Template

Edit `src/server/better-auth/email.ts` to customize:

- Email content and styling
- Sender name and email (update the `from` field)
- Template design

### Changing Verification Behavior

Edit `src/server/better-auth/config.ts` to adjust:

- When verification emails are sent
- Auto sign-in behavior
- Token expiration time

## Testing

To test email verification locally:

1. Set up a Resend account and get an API key
2. Add the API key to your `.env` file
3. Start the development server: `npm run dev`
4. Sign up for a new account
5. Check your email for the verification link
6. Click the link to verify

## Production Considerations

### Domain Verification

For production, you should:

1. Add and verify your domain in Resend
2. Update the `from` email in `email.ts` to use your verified domain
3. Example: `from: "ClarifAI <noreply@yourdomain.com>"`

### Security

- Keep your `RESEND_API_KEY` secret and never commit it to version control
- Use different API keys for development and production
- Monitor your email sending limits and usage

## Troubleshooting

### Emails Not Sending

1. Check that `RESEND_API_KEY` is set correctly
2. Check the server logs for errors
3. Verify your Resend account is active
4. Check your Resend dashboard for delivery status

### Users Can't Sign In

If `requireEmailVerification` is `true`, users must verify their email before signing in. They'll see an error message prompting them to check their email.

### Email Not Received

- Check spam/junk folders
- Verify the email address is correct
- Check Resend dashboard for delivery status
- Ensure the sender email is from a verified domain (in production)
