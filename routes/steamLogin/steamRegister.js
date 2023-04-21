const express = require('express');
const UserSchema = require('../../db/Schemas/User.js');
const TokenGenerator = require('token-generator')({ salt: '55', timestampMap: '1k45oj6x2l', });
const router = express.Router();
const SteamAuth = require("node-steam-openid");
const steam = new SteamAuth({
    realm: "http://localhost:4000/steam/authenticate/register", 
    returnUrl: "http://localhost:4000/steam/authenticate/register",
    apiKey: "1ABEBB4C3AAD8EC2714CD2AFAEE38039"
});



router.get("/steam/geturl", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const redirectUrl = await steam.getRedirectUrl();
    res.send({ link : redirectUrl})
})


router.get("/steam/authenticate/register", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    try {
        let ip
        const user = await steam.authenticate(req);
        console.log(user)
        const email = "steam:" + user.steamid
        const findedUser = await UserSchema.findOne({ email: email })
        if (findedUser) return res.redirect("http://127.0.0.1:3000/login")
        const date = new Date;
        const loginToken = await TokenGenerator.generate() + date.getSeconds() + date.getMinutes();
        const steamPsswd = await TokenGenerator.generate() + userData.steamid + date.getSeconds() + date.getMinutes();
        const newUser = new UserSchema({ email: email, password: steamPsswd, ip: ip, loginToken: loginToken, date: new Date(Date.now()) });
        newUser.save();
        res.redirect(`http://127.0.0.1:3000/steamprocess?type=register&token=${token}`)
    }catch(err){
        console.error(err)
    }
})


module.exports = router;