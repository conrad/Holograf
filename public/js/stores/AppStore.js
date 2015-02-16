/**
 * @jsx React.DOM
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var AppConstants = require('../constants/appConstants');
var Program = require('../utils/Program.js');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Compiler = require('../compiler/Compiler')

var CHANGE_EVENT = 'change';

var _code;
var _program;
var _currentStep = {};

var updateCode = function(code) {
  _code = code;
}

var compileCode = function() {
  _program = Compiler.parse(_code);
  console.log(_program);
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
    _currentStep = Program.buildStep(0);
  },

  //return an object with all of the files
  getCode: function() {
    return _code;
  },

  // TODO: change this to getProgram, but need to change in components & action files
  getProgram: function() {       
    return _program;
  },

  getProgramStep: function(n) {
    if (_program) {
      return _program.buildStep(n);
    }
  },

  updateProgramStep: function(n) {
    _program.updateProgramStep(n);
  },

  previousStep: function() {
    _currentStep = _program.previousStep();
  },

  nextStep: function() {
    _currentStep = _program.previousStep();
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
