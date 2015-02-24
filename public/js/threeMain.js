// customControls.js
var theatre = require('scene.js');

theatre.customControls = function ( object, domElement ) {

  this.object = object;
  this.domElement = ( domElement !== undefined ) ? domElement : document;

  // API
  this.enabled = true;
  this.target = new THREE.Vector3();
  // This option actually enables dollying in and out
  this.zoomSpeed = 1.0;
  this.rotateSpeed = 1.0;
  // this.autoRotate = false;
  // this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60
  this.minPolarAngle = 0; // radians
  this.maxPolarAngle = Math.PI; // radians

  this.minDistance = 0;
  this.maxDistance = Infinity;
  this.keys = { 
    LEFT: 37, 
    UP: 38, 
    RIGHT: 39, 
    BOTTOM: 40 
  };


  // internals

  var scope = this;

  var EPS = 0.000001;

  var rotateStart = new THREE.Vector2();
  var rotateEnd = new THREE.Vector2();
  var rotateDelta = new THREE.Vector2();

  var panStart = new THREE.Vector2();
  var panEnd = new THREE.Vector2();
  var panDelta = new THREE.Vector2();

  var dollyStart = new THREE.Vector2();
  var dollyEnd = new THREE.Vector2();
  var dollyDelta = new THREE.Vector2();

  var phiDelta = 0;
  var thetaDelta = 0;
  var scale = 1;
  var pan = new THREE.Vector3();

  var lastPosition = new THREE.Vector3();

  // var STATE = { NONE : -1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };
  // var state = STATE.NONE;


  // events
  var changeEvent = { type: 'change' };

  this.rotateLeft = function ( angle ) {
    if ( angle === undefined ) {
      angle = getAutoRotationAngle();
    }
    thetaDelta -= angle;
  };

  this.rotateRight = function ( angle ) {
    if ( angle === undefined ) {
      angle = getAutoRotationAngle();
    }
    thetaDelta += angle;
  };

  this.rotateUp = function ( angle ) {
    if ( angle === undefined ) {
      angle = getAutoRotationAngle();
    }
    phiDelta -= angle;
  };

  this.rotateDown = function ( angle ) {
    if ( angle === undefined ) {
      angle = getAutoRotationAngle();
    }
    phiDelta += angle;
  };

  // // pass in distance in world space to move left
  // // this.panLeft = function ( distance ) {
  //   // var panOffset = new THREE.Vector3();
  //   // var te = this.object.matrix.elements;
  //   // get X column of matrix
  //   // panOffset.set( te[0], te[1], te[2] );
  //   // panOffset.multiplyScalar(-distance);
  //   // pan.add( panOffset );
  // // };

  // // pass in distance in world space to move up
  // // this.panUp = function ( distance ) {
  // //   var panOffset = new THREE.Vector3();
  // //   var te = this.object.matrix.elements;
  // //   // get Y column of matrix
  // //   panOffset.set( te[4], te[5], te[6] );
  // //   panOffset.multiplyScalar(distance);
  // //   pan.add( panOffset );
  // // };
  
  // // main entry point; pass in Vector2 of change desired in pixel space,
  // // right and down are positive
  // this.pan = function ( delta ) {

  //   if ( scope.object.fov !== undefined )
  //   {
  //     // perspective
  //     var position = scope.object.position;
  //     var offset = position.clone().sub( scope.target );
  //     var targetDistance = offset.length();

  //     // half of the fov is center to top of screen
  //     targetDistance *= Math.tan( (scope.object.fov/2) * Math.PI / 180.0 );
  //     // we actually don't use screenWidth, since perspective camera is fixed to screen height
  //     scope.panLeft( 2 * delta.x * targetDistance / scope.domElement.height );
  //     scope.panUp( 2 * delta.y * targetDistance / scope.domElement.height );
  //   }
  //   else if ( scope.object.top !== undefined )
  //   {
  //     // orthographic
  //     scope.panLeft( delta.x * (scope.object.right - scope.object.left) / scope.domElement.width );
  //     scope.panUp( delta.y * (scope.object.top - scope.object.bottom) / scope.domElement.height );
  //   }
  //   else
  //   {
  //     // camera neither orthographic or perspective - warn user
  //     console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
  //   }
  // };

  // this.dollyIn = function ( dollyScale ) {

  //   if ( dollyScale === undefined ) {

  //     dollyScale = getZoomScale();

  //   }

  //   scale /= dollyScale;

  // };

  // this.dollyOut = function ( dollyScale ) {

  //   if ( dollyScale === undefined ) {

  //     dollyScale = getZoomScale();

  //   }

  //   scale *= dollyScale;

  // };

  this.update = function () {

    console.log('update called... this.object.position:',this.objectposition);
    var position = this.object.position;
    var offset = position.clone().sub( this.target );   // what is this???

    // angle from z-axis around y-axis
    var theta = Math.atan2( offset.x, offset.z );
    // angle from y-axis
    var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

    // if ( this.autoRotate ) {
    //   this.rotateLeft( getAutoRotationAngle() );
    // }
    theta += thetaDelta;
    phi += phiDelta;
    // restrict phi to be between desired limits
    phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );
    // restrict phi to be betwee EPS and PI-EPS
    phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );
    var radius = offset.length() * scale;

    // restrict radius to be between desired limits
    radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );
    
    // move target to panned location
    // this.target.add( pan );

    offset.x = radius * Math.sin( phi ) * Math.sin( theta );
    offset.y = radius * Math.cos( phi );
    offset.z = radius * Math.sin( phi ) * Math.cos( theta );

    position.copy( this.target ).add( offset );

    this.object.lookAt( this.target );

    thetaDelta = 0;
    phiDelta = 0;
    scale = 1;
    pan.set(0,0,0);

    if ( lastPosition.distanceTo( this.object.position ) > 0 ) {
      this.dispatchEvent( changeEvent );
      lastPosition.copy( this.object.position );
    }

  };


  function getAutoRotationAngle() {
    return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
  }

  function getZoomScale() {
    return Math.pow( 0.95, scope.zoomSpeed );
  }

  // function onMouseDown( event ) {
  //   if ( scope.enabled === false ) { return; }
  //   event.preventDefault();

  //   if ( event.button === 0 ) {
  //     if ( scope.noRotate === true ) { return; }

  //     state = STATE.ROTATE;

  //     rotateStart.set( event.clientX, event.clientY );

  //   } else if ( event.button === 1 ) {
  //     if ( scope.noZoom === true ) { return; }

  //     state = STATE.DOLLY;

  //     dollyStart.set( event.clientX, event.clientY );

  //   } else if ( event.button === 2 ) {
  //     if ( scope.noPan === true ) { return; }

  //     state = STATE.PAN;

  //     panStart.set( event.clientX, event.clientY );

  //   }

  //   document.addEventListener( 'mousemove', onMouseMove, false );
  //   document.addEventListener( 'mouseup', onMouseUp, false );

  // }

  // function onMouseMove( event ) {

  //   if ( scope.enabled === false ) { return; }

  //   event.preventDefault();

  //   if ( state === STATE.ROTATE ) {
  //     if ( scope.noRotate === true ) { return; }

  //     rotateEnd.set( event.clientX, event.clientY );
  //     rotateDelta.subVectors( rotateEnd, rotateStart );

  //     // rotating across whole screen goes 360 degrees around
  //     scope.rotateLeft( 2 * Math.PI * rotateDelta.x / scope.domElement.width * scope.rotateSpeed );
  //     // rotating up and down along whole screen attempts to go 360, but limited to 180
  //     scope.rotateUp( 2 * Math.PI * rotateDelta.y / scope.domElement.height * scope.rotateSpeed );

  //     rotateStart.copy( rotateEnd );

  //   } else if ( state === STATE.DOLLY ) {
  //     if ( scope.noZoom === true ) { return; }

  //     dollyEnd.set( event.clientX, event.clientY );
  //     dollyDelta.subVectors( dollyEnd, dollyStart );

  //     if ( dollyDelta.y > 0 ) {

  //       scope.dollyIn();

  //     } else {

  //       scope.dollyOut();

  //     }

  //     dollyStart.copy( dollyEnd );

  //   } else if ( state === STATE.PAN ) {
  //     if ( scope.noPan === true ) { return; }

  //     panEnd.set( event.clientX, event.clientY );
  //     panDelta.subVectors( panEnd, panStart );
      
  //     scope.pan( panDelta );

  //     panStart.copy( panEnd );

  //   }

  // }

  // function onMouseUp( /* event */ ) {

  //   if ( scope.enabled === false ) { return; }

  //   document.removeEventListener( 'mousemove', onMouseMove, false );
  //   document.removeEventListener( 'mouseup', onMouseUp, false );

  //   state = STATE.NONE;

  // }

  // function onMouseWheel( event ) {
  //   // this is needed when the program is inside an iframe
  //   // to prevent scrolling the whole page
  //   event.preventDefault();
  //   if ( scope.enabled === false ) { return; }
  //   if ( scope.noZoom === true ) { return; }

  //   var delta = 0;

  //   if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

  //     delta = event.wheelDelta;

  //   } else if ( event.detail ) { // Firefox

  //     delta = - event.detail;

  //   }

  //   if ( delta > 0 ) {

  //     scope.dollyOut();

  //   } else {

  //     scope.dollyIn();

  //   }

  // }

  var onKeyDown = function( event ) {

    if (event.keyCode === scope.keys.UP) {
      console.log('UP!');
      scope.rotateUp();
    }
    if ( scope.enabled === false ) { return; }

  };
    // switch ( event.keyCode ) {
    //   case scope.keys.UP:
    //     scope.pan( new THREE.Vector2( 0, 1 ) );
    //     break;
    //   case scope.keys.BOTTOM:
    //     scope.pan( new THREE.Vector2( 0, -1 ) );
    //     break;
    //   case scope.keys.LEFT:
    //     scope.pan( new THREE.Vector2( 1, 0 ) );
    //     break;
    //   case scope.keys.RIGHT:
    //     scope.pan( new THREE.Vector2( -1, 0 ) );
    //     break;
    // }

  
  // function touchstart( event ) {

  //   if ( scope.enabled === false ) { return; }
  //   switch ( event.touches.length ) {

  //     case 1: // one-fingered touch: rotate
  //       if ( scope.noRotate === true ) { return; }

  //       state = STATE.TOUCH_ROTATE;

  //       rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
  //       break;

  //     case 2: // two-fingered touch: dolly
  //       if ( scope.noZoom === true ) { return; }

  //       state = STATE.TOUCH_DOLLY;

  //       var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
  //       var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
  //       var distance = Math.sqrt( dx * dx + dy * dy );
  //       dollyStart.set( 0, distance );
  //       break;

  //     case 3: // three-fingered touch: pan
  //       if ( scope.noPan === true ) { return; }

  //       state = STATE.TOUCH_PAN;

  //       panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
  //       break;

  //     default:
  //       state = STATE.NONE;

  //   }
  // }

  // function touchmove( event ) {

  //   if ( scope.enabled === false ) { return; }

  //   event.preventDefault();
  //   event.stopPropagation();

  //   switch ( event.touches.length ) {

  //     case 1: // one-fingered touch: rotate
  //       if ( scope.noRotate === true ) { return; }
  //       if ( state !== STATE.TOUCH_ROTATE ) { return; }

  //       rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
  //       rotateDelta.subVectors( rotateEnd, rotateStart );

  //       // rotating across whole screen goes 360 degrees around
  //       scope.rotateLeft( 2 * Math.PI * rotateDelta.x / scope.domElement.width * scope.rotateSpeed );
  //       // rotating up and down along whole screen attempts to go 360, but limited to 180
  //       scope.rotateUp( 2 * Math.PI * rotateDelta.y / scope.domElement.height * scope.rotateSpeed );

  //       rotateStart.copy( rotateEnd );
  //       break;

  //     case 2: // two-fingered touch: dolly
  //       if ( scope.noZoom === true ) { return; }
  //       if ( state !== STATE.TOUCH_DOLLY ) { return; }

  //       var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
  //       var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
  //       var distance = Math.sqrt( dx * dx + dy * dy );

  //       dollyEnd.set( 0, distance );
  //       dollyDelta.subVectors( dollyEnd, dollyStart );

  //       if ( dollyDelta.y > 0 ) {

  //         scope.dollyOut();

  //       } else {

  //         scope.dollyIn();

  //       }

  //       dollyStart.copy( dollyEnd );
  //       break;

  //     case 3: // three-fingered touch: pan
  //       if ( scope.noPan === true ) { return; }
  //       if ( state !== STATE.TOUCH_PAN ) { return; }

  //       panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
  //       panDelta.subVectors( panEnd, panStart );
        
  //       scope.pan( panDelta );

  //       panStart.copy( panEnd );
  //       break;

  //     default:
  //       state = STATE.NONE;

  //   }

  // }

  // function touchend( /* event */ ) {

  //   if ( scope.enabled === false ) { return; }

  //   state = STATE.NONE;
  // }

  // this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
  // this.domElement.addEventListener( 'mousedown', onMouseDown, false );
  // this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
  // this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox

  this.domElement.addEventListener( 'keydown', onKeyDown, false );

  // this.domElement.addEventListener( 'touchstart', touchstart, false );
  // this.domElement.addEventListener( 'touchend', touchend, false );
  // this.domElement.addEventListener( 'touchmove', touchmove, false );

};

