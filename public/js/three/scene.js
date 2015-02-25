// module.exports = theatre;
var theatre = {scenePaused:false, expanded:false,controlsEnabled:true};


theatre.display = function(allData){	
	var composite, container, controls, camera, scene, renderer, particleLight, tween, visualTimeline;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	// var centerpoint = new THREE.Vector3(0,0,5000);
	var target = new THREE.Vector3(0,0,5000);
	var scopes = utils.extractScopes(allData);
	var timeline = utils.parseTimeline(allData.programSteps, allData.components);
	
	init(timeline);
	animate();
	

	function init(data) {
		container = document.getElementById('three-scene');

		// PerspectiveCamera method args: (field of view angle, aspectRatio, near, far)
		camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
		camera.position.z = 5000;
		camera.position.y = 0;
		camera.position.x = -4000;

		controls = new customControls(camera, container);
		// controls = new THREE.OrbitControls(camera, target, container);
		controls.addEventListener( 'change', render );  
		// controls = makeControls(camera, container);

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
			// renderer.setSize( window.innerWidth, window.innerHeight-$(container).offset().top );
			renderer.setSize( window.innerWidth, window.innerHeight - 86);  // hard-coded top offset
			renderer.setClearColor( 0x333333, 1);
			container.appendChild( renderer.domElement );

		// User interaction
		window.addEventListener( 'mousemove', onMouseMove, false );
		window.addEventListener( 'resize', onWindowResize, false );
		document.addEventListener("keydown", onKeyDown, false);  // controls.onKeyDown

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


///////////////////////////////////////////////////////////
// CONTROLS
///////////////////////////////////////////////////////////
	
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













	function animate() {
		requestAnimationFrame( animate );
		// if (killControls) {
		//   controls.enabled = false;
		// } else {
		//   controls.update(controlsObj.delta);
		//   controls.update();
		// }
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
		camera.lookAt(target);

		TWEEN.update();
		renderer.render( scene, camera );
		// effect.render( scene, camera );			// This is used for stereoEffect
	}
};

