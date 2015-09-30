/** @jsx React.DOM */
var React = require('react');

var CachedProducts = React.createClass({
  //The div that will appear during loading if
  // the product exists within the localstorage
  render: function(){
  	var product = JSON.parse(this.props.cached);
    return (
      <section className="relatedResults">
      <h1>Previously Related Items </h1>
      <div className="productSection">
          <div className="productImage">
            <img src={product.thumb_photo_url}></img>
          </div>
          <div className="productTitle"> {product.title} </div>
          <div className="productPrice"> {product.price}</div>
          <div className="brandLogo">
            <img className="brandLogo" src={product.merchant_logo_url}></img>
          </div>
          <div className="productMore">
            <button> Show More </button>
          </div>
        </div>

      </section>
	  )
  }
});

module.exports = CachedProducts;
