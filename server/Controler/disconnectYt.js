const User = require('../Models/userModel');

const disconnectYt = async (req, res) => {
    const userId = req.body.userId;
    // console.log(userId);

    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.googleId = undefined;
        user.googleAccessToken = undefined;
        user.googleRefreshToken = undefined;
        
        await user.save();

        res.status(200).json({ msg: 'Successfully disconnected YouTube account' });
    } catch (error) {
        console.log('Error in disconnecting yt: ', error);
        res.status(400).json({ msg: 'Error in disconnecting YouTube account' });
    }
};

module.exports = { disconnectYt };