THREE.CustomControls.prototype = Object.create( THREE.EventDispatcher.prototype );
// renderer.js



var makeRenderer = function() {

  // current code:
  // var renderer = new THREE.CanvasRenderer();

  // http://codepen.io/nireno/pen/cAoGI?editors=001
  var renderer = new THREE.WebGLRenderer();    
      // ( { antialias: true } );

  renderer.setClearColor( 0x333333, 1);
  renderer.setSize( window.innerWidth - 20, window.innerHeight - 20 );


  return renderer;
};
module.exports = theatre;

var theatre={scenePaused:false,expanded:false};

theatre.display = function(allData){	
	var composite, container, controls, camera, scene, renderer, particleLight, tween, visualTimeline;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	var centerPoint = new THREE.Vector3(0,0,5000);
	var scopes=utils.extractScopes(allData);
	var timeline=utils.parseTimeline(allData.programSteps,allData.components);
	
	init(timeline);
	animate();
	

	function init(data) {
		container = document.getElementById('three-scene');

		// PerspectiveCamera method args: (field of view angle, aspectRatio, near, far)
		camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
		camera.position.z = 5000;
		camera.position.y = 0;
		camera.position.x = -4000;
		controls = new THREE.CustomControls(camera, container);
		controls.addEventListener( 'change', render );
		// controls = makeControls(camera, container);
		// controls = new THREE.OrbitControls(camera, container);

		scene = new THREE.Scene();
		particleLight = subroutines.TimeLight();
		particleLight.tween.start();
		particleLight.tween.onComplete(function(){
			particleLight.position.z=0;
			particleLight.tween.start();
		});
		scene.add( particleLight );
		composite = subroutines.Composite(data,scopes);
		scene.add( composite );
		visualTimeline = subroutines.VisualTimeline(data,scopes);
		scene.add(visualTimeline);
		//will add the dotgrid to the scene;
		subroutines.dotGrid(scene,data,scopes,composite.maxSize);
		
		renderer = new THREE.WebGLRenderer({antialias:true});
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight-$(container).offset().top );
			renderer.setClearColor( 0x333333, 1);
			container.appendChild( renderer.domElement );

		// User interaction
		window.addEventListener( 'mousemove', onMouseMove, false );
		window.addEventListener( 'resize', onWindowResize, false );
		document.addEventListener("keydown", onKeyDown, false); 

	}

	function onWindowResize() {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}


	function onMouseMove( e ) {
		var vector = new THREE.Vector3();
		var raycaster = new THREE.Raycaster();
		var dir = new THREE.Vector3();

		//check the type of camera
		//extract that offset into an external variable that doesn't have to be recalculated every time... later
		var x =  ( event.clientX / window.innerWidth ) * 2 - 1;
		var y = - ( (event.clientY-$(container).offset().top ) / window.innerHeight ) * 2 + 1;
		if ( camera instanceof THREE.OrthographicCamera ) {
	    vector.set( x, y, - 1 ); // z = - 1 important!
	    vector.unproject( camera );
	    dir.set( 0, 0, - 1 ).transformDirection( camera.matrixWorld );
	    raycaster.set( vector, dir );
		} else if ( camera instanceof THREE.PerspectiveCamera ) {
	    vector.set( x, y, 0.5 ); // z = 0.5 important!
	    vector.unproject( camera );
	    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
		}
		
		if (composite){
			var intersects = raycaster.intersectObjects( composite.children, true );	
			if (intersects.length<1){
				$("#three-modal").fadeOut();
				composite.children.forEach(function( shape ) {
					shape.material.color.setRGB( shape.grayness, shape.grayness, shape.grayness );
				});
			} else {
				var d="";
				var selectedId=intersects[0].object.componentData.id;
				for (var key in intersects[0].object.componentData){
					d+="<div>"+key+": "+intersects[0].object.componentData[key]+"</div>";
				}
				$("#three-modal").html(d);
				$("#three-modal").fadeIn();
				intersects[0].object.material.color.setRGB( 1, 1, 0 );
				composite.children.forEach(function( shape ) {
					if (shape.componentData.id===selectedId){
						shape.material.color.setRGB( 1, 1, 0 );
					}
				});
			}
		}
	}

	function onKeyDown ( event ) {
		console.log('onKeyDown CALLED');
	  if (event.keyCode === 38) {
	    console.log('UP!');
	    // scope.rotateUp();
	  }
	  // if ( scope.enabled === false ) { return; }

	};


	
	function animate() {
		requestAnimationFrame( animate );
		// if (killControls) 
		//   controls.enabled = false;
		// else 
		//   controls.update(controlsObj.delta);
		// controls.update();

		render();
	}
	
	theatre.pause=function(){
		theatre.scenePaused ? particleLight.tween.start() : particleLight.tween.stop();
		theatre.scenePaused=!theatre.scenePaused;
	};
	
	theatre.expand=function(){
		var action = theatre.expanded ? "collapse" : "expand";
		console.log(visualTimeline);
		for (var i=0;i<composite.children.length;i++){
			composite.children[i][action].start();
			if (action==='collapse'){
				visualTimeline.hide.start();
			} else {
				visualTimeline.show.start();
			}
		}
		theatre.expanded=!theatre.expanded;
	};
	
	function render() {
		// lookAt might be preventing panning
		camera.lookAt(centerPoint);

		TWEEN.update();
		renderer.render( scene, camera );
		// effect.render( scene, camera );			// This is used for stereoEffect
	}
};


