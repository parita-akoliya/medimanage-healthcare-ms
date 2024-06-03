import transporter from './mailerTransporter';
import { logger } from './logger';
import path from 'path';
import fs from 'fs';
import config from '../config';

interface MailOptions {
    to: string;
    subject: string;
    templateName?: string;
    placeholders?: { [key: string]: string };
    htmlBody?: string;
}

function getTemplate(templateName: string, placeholders: { [key: string]: string }): string {
    const templatePath = path.join(__dirname, `${templateName}`);
    let template = fs.readFileSync(templatePath, 'utf8');
    
    for (const [key, value] of Object.entries(placeholders)) {
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    return template;
}

export const mailSender = async ({ to, subject, templateName, placeholders, htmlBody }: MailOptions) => {
    let html;

    if (templateName && placeholders) {
        html = getTemplate(templateName, placeholders);
    } else if (htmlBody) {
        html = htmlBody;
    } else {
        throw new Error("Either templateName and placeholders or htmlBody must be provided");
    }

    const logoPath = path.join(__dirname, '../assets/images/logo.png');

    const mailOptions = {
        from: config.mailer.fromAlias,
        to,
        subject,
        html,
        attachments: [{
            filename: 'logo.png',
            path: logoPath,
            cid: 'logo'
        }]
    };

    return transporter.sendMail(mailOptions);
};
