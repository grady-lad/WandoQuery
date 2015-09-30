/** @jsx React.DOM */
var React = require('react');
var LoadingComponent = React.createClass({
 //Placeholder for our spinner (its all done via css)
  render: function(){
    return (
      <div className="spinner">
      </div>
	)
  }
});

module.exports = LoadingComponent;
