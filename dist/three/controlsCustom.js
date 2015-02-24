// controlsCustom.js
// changes to threeControls.js ???

// var contorls = {};
// browserify support
// if ( typeof module === 'object' ) {
  // module.exports = controls;
// }

THREE.OrbitAndPanControls = function (camera, domElement) {
  this.camera = camera;    
  this.domElement = (domElement !== undefined) ? domElement : document;
  this.enabled = true;   // Set to false to disable controls

  // Just implementing ROTATE at first

  // set the focus target to rotate around
  this.target = new THREE.Vector3();    // this.center?
  this.rotateSpeed = 1.0;
  this.keyPanSpeed = 7.0; // pixels moved per arrow key push

  // Set to true to automatically rotate around the target
  // this.autoRotate = false;
  // this.autoRotateSpeed = 2.0; // 60=30sec/round

  // Upper & lower limits of vertical orbiting: 0 to Math.PI radians
  this.minPolarAngle = 0; // radians
  this.maxPolarAngle = Math.PI; // radians

  // Limits to how far you can dolly in and out
  this.minDistance = 0;
  this.maxDistance = Infinity;

  // keyCodess
  this.keys = { 
    ROTATE_LEFT: 37,      // left key
    ROTATE_UP: 38,        // up key
    ROTATE_RIGHT: 39,      // right key
    ROTATE_DOWN: 40,       // down key
    PAN_UP: 87,         // W
    PAN_DOWN: 83,       // S
    PAN_LEFT: 65,       // A
    PAN_RIGHT: 68       // D
  };   
    // add 'shift', 'space' (pause), 'return' (expand)


  ////////////
  // internals

  var scope = this;

  var EPS = 0.000001;     // What is this???

  var rotateStart = new THREE.Vector2();
  var rotateEnd = new THREE.Vector2();
  var rotateDelta = new THREE.Vector2();

  var panStart = new THREE.Vector2();
  var panEnd = new THREE.Vector2();
  var panDelta = new THREE.Vector2();

  var dollyStart = new THREE.Vector2();
  var dollyEnd = new THREE.Vector2();
  var dollyDelta = new THREE.Vector2();

  var phiDelta = 0;       // change in horizontal rotation
  var thetaDelta = 0;     // change in vertical rotation
  var scale = 1;
  var pan = new THREE.Vector3();      // camera positions???

  var lastPosition = new THREE.Vector3();


  // EVENTS 
  var changeEvent = {type: 'change'};

  // Rotation methods
  this.rotateUp = function (angle) {
    if (angle === undefined) {
      angle = scope.rotateSpeed;
    }
    phiDelta -= angle;
  };

  this.rotateDown = function (angle) {
    if (angle === undefined) {
      angle = scope.rotateSpeed;
    }
    thetaDelta += angle;
  };

  this.rotateLeft = function (angle) {
    if (angle === undefined) {
      angle = scope.rotateSpeed;
    }
    thetaDelta -= angle;
  };

  this.rotateRight = function (angle) {
    if (angle === undefined) {
      angle = scope.rotateSpeed;
    }
    thetaDelta += angle;
  };


  // Pan methods
  // this.panLeft = function ( distance ) {

  //   var panOffset = new THREE.Vector3();
  //   var te = this.camera.matrix.elements;
  //   // get X column of matrix
  //   panOffset.set( te[0], te[1], te[2] );
  //   panOffset.multiplyScalar(-distance);
    
  //   pan.add( panOffset );

  // };

  this.update = function() {
    var position = this.camera.position; 
    console.log('this.camera.position:', this.camera.position); 
        // console.log('position:', position); 
    var offset = position.clone().sub( this.target );  // what is clone()???
        console.log('offset from clone:', offset);

    // move target to panned location
    // this.target.add( pan );     // pan is 0,0,0 if not panning???

    // angle from z-axis around y-axis
    var theta = Math.atan2( offset.x, offset.z );
    theta += thetaDelta;
    // angle from y-axis
    var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );
    phi += phiDelta;
    // restrict phi to be between desired limits
    phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

    var radius = offset.length() * scale;
    // restrict radius to be between desired limits
    // radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

    offset.x = radius * Math.sin( phi ) * Math.sin( theta );
    offset.y = radius * Math.cos( phi );
    offset.z = radius * Math.sin( phi ) * Math.cos( theta );
    console.log('offset with coordinates:', offset);

    position.copy( this.target ).add( offset );     // copy & add methods???

    // re-oriented toward target after moving
    this.camera.lookAt( this.target );

    // reset delta values
    thetaDelta = 0;
    phiDelta = 0;
    // scale = 1;    // why this???

    if (lastPosition.distanceTo(this.camera.position) > 0.5 ) {
      this.dispatchEvent(changeEvent);
      lastPosition.copy(this.camera.position);
    }


  };





  var onKeyDown = function (event) {

    if ( scope.enabled === false ) { return; }
    var needUpdate = false;
    
    // Rotating events
    if (event.keyCode === scope.keys.UP) {
      scope.rotateUp();
      needUpdate = true;
    } else if (event.keyCode === scope.keys.DOWN) {
        scope.rotateDown();
        needUpdate = true;
    } else if (event.keyCode === scope.keys.LEFT) {
        scope.rotateLeft();
        needUpdate = true;
    } else if (event.keyCode === scope.keys.RIGHT) {
        scope.rotateRight();
        needUpdate = true;
    }

    // Panning events



    if (needUpdate) { 
      console.log('calling update b/c needUpdate = false;')
      scope.update(); 
    }
  };



  this.domElement.addEventListener( 'keydown', onKeyDown, false );

  // this.domElement.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false );
  // this.domElement.addEventListener( 'mousedown', onMouseDown, false );
  // this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
  // this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox


  // this.domElement.addEventListener( 'touchstart', touchstart, false );
  // this.domElement.addEventListener( 'touchend', touchend, false );
  // this.domElement.addEventListener( 'touchmove', touchmove, false );
};


// include this to add event listeners
THREE.OrbitAndPanControls.prototype = Object.create( THREE.EventDispatcher.prototype );

