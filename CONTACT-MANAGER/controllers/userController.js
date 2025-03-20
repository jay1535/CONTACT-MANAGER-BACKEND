const asyncHandler= require('express-async-handler')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
//@Register a user
//@Route post /api/user/register
//@access public

const registerUser = asyncHandler (async (req,res)=>{
    const {username, email, password}= req.body;
    if(!username || !email || !password){
        res.status(400).json({msg: 'Please fill in all fields'})
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400).json({msg: 'Email already in use'})
    }
    //Hashing 
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    })
    console.log("User created")
    if(user){
        res.status(201).json({_id:user.id,email:user.email,password:user.password})
    }
    else{
        res.status(400)
        throw new Error("User data is not valid")
    }

    res.json({message: "Register the user"})
});
//@login a user
//@Route post /api/user/login
//@access public
const loginUser = asyncHandler (async (req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("Please fill all details ")
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password ))){
        const token = jwt.sign({
            username : user.username,
            id: user.id,
            email: user.email
        },
        process.env.SECRET_KEY,{
            expiresIn: '1h'
        }
    )
        res.status(200).json({token})
    }else{
        res.status(401).json({msg: 'Invalid credentials'})
    }
    res.json({message: "login  user"})
});
//@current user
//@Route get /api/user/current
//@access private
const currentUser = asyncHandler (async(req,res)=>{
    res.json(req.user)
});

module.exports = {registerUser,loginUser, currentUser}