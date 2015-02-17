/**
 * @jsx React.DOM
 */

 // Visual3D.js

var React = require('react');
// import threejs scene
// var ThreeJS = require('pathToFile');

module.exports = React.createClass({

  componentDidMount: function() {
    // ThreeJS.displayScene(this.props.data);
  },

  render: function() {
    return (
      <div id="three-scene" data={this.props.data} />
    );
  }
});

