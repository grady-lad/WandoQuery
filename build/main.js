(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/martin/Documents/Javascript-Workspace/WandoQuery/dev/app/client/Components/CachedProducts.js":[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');

var CachedProducts = React.createClass({displayName: 'CachedProducts',
  //The div that will appear during loading if
  // the product exists within the localstorage
  render: function(){
  	var product = JSON.parse(this.props.cached);
    return (
      React.DOM.section({className: "relatedResults"}, 
      React.DOM.h1(null, "Previously Related Items "), 
      React.DOM.div({className: "productSection"}, 
          React.DOM.div({className: "productImage"}, 
            React.DOM.img({src: product.thumb_photo_url})
          ), 
          React.DOM.div({className: "productTitle"}, " ", product.title, " "), 
          React.DOM.div({className: "productPrice"}, " ", product.price), 
          React.DOM.div({className: "brandLogo"}, 
            React.DOM.img({className: "brandLogo", src: product.merchant_logo_url})
          ), 
          React.DOM.div({className: "productMore"}, 
            React.DOM.button(null, " Show More ")
          )
        )

      )
	  )
  }
});

module.exports = CachedProducts;

},{"react":"react"}],"/home/martin/Documents/Javascript-Workspace/WandoQuery/dev/app/client/Components/ErrorComponent.js":[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');

var ErrorComponent = React.createClass({displayName: 'ErrorComponent',
  //If something goes wrong show the message!
  render: function(){
  	var message = this.props.errorMessage;
    return (
      React.DOM.section({className: "errorContainer"}, 
       React.DOM.h1(null, message)
      )
	  )
  }
});

module.exports = ErrorComponent;

},{"react":"react"}],"/home/martin/Documents/Javascript-Workspace/WandoQuery/dev/app/client/Components/LoadingComponent.js":[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');
var LoadingComponent = React.createClass({displayName: 'LoadingComponent',
 //Placeholder for our spinner (its all done via css)
  render: function(){
    return (
      React.DOM.div({className: "spinner"}
      )
	)
  }
});

module.exports = LoadingComponent;

},{"react":"react"}],"/home/martin/Documents/Javascript-Workspace/WandoQuery/dev/app/client/Components/ProductItem.js":[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');
var ProductItem = React.createClass({displayName: 'ProductItem',

  /** What to display for the shipping costs**/
  calculateShipping: function(ship){
    if(typeof ship === 'object'){
      return "+ shipping costs"
    }
    if(ship === "$0.00"){
      return "free shipping";
    }else{
      return "+ " + ship + " shipping";
    }
    return undefined;
  },

  render: function(){
  	var product = this.props.data;
  	var shipping = this.calculateShipping(product.shipping_price);
    // The product item div
    return (
      React.DOM.a({href: product.click_out_link}, 
    	  React.DOM.div({className: "productSection"}, 
          React.DOM.div({className: "productImage"}, 
    	      React.DOM.img({src: product.thumb_photo_url})
          ), 
    	    React.DOM.div({className: "productTitle"}, " ", product.title, " "), 
    	    React.DOM.div({className: "productPrice"}, " ", product.price), 
          React.DOM.div({className: "productShipping"}, shipping), 
          React.DOM.div({className: "brandLogo"}, 
    	      React.DOM.img({className: "brandLogo", src: product.merchant_logo_url})
          ), 
          React.DOM.div({className: "productMore"}, 
    	      React.DOM.button(null, " Show More ")
          )
    	  )
      )
    )
  }

});

module.exports = ProductItem;
},{"react":"react"}],"/home/martin/Documents/Javascript-Workspace/WandoQuery/dev/app/client/Components/ProductListContainer.js":[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');
var ProductItem = require('./ProductItem');
var ProductListContainer = React.createClass({displayName: 'ProductListContainer',
// We need to create a div for each product which
// can be achieved via mapping :)
  render: function(){
  	var products = this.props.products;
    return (
      React.DOM.div(null, 
        products.map(function(item, index){
          return (
            //each div needs a unqiue key
    	      React.DOM.section({key: item.item_id, className: "productContainer"}, 
    	        ProductItem({data: item})
    	      )
    	    )
        })
      )
	)
  }
});
module.exports = ProductListContainer;

},{"./ProductItem":"/home/martin/Documents/Javascript-Workspace/WandoQuery/dev/app/client/Components/ProductItem.js","react":"react"}],"/home/martin/Documents/Javascript-Workspace/WandoQuery/dev/app/client/init.js":[function(require,module,exports){
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
      React.renderComponent(LoadingComponent(null) , document.getElementById('Content'));
      //If we have previous results, show them!
      if(cachedSearch !== undefined){
        React.renderComponent(CachedProducts({cached: cachedSearch}) , document.getElementById('CachedContent'));
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
  	      React.renderComponent(ProductListContainer({products: response}) , document.getElementById('Content'));
        } , 1000); // Add's two seconds longer than what we want just for demo
      }).catch(function(error){
  	     React.renderComponent(ErrorComponent({errorMessage: error}) , document.getElementById('Content'));
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
      var url = 'productfeedtest.wandoso.com/?keyword=' + query,
          result;
      xhr.open('GET' , url, true);
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
},{"./Components/CachedProducts":"/home/martin/Documents/Javascript-Workspace/WandoQuery/dev/app/client/Components/CachedProducts.js","./Components/ErrorComponent":"/home/martin/Documents/Javascript-Workspace/WandoQuery/dev/app/client/Components/ErrorComponent.js","./Components/LoadingComponent":"/home/martin/Documents/Javascript-Workspace/WandoQuery/dev/app/client/Components/LoadingComponent.js","./Components/ProductListContainer":"/home/martin/Documents/Javascript-Workspace/WandoQuery/dev/app/client/Components/ProductListContainer.js","./lib/PreviousResults":"/home/martin/Documents/Javascript-Workspace/WandoQuery/dev/app/client/lib/PreviousResults.js","react":"react"}],"/home/martin/Documents/Javascript-Workspace/WandoQuery/dev/app/client/lib/PreviousResults.js":[function(require,module,exports){
//We could add stuff to this constructor
//But now we will leave it as blank
var PreviousResults = function(){
  
}

// Save the 1st item within the localstorage
PreviousResults.prototype.addSearchTerms = function(search, result){
  localStorage.setItem(search , JSON.stringify(result));
}

//Loop through the localstroage to see if the search term exists 
PreviousResults.prototype.checkStorage = function(item){
  var i;
  for(var key in localStorage){
    if(item.indexOf(key) > -1){
      return localStorage[key];
    }
  }
  return undefined;
}


module.exports = PreviousResults;
},{}]},{},["/home/martin/Documents/Javascript-Workspace/WandoQuery/dev/app/client/init.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9tYXJ0aW4vRG9jdW1lbnRzL0phdmFzY3JpcHQtV29ya3NwYWNlL1dhbmRvUXVlcnkvZGV2L2FwcC9jbGllbnQvQ29tcG9uZW50cy9DYWNoZWRQcm9kdWN0cy5qcyIsIi9ob21lL21hcnRpbi9Eb2N1bWVudHMvSmF2YXNjcmlwdC1Xb3Jrc3BhY2UvV2FuZG9RdWVyeS9kZXYvYXBwL2NsaWVudC9Db21wb25lbnRzL0Vycm9yQ29tcG9uZW50LmpzIiwiL2hvbWUvbWFydGluL0RvY3VtZW50cy9KYXZhc2NyaXB0LVdvcmtzcGFjZS9XYW5kb1F1ZXJ5L2Rldi9hcHAvY2xpZW50L0NvbXBvbmVudHMvTG9hZGluZ0NvbXBvbmVudC5qcyIsIi9ob21lL21hcnRpbi9Eb2N1bWVudHMvSmF2YXNjcmlwdC1Xb3Jrc3BhY2UvV2FuZG9RdWVyeS9kZXYvYXBwL2NsaWVudC9Db21wb25lbnRzL1Byb2R1Y3RJdGVtLmpzIiwiL2hvbWUvbWFydGluL0RvY3VtZW50cy9KYXZhc2NyaXB0LVdvcmtzcGFjZS9XYW5kb1F1ZXJ5L2Rldi9hcHAvY2xpZW50L0NvbXBvbmVudHMvUHJvZHVjdExpc3RDb250YWluZXIuanMiLCIvaG9tZS9tYXJ0aW4vRG9jdW1lbnRzL0phdmFzY3JpcHQtV29ya3NwYWNlL1dhbmRvUXVlcnkvZGV2L2FwcC9jbGllbnQvaW5pdC5qcyIsIi9ob21lL21hcnRpbi9Eb2N1bWVudHMvSmF2YXNjcmlwdC1Xb3Jrc3BhY2UvV2FuZG9RdWVyeS9kZXYvYXBwL2NsaWVudC9saWIvUHJldmlvdXNSZXN1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgQ2FjaGVkUHJvZHVjdHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdDYWNoZWRQcm9kdWN0cycsXG4gIC8vVGhlIGRpdiB0aGF0IHdpbGwgYXBwZWFyIGR1cmluZyBsb2FkaW5nIGlmXG4gIC8vIHRoZSBwcm9kdWN0IGV4aXN0cyB3aXRoaW4gdGhlIGxvY2Fsc3RvcmFnZVxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gIFx0dmFyIHByb2R1Y3QgPSBKU09OLnBhcnNlKHRoaXMucHJvcHMuY2FjaGVkKTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLnNlY3Rpb24oe2NsYXNzTmFtZTogXCJyZWxhdGVkUmVzdWx0c1wifSwgXG4gICAgICBSZWFjdC5ET00uaDEobnVsbCwgXCJQcmV2aW91c2x5IFJlbGF0ZWQgSXRlbXMgXCIpLCBcbiAgICAgIFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJwcm9kdWN0U2VjdGlvblwifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcInByb2R1Y3RJbWFnZVwifSwgXG4gICAgICAgICAgICBSZWFjdC5ET00uaW1nKHtzcmM6IHByb2R1Y3QudGh1bWJfcGhvdG9fdXJsfSlcbiAgICAgICAgICApLCBcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwicHJvZHVjdFRpdGxlXCJ9LCBcIiBcIiwgcHJvZHVjdC50aXRsZSwgXCIgXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwicHJvZHVjdFByaWNlXCJ9LCBcIiBcIiwgcHJvZHVjdC5wcmljZSksIFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJicmFuZExvZ29cIn0sIFxuICAgICAgICAgICAgUmVhY3QuRE9NLmltZyh7Y2xhc3NOYW1lOiBcImJyYW5kTG9nb1wiLCBzcmM6IHByb2R1Y3QubWVyY2hhbnRfbG9nb191cmx9KVxuICAgICAgICAgICksIFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJwcm9kdWN0TW9yZVwifSwgXG4gICAgICAgICAgICBSZWFjdC5ET00uYnV0dG9uKG51bGwsIFwiIFNob3cgTW9yZSBcIilcbiAgICAgICAgICApXG4gICAgICAgIClcblxuICAgICAgKVxuXHQgIClcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FjaGVkUHJvZHVjdHM7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBFcnJvckNvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0Vycm9yQ29tcG9uZW50JyxcbiAgLy9JZiBzb21ldGhpbmcgZ29lcyB3cm9uZyBzaG93IHRoZSBtZXNzYWdlIVxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gIFx0dmFyIG1lc3NhZ2UgPSB0aGlzLnByb3BzLmVycm9yTWVzc2FnZTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLnNlY3Rpb24oe2NsYXNzTmFtZTogXCJlcnJvckNvbnRhaW5lclwifSwgXG4gICAgICAgUmVhY3QuRE9NLmgxKG51bGwsIG1lc3NhZ2UpXG4gICAgICApXG5cdCAgKVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBFcnJvckNvbXBvbmVudDtcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBMb2FkaW5nQ29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnTG9hZGluZ0NvbXBvbmVudCcsXG4gLy9QbGFjZWhvbGRlciBmb3Igb3VyIHNwaW5uZXIgKGl0cyBhbGwgZG9uZSB2aWEgY3NzKVxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJzcGlubmVyXCJ9XG4gICAgICApXG5cdClcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGluZ0NvbXBvbmVudDtcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBQcm9kdWN0SXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ1Byb2R1Y3RJdGVtJyxcblxuICAvKiogV2hhdCB0byBkaXNwbGF5IGZvciB0aGUgc2hpcHBpbmcgY29zdHMqKi9cbiAgY2FsY3VsYXRlU2hpcHBpbmc6IGZ1bmN0aW9uKHNoaXApe1xuICAgIGlmKHR5cGVvZiBzaGlwID09PSAnb2JqZWN0Jyl7XG4gICAgICByZXR1cm4gXCIrIHNoaXBwaW5nIGNvc3RzXCJcbiAgICB9XG4gICAgaWYoc2hpcCA9PT0gXCIkMC4wMFwiKXtcbiAgICAgIHJldHVybiBcImZyZWUgc2hpcHBpbmdcIjtcbiAgICB9ZWxzZXtcbiAgICAgIHJldHVybiBcIisgXCIgKyBzaGlwICsgXCIgc2hpcHBpbmdcIjtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gIFx0dmFyIHByb2R1Y3QgPSB0aGlzLnByb3BzLmRhdGE7XG4gIFx0dmFyIHNoaXBwaW5nID0gdGhpcy5jYWxjdWxhdGVTaGlwcGluZyhwcm9kdWN0LnNoaXBwaW5nX3ByaWNlKTtcbiAgICAvLyBUaGUgcHJvZHVjdCBpdGVtIGRpdlxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uYSh7aHJlZjogcHJvZHVjdC5jbGlja19vdXRfbGlua30sIFxuICAgIFx0ICBSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwicHJvZHVjdFNlY3Rpb25cIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJwcm9kdWN0SW1hZ2VcIn0sIFxuICAgIFx0ICAgICAgUmVhY3QuRE9NLmltZyh7c3JjOiBwcm9kdWN0LnRodW1iX3Bob3RvX3VybH0pXG4gICAgICAgICAgKSwgXG4gICAgXHQgICAgUmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcInByb2R1Y3RUaXRsZVwifSwgXCIgXCIsIHByb2R1Y3QudGl0bGUsIFwiIFwiKSwgXG4gICAgXHQgICAgUmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcInByb2R1Y3RQcmljZVwifSwgXCIgXCIsIHByb2R1Y3QucHJpY2UpLCBcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwicHJvZHVjdFNoaXBwaW5nXCJ9LCBzaGlwcGluZyksIFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJicmFuZExvZ29cIn0sIFxuICAgIFx0ICAgICAgUmVhY3QuRE9NLmltZyh7Y2xhc3NOYW1lOiBcImJyYW5kTG9nb1wiLCBzcmM6IHByb2R1Y3QubWVyY2hhbnRfbG9nb191cmx9KVxuICAgICAgICAgICksIFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJwcm9kdWN0TW9yZVwifSwgXG4gICAgXHQgICAgICBSZWFjdC5ET00uYnV0dG9uKG51bGwsIFwiIFNob3cgTW9yZSBcIilcbiAgICAgICAgICApXG4gICAgXHQgIClcbiAgICAgIClcbiAgICApXG4gIH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvZHVjdEl0ZW07IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFByb2R1Y3RJdGVtID0gcmVxdWlyZSgnLi9Qcm9kdWN0SXRlbScpO1xudmFyIFByb2R1Y3RMaXN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnUHJvZHVjdExpc3RDb250YWluZXInLFxuLy8gV2UgbmVlZCB0byBjcmVhdGUgYSBkaXYgZm9yIGVhY2ggcHJvZHVjdCB3aGljaFxuLy8gY2FuIGJlIGFjaGlldmVkIHZpYSBtYXBwaW5nIDopXG4gIHJlbmRlcjogZnVuY3Rpb24oKXtcbiAgXHR2YXIgcHJvZHVjdHMgPSB0aGlzLnByb3BzLnByb2R1Y3RzO1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KG51bGwsIFxuICAgICAgICBwcm9kdWN0cy5tYXAoZnVuY3Rpb24oaXRlbSwgaW5kZXgpe1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAvL2VhY2ggZGl2IG5lZWRzIGEgdW5xaXVlIGtleVxuICAgIFx0ICAgICAgUmVhY3QuRE9NLnNlY3Rpb24oe2tleTogaXRlbS5pdGVtX2lkLCBjbGFzc05hbWU6IFwicHJvZHVjdENvbnRhaW5lclwifSwgXG4gICAgXHQgICAgICAgIFByb2R1Y3RJdGVtKHtkYXRhOiBpdGVtfSlcbiAgICBcdCAgICAgIClcbiAgICBcdCAgICApXG4gICAgICAgIH0pXG4gICAgICApXG5cdClcbiAgfVxufSk7XG5tb2R1bGUuZXhwb3J0cyA9IFByb2R1Y3RMaXN0Q29udGFpbmVyO1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cInVzZSBzdHJpY3RcIjtcbi8vVGhlIGVudHJ5IHBvaW50IHRvIHRoZSBjbGllbnRzaWRlIGFwcGxpY2F0aW9uXG4oZnVuY3Rpb24oKXtcbiBcbiAgdmFyIHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiU2VhcmNoQnV0dG9uXCIpO1xuICB2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuICB2YXIgUHJvZHVjdExpc3RDb250YWluZXIgPSByZXF1aXJlKCcuL0NvbXBvbmVudHMvUHJvZHVjdExpc3RDb250YWluZXInKTtcbiAgdmFyIExvYWRpbmdDb21wb25lbnQgPSByZXF1aXJlKCcuL0NvbXBvbmVudHMvTG9hZGluZ0NvbXBvbmVudCcpO1xuICB2YXIgUHJldmlvdXNSZXN1bHRzID0gcmVxdWlyZSgnLi9saWIvUHJldmlvdXNSZXN1bHRzJyk7XG4gIHZhciBDYWNoZWRQcm9kdWN0cyA9IHJlcXVpcmUoJy4vQ29tcG9uZW50cy9DYWNoZWRQcm9kdWN0cycpO1xuICB2YXIgRXJyb3JDb21wb25lbnQgPSByZXF1aXJlKCcuL0NvbXBvbmVudHMvRXJyb3JDb21wb25lbnQnKTtcbiAgdmFyIHByZXZpb3VzUmVzdWx0cyA9IG5ldyBQcmV2aW91c1Jlc3VsdHMoKTtcbiAgXG4gIHN1Ym1pdEJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oZSl7XG4gICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAvL1dlIG5lZWQgdG8gY3JlYXRlIHRoaXMgZXZlcnl0aW1lIHRoZSBib3ggaXMgY2xpY2tlZFxuICAgIHZhciBzZWFyY2hWYWx1ZSAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlByb2R1Y3RJbnB1dFwiKS52YWx1ZTtcblxuICAgIGlmKHNlYXJjaFZhbHVlKXtcbiAgICAgIC8vc3RvcmUgdGhlIHZhbHVlIHdlIGp1c3Qgc2VhcmNoZWQgZm9yXG4gICAgICB2YXIgY2FjaGVkU2VhcmNoID0gcHJldmlvdXNSZXN1bHRzLmNoZWNrU3RvcmFnZShzZWFyY2hWYWx1ZSk7XG4gICAgICAvL2Rpc3BsYXkgbG9hZGluZ1xuICAgICAgUmVhY3QucmVuZGVyQ29tcG9uZW50KExvYWRpbmdDb21wb25lbnQobnVsbCkgLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnQ29udGVudCcpKTtcbiAgICAgIC8vSWYgd2UgaGF2ZSBwcmV2aW91cyByZXN1bHRzLCBzaG93IHRoZW0hXG4gICAgICBpZihjYWNoZWRTZWFyY2ggIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIFJlYWN0LnJlbmRlckNvbXBvbmVudChDYWNoZWRQcm9kdWN0cyh7Y2FjaGVkOiBjYWNoZWRTZWFyY2h9KSAsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdDYWNoZWRDb250ZW50JykpO1xuICAgICAgfVxuICAgICAgLy9zZW5kIHRoZSByZXF1ZXN0XG4gICAgICBzZW5kUmVxdWVzdChzZWFyY2hWYWx1ZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIC8vS2VlcCBtZW1lb3J5IG9mIHRoZSAxc3QgcHJvZHVjdCByZXR1cm5lZFxuICAgICAgICB2YXIgc29vblRvQmVDYWNoZWQgPSB7XG4gICAgICAgICAgcHJvZHVjdDogcmVzcG9uc2VbMF1cbiAgICAgICAgfTtcbiAgICAgICAgcHJldmlvdXNSZXN1bHRzLmFkZFNlYXJjaFRlcm1zKHNlYXJjaFZhbHVlICwgcmVzcG9uc2VbMF0pO1xuICAgICAgICAvLyBKdXN0IGZvciBkZW1vIHB1cnBvc2VzXG4gICAgICAgIC8vIHRvIHNpbXVsYXRlIHRoZSByZWxhdGVkIHByb2R1Y3Qgc2VhcmNoXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICBSZWFjdC51bm1vdW50Q29tcG9uZW50QXROb2RlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdDYWNoZWRDb250ZW50JykpO1xuICBcdCAgICAgIFJlYWN0LnJlbmRlckNvbXBvbmVudChQcm9kdWN0TGlzdENvbnRhaW5lcih7cHJvZHVjdHM6IHJlc3BvbnNlfSkgLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnQ29udGVudCcpKTtcbiAgICAgICAgfSAsIDEwMDApOyAvLyBBZGQncyB0d28gc2Vjb25kcyBsb25nZXIgdGhhbiB3aGF0IHdlIHdhbnQganVzdCBmb3IgZGVtb1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuICBcdCAgICAgUmVhY3QucmVuZGVyQ29tcG9uZW50KEVycm9yQ29tcG9uZW50KHtlcnJvck1lc3NhZ2U6IGVycm9yfSkgLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnQ29udGVudCcpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICpAUGFyYW06IFRoZSBwcm9kdWN0IHRoZSB1c2VyIGlzIHNlYXJjaGluZ1xuICAqQFJldHVybjogQSBwcm9taXNlIHdoaWNoIHdpbGwgZXhlY3V0ZSB0aGUgcXVlcnkgaW4gXG4gICogYW4gYXN5bmNocm9ub3VzIGZhc2hpb24hXG4gICovXG4gIGZ1bmN0aW9uIHNlbmRSZXF1ZXN0KHF1ZXJ5KXtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIC8vQnVpbGQgdXAgdGhlIHJlcXVlc3RcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIGNvbnNvbGUubG9nKFwidGVzdGluZ1wiKTtcbiAgICAgIHZhciB1cmwgPSAncHJvZHVjdGZlZWR0ZXN0LndhbmRvc28uY29tLz9rZXl3b3JkPScgKyBxdWVyeSxcbiAgICAgICAgICByZXN1bHQ7XG4gICAgICB4aHIub3BlbignR0VUJyAsIHVybCwgdHJ1ZSk7XG4gICAgICAvL1N1Y2Nlc3MhISFcbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbihlKXtcbiAgICAgICAgaWYodGhpcy5zdGF0dXMgPT09IDIwMCl7XG4gICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICAvL05vIGl0ZW1zIGZvdW5kIGNhc2VcbiAgICAgICAgICBpZihyZXN1bHQuaXRlbXMubGVuZ3RoIDw9IDApe1xuICAgICAgICAgICAgcmVqZWN0KFwiU29ycnkgbm8gcHJvZHVjdHMgbWF0Y2hlZCB5b3VyIHNlYXJjaFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQuaXRlbXMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgLy9Tb21ldGhpbmcgdmVyeSBzdHJhbmdlIGdvaW5nIG9uIGlmIHdlIGxhbmQgaGVyZVxuICAgICAgeGhyLmVycm9yID0gZnVuY3Rpb24oZSl7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICAgIC8vU2VuZCB0aGUgcmVxdWVzdCAhXG4gICAgICB4aHIuc2VuZCgpO1xuICAgIH0pO1xuICB9O1xufSgpKTsiLCIvL1dlIGNvdWxkIGFkZCBzdHVmZiB0byB0aGlzIGNvbnN0cnVjdG9yXG4vL0J1dCBub3cgd2Ugd2lsbCBsZWF2ZSBpdCBhcyBibGFua1xudmFyIFByZXZpb3VzUmVzdWx0cyA9IGZ1bmN0aW9uKCl7XG4gIFxufVxuXG4vLyBTYXZlIHRoZSAxc3QgaXRlbSB3aXRoaW4gdGhlIGxvY2Fsc3RvcmFnZVxuUHJldmlvdXNSZXN1bHRzLnByb3RvdHlwZS5hZGRTZWFyY2hUZXJtcyA9IGZ1bmN0aW9uKHNlYXJjaCwgcmVzdWx0KXtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc2VhcmNoICwgSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XG59XG5cbi8vTG9vcCB0aHJvdWdoIHRoZSBsb2NhbHN0cm9hZ2UgdG8gc2VlIGlmIHRoZSBzZWFyY2ggdGVybSBleGlzdHMgXG5QcmV2aW91c1Jlc3VsdHMucHJvdG90eXBlLmNoZWNrU3RvcmFnZSA9IGZ1bmN0aW9uKGl0ZW0pe1xuICB2YXIgaTtcbiAgZm9yKHZhciBrZXkgaW4gbG9jYWxTdG9yYWdlKXtcbiAgICBpZihpdGVtLmluZGV4T2Yoa2V5KSA+IC0xKXtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Vba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFByZXZpb3VzUmVzdWx0czsiXX0=
