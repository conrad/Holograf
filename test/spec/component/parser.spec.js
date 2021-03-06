var React = require("react/addons");
var Parser = require("../../../public/js/compiler/Parser");
var Generate = require('../../../public/js/compiler/Generator');
var Linter = require('../../../public/js/compiler/Linter');

var codeStubs = require("../../lib/stub/codeStubs");


var testFunction = function (test, done) {
  var input  = codeStubs[test].input;
  var output = codeStubs[test].output;
  Parser(input)
    .then(Generate)
    .then(function (generatedCode) {
      generatedCode = generatedCode.replace('\n', '');
      expect(generatedCode).toBe(output);
    })
    .finally(done); 
}

describe("Parser", function() {

  it("should have code stubs", function() {
    var test = 'declarations/variable_declaration';
    var input  = codeStubs[test].input;
    var output = codeStubs[test].output;

    expect(input).toBe('var x = 1;');
    expect(output).toBe("var x = 1;___Program.set('x', x, 1);");
  });

  describe("Variable Declarations", function() {

    it("should parse variable declarations", function(done) {
      var test = 'declarations/variable_declaration';
      testFunction(test, done);
    });

    it("should parse variable declarations to boolean", function(done) {
      var test = 'declarations/boolean_declaration';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should parse variable declarations to undefined", function(done) {
      var test = 'declarations/undefined_declaration';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle implicit variable declaration", function(done) {
      var test = 'declarations/implicit_declaration';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

  });

  describe("Simple Expressions", function() {

    it("should handle assignment", function(done) {
      var test = 'expressions/assignment';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle assignment with operators", function(done) {
      var test = 'expressions/assignment_with_operator';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle the post-increment operator", function(done) {
      var test = 'expressions/post-increment_operator';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle the pre-increment operator", function(done) {
      var test = 'expressions/pre-increment_operator';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle the shorthand expression assignment operator", function(done) {
      var test = 'expressions/shorthand_expression_assignment_operator';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

  });

  describe("Flow Control", function() {

    describe("Conditionals", function() {

      it("should handle simple if statements", function(done) {
        var test = 'conditionals/if_statement';
              var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
      });

      it("should handle if / else statements", function(done) {
        var test = 'conditionals/if_else_statement';
              var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
      });

      it("should handle if / else if / else statements", function(done) {
        var test = 'conditionals/if_else_if_else_statement';
              var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
      });

      it("should handle nested if statements", function(done) {
        var test = 'conditionals/nested_if_statement';
              var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
      });

    });

    describe("Loops", function() {
      it("should handle for loops", function(done) {
        var test = 'loops/for_loop';
              var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
      });
      it("should handle while loops", function(done) {
        var test = 'loops/while_loop';
              var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
      });
      it("should handle while loops", function(done) {
        var test = 'loops/do_while_loop';
              var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
      });
      it("should handle nested loops", function(done) {
        var test = 'loops/nested_loops';
              var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
      });
    });

  });

  describe("Functions", function() {
    it("should handle function declarations", function(done) {
      var test = 'functions/function_declaration';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle functions with return statements", function(done) {
      var test = 'functions/function_return_statement';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle functions with a single argument", function(done) {
      var test = 'functions/function_with_argument';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle functions with multiple arguments", function(done) {
      var test = 'functions/function_with_arguments';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle functions with conditionally dependent return statements", function(done) {
      var test = 'functions/function_with_conditional_returns';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle functions with return operations", function(done) {
      var test = 'functions/function_with_return_operation';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle recursive functions", function(done) {
      var test = 'functions/recursive_function';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });
  });


  describe("Object", function() {
    it("should handle object declarations", function(done) {
      var test = 'objects/object_declaration';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle object properties", function(done) {
      var test = 'objects/object_properties';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle object methods", function(done) {
      var test = 'objects/object_methods';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle object properties that are objects", function(done) {
      var test = 'objects/object_property_object';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle nested objects with methods", function(done) {
      var test = 'objects/object_property_object_method';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should set object properties", function(done) {
      var test = 'objects/set_object_property';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should set object methods", function(done) {
      var test = 'objects/set_object_method';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should set existing object properties", function(done) {
      var test = 'objects/set_existing_object_property';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should set properties of nested objects", function(done) {
      var test = 'objects/set_nested_object_property';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should reset an object to a variable", function(done) {
      var test = 'objects/set_object_to_variable';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should create a pointer to an object outside of the current scope", function(done) {
      var test = 'objects/pointer_to_object_outside_scope';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should create a pointer to a new object assigned to a property", function(done) {
      var test = 'objects/object_property_new_object';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should create a pointer to an object assigned to a property", function(done) {
      var test = 'objects/pointer_to_object_as_property';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });
   
  });

  describe("Array", function() {
    it("should handle array declarations", function(done) {
      var test = 'arrays/array_declaration';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle arrays with objects", function(done) {
      var test = 'arrays/array_with_objects';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should handle nested arrays", function(done) {
      var test = 'arrays/nested_arrays';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should change a value at an indexed position", function(done) {
      var test = 'arrays/change_array_index';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });

    it("should nest an array inside of an object", function(done) {
      var test = 'arrays/object_with_array';
      var input  = codeStubs[test].input;
      var output = codeStubs[test].output;
      Parser(input)
        .then(Generate)
        .then(function (generatedCode) {
          generatedCode = generatedCode.replace('\n', '');
          expect(generatedCode).toBe(output);
        })
        .finally(done);
    });
  });
});
