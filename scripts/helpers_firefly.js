function getMostAttractiveFirefly(fireflyI, i) {
  var fitnessArr = [];

  for (let j = 0; j < population.length; j++) {
    fitnessArr[i] = 0;
    if (i != j) {
      var distance = getDistanceFAnew(fireflyI, population[j]);
      var fitness = getFitness(distance);
      fitnessArr[j] = fitness;
    }
  }

  var repeatableMax = max(fitnessArr);
  var count = 0;
  var bestFitnessIndex;
  for (let k = 0; k < fitnessArr.length; k++) {
    if (repeatableMax == fitnessArr[k]) {
      count++;
      bestFitnessIndex = k;
    }
  }

  if (count == 1) {
    return bestFitnessIndex;
  } else {
    return null;
  }
}

function getDistanceFAnew(fireflyI, fireflyJ) {
  var similarEdgeCount = 0;

  for (let i = 0; i < fireflyI.length - 1; i++) {
    for (let j = 0; j < fireflyJ.length; j++) {
      if (fireflyI[i] == fireflyJ[j] && fireflyI[i + 1] == fireflyJ[j + 1]) {
        similarEdgeCount++;
        break;
      }
    }
  }

  var arcCount = fireflyI.length - 1 - similarEdgeCount;
  return (arcCount / totalCities) * 10;
}

function getFitness(distance) {
  var betaTemp = beta0 * exp(-lightAbsorption * sq(distance));
  return betaTemp;
}

function movement(moveFirefly, bestFirefly) {
  var tempArr = moveFirefly.slice();
  for (let i = 0; i < totalMoves; i++) {
    var length = int(random(2, getDistanceFAnew(moveFirefly, bestFirefly)));
    var chromosome = int(random(0, moveFirefly.length));
    var arr_first = tempArr.slice(0, chromosome);
    var arr_second = tempArr.slice(length + chromosome + 1);
    var arr_middle = tempArr.slice(chromosome, chromosome + length + 1);
    var inverseMutation = reverse(arr_middle);
    var concat_arr = arr_first.concat(inverseMutation).concat(arr_second);
    nextPopulation.push(concat_arr);

    var fit = calculateFitness(concat_arr);
    nextPopulationFitness.push(fit);
  }
}

function pickNewPopulation() {
  var tempArr = [];
  for (let index = 0; index < populationSize; index++) {
    var bestIndex = 0;
    for (let i = 0; i < nextPopulationFitness.length; i++) {
      if (nextPopulationFitness[i] > nextPopulationFitness[bestIndex]) {
        bestIndex = i;
      }
    }
    tempArr.push(nextPopulation[bestIndex]);
    nextPopulationFitness[bestIndex] = 0;
  }
  population = [];
  population = tempArr;
}

function getBrightestFirefly() {
  for (let i = 0; i < population.length; i++) {
    var d = calcDistance(cities, population[i]);
    currentCombination = population[i];
    if (d < recordDistance) {
      recordDistance = d;
      bestEver = population[i].slice();
      stability = 0;
    } else {
      stability++;
      if (genetic == true) reShufflePopulation();
    }
  }
}

function calcDistance(points, order) {
  var sum = 0;
  for (var i = 0; i < order.length - 1; i++) {
    var cityAIndex = order[i];
    var cityA = points[cityAIndex];

    var cityBIndex = order[i + 1];
    var cityB = points[cityBIndex];
    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  return sum;
}

function calculateFitness(order) {
  var dist = calcDistance(cities, order);
  // var fitnessEUC = 1 / (pow(dist, 8) + 1);
  var fitnessEUC = 1 / (dist + 1);
  return fitnessEUC;
}

//Genetic Algorithm
function normalizeFitness() {
  var sum = 0;
  for (var i = 0; i < nextPopulationFitness.length; i++) {
    sum += nextPopulationFitness[i];
  }
  for (var i = 0; i < nextPopulationFitness.length; i++) {
    nextPopulationFitness[i] = nextPopulationFitness[i] / sum;
  }
}

function reShufflePopulation() {
  if (stability / populationSize > 5) {
    stability = 0;
    population = [];
    nextGenerationGenetic();
  }
}

function nextGenerationGenetic() {
  var geneticPopulation = [];
  for (var i = 0; i < populationSize; i++) {
    var orderA = pickOne(nextPopulation, nextPopulationFitness);
    var orderB = pickOne(nextPopulation, nextPopulationFitness);
    var order = crossOver(orderA, orderB);
    mutate(order, 0.1);
    geneticPopulation[i] = order;
  }
  population = geneticPopulation;
}

function pickOne(list, prob) {
  var index = 0;
  var r = random(1);

  while (r > 0) {
    r = r - prob[index];
    index++;
  }
  index--;
  if (index == list.length) {
    return list[index - 1].slice();
  } else if (index == 0) {
    return list[index].slice();
  } else {
    return list[index].slice();
  }
}

function crossOver(orderA, orderB) {
  var start = floor(random(orderA.length));
  var end = floor(random(start + 1, orderA.length));
  var neworder = orderA.slice(start, end);

  for (var i = 0; i < orderB.length; i++) {
    var city = orderB[i];
    if (!neworder.includes(city)) {
      neworder.push(city);
    }
  }

  return neworder;
}

function mutate(order, mutationRate) {
  for (var i = 0; i < totalCities; i++) {
    if (random(1) < mutationRate) {
      var indexA = floor(random(order.length));
      var indexB = (indexA + 1) % totalCities;
      swap(order, indexA, indexB);
    }
  }
}
