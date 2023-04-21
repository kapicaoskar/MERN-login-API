const express = require('express');
const UserSchema = require('../db/Schemas/User.js');
const validateip = require('validate-ip');
const router = express.Router();

router.get("/checktoken", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const { token, ip } = req.query
    if (!validateip(ip) || !token) return res.status(400).send({ resMessage: "Bad token or ip!" })
    const findedToken = await UserSchema.findOne({ loginToken: token })
    if (!findedToken) return res.status(400).send({ resMessage: "notfound" })
    if (findedToken.ip === ip) return res.status(200).send({ resMessage: "correctToken", email: findedToken.email })
    res.status(200).send({ resMessage: "badip" })
})


module.exports = router;