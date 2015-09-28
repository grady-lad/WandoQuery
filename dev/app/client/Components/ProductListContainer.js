/** @jsx React.DOM */
var React = require('react');
var ProductItem = require('./ProductItem');
var ProductListContainer = React.createClass({

  render: function(){
  	var products = this.props.products;
    return (
      <div>
        {products.map(function(item, index){
          return (
    	    <section key={item.item_id} className="productSection">
    	      <ProductItem data={item}/>
    	    </section>
    	  )
        })}
      </div>
	)
  }
});

module.exports = ProductListContainer;
