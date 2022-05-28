window.heightFromAbove = 1000;
window.zTranslate = 2000;
window.zSpeed = -0.0;
window.density  = 10.0;
window.cube     = {
  x: 30 * window.density,
  y: 30 * window.density,
  z: 30 * window.density
};
window.particleCount = 50 * (window.density ** 3); // default is 100K
window.textureImage = 'https://threejs.org/examples/textures/sprites/circle.png';
window.shouldRotate = true;

window.shapes = [
  "invertedTorus",
  "hyperboloid",
  "heart",
];
window.currentMaterialID = window.shapes[0];
window.nextMaterialID    = window.shapes[1];

window.meshes = {universe: {}};
window.materials = {universe: {}};


for (var s=0; s < window.shapes.length; s++) {
  window.meshes[s]  = {};
  window.materials[s] = {};
}

window.initCamera = function(THREE) {
  window.container = null;
  window.camera = null;
  window.scene = null;
  window.renderer = new THREE.WebGLRenderer();
  // if ( window.renderer.extensions.get( 'ANGLE_instanced_arrays' ) === null ) {
  //   document.getElementById( 'notSupported' ).style.display = '';
  //   return false;
  // }

  window.container = document.createElement( 'div' );
  document.body.appendChild( window.container );

  // https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
  // z is the height at which you're looking at it.
  window.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
  window.camera.position.z = window.heightFromAbove;
  window.scene = new THREE.Scene();

  // var helper = new THREE.CameraHelper( window.camera );
  // window.scene.add( helper );

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  window.container.appendChild( renderer.domElement );
}


window.createGeometry = function(THREE, particleCount) {
  var geometry;

  var circleGeometry = new THREE.CircleBufferGeometry( 1, 6 );
	geometry = new THREE.InstancedBufferGeometry();
	geometry.index = circleGeometry.index;
	geometry.attributes = circleGeometry.attributes;

  // Location of the cube.
  var translateArray = new Float32Array( particleCount * 3 );
  for ( var i = 0, i3 = 0, l = particleCount; i < l; i ++, i3 += 3 ) {
    translateArray[ i3 + 0 ] = Math.random() * 2 - 1;
    translateArray[ i3 + 1 ] = Math.random() * 2 - 1;
    translateArray[ i3 + 2 ] = Math.random() * 2 - 1;
  }
  geometry.setAttribute( 'translate', new THREE.InstancedBufferAttribute( translateArray, 3 ) );
  return geometry
}

// Shader: https://threejs.org/docs/#api/en/materials/ShaderMaterial
// * vertexShader calculates positioning of element
// * fragmentShader calculates coloring.
// https://www.airtightinteractive.com/2013/02/intro-to-pixel-shaders-in-three-js/
window.initMaterial = function(THREE, materialID) {
  window.materials[materialID] = new THREE.RawShaderMaterial( {
    uniforms: {
      "map":      { value: new THREE.TextureLoader().load( window.textureImage ) },
      "time":     { value: 0.0 },
      "lowFreq":  { value: 0.0 },
      "medFreq":  { value: 0.0 },
      "highFreq":  { value: 0.0 },
      "freqSlice0": { value: 0.0 },
      "freqSlice1":  { value: 0.0 },
      "freqSlice2":  { value: 0.0 },
      "freqSlice3": { value: 0.0 },
      "freqSlice4": { value: 0.0 },
      "freqSlice5": { value: 0.0 },
      "freqSlice6": { value: 0.0 },
      "freqSlice7": { value: 0.0 },
      "freqSlice8": { value: 0.0 },
      "freqSlice9": { value: 0.0 }
    },
    vertexShader: document.getElementById( materialID + "_vshader" ).textContent,
    fragmentShader: document.getElementById( 'fshader' ).textContent,
    depthTest: true,
    depthWrite: true
  } );

  // https://threejs.org/docs/#api/en/objects/Mesh
  // Takes in a geometry of objects (location) & material describes
  // the appearance. E.g. show colored vertices inside a cube.
  geometry = window.createGeometry(THREE, window.particleCount);
  window.meshes[materialID] = new THREE.Mesh( geometry, window.materials[materialID] );
  window.meshes[materialID].scale.set( window.cube.x, window.cube.y, window.cube.z );
  window.scene.add( window.meshes[materialID] );
}

window.animateWormhole = function(time, materialID) {
  camera.translateZ(-2.0);
  window.meshes[materialID].rotation.x = time * 0.2;
  window.meshes[materialID].rotation.y = time * 0.4;

  // if (window.shouldRotate) {
  //   if (mesh.rotation.x > 3.14 && mesh.rotation.x / 6.28 < 1) {
  //     // camera.translateZ(-2.0);
  //   } else {
  //     mesh.rotation.x = time * 0.2;
  //   }
  //
  //   if (mesh.rotation.y > 3.14 && mesh.rotation.y / 6.28 < 1) {
  //     // camera.translateZ(-2.0);
  //   } else {
  //     mesh.rotation.y = time * 0.4;
  //   }
  // }
}

window.initUniverse = function(THREE) {
  window.materials.universe = new THREE.RawShaderMaterial( {
    uniforms: {
      "map":      { value: new THREE.TextureLoader().load( window.textureImage ) },
      "time":     { value: 0.0 },
      "lowFreq":  { value: 0.0 },
      "medFreq":  { value: 0.0 },
      "highFreq": { value: 0.0 },
      "freqSlice0": { value: 0.0 },
      "freqSlice1":  { value: 0.0 },
      "freqSlice2":  { value: 0.0 },
      "freqSlice3": { value: 0.0 },
      "freqSlice4": { value: 0.0 },
      "freqSlice5": { value: 0.0 },
      "freqSlice6": { value: 0.0 },
      "freqSlice7": { value: 0.0 },
      "freqSlice8": { value: 0.0 },
      "freqSlice9": { value: 0.0 }
    },
    vertexShader: document.getElementById( "sphere_vshader" ).textContent,
    fragmentShader: document.getElementById( 'fshader' ).textContent,
    depthTest: true,
    depthWrite: true
  } );

  // Create the universe geometry.
  geometry = window.createGeometry(THREE, window.particleCount * 5);
  window.meshes.universe = new THREE.Mesh( geometry, window.materials.universe );
  window.meshes.universe.scale.set( window.cube.x * 10, window.cube.y * 10, window.cube.z * 10 );
  window.scene.add( window.meshes.universe );
}


window.updateCurrentMesh = function(THREE) {
  // console.log("camera.position.z = ", camera.position.z)
  // console.log("window.meshes[window.currentMaterialID].position.z = ", window.meshes[window.currentMaterialID].position.z)
  if (camera.position.z < window.meshes[window.currentMaterialID].position.z - window.cube.z) {
  //   window.currentMaterialID = window.nextMaterialID;
  // }
  //
  // if (camera.position.z < window.meshes[window.currentMaterialID].position.z - (window.cube.z / 3)) {
    window.nextMaterialID = window.shapes[Math.floor(Math.random() * window.shapes.length)]
    console.log("nextMeshID = ", window.nextMaterialID, " !window.meshes[window.nextMaterialID] = ", !window.meshes[window.nextMaterialID])

    if (!window.meshes[window.nextMaterialID]) {
      window.initMaterial(THREE, window.nextMaterialID)
    }

    window.meshes[window.nextMaterialID].position.z = window.meshes.universe.position.z;
    window.meshes.universe.position.z -= window.zTranslate;
    window.currentMaterialID = window.nextMaterialID;
  }
}
