const express = require('express');
const { userModel } = require('../Models/userModel');
const bcrypt = require('bcrypt');

const registerControler = async (req, res, next) => {
    console.log(req.body);
    // const { name, email, password } = req.body;
    // console.log(name, email, password);
    try {
        const userInfo = userModel(req.body);
        const result = await userInfo.save();
        return res.status(200).json({
            status: true,
            data: result
        })

    }
    catch (e) {
        console.log(e.message);
        return res.status(400).json({
            status: false,
            data: e
        })
    }

}

const loginControler = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // console.log(email, password);
        if (!email || !password) {
            res.status(400).json({
                status: false,
                message: "Every field is required"
            })
        }

        const userInfo = await userModel.findOne({ email });
        // console.log(userInfo.password, password);
        if (!userInfo || !(await bcrypt.compare(password, userInfo.password))) {
            return res.status(400).json({
                status: false,
                message: "invalid credentials"
            })
        }


        const token = userInfo.jwtToken();
        userInfo.password = undefined;
        const cookiesOption = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        }
        res.cookie("token", token, cookiesOption);
        // console.log(userInfo);
        return res.status(200).json({
            status: true,
            data: userInfo,
            token: token
        })


    }
    catch (e) {
        return res.status(400).json({
            status: false,
            message: e.message
        })
    }
}

const getUser = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const user = await userModel.findById(userId);
        return res.status(200).json({
            status: true,
            data: user
        })
    }
    catch (e) {
        return res.status(400).json({
            status: false,
            message: e.message
        })
    }
}

const logout = (req, res, next) => {
    try {
        const cookieOption = {
            expires: new Date(),
            httpOnly: true
        };
        // console.log("logout route")
        res.cookie("token", null, cookieOption);
        res.status(200).json({
            status: true,
            data: "Logged out"
        })
    }
    catch (e) {
        return res.status(400).json({
            status: false,
            data: e.message
        })
    }
}

module.exports = { registerControler, loginControler, getUser, logout };