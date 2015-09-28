var site = require('../dev/app/server/controllers/site');


module.exports = function(app){

	app.get("/" , site.home)
};