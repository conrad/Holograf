// goes inside scene.js


////////////////////
// API 
var zoomSpeed = 1.0;
var minDistance = 0;
var maxDistance = Infinity;
var rotateSpeed = 0.05;
var keyPanSpeed = 7.0; // pixels moved per arrow key push
var minPolarAngle = 0;  // vertical orbit range, upper & lower limits.
var maxPolarAngle = Math.PI;   // Range is 0 to Math.PI radians.

// Toggle whether controls are enabled based on tab selected
var controlsEnabled = true;
var keys = { 
  ROTATE_LEFT: 37, 
  ROTATE_UP: 38, 
  ROTATE_RIGHT: 39, 
  ROTATE_DOWN: 40,
  PAN_LEFT: 65,
  PAN_RIGHT: 68,
  PAN_DOWN: 83,
  PAN_UP: 87,
  EXPAND: 13,     // enter 
  PAUSE: 32,      // spacebar
  PAN_LOCK: 16    // shift
};


///////////////////
// Internals 
// var scope = this;
var EPS = 0.000001;
var phiDelta = 0;
var thetaDelta = 0;
var scale = 1;
var pan = new THREE.Vector3();

var lastPosition = new THREE.Vector3();

// var rotateStart = new THREE.Vector2();
// var rotateEnd = new THREE.Vector2();
// var rotateDelta = new THREE.Vector2();

// var panStart = new THREE.Vector2();
// var panEnd = new THREE.Vector2();
// var panDelta = new THREE.Vector2();

// var dollyStart = new THREE.Vector2();
// var dollyEnd = new THREE.Vector2();
// var dollyDelta = new THREE.Vector2();

// var STATE = { NONE : -1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };
// var state = STATE.NONE;


////////////////////
// Events
var changeEvent = { type: 'change' };


function onKeyDown (event) {
  console.log('onKeyDown CALLED');
  if ( controlsEnabled === false ) { console.log('controls not enabled'); return; }
  var needUpdate = false;

  if (event.keyCode === keys.ROTATE_UP) {
    console.log('rotate UP!');
    rotateUp();
    needUpdate = true;
  } else if (event.keyCode === keys.ROTATE_DOWN) {
    console.log('rotate DOWN!');
    rotateDown();
    needUpdate = true;
  } else if (event.keyCode === keys.ROTATE_LEFT) {
    console.log('rotate LEFT!');
    rotateLeft();
    needUpdate = true;
  } else if (event.keyCode === keys.ROTATE_RIGHT) {
    console.log('rotate right!');
    rotateRight();
    needUpdate = true;
  } 
  // else if (event.keyCode === keys.ROTATE_LEFT) {
  //   console.log('UP!');
  //   rotateUp();
  // } else if ()

  if (needUpdate) { update(); }
}


function rotateLeft (angle) {
  if (angle === undefined) { 
    angle = rotateSpeed; 
  }
  // camera.rotation.y += 0.5;
  thetaDelta -= angle;
}

function rotateRight (angle) {
  if (angle === undefined) { 
    angle = rotateSpeed; 
  }
  thetaDelta += angle;
}

function rotateUp ( angle ) {
  if (angle === undefined) { 
    angle = rotateSpeed; 
  }
  phiDelta -= angle;
};

function rotateDown ( angle ) {
  if (angle === undefined) { 
    angle = rotateSpeed; 
  }
  phiDelta += angle;
};


// Look here for panning & zoom:
//  http://threejs.org/examples/js/controls/OrbitControls.js

function update () {
  // debugger;

  // Maybe add these to get the direction of the camera!!
        // http://stackoverflow.com/questions/14813902/three-js-get-the-direction-in-which-the-camera-is-looking
    // camera.lookAt( point );      // direct the camera
    // var vector = new THREE.Vector3( 0, 0, -1 );    // create a vector
    // vector.applyQuaternion( camera.quaternion );   // point vector in same direction as camera
    // angle = vector.angleTo( target.position );


  // var position = camera.position;
  var offset = target.clone().sub(camera.position);

  // angle from z-axis around y-axis
  var theta = Math.atan2( offset.x, offset.z );
  // angle from y-axis
  var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );
  theta += thetaDelta;
  phi += phiDelta;
  console.log('phi:',phi, 'theta:',theta);

  var radius = offset.length() * scale;
  // restrict radius to be between desired limits  ---- HOWEVER, currently, maxDistance=Infinitiy
  radius = Math.max(minDistance, Math.min(maxDistance, radius) );

  // move target to panned location
  // target.add(pan);

  offset.x = radius * Math.sin( phi ) * Math.sin( theta );
  offset.y = radius * Math.cos( phi );
  offset.z = radius * Math.sin( phi ) * Math.cos( theta );
  console.log('target pre-offset:', target);
  target.add(offset);  
  console.log('target post-offset:', target);
  camera.lookAt(target);

  thetaDelta = 0;
  phiDelta = 0;
  scale = 1;
  pan.set(0,0,0);

  if ( lastPosition.distanceTo( target ) > 0 ) {
    // controls.dispatchEvent( changeEvent );
    lastPosition.copy( target );
  }
};



