import fs from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";

interface EmailParams {
  to: string;
  subject: string;
  body: string;
  templateParams?: Record<string, any>;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER || "yourmail@gmail.com",
    pass: process.env.SMTP_PASS || "your_app_password",
  },
});

export async function sendEmailNotification({
  to,
  subject,
  body,
  templateParams,
}: EmailParams) {
  const timestamp = new Date().toISOString();

  try {
    const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_USER || "yourmail@gmail.com";
    await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      text: body,
      html: body.split("\n").map((line) => `<p>${line}</p>`).join(""),
    });
  } catch (smtpError) {
    console.error("SMTP sending error:", smtpError);
  }

  try {
    const filePath = path.join(process.cwd(), "emails_sent.json");
    let emailsList: any[] = [];

    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      emailsList = JSON.parse(fileContent);
    } catch {
      emailsList = [];
    }

    const newEmail = {
      id: Date.now(),
      timestamp,
      to,
      subject,
      body,
      templateParams,
    };

    emailsList.unshift(newEmail);
    await fs.writeFile(filePath, JSON.stringify(emailsList, null, 2), "utf-8");
  } catch (error) {
    console.error("Error persisting simulated email:", error);
  }
}
