import nodemailer from 'nodemailer';
export const transporter = nodemailer.createTransport({
  host: '127.0.0.1',
  port: 1025,
  secure: false,
});
