import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'

import * as PostController from './controllers/PostController.js'
import * as UserController from './controllers/UserController.js'
import checkAuth from './utils/checkAuth.js'
import { loginValidation, postCreateValidation, registerValidation } from './validations.js'

mongoose
    .connect('mongodb+srv://admin:pass@cluster0.jhbr941.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB Error', err))

const app = express()

const storage = multer.diskStorage({ // image storage
    destination: (_, __, cb) => {
        cb(null, 'uploads') // if no errors then save images
    },

    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })

/* Routers */

app.use(express.json()) // express handles json
app.use('/uploads', express.static('uploads')) // express opens uploads folder

/* Authorization form */
app.post('/auth/login', loginValidation, UserController.login)

/* Registration form */
app.post('/auth/register', registerValidation, UserController.register)

/* Check me */
app.get('/auth/me', checkAuth, UserController.getMe)

/* Upload image */
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update)

app.listen(4444, (err) => { // server 4444
    if (err) {
        return console.log(err)
    }

    console.log('Server OK')
})