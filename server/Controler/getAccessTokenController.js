const User = require('../Models/userModel');
const dotenv = require('dotenv');

dotenv.config();

const getAccessTokenController = async (req, res) => {
    const userId = req.query.userId;
    // console.log(userId);
    try {
        const user = await User.findById(userId);

        // console.log(user.googleRefreshToken);

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                refresh_token: user.googleRefreshToken,
                client_id: process.env.GOOGLE_CLI_ID,
                client_secret: process.env.GOOGLE_CLI_SEC,
                grant_type: 'refresh_token'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to refresh access token');
        }



        const data = await response.json();
        const accessToken = data.access_token;
        // console.log('this:', accessToken);
        res.status(200).json({ accessToken: accessToken });
    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: 'Unable to get access tokne' });
    }
}

module.exports = { getAccessTokenController };