// stereoEffect.js

// Stereoscopic effect
// effect = new THREE.StereoEffect( renderer );
// effect.eyeSeparation = 10;
// effect.setSize( window.innerWidth, window.innerHeight );


// effect.render( scene, camera );      // This is used for stereoEffect








// Some controls code
// THREE.MouseControls = function ( object ) {

//   var scope = this;
//   var PI_2 = Math.PI / 2;
//   var mouseQuat = {
//     x: new THREE.Quaternion(),
//     y: new THREE.Quaternion()
//   };
//   var object = object;
//   var xVector = new THREE.Vector3( 1, 0, 0 );
//   var yVector = new THREE.Vector3( 0, 1, 0 );

//   var onMouseMove = function ( event ) {

//     if ( scope.enabled === false ) return;

//     var orientation = scope.orientation;

//     var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
//     var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

//     orientation.y += movementX * 0.0025;
//     orientation.x += movementY * 0.0025;

//     orientation.x = Math.max( - PI_2, Math.min( PI_2, orientation.x ) );

//   };

//   this.enabled = true;

//   this.orientation = {
//     x: 0,
//     y: 0,
//   };

//   this.update = function() {

//     if ( this.enabled === false ) return;

//     mouseQuat.x.setFromAxisAngle( xVector, this.orientation.x );
//     mouseQuat.y.setFromAxisAngle( yVector, this.orientation.y );
//     object.quaternion.copy(mouseQuat.y).multiply(mouseQuat.x)
//     return;

