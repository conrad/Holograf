/**
 * @jsx React.DOM
 */

var React = require('react');
var Button = require('react-bootstrap/Button');
var Panel = require('react-bootstrap/Panel');
var Program = require('../utils/Program.js');
var Thing = require('./Thing.js')
// var CodeMirror = require('./CodeMirror/');
// var Actions = require('../actions/Actions');


module.exports = React.createClass({

  // this.props should have an array of the program states/steps

  compile: function () {
    Actions.compile();
  },


  previousStep: function() {
    this.setState({currentStep: Program.previousStep()});
    this.programState = Program.previousStep();
  },

  nextStep: function() {
    this.setState({currentStep: Program.nextStep()});
    this.programState = Program.previousStep();
  },

  render: function () {

    var displayThings = [];

    for (var key in this.state.currentStep) {
      if (key !== 'index') {
        displayThings.push(<li><Thing {...this.state.currentStep[key]} /></li>);  
      }
    }

    return (
      <div>
        <Panel>
          <ul>
            {displayThings}
          </ul>
        </Panel>
        <Button bsStyle="primary" className={'pull-left'} onClick={this.previousStep} >Prev</Button>
        <Button bsStyle="primary" className={'pull-right'} onClick={this.nextStep} >Next</Button>
      </div>
    );
  }
});


