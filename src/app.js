require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const auth = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', auth);

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.c9ysh.mongodb.net/test`,{useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log("Succesfully connected to the database");
        app.listen(PORT),console.log(`Server started at http://localhost:${PORT}`);
    })
    .catch((error) => {
        console.log("Error connecting to the DB :" , error);
    })


