const express = require('express');
const UserSchema = require('../../db/Schemas/User.js');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get("/login", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const { email, password, ip } = req.query
    const findedUser = await UserSchema.findOne({ email: email })
    if (!findedUser) return res.status(200).send({ isCreated: false })
    const hashedPassword = findedUser.password
    bcrypt.compare(password, hashedPassword, async function (err, result) {
        if (!result) return res.send({ correctPassword: false })
        findedUser.ip = ip
        findedUser.save()
        res.status(200).send({ token: findedUser.loginToken, correctPassword: true })
    });
})

module.exports = router;