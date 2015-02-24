(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// controls.js


// controls = new THREE.OrbitControls(camera, container);
// controls.addEventListener( 'change', render );

var makeControls = function(camera, container) {

  var controls = new THREE.TrackballControls(camera, container);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

};

  /** Event fired when the mouse button is pressed down */
  function onDocumentMouseDown(event) {
      event.preventDefault();

      /** Calculate mouse position and project vector through camera and mouse3D */
      mouse3D.x = mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse3D.y = mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouse3D.z = 0.5;
      projector.unprojectVector(mouse3D, camera);

      var ray = new THREE.Ray(camera.position, mouse3D.subSelf(camera.position).normalize());

      var intersects = ray.intersectObject(maskMesh);

      if (intersects.length > 0) {
          SELECTED = intersects[0].object;
          var intersects = ray.intersectObject(plane);
          offset.copy(intersects[0].point).subSelf(plane.position);
          killControls = true;
      }
      else if (controls.enabled == false)
          controls.enabled = true;
  }

  /** This event handler is only fired after the mouse down event and
      before the mouse up event and only when the mouse moves */
  function onDocumentMouseMove(event) {
      event.preventDefault();

      /** Calculate mouse position and project through camera and mouse3D */
      mouse3D.x = mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse3D.y = mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouse3D.z = 0.5;
      projector.unprojectVector(mouse3D, camera);

      var ray = new THREE.Ray(camera.position, mouse3D.subSelf(camera.position).normalize());

      if (SELECTED) {
          var intersects = ray.intersectObject(plane);
          SELECTED.position.copy(intersects[0].point.subSelf(offset));
          killControls = true;
          return;
      }

      var intersects = ray.intersectObject(maskMesh);

      if (intersects.length > 0) {
          if (INTERSECTED != intersects[0].object) {
              INTERSECTED = intersects[0].object;
              INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
              plane.position.copy(INTERSECTED.position);
          }
      }
      else {
          INTERSECTED = null;
      }
  }

  /** Removes event listeners when the mouse button is let go */
  function onDocumentMouseUp(event) {
      event.preventDefault();
      if (INTERSECTED) {
          plane.position.copy(INTERSECTED.position);
          SELECTED = null;
          killControls = false;
      }
  }

  /** Removes event listeners if the mouse runs off the renderer */
  function onDocumentMouseOut(event) {
      event.preventDefault();
      if (INTERSECTED) {
          plane.position.copy(INTERSECTED.position);
          SELECTED = null;
      }
  }



// PLACED in our main animation loop
// if (killControls) 
//   controls.enabled = false;
// else 
//   controls.update(delta);


// // inside animate()
// controls.update();

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

},{}]},{},[1]);