//   };

//   document.addEventListener( 'mousemove', onMouseMove, false );

// };
var subroutines={};

subroutines.Fun=function(composite, opts){
	if (opts===undefined){var opts={};}
	if (opts.z1===undefined){opts.z1=0;}
	if (opts.z2===undefined){opts.z2=0;}
	if (opts.x===undefined){opts.x=0;}
	if (opts.componentData===undefined){opts.componentData={};}
	var x=opts.x;
	var z1=opts.z1;
	var z2=opts.z2;
	var r=opts.r || 300;
	var geometry = Object.create(subroutines.variableGeometry);
	var grayness = 0.5;
	var material=new THREE.MeshLambertMaterial({});
	material.color.setRGB( grayness, grayness, grayness );
	var object = new THREE.Mesh(geometry, material );

	object.grayness=grayness;
	object.componentData=opts.componentData;
	object=utils.tweenify(object,{z1: z1, z2:z2} );
		
	object.position.set( x, 0, z1 );
	object.rotation.x=-1*(Math.PI/2);
	composite.add(object);
};

subroutines.FunctionInvocation=function(composite, opts){
	if (opts===undefined){var opts={};}
	if (opts.z1===undefined){opts.z1=0;}
	if (opts.z2===undefined){opts.z2=0;}
	if (opts.x===undefined){opts.x=0;}
	if (opts.componentData===undefined){opts.componentData={};}
	var x=opts.x;
	var z1=opts.z1;
	var z2=opts.z2;
	var r=opts.r || 300;
	var geometry = Object.create(subroutines.funGeometry);
	var grayness = 0;
	var material=new THREE.MeshBasicMaterial({wireframe:true, side: THREE.DoubleSide});
	material.color.setRGB( grayness, grayness, grayness );
	var object = new THREE.Mesh(geometry, material );

	object.grayness=grayness;
	object.componentData=opts.componentData;
	object=utils.tweenify(object,{z1: z1, z2:z2} );
		
	object.position.set( x, 0, z1 );
	object.rotation.x=(Math.PI/2);
	composite.add(object);
};

