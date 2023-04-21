const express = require('express');
const UserSchema = require('../../db/Schemas/User.js');
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({ clientId: '1092417298813427744', clientSecret: 'UD1TiW4J0_CFfK5qPrvM3QHQh5XfSN6x', redirectUri: 'http://127.0.0.1:3000/dscprocess?type=login' });
const router = express.Router();




router.get("/dsclogin", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const { code, ip } = req.query
    try {
        const tokenData = await oauth.tokenRequest({ code: code, scope: 'identify', grantType: 'authorization_code' });
        const accessToken = tokenData.access_token;
        const userData = await oauth.getUser(accessToken);
        const email = userData.email
        const findedUser = await UserSchema.findOne({ email: email })
        if (!findedUser) return res.send({ isCreated: false })
        if (!findedUser.password.includes(userData.id)) return res.send({ canLogin: false, isCreated: true })
        findedUser.ip = ip
        findedUser.save()
        res.status(200).send({ correctPassword: true, loginToken: findedUser.loginToken, isCreated: true, canLogin: true })
    } catch (err) { }
})

module.exports = router;