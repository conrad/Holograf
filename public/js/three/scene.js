// module.exports = theatre;

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
		controls = new customControls(camera, container);
		// controls = new THREE.CustomControls(camera, container);
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
	
	////////////////////
	// API 
	var target = new THREE.Vector3();
	var zoomSpeed = 1.0;
	var minDistance = 0;
	var maxDistance = Infinity;
	var rotateSpeed = 1.0;
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


	function onKeyDown (event) {
		console.log('onKeyDown CALLED');
	  if ( controlsEnabled === false ) { 
	  	console.log('controls not enabled');
	  	return; 
	  }

	  if (event.keyCode === keys.ROTATE_UP) {
	    console.log('rotate UP!');
	    rotateUp();
	  } else if (event.keyCode === keys.ROTATE_DOWN) {
	    console.log('rotate DOWN!');
	    rotateDown();
	  } else if (event.keyCode === keys.ROTATE_LEFT) {
	    console.log('rotate LEFT!');
	    rotateLeft();
	  } else if (event.keyCode === keys.ROTATE_RIGHT) {
	    console.log('rotate right!');
	    rotateRight();
	  } 
	  // else if (event.keyCode === keys.ROTATE_LEFT) {
	  //   console.log('UP!');
	  //   rotateUp();
	  // } else if ()
	}

	function rotateLeft (angle) {
	  // if (angle === undefined) { angle = getAutoRotationAngle(); }
	  thetaDelta -= angle;
	}

	function rotateRight (angle) {
	  // if (angle === undefined) { angle = getAutoRotationAngle(); }
	  thetaDelta += angle;
	}

	function rotateUp ( angle ) {
	  phiDelta -= angle;
	};

	function rotateDown ( angle ) {
	  phiDelta += angle;
	};

	function update () {

	  var position = this.object.position;
	  var offset = position.clone().sub( this.target );

	  // angle from z-axis around y-axis

	  var theta = Math.atan2( offset.x, offset.z );

	  // angle from y-axis

	  var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

	  if ( this.autoRotate ) {

	    this.rotateLeft( getAutoRotationAngle() );

	  }

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
	  this.target.add( pan );

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