subroutines.FunctionReturn=function(composite, opts){
	if (opts===undefined){var opts={};}
	if (opts.z1===undefined){opts.z1=0;}
	if (opts.z2===undefined){opts.z2=0;}
	if (opts.x===undefined){opts.x=0;}
	if (opts.componentData===undefined){opts.componentData={};}
	var x=opts.x;
	var z1=opts.z1;
	var z2=opts.z2;
	var r=opts.r || 300;
	var geometry = Object.create(subroutines.funGeometry);
	var grayness = 0;
	var material=new THREE.MeshBasicMaterial({wireframe:true, side: THREE.DoubleSide});
	material.color.setRGB( grayness, grayness, grayness );
	var object = new THREE.Mesh(geometry, material );

	object.grayness=grayness;
	object.componentData=opts.componentData;
	object=utils.tweenify(object,{z1: z1, z2:z2} );
		
	object.position.set( x, 0, z1 );
	object.rotation.x=-1*(Math.PI/2);
	composite.add(object);
};

subroutines.Dflt=function(opts){
	if (opts===undefined){var opts={};}
	if (opts.z===undefined){opts.z=0;}
	if (opts.x===undefined){opts.x=0;};
	var z=opts.z;
	var x=opts.x;
	particle = new THREE.Sprite( subroutines.dfltMaterial );
	particle.position.x = opts.x===undefined ? 0 : opts.x ;
	particle.position.y = opts.y===undefined ? 0 : opts.y ;
	particle.position.z = opts.z===undefined ? 0 : opts.z ;
	particle.grayness = 0.5;
	particle.scale.x = particle.scale.y = opts.scale || 100;
	return particle;
};

