/** @jsx React.DOM */
var React = require('react');
var ProductItem = require('./ProductItem');
var ProductListContainer = React.createClass({
// We need to create a div for each product which
// can be achieved via mapping :)
  render: function(){
  	var products = this.props.products;
    return (
      <div>
        {products.map(function(item, index){
          return (
            //each div needs a unqiue key
    	      <section key={item.item_id} className="productContainer">
    	        <ProductItem data={item}/>
    	      </section>
    	    )
        })}
      </div>
	)
  }
});
module.exports = ProductListContainer;
