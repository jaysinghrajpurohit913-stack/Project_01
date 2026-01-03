const express = require('express');
const Routes = express.Router();


const {body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.models');
const jwt = require('jsonwebtoken');

Routes.get('/register', (req, res) => {
  res.render('register');
});

Routes.post('/register',
    body('username').trim().isLength({min:3}),
    body('email').trim().isEmail(),
    body('password').trim().isLength({min:5}),
   async (req, res) => {

                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                        return res.status(400).json({ 
                            errors: errors.array()
                         });
                       }

                 const { username, email, password } = req.body;
                 const hashpassword = await bcrypt.hash(password,10);
                    // Store user in DB (omitted for brevity)
                const newUser = await userModel.create({
                    username,
                    email,
                    password: hashpassword
                });
                    res.json(newUser);
});

Routes.get('/login', (req, res) => {
  res.render('login');
});

Routes.post('/login',   
     body('username').trim().isLength({min:3}),
     body('password').trim().isLength({min:5}),
     async (req, res) => {

                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                        return res.status(400).json({ 
                            errors: errors.array()
                         });
                       }

                 const { username, password } = req.body;
                 // Authenticate user (omitted for brevity)
                 const newUser = await userModel.findOne({ username });
                 if(!newUser){
                    return res.status(400).json({error:"User not found"});
                 }
                 const isMatch = await bcrypt.compare(password, newUser.password);
                 if(!isMatch){
                    return res.status(400).json({error:"Invalid credentials"});
                 }
                 const token = jwt.sign({
                        userId: newUser._id,
                     }, 
                    process.env.JWT_secret, { expiresIn: '1h' });    
                  
                res.cookie('token', token, {
                    httpOnly: true
                });

                res.json({ message: "Login successful", token });
});


module.exports =   Routes;