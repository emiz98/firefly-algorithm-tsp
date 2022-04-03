const params = new URL(document.location).searchParams;
const type = params.get("type");
const total_cities = params.get("total_cities");
const popSize = params.get("populationSize");
const gamma = params.get("gamma");
const beta = params.get("beta");
const moves = params.get("totalMoves");
document.getElementById("title").innerHTML = type;
if (type == "ulysses16") {
  cities1 = ulysses16;
}
if (type == "ulysses22") {
  cities1 = ulysses22;
}

// -------------Brute Force--------------------
var order1 = [];
var totalPermutations;
var count1 = 0;

var recordDistance1;
var bestEver1;

// --------------FireFly Algorithm--------------------

var iterations = 1;
var iterationStart = 0;

var order = [];
var cities = [];

var cities1;

var populationSize = 0;
var population = [];
var nextPopulation = [];
var nextPopulationFitness = [];

var lightAbsorption = 0.03;
var beta0;

var totalCities;
if (type == "random") {
  totalCities = total_cities;
} else {
  totalCities = cities1.length;
}

var totalMoves = 0;
var bestEver;
var recordDistance;
var currentCombination = [];

var DATASET_MIN_X;
var DATASET_MAX_X;
var DATASET_MIN_Y;
var DATASET_MAX_Y;
if (type != "random") {
  DATASET_MIN_X = cities1[0].x; // 267.84
  DATASET_MAX_X = cities1[0].x; // 267.84
  DATASET_MIN_Y = cities1[0].y; // 84.32
  DATASET_MAX_Y = cities1[0].y; // 84.32
}

var stability = 0;

populationSize = popSize;
lightAbsorption = gamma;
beta0 = beta;
totalMoves = moves;

function setup() {
  createCanvas(windowWidth - 100, windowHeight - 150);

  if (type != "random") {
    for (let city = 0; city < cities1.length; city++) {
      if (cities1[city].x < DATASET_MIN_X) {
        DATASET_MIN_X = cities1[city].x;
      }
      if (cities1[city].x > DATASET_MAX_X) {
        DATASET_MAX_X = cities1[city].x;
      }
      if (cities1[city].y < DATASET_MIN_Y) {
        DATASET_MIN_Y = cities1[city].y;
      }
      if (cities1[city].y > DATASET_MAX_Y) {
        DATASET_MAX_Y = cities1[city].y;
      }
    }
  }

  //Original Cities
  // for (let j = 0; j < cities1.length; j++) {
  //   // https://stackoverflow.com/questions/69294016/how-can-i-scale-down-my-coordinates-using-map-to-fit-on-the-canvas
  //   cities1[j].x = map(
  //     cities1[j].x,
  //     DATASET_MIN_X,
  //     DATASET_MAX_X,
  //     0 + 50,
  //     width - 50
  //   );
  //   cities1[j].y = map(
  //     cities1[j].y,
  //     DATASET_MIN_Y,
  //     DATASET_MAX_Y,
  //     50,
  //     height - 50
  //   );

  //   cities[j] = cities1[j];
  //   order[j] = j;
  // }

  if (type != "random") {
    for (let j = 0; j < cities1.length; j++) {
      // https://stackoverflow.com/questions/69294016/how-can-i-scale-down-my-coordinates-using-map-to-fit-on-the-canvas
      cities1[j].x = map(
        cities1[j].x,
        DATASET_MIN_X,
        DATASET_MAX_X,
        0 + 50,
        width - 50
      );
      cities1[j].y = map(
        cities1[j].y,
        DATASET_MIN_Y,
        DATASET_MAX_Y,
        100,
        height - 50
      );
      var v = createVector(
        (cities1[j].x / 5) * 2 + 20,
        getInvertedYCoord((cities1[j].y / 5) * 3 + 350)
      );
      cities[j] = v;
      order[j] = j;
      order1[j] = j;
    }
  }

  // Random Cities
  if (type == "random") {
    for (var i = 0; i < totalCities; i++) {
      var v = createVector(
        random((width / 5) * 2 + 20),
        random((height / 5) * 3) + 100
      );
      cities[i] = v;
      order1[i] = i;
      order[i] = i;
    }
  }

  for (var i = 0; i < populationSize; i++) {
    population[i] = shuffle(order);
  }
  bestEver = order.slice();
  recordDistance = calcDistance(cities, order);

  var d = calcDistance(cities, order1);
  recordDistance1 = d;
  bestEver1 = order1.slice();

  totalPermutations = factorial(totalCities);

  for (var i = 0; i < populationSize; i++) {
    population[i] = shuffle(order);
  }
  bestEver = order.slice();
  recordDistance = calcDistance(cities, population[0]);
  plotGraph();
}

