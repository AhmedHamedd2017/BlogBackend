require('dotenv').config();

const cors = require('cors');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const auth = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', auth);

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.c9ysh.mongodb.net/test`,{useUnifiedTopology: true, useNewUrlParser: true , useCreateIndex: true})
    .then(() => {
        console.log("\nSuccesfully connected to the database");
        app.listen(PORT),console.log(`Server started at http://localhost:${PORT}\n`);
    })
    .catch((error) => {
        console.log("Error connecting to the DB :" , error);
    })


