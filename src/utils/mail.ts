import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mohit4122006@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD, // Use an app password for better security
  },
});

export async function sendMail(
  to: string,
  subject: string,
  text: string,
): Promise<void> {
  try {
    await transporter.sendMail({
      from: "no-reply <mohit4122006@gmail.com>",
      to,
      subject,
      text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
