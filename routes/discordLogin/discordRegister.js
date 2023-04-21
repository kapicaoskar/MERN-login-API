const express = require('express');
const UserSchema = require('../../db/Schemas/User.js');
const TokenGenerator = require('token-generator')({ salt: '55', timestampMap: '1k45oj6x2l', });
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({ clientId: '1092417298813427744', clientSecret: 'UD1TiW4J0_CFfK5qPrvM3QHQh5XfSN6x', redirectUri: 'http://127.0.0.1:3000/dscprocess?type=register' });
const router = express.Router();


router.get("/dscregister", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const { code, ip } = req.query
    try {
        const tokenData = await oauth.tokenRequest({ code: code, scope: 'identify', grantType: 'authorization_code' });
        const accessToken = tokenData.access_token;
        const userData = await oauth.getUser(accessToken);
        const email = userData.email
        const findedUser = await UserSchema.findOne({ email: email })
        if (findedUser) return res.send({ isCreated: true })
        const date = new Date;
        const loginToken = await TokenGenerator.generate() + date.getSeconds() + date.getMinutes();
        const discordPsswd = await TokenGenerator.generate() + userData.id + date.getSeconds() + date.getMinutes();
        const newUser = new UserSchema({ email: email, password: discordPsswd, ip: ip, loginToken: loginToken, date: new Date(Date.now()) });
        newUser.save();
        res.status(200).send({ isCreated: false, loginToken: loginToken })
    } catch (err) { }
})


module.exports = router;