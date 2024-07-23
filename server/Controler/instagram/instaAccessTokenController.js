const instaAccessTokenController = async (req, res) => {
    const refreshToken = req.query.refreshToken;

    try {
        const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token
        &access_token=${refreshToken}`;
        const response = await fetch(url, {
            method: "GET",
        })
        const data = await response.json();
        console.log('instaAcessToken: ', data);
        const accessToken = data.access_token;

        res.status(200).json({ accessToken: accessToken });
    } catch (error) {
        console.log('Error in generating access token: ', error);
        res.status(404).json({ msg: 'Unable to get access token' });
    }
}

module.exports = { instaAccessTokenController };