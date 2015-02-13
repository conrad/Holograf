/**
 * @jsx React.DOM
 */

var React = require('react');
var TabbedArea = require('react-bootstrap/TabbedArea');
var TabPane = require('react-bootstrap/TabPane');
var CodeEditor = require('./CodeEditor');
var Visual2D = require('./Visual2D.js');
// var DataEditor = require('./DataEditor');
var ProgramStateView = require('./ProgramStateView');


module.exports = React.createClass({

  render: function() {

    return (
      <TabbedArea defaultActiveKey={1}>
            <TabPane eventKey={1} tab="Code">
              <CodeEditor code={this.props.code} />
            </TabPane>
            <TabPane eventKey={2} tab="View State">
              <ProgramStateView />
            </TabPane>
            <TabPane eventKey={3} tab="2D Visualization">
              <Visual2D />
            </TabPane>
      </TabbedArea>
    );
  }
});