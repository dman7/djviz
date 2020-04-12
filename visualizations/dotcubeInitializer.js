window.heightFromAbove = 2000;

window.particleCount = 100000; // default is 100K
window.textureImage = 'https://threejs.org/examples/textures/sprites/circle.png';
window.shouldRotate = true;

window.frequencyData = [];
for (var i=0; i < 1024; i++) {
  window.frequencyData.push(Math.random());
}
