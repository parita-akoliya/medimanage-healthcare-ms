import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
    host: config.mailer.host,
    service: config.mailer.service,
    secure: config.mailer.secure,
    port: config.mailer.port,
    auth: {
        user: config.mailer.email,
        pass: config.mailer.password,
    }
});

export default transporter;
