const { sendEmail } = require('../../utils/index');

const notifyController = async (req, res) => {
    console.log(req.body);

    const { senderEmail, emails, msg, subject } = req.body;
    console.log(senderEmail, emails, msg, subject);
    // send emails
    await sendEmail({ senderEmail, emails, msg, subject });

    res.status(200).json({msg: 'notified successfully'});
}

module.exports = { notifyController };