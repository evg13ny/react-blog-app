import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'

import { registerValidation } from './validations/auth.js'
import UserModel from './models/User.js'
import checkAuth from './utils/checkAuth.js'
import User from './models/User.js'

mongoose
    .connect('mongodb+srv://admin:pass@cluster0.jhbr941.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB Error', err))

const app = express()

app.use(express.json()) // express handles json

/* Authorization form */
app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({
                message: 'User was not found'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Wrong password or login'
            })
        }

        const token = jwt.sign({
            _id: user._id
        },
            'secret123',
            {
                expiresIn: '30d'
            }
        )

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: 'Invalid authorization request :('
        })
    }
})


/* Registration form */
app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) res.status(400).json(errors.array())

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        })

        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id
        },
            'secret123',
            {
                expiresIn: '30d'
            }
        )

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: 'Invalid registration request :('
        })
    }
})

/* Get me */
app.get('/auth/me', checkAuth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'User was not found'
            })
        }

        const { passwordHash, ...userData } = user._doc

        res.json(userData)
    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: 'No access'
        })
    }
})

app.listen(4444, (err) => { // server 4444
    if (err) {
        return console.log(err)
    }

    console.log('Server OK')
})