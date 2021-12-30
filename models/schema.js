const bcrypt = require('bcryptjs')
const express = require('express')
const mongoose = require('mongoose')
const validator = require('validator')

const schema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
    },
    lname: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Email is not valid")
            }
        }
    },
    no: {
        type: Number,
        trim: true,
        required: true,
        min: 10,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    cpassword: {
        type: String,
        trim: true,
        required: true,
    }
})


schema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
        next()
    }

    this.cpassword = undefined;
})

const Collection = new mongoose.model('collector', schema)

module.exports = Collection;