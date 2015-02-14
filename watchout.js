/* ******************
 * GLOBAL VARIABLES *
 * ******************/

var gameBoard = d3.select('.gameboard svg');
var scoreBoard = d3.select('.scoreboard');

var dimensions = { height: 500, width: 800, 
                   circleRadius: 15 };

var enemyCircle = { color: 'purple', 
                    classification: 'enemy',
                    numEnemies: 30 };                   
                    
var playerCircle = { color: 'green',
                     classification: 'player' };

var scores = [0, 0, 0];

/* ******************
 * HELPER FUNCTIONS *
 * ******************/

// updates scores
// scores = [highscore, currentscore, collisions]
var updateScoreboard = function(){
    scoreBoard.selectAll('span')
    .data(scores)
    .text(function(d){ return d; });
};

// adds a circle to the gameBoard.
var addCircle = function(x, y, color, classification){
  var circle_data = [{
    "x_axis": x,
    "y_axis": y,
    "radius": dimensions.circleRadius,
    "color": color,
    "classification": classification
  }];

  var circle = gameBoard.append("circle")
    .data(circle_data)
    .attr("class", function(d){ return d.classification; })
    .style('opacity', 0)
    .style("fill", function(d) {
      return d.color;
    });

  var circleAttributes = circle.transition()
    .duration(1000)
    .attr("cx", function(d) {
      return d.x_axis;
    })
    .attr("cy", function(d) {
      return d.y_axis;
    })
    .attr("r", function(d) {
      return d.radius;
    })
    .style('opacity', 1);
};

// generates random coordinates (omit center screen)
var generateRandomCoordinates = function(){
  var randomX = Math.floor(Math.random() * (dimensions.width));
  var randomY = Math.floor(Math.random() * (dimensions.height));

  if((randomX === dimensions.width / 2) ||
     (randomY === dimensions.height / 2)){
    return generateRandomCoordinates();
  }else {
    return [randomX, randomY];
  }
};

// generates a new array of data for a given number of enemies
var generateEnemyCircleData = function(numEnemies){
  var data = [];

  for(var i = 0; i < numEnemies; i++){
    var coordinates = generateRandomCoordinates();
    var obj = {
      'x_axis' : coordinates[0],
      'y_axis' : coordinates[1],
      'radius' : dimensions.circleRadius,
      'color' : enemyCircle.color,
      'classification' : enemyCircle.classification };

    data.push(obj);
  }

  return data;
};

/* ****************
 * EVENT HANDLERS *
 * ****************/

var drag = d3.behavior.drag().on('drag', function(){
  var mouse = d3.mouse(this);
  console.log(mouse.toString());

  // mouse is at the left or top
  if(mouse[0] <= 0) { mouse[0] = dimensions.circleRadius; }
  if(mouse[1] <= 0) { mouse[1] = dimensions.circleRadius; }

  // mouse is at the right or bottom
  if(mouse[0] > dimensions.width) { mouse[0] = dimensions.width - dimensions.circleRadius; }
  if(mouse[1] > dimensions.height) { mouse[1] = dimensions.height - dimensions.circleRadius; }
  d3.select('.player').attr("cx", mouse[0])
      .attr('cy', mouse[1]);
});

/* **************
 * DEFAULT CODE *
 * **************/

// initialize enemies on board
for(var i = 0; i < enemyCircle.numEnemies; i++){
  var randomCoordinates = generateRandomCoordinates();
  addCircle(randomCoordinates[0], randomCoordinates[1], enemyCircle.color, enemyCircle.classification);
}

// initializes player on the board
addCircle(dimensions.width / 2, dimensions.height / 2, playerCircle.color, playerCircle.classification);
d3.select('.player').call(drag);

// move enemies to a new random location every 2 seconds
var moveInterval = setInterval(function(){
  
  var circle_data = generateEnemyCircleData(enemyCircle.numEnemies);

  d3.selectAll('.enemy')
    .data(circle_data)
    .transition()
    .duration(1000)
    .attr("cx", function(d) {
      return d.x_axis;
    })
    .attr("cy", function(d) {
      return d.y_axis;
    })
    .attr("r", function(d) {
      return d.radius;
    });
  
}, 2000);

// update the score board every 50 milliseconds
var scoreInterval = setInterval(function(){
    scores[0] = 0; //TODO update high score
    scores[1] = 0; //TODO update current score
    scores[2] = 0; //TODO update number of collisions
    
    updateScoreboard();
  }, 50);
