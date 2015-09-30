var express = require('express');
var nodejsx = require('node-jsx');

var isProduction = process.env.NODE_ENV === 'production';
//What dist to use when in dev or
var publicDir = isProduction ? '/dist' : '/../dev/app';

module.exports = function(app){
	nodejsx.install();
	var hbConfig = {
		layoutsDir: __dirname + "/../dev/app/views/layouts",
		defaultLayout: "main.html" 
	}
	app.set('view engine', 'html');
	app.engine('html', require('express-handlebars')(hbConfig));
	app.set("views", __dirname + "/../dev/app/views");
	
	app.use(express.static(__dirname + "/../build"));
}