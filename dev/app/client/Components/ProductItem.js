/** @jsx React.DOM */
var React = require('react');
var ProductItem = React.createClass({

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
      <a href={product.click_out_link}>
    	  <div className="productSection">
          <div className="productImage">
    	      <img src={product.thumb_photo_url}></img>
          </div>
    	    <div className="productTitle"> {product.title} </div>
    	    <div className="productPrice"> {product.price}</div>
          <div className="productShipping">{shipping}</div>
          <div className="brandLogo">
    	      <img className="brandLogo" src={product.merchant_logo_url}></img>
          </div>
          <div className="productMore">
    	      <button> Show More </button>
          </div>
    	  </div>
      </a>
    )
  }

});

module.exports = ProductItem;