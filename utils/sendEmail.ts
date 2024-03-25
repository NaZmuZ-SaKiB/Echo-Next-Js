import nodemailer from "nodemailer";

type TSendMail = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

const sendMail = async ({ to, subject, text = "", html = "" }: TSendMail) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass: process.env.NODE_MAILER_EMAIL_PASSWORD,
    },
  });

  try {
    await transport.verify();

    await transport.sendMail({
      from: '"Echo" <official@echo.mail>',
      to,
      subject,
      text,
      html,
    });
  } catch (err) {}
};

export default sendMail;
