var isProduction = process.env.NODE_ENV === 'production';

// Setup Express
var express = require('express');
var app = express();

require('./config/express')(app);
require('./config/routes')(app);

if(process.env.NODE_ENV === 'production'){
  app.listen(process.env.PORT || 3000, function (error){
    if(error){
      log.error("Unable to listen for connections ", error);
	  process.exit(10);
    }
  });
}else{
  app.listen(3000);
}
console.log('Server running on 3000');