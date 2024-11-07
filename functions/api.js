const express = require('express'); 
const bodyParser = require('body-parser'); 
const cors = require('cors');
const apiRoutes = require('../endpoints/apiRoutes'); 

const serverless = require('serverless-http'); 

const app = express(); 


app.use(cors());
app.use(bodyParser.json()); 

app.use('/.netlify/functions/api', apiRoutes);

module.exports.handler = serverless(app);
