/**
 * @jsx React.DOM
 */

var React = require('react');
var Button = require('react-bootstrap/Button');
var Panel = require('react-bootstrap/Panel');
var ProgramObject = require('../Program.js');
var Element2D = require('./Element2D');



module.exports = React.createClass({

  // this.props should have an array of the program states

  // 
  getInitialState: function() {
    console.log('buildState result');
    console.log(ProgramObject.buildState(3));
    return { currentState: ProgramObject.buildState(0) };
  },

  compile: function () {
    Actions.compile();
  },

  previousState: function() {
    this.setState({currentState: ProgramObject.previousState()});
    this.programState = ProgramObject.previousState();
  },

  nextState: function() {
    this.setState({currentState: ProgramObject.nextState()});
    this.programState = ProgramObject.previousState();
  },

  render: function () {
    var Elements2D = [];
    for (var key in this.state.currentState) {
      if (key !== 'index') {
        Elements2D.push(this.state.currentState[key]);  
      }
    }

    var node = null;

    if (this.props.type === 'number') {
      node = <div className='number'>this.props.value</div>

    } else if (this.props.type === 'string') {
      node = <div className='string'>this.props.value</div>
    } else if (this.props.type === 'boolean') {
      node = <div className='boolean'>this.props.value</div>
    } else if (this.props.type === 'string') {
      node = <div className='for'>this.props.value</div>
    } 
    // else if (this.props.type === 'string') {
    // } else if (this.props.type === 'string') {  
    // }

    // append to its container


    return (
      <Panel>
        <div className='global-container'>

        </div>
        {node}
      </Panel>
    );
  }
});