subroutines.Loop=function(composite,opts){
	if (opts===undefined){var opts={};}
	if (opts.z1===undefined){opts.z1=0;}
	if (opts.z2===undefined){opts.z2=0;}
	if (opts.x===undefined){opts.x=0;}
	if (opts.componentData===undefined){opts.componentData={};}
	var x=opts.x;
	var z1=opts.z1;
	var z2=opts.z2;
	var r=opts.r || 300;
	var geometry = Object.create(subroutines.loopGeometry);
	var grayness = 0.5;
	var material=new THREE.MeshLambertMaterial({});
	material.color.setRGB( grayness, grayness, grayness );
	var object = new THREE.Mesh(geometry, material );

	object.grayness=grayness;
	object.componentData=opts.componentData;
	object=utils.tweenify(object,{z1: z1, z2:z2} );
		
	object.position.set( x, 0, z1 );
	composite.add(object);
};

subroutines.LoopCycle=function(composite,opts){
	console.log('entered loop cycle');
	if (opts===undefined){var opts={};}
	if (opts.z1===undefined){opts.z1=0;}
	if (opts.z2===undefined){opts.z2=0;}
	if (opts.x===undefined){opts.x=0;}
	if (opts.componentData===undefined){opts.componentData={};}
	var steps=60;
	var planeInterval = 360/steps;
	var radianInterval = (2*Math.PI)/steps;
	for (var j=0;j<steps;j++){
		var ticGeometry = new THREE.PlaneBufferGeometry( 30, 10 );
		var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( ticGeometry, material );
		plane.grayness=1;
		plane.position.z=opts.z1;
		plane.position.x=opts.x;
		plane.rotation.z-=radianInterval*j;
		var coords = utils.getPoint(plane.position.x,plane.position.y,opts.radius,planeInterval*j);
		plane.position.x=coords.x2;
		plane.position.y=coords.y2;
		
		plane.componentData=opts.componentData;
		plane=utils.tweenify(plane,{z1: opts.z1, z2:opts.z2} );
		composite.add( plane );
	}
};
	
