var population;
var lifespan = 200;
var lifeP;
var count = 0;
var target;

function setup() {
  createCanvas(400, 300);
  ant = new Ant();
  population = new Population();
  target = createVector(width/2, 15);
}


function draw() {
  background(0);
  population.run();
  //lifeP.HTML(count);

  count++;
  if (count == lifespan) {
    population.evaluate();
    population.selection();
    //population = new Population();
    count = 0;
  }

  ellipse(target.x, target.y, 16, 16);
}

function Population() {
  this.ants = [];
  this.popsize = 25;
  this.matingpool = [];

  for (var i = 0; i < this.popsize; i++) {
    this.ants[i] = new Ant();
  }

  this.evaluate = function() {

    var maxfit = 0;
    for (var i = 0; i < this.popsize; i++) {
      this.ants[i].calcFitness();
      if (this.ants[i].fitness > maxfit) {
        maxfit = this.ants[i].fitness;
      }
    }

    for (var k = 0; k < this.popsize; k++) {
      this.ants[k].fitness /= maxfit;
    }
    this.matingpool = [];

    for (var l = 0; l < this.popsize; l++) {
      var n = this.ants[l].fitness * 100;
      for (var j = 0; j < n; j++) {
        this.matingpool.push(this.ants[l]);
      }
    }
  };

  this.selection = function() {

    var newAnts = [];
    for (var i = 0; i < this.ants.length; i++) {
      //gets random element from array
      var parentA = random(this.matingpool).dna;
      var parentB = random(this.matingpool).dna;

      var child = parentA.crossover(parentB);

      newAnts[i] = new Ant(child);
    }
    this.ants = newAnts;
  };

  this.run = function() {
    for (var i = 0; i < this.popsize; i++) {
      this.ants[i].update();
      this.ants[i].show();
    }
  };
}

function DNA(genes) {
  if (genes) {
    this.genes = genes;
  } else {
    this.genes = [];
    for (var i =0; i < lifespan; i++) {
      this.genes[i] = p5.Vector.random2D();
      this.genes[i].setMag(0.1);
    }
  }
  this.crossover = function(partner) {
    var newgenes = [];
    var mid = floor(random(this.genes.length));
    for (var i = 0; i < this.genes.length; i++) {
      if (i > mid) {
        newgenes[i] = this.genes[i];
      } else {
        newgenes[i] = partner.genes[i];
      }
    }
    return new DNA(newgenes);
  };
}

function Ant(dna) {
  this.pos = createVector(width/2, height);
  this.vel = createVector();
  this.acc = createVector();
  if (dna) {
    this.dna = dna;
  } else {
    this.dna = new DNA();
  }
  this.fitness = 0;


  this.applyForce = function(force) {
    this.acc.add(force);
  };

  this.calcFitness = function() {
    var d = dist(this.pos.x, this.pos.y, target.x, target.y);
    this.fitness = map(d, 0, width, width, 0);
  };

  this.update = function() {
    this.applyForce(this.dna.genes[count]);

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  this.show = function() {
    push();
    noStroke();
    fill(255, 150);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    rectMode(CENTER);
    rect(0, 0, 25, 5);
    pop();
  };
}
