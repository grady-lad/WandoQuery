/** @jsx React.DOM */
"use strict";
(function(){
 
  var submitButton = document.getElementById("SearchButton");
  var React = require('react');
  var ProductListContainer = require('./Components/ProductListContainer');

  submitButton.onclick = function(e){
    e.preventDefault();
    // add error handling here
    var searchValue	 = document.getElementById("ProductInput").value;
    sendRequest(searchValue).then(function(response){
      console.log("resolved our response");
      console.log(response);
  	  React.renderComponent(<ProductListContainer products={response}/> , document.getElementById('Content'));
    }).catch(function(error){
  	  console.log("error error " + error );
    });
  };

  function sendRequest(query){
    return new Promise(function(resolve, reject){
      var xhr = new XMLHttpRequest();
      var url = 'http://productfeedtest.wandoso.com/?keyword=' + query,
          result;
      xhr.open('GET' , url);
      xhr.onload = function(e){
        if(this.status === 200){
          result = JSON.parse(this.response);
          resolve(result.items);
        }
      };
      // add error handling
      xhr.error = function(e){
        reject(e);
      }
      xhr.send();
    });
  };
}());