function draw() {
  background(1);

  //---------------------Every Combination--------------------------
  stroke(255, 255, 255);
  strokeWeight(1);
  noFill();
  for (var i = 0; i < cities.length; i++) {
    ellipse(cities[i].x, cities[i].y, 10, 10);
    textSize(18);
    text(i, cities[i].x, cities[i].y, 70, 80);
  }

  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();
  beginShape();
  for (var i = 0; i < order1.length; i++) {
    var n = bestEver1[i];
    vertex(cities[n].x, cities[n].y);
  }
  endShape();

  stroke("#fff6");
  strokeWeight(1);
  noFill();
  beginShape();
  for (var i = 0; i < order1.length; i++) {
    var n = order1[i];
    vertex(cities[n].x, cities[n].y);
  }
  endShape();

  var d = calcDistance(cities, order1);

  if (d < recordDistance1) {
    recordDistance1 = d;
    bestEver1 = order1.slice();
  }

  BruteForce();

  stroke(0);
  var s1 = "";
  var s2 = "";
  for (let i = 0; i < order1.length; i++) {
    s1 += order1[i] + ",";
    s2 += bestEver1[i] + ",";
  }
  fill(255);

  var n1 = new bigDecimal(count1);
  var n2 = new bigDecimal(totalPermutations);
  var quotient = n1.divide(n2).getValue();
  var percent = quotient * 100;
  // var percent = (count1 / totalPermutations) * 100;

  textSize(30);
  if (totalCities < 10) {
    text(nf(percent, 0, 2) + " % Completed", 20, height - 100);
  } else {
    text(nf(percent, 0, 4) + " % Completed", 20, height - 100);
  }

  textSize(18);
  text("Global Best: " + s2, 20, height - 70);
  textSize(18);
  text("Local Best: " + s1, 20, height - 45);
  textSize(28);
  fill(255, 0, 0);
  text("Brute Force", 20, height - 10);

  //--------------------Firefly Algorithm---------------------------
  stroke(255, 255, 255);
  strokeWeight(1);
  noFill();
  for (var i = 0; i < totalCities; i++) {
    ellipse(cities[i].x + 1000, cities[i].y, 10, 10);
    textSize(18);
    text(i, cities[i].x + 1000, cities[i].y, 70, 80);
  }

  stroke(0, 255, 0);
  strokeWeight(2);
  noFill();
  beginShape();
  for (var i = 0; i < totalCities; i++) {
    var n = bestEver[i];
    vertex(cities[n].x + 1000, cities[n].y);
  }
  endShape();

  stroke("#fff6");
  strokeWeight(1);
  noFill();
  beginShape();
  for (var i = 0; i < currentCombination.length; i++) {
    var n = currentCombination[i];
    vertex(cities[n].x + 1000, cities[n].y);
  }
  endShape();

  textSize(18);
  stroke(0);
  var s1 = "";
  var s2 = "";
  for (let i = 0; i < order.length; i++) {
    s1 += currentCombination[i] + ",";
    s2 += bestEver[i] + ",";
  }
  fill(255);
  text("Global Best: " + s2, 1000, height - 80);
  textSize(18);
  text("Local Best: " + s1, 1000, height - 50);
  textSize(25);
  fill(0, 255, 0);
  text("FireFly Algorithm", 1000, height - 10);

  FireFly();

  //   if (iterationStart == iterations) {
  //     noLoop();
  //   }
}

function FireFly() {
  iterationStart++;
  for (let i = 0; i < population.length; i++) {
    var bestFirefly = getMostAttractiveFirefly(population[i], i);
    if (bestFirefly != null) {
      movement(population[i], population[bestFirefly]);
    } else {
      var randomIndex = int(random(0, population.length));
      movement(population[i], population[randomIndex]);
    }
  }
  normalizeFitness();
  pickNewPopulation();
  getBrightestFirefly();

  nextPopulation = [];
  nextPopulationFitness = [];
}

function BruteForce() {
  count1++;
  var largestI = -1;
  for (let i = 0; i < order1.length - 1; i++) {
    if (order1[i] < order1[i + 1]) {
      largestI = i;
    }
  }

  if (largestI == -1) {
    noLoop();
    console.log("Finished");
  }

  var largestJ = -1;
  for (let j = 0; j < order1.length; j++) {
    if (order1[largestI] < order1[j]) {
      largestJ = j;
    }
  }

  swap(order1, largestI, largestJ);

  var endArray = order1.splice(largestI + 1);
  endArray.reverse();
  order1 = order1.concat(endArray);
}

function getInvertedYCoord(y_coord) {
  return windowHeight - y_coord;
}
