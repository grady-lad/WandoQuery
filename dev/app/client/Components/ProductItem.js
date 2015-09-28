/** @jsx React.DOM */
var React = require('react');
var ProductItem = React.createClass({


  calculateShipping: function(){
  	//Need to add a switch statement here to
  	// find the shipping value
  },
  //Need to fix the link problem
  render: function(){
  	var product = this.props.data;
  	var shipping = product.shipping_price !== null ? product.shipping_price : "free shipping";
    return (
    	<div>
    	  <a href ={product.click_out_link}>
    	    <img src={product.thumb_photo_url}></img>
    	    <p> {product.title} </p>
    	    <p> {product.price}</p>
    	    <img className="brandLogo" src={product.merchant_logo_url}></img>
    	    <p>{shipping}</p>
    	    <button> show more :L </button>
    	  </a>
    	</div>
    )
  }

});


module.exports = ProductItem;