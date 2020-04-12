window.heightFromAbove = 1000;
window.cube     = {x: 300.0, y: 300.0, z: 300.0};
window.cubeMidpoint = {x: window.cube.x / 2, y: window.cube.y / 2, z: window.cube.z / 2}

// Construct cube dimensions.
window.numCubes = 3;
window.cubes = [];
for (var i=1; i <= window.numCubes; i++) {
  var cubeSize = i * (window.cube.x / window.numCubes) / 2;

  window.cubes.push({
    x: {min: window.cubeMidpoint.x - cubeSize, max: window.cubeMidpoint.x + cubeSize},
    y: {min: window.cubeMidpoint.y - cubeSize, max: window.cubeMidpoint.y + cubeSize},
    z: {min: window.cubeMidpoint.z - cubeSize, max: window.cubeMidpoint.z + cubeSize},
  })
}
console.log("window.cubes = ", window.cubes)


window.meshes = []

window.getFrequencyAverage = function(freqRange) {
  if (freqRange == 'high') {
    var total = 0; for(var i=680; i<1020;i++){total += window.frequencyData[i]};
    return (total / 340) / 255;
  } else if (freqRange == 'med') {
    var total = 0; for(var i=340; i<680;i++){total += window.frequencyData[i]};
    return (total / 340) / 255;
  } else if (freqRange == 'low') {
    var total = 0; for(var i=0; i<340;i++){total += window.frequencyData[i]};
    return (total / 340) / 255;
  }
}

window.particleCount = 50000; // default is 100K
window.textureImage = 'https://threejs.org/examples/textures/sprites/circle.png';
window.shouldRotate = true;

window.frequencyData = [];
for (var i=0; i < 1024; i++) {
  window.frequencyData.push(Math.random());
}
