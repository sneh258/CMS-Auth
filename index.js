require('dotenv').config();
const express = require('express');
const app = express();
const port = 5000;
const {router} = require('./src/routes/router');
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use('/user', router);
app.listen(port, () => {
    console.log(`started listening on port ${port}`);
});
