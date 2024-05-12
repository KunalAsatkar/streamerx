import nodemailer from 'nodemailer';

export const sendEmail = async ({ emails, msg, subject }) => {
    try {
        // todo: configure mail for usage
        console.log(emails, msg, subject);

        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASSWORD
            }
        });

        const emailHTML = `<p>${msg}</p>`;

        emails.map(async email => {
            const mailOptions = {
                from: 'your-email',
                to: email,
                subject: subject,
                // text: "Hello world?", // plain text body
                html: emailHTML,
            };

            const mailResponse = await transporter.sendMail(mailOptions);
            
        })
    } catch (error) {
        throw new Error(error.message);
    }
}