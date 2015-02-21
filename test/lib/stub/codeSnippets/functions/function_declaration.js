module.exports = {
input: function() {
var f = function () {};
},
output: function() {
var f = function () {
    ___Program.invoke('f');
    ___Program.return('f');
};
___Program.function('f', f);
},
data: {
 "programSteps": [
  {
   "id": 1,
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
   "type": "var",
   "name": "f",
   "block": 0,
   "scope": 0,
   "createdAt": 0
  }
 ],
 "scopes": {
  "0": {
   "f": 1
  }
 }
}
}