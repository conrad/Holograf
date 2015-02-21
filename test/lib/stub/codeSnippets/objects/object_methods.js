module.exports = {
input: function() {
var object = {
  speak: function () {
    return 'woof!';
  }
};
},
output: function() {
var object = {
    speak: function () {
        ___Program.method('object.speak');
        ___Program.returnState = 'woof!';
        ___Program.return('object.speak');
        return ___Program.returnState;
        ___Program.return('object.speak');
    }
};
___Program.object('object', object);
},
data: {
 "programSteps": [
  {
   "id": 2,
   "pointer": 1
  },
  {
   "id": 3,
   "value": "___function code"
  }
 ],
 "components": [
  {
   "id": 0,
   "type": "block",
   "name": "global",
   "block": 0,
   "scope": 0,
   "createdAt": 0
  },
  {
   "id": 1,
   "type": "object",
   "block": 0,
   "scope": 0,
   "createdAt": 0
  },
  {
   "id": 2,
   "type": "var",
   "name": "object",
   "block": 0,
   "scope": 0,
   "createdAt": 0
  },
  {
   "id": 3,
   "type": "method",
   "name": "speak",
   "block": 0,
   "scope": 0,
   "createdAt": 1,
   "parent": 1
  }
 ],
 "scopes": {
  "0": {
   "object": 2,
   "object.speak": 3
  }
 }
}
}