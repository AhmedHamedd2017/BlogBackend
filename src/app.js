const express = require('express');
const app = express();
const router = express.Router();

app.use('/', (req,res) => {
    console.log('hello!');
});

app.listen(3000)
