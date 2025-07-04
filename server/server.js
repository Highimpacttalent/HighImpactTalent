import express, { response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import axios from 'axios'
import bodyParser from 'body-parser'
import xss from 'xss-clean'
import { setInterval } from 'timers/promises'
import mongoose from 'mongoose'
import mongoSanitize from 'express-mongo-sanitize'
import dbConnection from './dbConfig/dbConnection.js'
import router from './routes/index.js'
import errorMiddleware from './middlewares/errorMiddleware.js'
import multer from 'multer'
import path from 'path';
import { fileURLToPath } from 'url';
import Users from './models/userModel.js'
import passport from 'passport';

dotenv.config()

const app = express()

const PORT = process.env.PORT || 8800;

dbConnection()

app.use(cors())
app.options("*", cors());
app.use(xss())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(mongoSanitize())
app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({ extended: true}))
app.use(morgan('dev'))
app.use(router)
app.use(errorMiddleware)
app.use(passport.initialize());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})