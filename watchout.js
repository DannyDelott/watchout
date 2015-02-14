/* ******************
 * GLOBAL VARIABLES *
 * ******************/

var gameBoard = d3.select('.gameboard svg');
var scoreBoard = d3.select('.scoreboard');

var dimensions = { height: 500, width: 800, 
                   circleRadius: 15 };

var enemyCircle = { color: 'purple', 
                    classification: 'enemy',
                    numEnemies: 15 };                   
                    
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

var checkCollision = function(d){
  var playerData = d3.select(".player").data()[0];
  var radiusSum = dimensions.circleRadius * 2;

  var xDiff = d.x_axis - playerData.x_axis;
  var yDiff = d.y_axis - playerData.y_axis;
  var separation = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2) );

  if(separation < radiusSum){
    scores[2]++;
    resetScore();
  }
};

var resetScore = function(){
 scores[1] = 0;
};

/* ****************
 * EVENT HANDLERS *
 * ****************/

var drag = d3.behavior.drag().on('drag', function(){

  var mouse = d3.mouse(this);

  // mouse is at the left or top
  if(mouse[0] <= dimensions.circleRadius) { mouse[0] = dimensions.circleRadius; }
  if(mouse[1] <= dimensions.circleRadius) { mouse[1] = dimensions.circleRadius; }

  // mouse is at the right or bottom
  if(mouse[0] >= dimensions.width - dimensions.circleRadius) {
    mouse[0] = dimensions.width - dimensions.circleRadius; 
  }
  if(mouse[1] >= dimensions.height - dimensions.circleRadius) { 
    mouse[1] = dimensions.height - dimensions.circleRadius; 
  }

  // update player data
  var circle_data = [{
    "x_axis": mouse[0],
    "y_axis": mouse[1],
    "radius": dimensions.circleRadius,
    "color": playerCircle.color,
    "classification": playerCircle.classification
  }];

  //  move the player
  d3.select(".player")
    .data(circle_data)
    .attr("cx", function(d){ return d.x_axis; })
    .attr('cy', function(d){ return d.y_axis; });

    
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
    .tween('collision', function(d, i){
       return function() {
         checkCollision(d);
         //TODO: check for a collision
       };
    })
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
    scores[1]++; //TODO update current score
    
    updateScoreboard();
  }, 50);
