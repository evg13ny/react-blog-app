import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

mongoose
    .connect('mongodb+srv://admin:pass@cluster0.nibhs0u.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB Error', err))

const app = express()

app.use(express.json()) // express обрабатывает json

app.get('/', (req, res) => { // запрос, ответ
    res.send('Hello World!')
})

app.post('/auth/login', (req, res) => {
    console.log(req.body)

    const token = jwt.sign({
        email: req.body.email,
        fillName: 'Иван Петров'
    },
        'secret123'
    )

    res.json({
        success: true,
        token
    })
})

app.listen(4444, (err) => { // сервер 4444
    if (err) {
        return console.log(err)
    }

    console.log('Server OK')
})