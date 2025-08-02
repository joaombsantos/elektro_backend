import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || "2525"),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export class Mailer {
    
    public static async sendEmail(to: string, subject: string, text: string): Promise<boolean> {
        console.log(`📨 Tentando enviar e-mail para: ${to}`);

        const messageObject = {
            from: `"Elektro Store" <${process.env.MAIL_SENDER}>`,
            to: to,
            subject: subject,
            text: text,
        };

        try {
            const info = await transporter.sendMail(messageObject);
            
            console.log(` E-mail enviado com sucesso! Message ID: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error(" Erro ao enviar e-mail:", error);
            return false;
        }
    }
}