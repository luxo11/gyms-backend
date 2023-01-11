require('dotenv').config()

const express = require('express')
const cors = require("cors");

const mongoose = require('mongoose')
const cityRoutes = require('./routes/cities')
const userRoutes = require('./routes/user')
const gymRoutes = require('./routes/gyms')
const commentRoutes = require('./routes/comments')

const app = express()

app.use(express.json())
app.use(express.static('public'))

app.use(cors())

app.use('/api/cities', cityRoutes)
app.use('/api/user', userRoutes)
app.use('/api/gyms', gymRoutes)
app.use('/api/comments', commentRoutes)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to database!')
        app.listen(process.env.PORT, () => {
            console.log(`Listening for requests on port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })