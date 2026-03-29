function preload() {
  loadTextures();
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(RADIANS);
  textureMode(NORMAL);

  initInput();
  initRobot();
  initScene();
}

function draw() {
  background(20, 30, 58);

  updateInput();
  updateRobot();

  setupSceneCamera();
  setupSceneLights();

  drawScene();
  drawRobot();
  drawFootball();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  handleKeyPressed(key, keyCode);
}

function keyReleased() {
  handleKeyReleased(key, keyCode);
}
