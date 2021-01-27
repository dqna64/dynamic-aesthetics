
class Flock {
  constructor() {
    this.boids = [];
  }

  addBoid(x, y) {
    this.boids.push(new Boid(x, y));
  }

  run() {
    for (let boid of this.boids) {
      let separationForce = boid.separate(this.boids, 30);
      separationForce.mult(boid.separationForceScl); // Local scale
      separationForce.mult(separationForceSlider.value()); // Global scale
      boid.applyForce(separationForce);

      let cohesionForce = boid.cohesion(this.boids, 60);
      cohesionForce.mult(boid.cohesionForceScl);
      cohesionForce.mult(cohesionForceSlider.value());
      boid.applyForce(cohesionForce);

      let alignmentForce = boid.align(this.boids, 80);
      alignmentForce.mult(boid.alignmentForceScl);
      alignmentForce.mult(alignmentForceSlider.value());
      boid.applyForce(alignmentForce);

      boid.update();
      boid.edges();
      boid.display();
    }
  }
}
