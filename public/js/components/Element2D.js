/** @jsx React.DOM */
var React = require('react');
// var AppActions = require('../actions/appActions');
// var AppStore = require('../stores/appStore');

  // <p>id: {this.props.id}</p>
  // <p>name: {this.props.name}</p>
  // <p>val: {this.props.val}</p>
  // <p>type: {this.props.type}</p>
  // <p>scope: {this.props.scope}</p>
  // <p>container: {this.props.container}</p>
  // <p>createdAt: {this.props.createdAt}</p>

      // id: 1
      // name: y
      // val: 0
      // type: number
      // scope: 0
      // container: 0
      // createdAt: 0

var Element2D = React.createClass({

  render:function(){
  
    console.log('this.props in Element2D:', this.props);

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

    return (
      <div>{node}</div>
    );
  }
});

module.exports = Element2D;
