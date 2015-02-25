//vector to align to
var vector = new THREE.Vector3(
    5,//x
    10,//y
    15 //z
);

//create a point to lookAt
var focalPoint = new THREE.Vector3(
    cylinder.position.x + vector.x,
    cylinder.position.y + vector.y,
    cylinder.position.z + vector.z
);

camera.lookAt( point );      // direct the camera
var vector = new THREE.Vector3( 0, 0, -1 );    // create a vector
vector.applyQuaternion( camera.quaternion );   // point vector in same direction as camera
angle = vector.angleTo( target.position );

// http://stackoverflow.com/questions/14813902/three-js-get-the-direction-in-which-the-camera-is-looking


// http://stackoverflow.com/questions/9038465/three-js-object3d-rotation-to-align-to-a-vector