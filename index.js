const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const connectDB = require('./app/config/dbcon')
const dotenv = require('dotenv')

dotenv.config()
connectDB()
const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname,'public')))
app.use("/uploads",express.static(path.join(__dirname,'uploads')))


//router
const apiRouter = require('./app/routes/apiRouter')
app.use('/api',apiRouter)



const port = 3300
app.listen(port,()=>{
    console.log(`surver running at http://localhost:${port}`);
})
