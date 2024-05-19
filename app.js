"use strict";

const express = require('express')
const http = require('http')
const errorHandler = require('./middlewares/errorHandler')
const userRouter = require('./routes/user');
const teamRouter = require('./routes/team');
const connectDB = require('./config/db');
const app = express()
const cors = require('cors')
const { Server } = require('socket.io');
const dotenv = require('dotenv').config()
const PORT = process.env.PORT


app.use(cors())

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"],
    }
});


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    req.io = io;
    next()
})

app.use('/api/user', userRouter)
app.use('/api/team', teamRouter)
app.use(errorHandler)

connectDB()

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('subscribe', (userId) => {
        console.log(userId, 'Connecting User')
        socket.join(userId);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


server.listen(PORT, () => {
    try {
        console.log(`SERVER RUNNING ON PORT ${PORT}`)
    } catch (error) {
        console.log(`ERROR WHILE STARTING SERVER ${error}`)
    }
})
