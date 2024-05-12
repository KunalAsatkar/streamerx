const express = require('express');
const { sendEmail } = require('../utils/mailer');

const notifyController = async (req, res) => {
    console.log(req.body);

    const [ emails, msg, subject ] = req.body;
    console.log(emails, msg, subject);
    // send emails
    await sendEmail(emails, msg, subject);

    res.status(200).json({msg: 'emails mil gaye'});
}

module.exports = { notifyController };