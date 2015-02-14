/* ******************
 * GLOBAL VARIABLES *
 * ******************/

var gameBoard = d3.select('.gameboard svg');
var scoreBoard = d3.select('.scoreboard');

var dimensions = { height: 500, width: 800, 
                   circleRadius: 15 };

var enemyCircle = { color: 'white', 
                    classification: 'enemy',
                    numEnemies: 15 };                   
                    
var playerCircle = { color: '#FDD835',
                     classification: 'player' };

var scores = [0, 0, 0];

var prevCollision = false;

/* ******************
 * HELPER FUNCTIONS *
 * ******************/

// updates scores
// scores = [highscore, currentscore, collisions]
var updateScoreboard = function(){
  d3.select('#high')
    .text(scores[0]);
  d3.select('#current')
    .text(scores[1]);
  d3.select('#collisions')
    .text(scores[2]);
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
  var randomX = Math.floor(Math.random() * (dimensions.width - (dimensions.circleRadius * 3)) + dimensions.circleRadius);
  var randomY = Math.floor(Math.random() * (dimensions.height - (dimensions.circleRadius * 3)) + dimensions.circleRadius);

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

var detectCollision = function(){
  
  var collision = false;

  d3.selectAll('.enemy').each(function(){
    var x = d3.select(this).attr('cx');
    var y = d3.select(this).attr('cy');
    if(checkCollision(x,y)){
      collision = true;
    }
  });

  if(collision){
    scores[1] = 0;
    if(prevCollision !== collision){
      scores[2]++; 
    }
  }else {}

  prevCollision = collision;
};

var checkCollision = function(enemyX, enemyY){
  var playerX = d3.select(".player").attr('cx');
  var playerY = d3.select(".player").attr('cy');
  var radiusSum = dimensions.circleRadius * 2;
  var xDiff = enemyX - playerX;
  var yDiff = enemyY - playerY;
  var separation = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2) );
  if(separation < radiusSum){ return true; }
  else{ return false; }
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
  scores[1]++;
  scores[0] = Math.max(scores[0], scores[1]);
  updateScoreboard();
}, 50);


d3.timer(detectCollision);
