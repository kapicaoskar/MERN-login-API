const mongoose = require('mongoose');
const express = require('express');
const UserSchema = require('../../db/Schemas/User.js');
const bcrypt = require('bcrypt');
const validateip = require('validate-ip');
const validatoremail = require("email-validator");
const TokenGenerator = require('token-generator')({ salt: '55', timestampMap: '1k45oj6x2l', });
const router = express.Router();



router.get("/register", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const { email, password, ip } = req.query
    if (!email || !password|| !ip || !validateip(ip) || !validatoremail.validate(email)) return res.status(400).send({ resMessage: "Bad email password or ip!" })
    const findedUser = await UserSchema.findOne({ email: email })
    if (findedUser) return res.send({ isCreated: true })
    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) return res.status(400).send("Sorry but we can't hash the password!")
        const date = new Date;
        const loginToken = await TokenGenerator.generate() + date.getSeconds() + date.getMinutes();
        const newUser = new UserSchema({ email: email, password: hash, ip: ip, loginToken: loginToken, date: new Date(Date.now()) });
        newUser.save();
        res.status(200).send({ isCreated: false, loginToken: loginToken })
    });
})



module.exports = router;