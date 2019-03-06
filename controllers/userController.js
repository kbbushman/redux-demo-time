const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUserObject = {
            username: req.body.username,
            password: hashedPassword
        }
        const newUser = await User.create(newUserObject);
        req.session.userId = newUser._id;
        res.json({
            status: 200,
            data: newUser
        })
    } catch(err){
        res.json({
            status: 500,
            data: err
        })
    }
})

module.exports = router;