subroutines.TimeLight=function(start,end) {
	if (start===undefined){var start=0;}
	if (end===undefined){var end=10000;}
	var particleLight = new THREE.Mesh( new THREE.SphereGeometry( 0, 0, 0 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
	var pointLight = new THREE.PointLight( 0xffffff, 2 );
	particleLight.add( pointLight );
	particleLight.tween=new TWEEN.Tween(particleLight.position).to({z:end},5000).easing(TWEEN.Easing.Quadratic.InOut);
	return particleLight;
};
	
subroutines.VisualTimeline=function (data,scopes){
	var maxSize=10000;
	var interval=maxSize/(data.length+1);
	var z = 0;
	var x = 0;
	var material = new THREE.LineBasicMaterial( { color: 0xffffff, transparent:true, opacity:0 } );
	var geometry = new THREE.Geometry();
	for (var i=0;i<data.length;i++){
		z += interval;
		if (data[i].return!==undefined){
			x-=500;
		}
		geometry.vertices.push(
			new THREE.Vector3( x, 0, z )
		);
		
		if (data[i].invoke!==undefined){
			x+=500;
		}
	}
	var line = new THREE.Line( geometry, material );
	line.show=new TWEEN.Tween(line.material).to({opacity:1},1500).easing(TWEEN.Easing.Exponential.In);
  line.hide=new TWEEN.Tween(line.material).to({opacity:0},1500).easing(TWEEN.Easing.Exponential.Out);
  
	return line;
};


subroutines.dotGrid=function(scene,data,scopes,maxSize){
	var dotSteps=maxSize/data.length;
	for (var key in scopes){
		var dotX=scopes[key];
		for (var i=0;i<data.length;i++){
			var opts={};
			opts.scale=10;
			opts.x=dotX;
			opts.z=dotSteps*i;
			scene.add(subroutines.Dflt(opts) );
		}
	}
};

subroutines.Composite = function(data,scopes){
	var composite=new THREE.Object3D();
	composite.maxSize=10000;
	var interval=composite.maxSize/(data.length+1);
	var z1, z2;
	var scopeStack=[];
	var x=0;
	for (var i=0;i<data.length;i++){
		z1=(composite.maxSize/2)+(10*i);
		z2= ((interval)+interval*i);
		if (data[i].return!==undefined){
			x-=500;
		}
		
		
		var radius=500;
		if (data[i].component.block && data[i].component.block>0){
			radius=200;
		}
		
		
		//all the possible heiroglyphs
		var opts={z1:z1, z2:z2,x:x,componentData:data[i].component,radius:radius} ;
		if (data[i].component.type==="block" && data[i].component.name==="for" && data[i].for!=="cycle"){
			subroutines.Loop(composite, opts);
		} else if (data[i].invoke!==undefined) {
			subroutines.FunctionInvocation(composite,opts);
		} else if (data[i].return !==undefined){
			subroutines.FunctionReturn(composite,opts);
		} else if (data[i].component.type==="block" && data[i].component.name==="for" && data[i].for==="cycle"){
			subroutines.LoopCycle(composite,opts);
		} else {
			opts={z1:z1, z2:z2,x:x,componentData:data[i].component,radius:radius};
			subroutines.Fun(composite, opts);
		}
		
		
		
		
		if (data[i].invoke!==undefined){
			x+=500;
		}
		
	}
	return composite;
};	



subroutines.loopGeometry=new THREE.TorusGeometry(500,20,20,30);
subroutines.funGeometry=new THREE.CylinderGeometry(200,50,100,6,1,true);
subroutines.variableGeometry=new THREE.DodecahedronGeometry(50);
subroutines.dfltMaterial=new THREE.SpriteMaterial({});
utils={};

utils.toGlossary=function(x){
  //x is an array of objects, and we're turning it into a hash where 
  //the id element from each object is it's key
  var glossary={};
  for (var i=0;i<x.length;i++){
    glossary[x[i].id]=x[i];
  }
  return glossary;
};

utils.parseTimeline=function(timeline,components){
  var glossary= utils.toGlossary(components);
  
  for (var i=0;i<timeline.length;i++){
    //deep clone to avoid altering the glossary
    timeline[i].component={};
    for (var key in glossary[timeline[i].id]){
      //if (key==='id'){continue;}
      timeline[i].component[key]=glossary[timeline[i].id][key];
    }
    timeline[i].component.value=timeline[i].value;
  }

  return timeline;
};

utils.getPoint=function(x,y,r,theta){
  theta+=90;
  theta=theta*(Math.PI/180);
  var x2=x+(r*Math.sin(theta));
  var y2=y+(r*Math.cos(theta));
  var circle={x1:x,y1:y,r:r,x2:x2,y2:y2};
  return circle;
};

utils.extractScopes=function(allData){  
  var scopes={};  
  var scopeX=0;
  for (var key in allData.scopes){
    scopes[key]=scopeX+500;
    scopeX+=500;
  }
  return scopes;
};

utils.tweenify=function(obj,opts){
  //tweenify is a decorator
  if (obj===undefined){var obj={};}
  if (opts===undefined){var opts={};}
  if (opts.z1===undefined){opts.z1=0;}
  if (opts.z2===undefined){opts.z2=0;}
  obj.collapse=new TWEEN.Tween(obj.position).to({z:opts.z1},1500).easing(TWEEN.Easing.Quadratic.InOut);
  obj.expand=new TWEEN.Tween(obj.position).to({z:opts.z2},1500).easing(TWEEN.Easing.Quadratic.InOut);
  return obj;
};