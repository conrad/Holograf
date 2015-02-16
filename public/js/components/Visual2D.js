/**
 * @jsx React.DOM
 */

var React = require('react');
var Button = require('react-bootstrap/Button');
var Panel = require('react-bootstrap/Panel');
var ProgramObject = require('../Program.js');
// var 2DCanvas = require('./2DCanvas.js');
var Element2D = require('./Element2D');
// var Famous = require(./Famous.js);
// var Engine = require('../famous/src/core/Engine');
// var Surface = require('../famous/src/core/Surface');



// require(['../famous/src/core/Engine', 'src/core/Surface', 'src/core/Transform', 'src/modifiers/StateModifier', '../utils/Program.js'], function (Engine, Surface, Transform, StateModifier, Program) {

  // var mainContext = Engine.createContext();

  // createSurface();
  // createModifiedSurface();

  // function createSurface() {
  //   var surface = new Surface({
  //     size: [100, 100],
  //     content: 'surface',
  //     properties: {
  //       color: 'white',
  //       textAlign: 'center',
  //       backgroundColor: '#FA5C4F'
  //     }
  //   });

  //   mainContext.add(surface);
  // }

  // function createModifiedSurface() {
  //   var modifiedSurface = new Surface({
  //     size: [true, true],
  //     content: 'modified surface',
  //     properties: {
  //       color: 'white',
  //       textAlign: 'center',
  //       backgroundColor: '#FA5C4F'
  //     }
  //   });
  //   var stateModifier = new StateModifier({
  //     transform: Transform.translate(150, 100, 0)
  //   });
  //   mainContext.add(stateModifier).add(modifiedSurface);
  // }
// });



module.exports = React.createClass({

  // this.props should have an array of the program states

  compile: function () {
    Actions.compile();
  },

  previousState: function() {
  },

  nextState: function() {
  },

  render: function () {
    // var Elements2D = [];
    // for (var key in this.state.currentState) {
    //   if (key !== 'index') {
    //     Elements2D.push(this.state.currentState[key]);  
    //   }
    // }


    // var node = null;

    // if (this.props.type === 'number') {
    //   node = <div className='number'>this.props.value</div>

    // } else if (this.props.type === 'string') {
    //   node = <div className='string'>this.props.value</div>
    // } else if (this.props.type === 'boolean') {
    //   node = <div className='boolean'>this.props.value</div>
    // } else if (this.props.type === 'string') {
    //   node = <div className='for'>this.props.value</div>
    // } 
    // else if (this.props.type === 'string') {
    // } else if (this.props.type === 'string') {  
    // }


    // append to its container

    // <div className='global-container'>
    //   {node}
    // </div>



    return (
      <Panel>
      </Panel>
    );
  }
});
        // <Famous />

// <2DCanvas id='raphael-canvas' {...this.props} />;