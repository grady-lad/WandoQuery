"use strict";
exports.home = function (req, res) {
  console.log('getting')
  res.render("index" , {title: 'Wando Search'});
};
	
