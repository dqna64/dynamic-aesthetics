
class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-2,2), random(-2,2));
    this.acceleration = createVector(0, 0);

    this.r = 2;
    this.maxSpeed = random(4, 6);
    this.maxForce = random(0.2, 0.4);

    this.separationForceScl = random(0.5, 1.5);
    this.cohesionForceScl = random(0.5, 1.5);
    this.alignmentForceScl = random(0.5, 1.5);
  }

  steer(desiredVel, limit=true) { // Takes in a desired velocity, returns a steering force towards desired velocity
    // Steer force = Desired - Velocity
    let steer = p5.Vector.sub(desiredVel, this.velocity);
    if (limit) {
      steer.limit(this.maxForce);
    }
    return steer;
  }

  seek(desiredPos) { // Takes in a desired position, returns a steering force towards desired position
    // Desired velocity based on vector to target
    let desiredVel = p5.Vector.sub(desiredPos, this.position);
    //let speed = this.arrive(desiredVel, 10);
    desiredVel.setMag(this.maxSpeed);

    let steer = this.steer(desiredVel);
    return steer;
  }

  flee(desiredPos) { // Takes in a desired position, returns a steering force way from desired position
    // Desired velocity based on vector to target
    let desiredVel = p5.Vector.sub(desiredPos, this.position).mult(-1);
    //let speed = this.arrive(desiredVel, 10);
    desiredVel.setMag(this.maxSpeed);

    let steer = this.steer(desiredVel);
    return steer;
  }

  arrive(proposedVel, arrivalRadius) {
    let dist = proposedVel.mag();
    let speed = null;
    if (dist < arrivalRadius) { // If distance to target is small, make magnitude of desired velocity proportional to distance
      speed = map(dist, 0, arrivalRadius, 0, this.maxSpeed);
    } else { // If distance to target is large, make magnitude of desired velocity maxSpeed
      speed = this.maxSpeed;
    }
    return speed;
  }

  align(vehicles, sightRadius) { // Desired velocity is average of velocities of all nearby vehicles
    let totalVec = createVector(0, 0);
    let count = 0;
    for (let other of vehicles) {
      let dist = p5.Vector.dist(this.position, other.position);
      if (dist > 0 && dist <= sightRadius) { // dist>0 is safety mechanism for not fleeing from itself
        totalVec.add(other.velocity);
        count++;
      }
    }
    if (count > 0) { // If there are any vehicles nearby to align with
      let desiredVel = totalVec.div(count);
      desiredVel.setMag(this.maxSpeed);
      let steer = this.steer(desiredVel);
      return steer;
    } else {
      let steer = createVector(0, 0);
      return steer;
    }
  }

  separate(vehicles, sightRadius) { // Desired velocity depends on average of distance to nearby vehicles, weighted by distance
    let totalVec = createVector(0, 0);
    let count = 0;
    for (let other of vehicles) {
      let dist = p5.Vector.dist(this.position, other.position);
      if (dist > 0 && dist <= sightRadius) { // dist>0 is safety mechanism for not fleeing from itself
        let diff = p5.Vector.sub(this.position, other.position);
        diff.normalize();
        diff.div(dist); // Velocity away from other is inversely proportional to distance
        totalVec.add(diff);
        count++;
      }
    }
    if (count > 0) {
      let desiredVel = totalVec.div(count);
      desiredVel.setMag(this.maxSpeed);
      let steer = this.steer(desiredVel);
      return steer;
    } else {
      let steer = createVector(0, 0);
      return steer;
    }
  }

  coalesce(vehicles, sightRadius) { // Desired velocity depends on average of distance to nearby vehicles, weighted by distance
    let totalVec = createVector(0, 0);
    let count = 0;
    for (let other of vehicles) {
      let dist = p5.Vector.dist(this.position, other.position);
      if (dist > 0 && dist <= sightRadius) { // dist>0 is safety mechanism for not fleeing from itself
        let diff = p5.Vector.sub(other.position, this.position);
        diff.normalize();
        diff.div(dist); // Velocity towards other is inversely proportional to distance
        totalVec.add(diff);
        count++;
      }
    }
    if (count > 0) {
      let desiredVel = totalVec.div(count);
      desiredVel.setMag(this.maxSpeed);
      let steer = this.steer(desiredVel);
      return steer;
    } else {
      let steer = createVector(0, 0);
      return steer;
    }
  }

  cohesion(vehicles, sightRadius) {
    let totalVec = createVector(0, 0);
    let count = 0;
    for (let other of vehicles) {
      let dist = p5.Vector.dist(this.position, other.position);
      if (dist > 0 && dist <= sightRadius) {
        totalVec.add(other.position);
        count++;
      }
    }
    if (count > 0) {
      let desiredPos = totalVec.div(count);
      let steer = this.seek(desiredPos);
      return steer;
    } else {
      let steer = createVector(0, 0);
      return steer;
    }
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  edges() {
    // Wrap around
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }

  display() {
    let angle = this.velocity.heading() + radians(90);
    //stroke(255, 215, 140);
    stroke(map(this.separationForceScl, 0.5, 1.5, 150, 255), map(this.cohesionForceScl, 0.5, 1.5, 150, 255), map(this.alignmentForceScl, 0.5, 1.5, 150, 255));
    strokeWeight(1);
    fill(255, 150);
    push();
    translate(this.position.x, this.position.y);
    strokeWeight(0.8);
    line(0, 0, this.velocity.x*10, this.velocity.y*10);
    strokeWeight(0.6);
    line(0, 0, this.velocity.x*10, 0);
    line(0, 0, 0, this.velocity.y*10);

    rotate(angle);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }
}
