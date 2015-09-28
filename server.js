var isProduction = process.env.NODE_ENV === 'production';

// Setup Express
var express = require('express');
var app = express();

require('./config/express')(app);
require('./config/routes')(app);

app.listen(3000);
console.log('Server running on 3000');