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
