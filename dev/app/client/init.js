/** @jsx React.DOM */
"use strict";
//The entry point to the clientside application
(function(){
 
  var submitButton = document.getElementById("SearchButton");
  var React = require('react');
  var ProductListContainer = require('./Components/ProductListContainer');
  var LoadingComponent = require('./Components/LoadingComponent');
  var PreviousResults = require('./lib/PreviousResults');
  var CachedProducts = require('./Components/CachedProducts');
  var ErrorComponent = require('./Components/ErrorComponent');
  var previousResults = new PreviousResults();
  
  submitButton.onclick = function(e){
     e.preventDefault();
    //We need to create this everytime the box is clicked
    var searchValue  = document.getElementById("ProductInput").value;

    if(searchValue){
      //store the value we just searched for
      var cachedSearch = previousResults.checkStorage(searchValue);
      //display loading
      React.renderComponent(<LoadingComponent/> , document.getElementById('Content'));
      //If we have previous results, show them!
      if(cachedSearch !== undefined){
        React.renderComponent(<CachedProducts cached={cachedSearch}/> , document.getElementById('CachedContent'));
      }
      //send the request
      sendRequest(searchValue).then(function(response){
        //Keep memeory of the 1st product returned
        var soonToBeCached = {
          product: response[0]
        };
        previousResults.addSearchTerms(searchValue , response[0]);
        // Just for demo purposes
        // to simulate the related product search
        setTimeout(function(){
          React.unmountComponentAtNode(document.getElementById('CachedContent'));
  	      React.renderComponent(<ProductListContainer products={response}/> , document.getElementById('Content'));
        } , 2000); // Add's two seconds longer than what we want just for demo
      }).catch(function(error){
  	     React.renderComponent(<ErrorComponent errorMessage={error}/> , document.getElementById('Content'));
      });
    }
  };
  /**
  *@Param: The product the user is searching
  *@Return: A promise which will execute the query in 
  * an asynchronous fashion!
  */
  function sendRequest(query){
    return new Promise(function(resolve, reject){
      //Build up the request
      var xhr = new XMLHttpRequest();
      console.log("testing");
      var url = 'https://google.com?keyword=' + query,
          result;
          console.log(url); 
      xhr.open('GET' , url);
      //Success!!!
      xhr.onload = function(e){
        if(this.status === 200){
          result = JSON.parse(this.response);
          //No items found case
          if(result.items.length <= 0){
            reject("Sorry no products matched your search");
          }
          resolve(result.items);
        }
      };
      //Something very strange going on if we land here
      xhr.error = function(e){
        reject(e);
      }
      //Send the request !
      xhr.send();
    });
  };
}());