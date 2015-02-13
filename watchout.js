// gets the game board from the page
var gameBoard = d3.select('.gameboard svg');
var dimensions = { height: 500, width: 800, 
                   circleRadius: 15 };
                   
// updates scores
// scores = [highscore, currentscore, collisions]
var updateScoreboard = function(scores){
  d3.select('.scoreboard')
    .selectAll('span')
    .data(scores)
    .transition()
    .text(function(d){ return d; });
};

// adds a circle to the gameBoard.
var addCircle = function(x, y, color){
  var circle_data = [{
    "x_axis": x,
    "y_axis": y,
    "radius": dimensions.circleRadius,
    "color": color
  }];

  var circle = gameBoard.append("circle")
    .data(circle_data)
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

// initialize enemies on board
for(var i = 0; i < 30; i++){
  var randomCoordinates = generateRandomCoordinates();
  addCircle(randomCoordinates[0], randomCoordinates[1], 'purple');
}

// initializes player on the board
addCircle(dimensions.width / 2, dimensions.height / 2, 'green');
