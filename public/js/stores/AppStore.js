/**
 * @jsx React.DOM
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var AppConstants = require('../constants/appConstants');
var Program = require('../Program.js');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Compiler = require('../compiler/Compiler')

var CHANGE_EVENT = 'change';

var _code = '';
var _data = '';
var _currentState = null;

var updateCode = function(code) {
  _code = code;
}

var compileCode = function() {
  _data = Compiler.parse(_code);
  console.log(JSON.stringify(_data, null, 2));
}

var AppStore = assign({}, EventEmitter.prototype, {

  initialize: function() {
    _code = "var f = function (n) {\n" +
            "  if (n < 2){\n"+
            "    return 1;\n"+
            "  }else{\n"+
            "    return f(n-2) + f(n-1);\n"+
            "  }\n"+
            "}\n"+
            "var x = f(2);";
    _data = [];
    _currentState = Program.buildState(0);
  },

  //return an object with all of the files
  getCode: function() {
    return _code;
  },

  getData: function() {
    return _data;
  },

  getProgramState: function(n) {
    return Program.buildState(n);
  },

  updateProgramState: function(n) {
    Program.updateProgramState(n);
  },

  previousState: function() {
    currentState = ProgramObject.previousState();
    this.programState = ProgramObject.previousState();
  },

  nextState: function() {
    this.setState({currentState: ProgramObject.nextState()});
    this.programState = ProgramObject.previousState();
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload){

    var action = payload.action; 
    switch(action.actionType){
      
      case AppConstants.CHANGE_CODE:
        updateCode(action.code);
        break;

      case AppConstants.COMPILE:
        compileCode();
        break;
    }

    AppStore.emitChange();
    return true;
  })

});

module.exports = AppStore;
