/** @jsx React.DOM */
var React = require('react');

var ErrorComponent = React.createClass({
  //If something goes wrong show the message!
  render: function(){
  	var message = this.props.errorMessage;
    return (
      <section className="errorContainer">
       <h1>{message}</h1>
      </section>
	  )
  }
});

module.exports = ErrorComponent;
