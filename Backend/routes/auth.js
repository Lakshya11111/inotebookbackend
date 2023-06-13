const express = require('express');
const User = require("../models/Users");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const dotenv = require('dotenv').config()
const JWTSECRET = process.env.JWTSECRET;


//ROUTE 1 - Creaing a User using: POST "/api/auth/usercreate" . no login required

router.post('/usercreate', [
    check('name').not().isEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 })
], async (req, res) => {
    let success = false;

    //if error is found, returns bad request and errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success, errors: errors.array() });
    }
    //check wether the user exist or not
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Sorry, user with this email already exist" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWTSECRET);

        success = true;
        res.json({ success, authToken });
        //  res.json({ user });
    } catch (error) {
        console.error(error.message);
        res.json(500).send("Some error occured");
    }
})

//ROUTE 2 - authenticate a User using: POST "/api/auth/login" . no login required
router.post('/login', [
    check('email', 'Enter a valid E-mail').isEmail(),
    check('password', "Password cannot be blank").exists()
], async (req, res) => {

    let success = false;

    //if error is found, returns bad request and errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Please try to login with correct credential" })
        }

        const passwordCampare = await bcrypt.compare(password, user.password);
        if (!passwordCampare) {
            return res.status(400).json({ success, error: "Please try to login with correct credential" })
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWTSECRET);
        success = true;
        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.json(500).send(success, "Some error occured");
    }

})

//ROUTE 3 - Geting user detail with auth-token: POST "/api/auth/getdetail" .login required
router.post('/getdetail', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.json(500).send("Some error occured");
    }
})

module.exports = router;