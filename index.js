import express from 'express'
import mongoose from 'mongoose'

import { registerValidation } from './validations/auth.js'
import * as UserController from './controllers/UserController.js'

import checkAuth from './utils/checkAuth.js'

mongoose
    .connect('mongodb+srv://admin:pass@cluster0.jhbr941.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB Error', err))

const app = express()

app.use(express.json()) // express handles json

/* Authorization form */
app.post('/auth/login', UserController.login)

/* Registration form */
app.post('/auth/register', registerValidation, UserController.register)

/* Get me */
app.get('/auth/me', checkAuth, UserController.getMe)

app.listen(4444, (err) => { // server 4444
    if (err) {
        return console.log(err)
    }

    console.log('Server OK')
})