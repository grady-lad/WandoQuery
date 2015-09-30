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
        } , 2000); // Add's two seconds longer than what we want
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
      var url = 'http://productfeedtest.wandoso.com/?keyword=' + query,
          result;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9tYXJ0aW4vRG9jdW1lbnRzL0phdmFzY3JpcHQtV29ya3NwYWNlL1dhbmRvUXVlcnkvZGV2L2FwcC9jbGllbnQvQ29tcG9uZW50cy9DYWNoZWRQcm9kdWN0cy5qcyIsIi9ob21lL21hcnRpbi9Eb2N1bWVudHMvSmF2YXNjcmlwdC1Xb3Jrc3BhY2UvV2FuZG9RdWVyeS9kZXYvYXBwL2NsaWVudC9Db21wb25lbnRzL0Vycm9yQ29tcG9uZW50LmpzIiwiL2hvbWUvbWFydGluL0RvY3VtZW50cy9KYXZhc2NyaXB0LVdvcmtzcGFjZS9XYW5kb1F1ZXJ5L2Rldi9hcHAvY2xpZW50L0NvbXBvbmVudHMvTG9hZGluZ0NvbXBvbmVudC5qcyIsIi9ob21lL21hcnRpbi9Eb2N1bWVudHMvSmF2YXNjcmlwdC1Xb3Jrc3BhY2UvV2FuZG9RdWVyeS9kZXYvYXBwL2NsaWVudC9Db21wb25lbnRzL1Byb2R1Y3RJdGVtLmpzIiwiL2hvbWUvbWFydGluL0RvY3VtZW50cy9KYXZhc2NyaXB0LVdvcmtzcGFjZS9XYW5kb1F1ZXJ5L2Rldi9hcHAvY2xpZW50L0NvbXBvbmVudHMvUHJvZHVjdExpc3RDb250YWluZXIuanMiLCIvaG9tZS9tYXJ0aW4vRG9jdW1lbnRzL0phdmFzY3JpcHQtV29ya3NwYWNlL1dhbmRvUXVlcnkvZGV2L2FwcC9jbGllbnQvaW5pdC5qcyIsIi9ob21lL21hcnRpbi9Eb2N1bWVudHMvSmF2YXNjcmlwdC1Xb3Jrc3BhY2UvV2FuZG9RdWVyeS9kZXYvYXBwL2NsaWVudC9saWIvUHJldmlvdXNSZXN1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIENhY2hlZFByb2R1Y3RzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnQ2FjaGVkUHJvZHVjdHMnLFxuICAvL1RoZSBkaXYgdGhhdCB3aWxsIGFwcGVhciBkdXJpbmcgbG9hZGluZyBpZlxuICAvLyB0aGUgcHJvZHVjdCBleGlzdHMgd2l0aGluIHRoZSBsb2NhbHN0b3JhZ2VcbiAgcmVuZGVyOiBmdW5jdGlvbigpe1xuICBcdHZhciBwcm9kdWN0ID0gSlNPTi5wYXJzZSh0aGlzLnByb3BzLmNhY2hlZCk7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5zZWN0aW9uKHtjbGFzc05hbWU6IFwicmVsYXRlZFJlc3VsdHNcIn0sIFxuICAgICAgUmVhY3QuRE9NLmgxKG51bGwsIFwiUHJldmlvdXNseSBSZWxhdGVkIEl0ZW1zIFwiKSwgXG4gICAgICBSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwicHJvZHVjdFNlY3Rpb25cIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJwcm9kdWN0SW1hZ2VcIn0sIFxuICAgICAgICAgICAgUmVhY3QuRE9NLmltZyh7c3JjOiBwcm9kdWN0LnRodW1iX3Bob3RvX3VybH0pXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcInByb2R1Y3RUaXRsZVwifSwgXCIgXCIsIHByb2R1Y3QudGl0bGUsIFwiIFwiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcInByb2R1Y3RQcmljZVwifSwgXCIgXCIsIHByb2R1Y3QucHJpY2UpLCBcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiYnJhbmRMb2dvXCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5pbWcoe2NsYXNzTmFtZTogXCJicmFuZExvZ29cIiwgc3JjOiBwcm9kdWN0Lm1lcmNoYW50X2xvZ29fdXJsfSlcbiAgICAgICAgICApLCBcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwicHJvZHVjdE1vcmVcIn0sIFxuICAgICAgICAgICAgUmVhY3QuRE9NLmJ1dHRvbihudWxsLCBcIiBTaG93IE1vcmUgXCIpXG4gICAgICAgICAgKVxuICAgICAgICApXG5cbiAgICAgIClcblx0ICApXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhY2hlZFByb2R1Y3RzO1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgRXJyb3JDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdFcnJvckNvbXBvbmVudCcsXG4gIC8vSWYgc29tZXRoaW5nIGdvZXMgd3Jvbmcgc2hvdyB0aGUgbWVzc2FnZSFcbiAgcmVuZGVyOiBmdW5jdGlvbigpe1xuICBcdHZhciBtZXNzYWdlID0gdGhpcy5wcm9wcy5lcnJvck1lc3NhZ2U7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5zZWN0aW9uKHtjbGFzc05hbWU6IFwiZXJyb3JDb250YWluZXJcIn0sIFxuICAgICAgIFJlYWN0LkRPTS5oMShudWxsLCBtZXNzYWdlKVxuICAgICAgKVxuXHQgIClcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXJyb3JDb21wb25lbnQ7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgTG9hZGluZ0NvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0xvYWRpbmdDb21wb25lbnQnLFxuIC8vUGxhY2Vob2xkZXIgZm9yIG91ciBzcGlubmVyIChpdHMgYWxsIGRvbmUgdmlhIGNzcylcbiAgcmVuZGVyOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwic3Bpbm5lclwifVxuICAgICAgKVxuXHQpXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRpbmdDb21wb25lbnQ7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUHJvZHVjdEl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdQcm9kdWN0SXRlbScsXG5cbiAgLyoqIFdoYXQgdG8gZGlzcGxheSBmb3IgdGhlIHNoaXBwaW5nIGNvc3RzKiovXG4gIGNhbGN1bGF0ZVNoaXBwaW5nOiBmdW5jdGlvbihzaGlwKXtcbiAgICBpZih0eXBlb2Ygc2hpcCA9PT0gJ29iamVjdCcpe1xuICAgICAgcmV0dXJuIFwiKyBzaGlwcGluZyBjb3N0c1wiXG4gICAgfVxuICAgIGlmKHNoaXAgPT09IFwiJDAuMDBcIil7XG4gICAgICByZXR1cm4gXCJmcmVlIHNoaXBwaW5nXCI7XG4gICAgfWVsc2V7XG4gICAgICByZXR1cm4gXCIrIFwiICsgc2hpcCArIFwiIHNoaXBwaW5nXCI7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpe1xuICBcdHZhciBwcm9kdWN0ID0gdGhpcy5wcm9wcy5kYXRhO1xuICBcdHZhciBzaGlwcGluZyA9IHRoaXMuY2FsY3VsYXRlU2hpcHBpbmcocHJvZHVjdC5zaGlwcGluZ19wcmljZSk7XG4gICAgLy8gVGhlIHByb2R1Y3QgaXRlbSBkaXZcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmEoe2hyZWY6IHByb2R1Y3QuY2xpY2tfb3V0X2xpbmt9LCBcbiAgICBcdCAgUmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcInByb2R1Y3RTZWN0aW9uXCJ9LCBcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwicHJvZHVjdEltYWdlXCJ9LCBcbiAgICBcdCAgICAgIFJlYWN0LkRPTS5pbWcoe3NyYzogcHJvZHVjdC50aHVtYl9waG90b191cmx9KVxuICAgICAgICAgICksIFxuICAgIFx0ICAgIFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJwcm9kdWN0VGl0bGVcIn0sIFwiIFwiLCBwcm9kdWN0LnRpdGxlLCBcIiBcIiksIFxuICAgIFx0ICAgIFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJwcm9kdWN0UHJpY2VcIn0sIFwiIFwiLCBwcm9kdWN0LnByaWNlKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcInByb2R1Y3RTaGlwcGluZ1wifSwgc2hpcHBpbmcpLCBcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiYnJhbmRMb2dvXCJ9LCBcbiAgICBcdCAgICAgIFJlYWN0LkRPTS5pbWcoe2NsYXNzTmFtZTogXCJicmFuZExvZ29cIiwgc3JjOiBwcm9kdWN0Lm1lcmNoYW50X2xvZ29fdXJsfSlcbiAgICAgICAgICApLCBcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwicHJvZHVjdE1vcmVcIn0sIFxuICAgIFx0ICAgICAgUmVhY3QuRE9NLmJ1dHRvbihudWxsLCBcIiBTaG93IE1vcmUgXCIpXG4gICAgICAgICAgKVxuICAgIFx0ICApXG4gICAgICApXG4gICAgKVxuICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2R1Y3RJdGVtOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBQcm9kdWN0SXRlbSA9IHJlcXVpcmUoJy4vUHJvZHVjdEl0ZW0nKTtcbnZhciBQcm9kdWN0TGlzdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ1Byb2R1Y3RMaXN0Q29udGFpbmVyJyxcbi8vIFdlIG5lZWQgdG8gY3JlYXRlIGEgZGl2IGZvciBlYWNoIHByb2R1Y3Qgd2hpY2hcbi8vIGNhbiBiZSBhY2hpZXZlZCB2aWEgbWFwcGluZyA6KVxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gIFx0dmFyIHByb2R1Y3RzID0gdGhpcy5wcm9wcy5wcm9kdWN0cztcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdihudWxsLCBcbiAgICAgICAgcHJvZHVjdHMubWFwKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KXtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgLy9lYWNoIGRpdiBuZWVkcyBhIHVucWl1ZSBrZXlcbiAgICBcdCAgICAgIFJlYWN0LkRPTS5zZWN0aW9uKHtrZXk6IGl0ZW0uaXRlbV9pZCwgY2xhc3NOYW1lOiBcInByb2R1Y3RDb250YWluZXJcIn0sIFxuICAgIFx0ICAgICAgICBQcm9kdWN0SXRlbSh7ZGF0YTogaXRlbX0pXG4gICAgXHQgICAgICApXG4gICAgXHQgICAgKVxuICAgICAgICB9KVxuICAgICAgKVxuXHQpXG4gIH1cbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBQcm9kdWN0TGlzdENvbnRhaW5lcjtcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG4vL1RoZSBlbnRyeSBwb2ludCB0byB0aGUgY2xpZW50c2lkZSBhcHBsaWNhdGlvblxuKGZ1bmN0aW9uKCl7XG4gXG4gIHZhciBzdWJtaXRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlNlYXJjaEJ1dHRvblwiKTtcbiAgdmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbiAgdmFyIFByb2R1Y3RMaXN0Q29udGFpbmVyID0gcmVxdWlyZSgnLi9Db21wb25lbnRzL1Byb2R1Y3RMaXN0Q29udGFpbmVyJyk7XG4gIHZhciBMb2FkaW5nQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9Db21wb25lbnRzL0xvYWRpbmdDb21wb25lbnQnKTtcbiAgdmFyIFByZXZpb3VzUmVzdWx0cyA9IHJlcXVpcmUoJy4vbGliL1ByZXZpb3VzUmVzdWx0cycpO1xuICB2YXIgQ2FjaGVkUHJvZHVjdHMgPSByZXF1aXJlKCcuL0NvbXBvbmVudHMvQ2FjaGVkUHJvZHVjdHMnKTtcbiAgdmFyIEVycm9yQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9Db21wb25lbnRzL0Vycm9yQ29tcG9uZW50Jyk7XG4gIHZhciBwcmV2aW91c1Jlc3VsdHMgPSBuZXcgUHJldmlvdXNSZXN1bHRzKCk7XG4gIFxuICBzdWJtaXRCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uKGUpe1xuICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgLy9XZSBuZWVkIHRvIGNyZWF0ZSB0aGlzIGV2ZXJ5dGltZSB0aGUgYm94IGlzIGNsaWNrZWRcbiAgICB2YXIgc2VhcmNoVmFsdWUgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJQcm9kdWN0SW5wdXRcIikudmFsdWU7XG5cbiAgICBpZihzZWFyY2hWYWx1ZSl7XG4gICAgICAvL3N0b3JlIHRoZSB2YWx1ZSB3ZSBqdXN0IHNlYXJjaGVkIGZvclxuICAgICAgdmFyIGNhY2hlZFNlYXJjaCA9IHByZXZpb3VzUmVzdWx0cy5jaGVja1N0b3JhZ2Uoc2VhcmNoVmFsdWUpO1xuICAgICAgLy9kaXNwbGF5IGxvYWRpbmdcbiAgICAgIFJlYWN0LnJlbmRlckNvbXBvbmVudChMb2FkaW5nQ29tcG9uZW50KG51bGwpICwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0NvbnRlbnQnKSk7XG4gICAgICAvL0lmIHdlIGhhdmUgcHJldmlvdXMgcmVzdWx0cywgc2hvdyB0aGVtIVxuICAgICAgaWYoY2FjaGVkU2VhcmNoICE9PSB1bmRlZmluZWQpe1xuICAgICAgICBSZWFjdC5yZW5kZXJDb21wb25lbnQoQ2FjaGVkUHJvZHVjdHMoe2NhY2hlZDogY2FjaGVkU2VhcmNofSkgLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnQ2FjaGVkQ29udGVudCcpKTtcbiAgICAgIH1cbiAgICAgIC8vc2VuZCB0aGUgcmVxdWVzdFxuICAgICAgc2VuZFJlcXVlc3Qoc2VhcmNoVmFsdWUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAvL0tlZXAgbWVtZW9yeSBvZiB0aGUgMXN0IHByb2R1Y3QgcmV0dXJuZWRcbiAgICAgICAgdmFyIHNvb25Ub0JlQ2FjaGVkID0ge1xuICAgICAgICAgIHByb2R1Y3Q6IHJlc3BvbnNlWzBdXG4gICAgICAgIH07XG4gICAgICAgIHByZXZpb3VzUmVzdWx0cy5hZGRTZWFyY2hUZXJtcyhzZWFyY2hWYWx1ZSAsIHJlc3BvbnNlWzBdKTtcbiAgICAgICAgLy8gSnVzdCBmb3IgZGVtbyBwdXJwb3Nlc1xuICAgICAgICAvLyB0byBzaW11bGF0ZSB0aGUgcmVsYXRlZCBwcm9kdWN0IHNlYXJjaFxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgUmVhY3QudW5tb3VudENvbXBvbmVudEF0Tm9kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnQ2FjaGVkQ29udGVudCcpKTtcbiAgXHQgICAgICBSZWFjdC5yZW5kZXJDb21wb25lbnQoUHJvZHVjdExpc3RDb250YWluZXIoe3Byb2R1Y3RzOiByZXNwb25zZX0pICwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0NvbnRlbnQnKSk7XG4gICAgICAgIH0gLCAyMDAwKTsgLy8gQWRkJ3MgdHdvIHNlY29uZHMgbG9uZ2VyIHRoYW4gd2hhdCB3ZSB3YW50XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG4gIFx0ICAgICBSZWFjdC5yZW5kZXJDb21wb25lbnQoRXJyb3JDb21wb25lbnQoe2Vycm9yTWVzc2FnZTogZXJyb3J9KSAsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdDb250ZW50JykpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgKkBQYXJhbTogVGhlIHByb2R1Y3QgdGhlIHVzZXIgaXMgc2VhcmNoaW5nXG4gICpAUmV0dXJuOiBBIHByb21pc2Ugd2hpY2ggd2lsbCBleGVjdXRlIHRoZSBxdWVyeSBpbiBcbiAgKiBhbiBhc3luY2hyb25vdXMgZmFzaGlvbiFcbiAgKi9cbiAgZnVuY3Rpb24gc2VuZFJlcXVlc3QocXVlcnkpe1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgLy9CdWlsZCB1cCB0aGUgcmVxdWVzdFxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgdmFyIHVybCA9ICdodHRwOi8vcHJvZHVjdGZlZWR0ZXN0LndhbmRvc28uY29tLz9rZXl3b3JkPScgKyBxdWVyeSxcbiAgICAgICAgICByZXN1bHQ7XG4gICAgICB4aHIub3BlbignR0VUJyAsIHVybCk7XG4gICAgICAvL1N1Y2Nlc3MhISFcbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbihlKXtcbiAgICAgICAgaWYodGhpcy5zdGF0dXMgPT09IDIwMCl7XG4gICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICAvL05vIGl0ZW1zIGZvdW5kIGNhc2VcbiAgICAgICAgICBpZihyZXN1bHQuaXRlbXMubGVuZ3RoIDw9IDApe1xuICAgICAgICAgICAgcmVqZWN0KFwiU29ycnkgbm8gcHJvZHVjdHMgbWF0Y2hlZCB5b3VyIHNlYXJjaFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQuaXRlbXMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgLy9Tb21ldGhpbmcgdmVyeSBzdHJhbmdlIGdvaW5nIG9uIGlmIHdlIGxhbmQgaGVyZVxuICAgICAgeGhyLmVycm9yID0gZnVuY3Rpb24oZSl7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICAgIC8vU2VuZCB0aGUgcmVxdWVzdCAhXG4gICAgICB4aHIuc2VuZCgpO1xuICAgIH0pO1xuICB9O1xufSgpKTsiLCIvL1dlIGNvdWxkIGFkZCBzdHVmZiB0byB0aGlzIGNvbnN0cnVjdG9yXG4vL0J1dCBub3cgd2Ugd2lsbCBsZWF2ZSBpdCBhcyBibGFua1xudmFyIFByZXZpb3VzUmVzdWx0cyA9IGZ1bmN0aW9uKCl7XG4gIFxufVxuXG4vLyBTYXZlIHRoZSAxc3QgaXRlbSB3aXRoaW4gdGhlIGxvY2Fsc3RvcmFnZVxuUHJldmlvdXNSZXN1bHRzLnByb3RvdHlwZS5hZGRTZWFyY2hUZXJtcyA9IGZ1bmN0aW9uKHNlYXJjaCwgcmVzdWx0KXtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc2VhcmNoICwgSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XG59XG5cbi8vTG9vcCB0aHJvdWdoIHRoZSBsb2NhbHN0cm9hZ2UgdG8gc2VlIGlmIHRoZSBzZWFyY2ggdGVybSBleGlzdHMgXG5QcmV2aW91c1Jlc3VsdHMucHJvdG90eXBlLmNoZWNrU3RvcmFnZSA9IGZ1bmN0aW9uKGl0ZW0pe1xuICB2YXIgaTtcbiAgZm9yKHZhciBrZXkgaW4gbG9jYWxTdG9yYWdlKXtcbiAgICBpZihpdGVtLmluZGV4T2Yoa2V5KSA+IC0xKXtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Vba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFByZXZpb3VzUmVzdWx0czsiXX0=
