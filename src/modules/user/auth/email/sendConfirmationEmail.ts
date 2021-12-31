import { createTransport } from 'nodemailer';
import { env } from 'config';

export const sendConfirmationEmail =
async (email: string, url: string): Promise<void> => {
  // Create reusable transporter object using the default SMTP transport
  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      clientId: env.GMAIL_CLIENT_ID,
      clientSecret: env.GMAIL_CLIENT_SECRET,
      refreshToken: env.GMAIL_REFRESH_TOKEN,
      user: 'matthewlinserviceworker@gmail.com'
    }
  });

  // Send mail with defined transport object
  transporter.sendMail({
    from: 'Test Server',
    to: email,
    subject: 'Confirmation email',
    html: `<a href="${url}">${url}</a>`
  });
};
