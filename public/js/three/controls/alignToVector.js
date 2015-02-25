//vector to align to
var vector = new THREE.Vector3(5, 10, 15);
//create a point to lookAt
var focalPoint = new THREE.Vector3(
    camera.position.x + vector.x,
    camera.position.y + vector.y,
    camera.position.z + vector.z
);

camera.lookAt( focalPoint );      // direct the camera
vector.applyQuaternion( camera.quaternion );   // point vector in same direction as camera
angle = vector.angleTo( target.position );

// http://stackoverflow.com/questions/14813902/three-js-get-the-direction-in-which-the-camera-is-looking


// http://stackoverflow.com/questions/9038465/three-js-object3d-rotation-to-align-to-a-vector