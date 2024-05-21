const nodemailer = require('nodemailer');

const sendEmail = async ({ senderEmail, emails, msg, subject }) => {
    try {
        // todo: configure mail for usage
        console.log(emails, msg, subject);

        var transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVICE,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASSWORD
            }
        });

        const emailHTML = `<p>${msg}</p>`;

        // emails.map(async email => {
            
        // })
        console.log(emails.join('.'));
        const mailOptions = {
            from: senderEmail,
            to: emails.join(','),
            subject: subject,
            html: emailHTML,
        };

        const mailResponse = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { sendEmail };