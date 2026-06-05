const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'info@shailbala-uppolice.shop',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.htmlMessage || `<p>${options.message}</p>`
    });

    console.log('Message sent via Resend:', data.id);
  } catch (error) {
    console.error('Error sending email with Resend:', error);
    throw error;
  }
};

module.exports = sendEmail;
