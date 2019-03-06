const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res)=>{
    try{
        const user = await User.findOne({username: req.body.username});
        const validLogin = await bcrypt.compare(req.body.password, user.password);
        if(!validLogin){
            res.json({
                status: 500,
                data: "WHOOPS BAD LOGIN"
            })
        }
        req.session.userId = user._id
        res.json({
            status: 200,
            data: user
        })
    }catch(err){
        console.log(err);
        res.json({
            status: 500,
            data: err
        })
    }
    
})

module.exports = router;