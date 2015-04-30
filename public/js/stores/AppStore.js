/**
 * @jsx React.DOM
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var AppConstants = require('../constants/appConstants');
var Program = require('../compiler/Program.js');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var compile = require('../compiler/Compiler')

// variables for emitting changes to store
var CHANGE_EVENT = 'change';
var COMPILE_EVENT = 'compile';

var _code, _data, _shareUrl, _compiledStatus, _selectedTab, _isLoading, _error;
// initial code in application editor
var templateCode = 
'var fibonacci = function (n) {\n'+
'  if (n < 2){\n'+
'    return 1;\n'+
'  } else {\n'+
'    return fibonacci(n-2) + fibonacci(n-1);\n'+
'  }\n'+
'}\n'+
'\n'+
'fibonacci(5);\n';


var AppStore = assign({}, EventEmitter.prototype, {   
  // extends EventEmitter object to tell React components to update state

  initialize: function() {
    _code = '';
    _data = [];
    _shareUrl = '';
    _compiledStatus = false;
    _selectedTab = 1;
    _isLoading = false;
  },

  getState: function() {
    return ({
      code: _code,
      data: _data,
      compiledStatus: _compiledStatus,
      shareUrl: _shareUrl,
      selectedTab: _selectedTab,
      isLoading: _isLoading,
      error: _error
    });
  },

  // set store to have same data as editor; called whenever change made to editor
  updateCode : function(code) {
    if (code === null) {      // if none, default to templateCode
      _code = templateCode;
    } else {
      _code = code;
    }
    // emit change for React components to update state
    AppStore.emitChange();
  },

  compileCode : function() {

    if (_compiledStatus) {
      // delete prior Three.js scene if already compiled
      theatre.clearScene();

      // reset initial values
      _data = [];
      _shareUrl = '';
      _compiledStatus = false;
    }

    setTimeout(function (){   // allow slight delay before adding loading modal
      _isLoading = true;
      AppStore.emitChange();
    }, 200);

    // calls main compiler.js function and waits for return
    compile(_code)
      .then(function (data) {
        _compiledStatus = true;
        _data = data;
        AppStore.emitChange();

        setTimeout(function() {
          AppStore.renderScene();
        }, 500);
      })
      .error(function (error) {
        _error = {
          line: error.lineno,
          message: error.message
        }
        _isLoading = false;
        AppStore.emitChange();
      })
  },

  renderScene: function () {
    theatre.display(_data, this.compileEnd);
  },

  compileEnd : function() {
    setTimeout(function() {
      _isLoading = false;
      _selectedTab = 2;
      AppStore.emitChange();
    }, 1000);
  },

  updateShareUrl : function(shareUrl) {
    _shareUrl = shareUrl;
    AppStore.emitChange();
  },

  selectTab: function(tab) {
    _selectedTab = tab;
    AppStore.emitChange();
  },

  resetError: function () {
    _error = null;
    _isLoading = false;
    AppStore.emitChange();
  },

  // handle emitting changes for React components to know when updates occur
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  }, 
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  // Not using because this method can't detect when data compile process has completed
  emitCompile: function() {
    this.emit(COMPILE_EVENT);
  },
  addCompileListener: function(callback) {
    this.on(COMPILE_EVENT, callback);
  },
  removeCompileListener: function(callback) {
    this.removeListener(COMPILE_EVENT, callback);
  },

  // sync invocations with actions coming through AppDispatcher
  dispatcherIndex: AppDispatcher.register(function(payload){

    var action = payload.action; 
    switch(action.actionType){
      
      case AppConstants.UPDATE_CODE:
        AppStore.updateCode(action.code);
        break;

      case AppConstants.COMPILE:
        AppStore.compileCode();
        break;

      case AppConstants.UPDATE_SHAREURL:
        AppStore.updateShareUrl(action.shareUrl);
        break;

      case AppConstants.SELECT_TAB:
        AppStore.selectTab(action.tab);
        break;

      case AppConstants.RESET_ERROR:
        AppStore.resetError();
        break;
    }

    return true;
  })

});

module.exports = AppStore;
