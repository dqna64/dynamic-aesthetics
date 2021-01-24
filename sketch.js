
let debug = true;
let FPS = 24;
let flock;
let numBoids = 20;

let separationForceSlider;
let cohesionForceSlider;
let alignmentForceSlider;

function setup() {
  createCanvas(1280, 720);
  frameRate(FPS);

  separationForceSlider = createSlider(0, 5, 1);
  cohesionForceSlider = createSlider(0, 5, 1);
  alignmentForceSlider = createSlider(0, 5, 1);

  flock = new Flock();

  for (let i=0; i<numBoids; i++) {
    flock.addBoid(random(width), random(height));
  }
}

function draw() {
  background(20);

  //let mousePos = createVector(mouseX, mouseY);

  flock.run();

  if (mouseIsPressed) {
    flock.addBoid(mouseX, mouseY);
  }
}

function keyPressed() {
  if (key == " ") {
    debug = !debug;
  }
}
